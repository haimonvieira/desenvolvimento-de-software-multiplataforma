import { createPrivateKey, createSign } from "node:crypto";

export type GitHubTransport = (
  path: string,
  init: { method: string; body?: string },
) => Promise<{
  status: number;
  json: () => Promise<unknown>;
  /** Releases the body when the caller only needs the status. */
  cancel?: () => Promise<void>;
}>;

export type GitHubAppConfig = Readonly<{
  appIdEnv: string;
  privateKeyEnv: string;
  installationIdEnv: string;
  repositoryEnv: string;
}>;

export const DEFAULT_GITHUB_APP_CONFIG: GitHubAppConfig = {
  appIdEnv: "GITHUB_APP_ID",
  privateKeyEnv: "GITHUB_APP_PRIVATE_KEY",
  installationIdEnv: "GITHUB_INSTALLATION_ID",
  repositoryEnv: "GITHUB_REPOSITORY",
};

type RuntimeEnv = Record<string, string | undefined>;

function requiredEnv(env: RuntimeEnv, name: string): string {
  const value = env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function base64Of(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function bytesOf(base64: string): Uint8Array {
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

export interface GitHubMaterialSource {
  readHead(): Promise<string>;
  readTree(commitSha: string): Promise<readonly GitTreeEntry[]>;
  readTreeSha(commitSha: string): Promise<string>;
  readBlob(blobSha: string): Promise<Uint8Array>;
  createBlob(bytes: Uint8Array): Promise<string>;
  createTree(
    entries: readonly TreeEntryInput[],
    baseTreeSha: string,
  ): Promise<string>;
  createCommit(
    input: Readonly<{
      message: string;
      treeSha: string;
      parents: readonly string[];
    }>,
  ): Promise<GitCommitResult>;
  readRef(ref: string): Promise<string>;
  updateRef(ref: string, sha: string): Promise<boolean>;
}

export interface GitTreeEntry {
  readonly path: string;
  readonly sha: string;
  readonly type: "blob" | "tree";
}

export type TreeEntryInput = Readonly<{
  path: string;
  mode: "100644";
  type: "blob";
  sha: string;
}>;

export type GitCommitResult = Readonly<{ sha: string; url: string }>;

export function createGitHubMaterialSource(
  transport: GitHubTransport,
  repository: string,
): GitHubMaterialSource {
  async function call(
    path: string,
    method: string,
    body?: unknown,
  ): Promise<unknown> {
    const response = await transport(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status >= 400)
      throw new Error(`GitHub request failed: ${response.status}`);
    return response.json();
  }

  return {
    async readHead(): Promise<string> {
      const data = (await call(
        `/repos/${repository}/commits/HEAD`,
        "GET",
      )) as { sha: string };
      return data.sha;
    },
    async readTree(commitSha: string): Promise<readonly GitTreeEntry[]> {
      // The trees endpoint addresses a tree SHA, not a commit SHA: resolve the
      // commit to its tree first so callers can pass what they actually hold.
      const commit = (await call(
        `/repos/${repository}/git/commits/${commitSha}`,
        "GET",
      )) as { tree: { sha: string } };
      const data = (await call(
        `/repos/${repository}/git/trees/${commit.tree.sha}?recursive=1`,
        "GET",
      )) as { tree: GitTreeEntry[] };
      return data.tree;
    },
    async readTreeSha(commitSha: string): Promise<string> {
      const data = (await call(
        `/repos/${repository}/git/commits/${commitSha}`,
        "GET",
      )) as { tree: { sha: string } };
      return data.tree.sha;
    },
    async readBlob(blobSha: string): Promise<Uint8Array> {
      const data = (await call(
        `/repos/${repository}/git/blobs/${blobSha}`,
        "GET",
      )) as { content: string; encoding: string };
      if (data.encoding !== "base64")
        throw new Error("Unsupported blob encoding");
      return bytesOf(data.content.replaceAll("\n", ""));
    },
    async createBlob(bytes: Uint8Array): Promise<string> {
      const data = (await call(`/repos/${repository}/git/blobs`, "POST", {
        content: base64Of(bytes),
        encoding: "base64",
      })) as { sha: string };
      return data.sha;
    },
    async createTree(
      entries: readonly TreeEntryInput[],
      baseTreeSha: string,
    ): Promise<string> {
      const data = (await call(`/repos/${repository}/git/trees`, "POST", {
        tree: entries,
        base_tree: baseTreeSha,
      })) as { sha: string };
      return data.sha;
    },
    async createCommit(input): Promise<GitCommitResult> {
      const data = (await call(`/repos/${repository}/git/commits`, "POST", {
        message: input.message,
        tree: input.treeSha,
        parents: [...input.parents],
      })) as { sha: string; html_url: string };
      return { sha: data.sha, url: data.html_url };
    },
    async readRef(ref: string): Promise<string> {
      const data = (await call(
        `/repos/${repository}/git/ref/${ref}`,
        "GET",
      )) as { object: { sha: string } };
      return data.object.sha;
    },
    async updateRef(ref: string, sha: string): Promise<boolean> {
      // force is never true: GitHub rejects a non-fast-forward update with 422,
      // which is how a concurrent commit becomes an atomic conflict here.
      const response = await transport(`/repos/${repository}/git/refs/${ref}`, {
        method: "PATCH",
        body: JSON.stringify({ sha, force: false }),
      });
      if (response.status === 422 || response.status === 409) return false;
      if (response.status >= 400)
        throw new Error(`GitHub request failed: ${response.status}`);
      return true;
    },
  };
}

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

/** App JWTs are short-lived: GitHub rejects an `exp` beyond 10 minutes. */
const JWT_LIFETIME_SECONDS = 540;
/** `iat` is backdated so a clock slightly behind GitHub's still validates. */
const JWT_CLOCK_SKEW_SECONDS = 60;
/** Re-mint this long before `expires_at` so a request never races the expiry. */
const TOKEN_EXPIRY_MARGIN_MS = 60_000;
/**
 * GitHub documents a one-hour installation token lifetime. The cache never
 * trusts a longer `expires_at` than this, so a bad provider value cannot keep a
 * stale token in use.
 */
const TOKEN_MAX_LIFETIME_MS = 3_600_000;

/** The `repositories` body takes repository *names*, not `owner/name`. */
function repositoryNameOf(repository: string): string {
  return repository.slice(repository.lastIndexOf("/") + 1);
}

export type GitHubAppJwtClaims = Readonly<{ iat: number; exp: number; iss: string }>;

export function githubAppJwtClaims(appId: string, nowMs: number): GitHubAppJwtClaims {
  const now = Math.floor(nowMs / 1000);
  return { iat: now - JWT_CLOCK_SKEW_SECONDS, exp: now + JWT_LIFETIME_SECONDS, iss: appId };
}

export type GitHubJwtSigner = (claims: GitHubAppJwtClaims, privateKeyPem: string) => string;

function base64UrlOf(value: string | Uint8Array): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

/**
 * RS256 signature over the App claims. `createPrivateKey` accepts both the
 * PKCS#1 and the PKCS#8 PEM GitHub hands out, and a key pasted through a shell
 * variable keeps its escaped newlines.
 */
export const signGitHubAppJwt: GitHubJwtSigner = (claims, privateKeyPem) => {
  const header = base64UrlOf(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlOf(JSON.stringify(claims));
  const signingInput = `${header}.${payload}`;
  // An RSA key with the SHA-256 digest is RSASSA-PKCS1-v1_5/SHA-256, i.e. RS256.
  const signer = createSign("sha256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(createPrivateKey(privateKeyPem.replaceAll("\\n", "\n")));
  return `${signingInput}.${base64UrlOf(new Uint8Array(signature))}`;
};

export type GitHubFetch = (url: string, init: RequestInit) => Promise<Response>;

export type InstallationTokenCache = Map<
  string,
  Readonly<{ token: string; expiresAtMs: number }>
>;

export type GitHubAppDeps = Readonly<{
  fetchImpl?: GitHubFetch;
  sign?: GitHubJwtSigner;
  now?: () => number;
  cache?: InstallationTokenCache;
  config?: GitHubAppConfig;
}>;

/**
 * Isolate-local token cache. One minted token serves every request handled by
 * the isolate until it nears expiry; it is never persisted and never logged.
 */
const installationTokenCache: InstallationTokenCache = new Map();

/**
 * Mints (and caches) an installation access token from the App credentials.
 * The JWT and the private key never leave this function, and a provider failure
 * reports the status only, so no secret can reach a caller or a log.
 */
export function createInstallationTokenProvider(
  env: RuntimeEnv,
  deps: GitHubAppDeps = {},
): () => Promise<string> {
  const fetchImpl = deps.fetchImpl ?? ((url, init) => fetch(url, init));
  const sign = deps.sign ?? signGitHubAppJwt;
  const now = deps.now ?? (() => Date.now());
  const cache = deps.cache ?? installationTokenCache;
  const config = deps.config ?? DEFAULT_GITHUB_APP_CONFIG;

  return async () => {
    const nowMs = now();
    const appId = requiredEnv(env, config.appIdEnv);
    const privateKey = requiredEnv(env, config.privateKeyEnv);
    const installationId = requiredEnv(env, config.installationIdEnv);
    const repositoryName = repositoryNameOf(requiredEnv(env, config.repositoryEnv));
    const cacheKey = `${appId}:${installationId}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAtMs - TOKEN_EXPIRY_MARGIN_MS > nowMs) return cached.token;

    const jwt = sign(githubAppJwtClaims(appId, nowMs), privateKey);
    const response = await fetchImpl(
      `${GITHUB_API_BASE_URL}/app/installations/${installationId}/access_tokens`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${jwt}`,
          accept: "application/vnd.github+json",
          "content-type": "application/json",
          "x-github-api-version": GITHUB_API_VERSION,
        },
        // Least privilege: the token covers only the repository the routes use,
        // never every repository the installation was granted.
        body: JSON.stringify({ repositories: [repositoryName] }),
      },
    );
    if (response.status >= 400) {
      await response.body?.cancel().catch(() => undefined);
      throw new Error(`GitHub installation token request failed: ${response.status}`);
    }
    const payload = (await response.json().catch(() => null)) as {
      token?: unknown;
      expires_at?: unknown;
    } | null;
    const token = typeof payload?.token === "string" ? payload.token : "";
    const reportedExpiryMs =
      typeof payload?.expires_at === "string" ? Date.parse(payload.expires_at) : Number.NaN;
    if (!token || !Number.isFinite(reportedExpiryMs)) {
      throw new Error("GitHub installation token response is unusable");
    }
    const expiresAtMs = Math.min(reportedExpiryMs, nowMs + TOKEN_MAX_LIFETIME_MS);
    cache.set(cacheKey, { token, expiresAtMs });
    return token;
  };
}

/**
 * The material transport every route uses: it mints the installation token on
 * demand and sends it, never the App JWT, to the Git Data API.
 */
export function createGitHubInstallationTransport(
  env: RuntimeEnv,
  deps: GitHubAppDeps = {},
): GitHubTransport {
  const fetchImpl = deps.fetchImpl ?? ((url, init) => fetch(url, init));
  const token = createInstallationTokenProvider(env, { ...deps, fetchImpl });
  return async (path, init) => {
    const response = await fetchImpl(`${GITHUB_API_BASE_URL}${path}`, {
      method: init.method,
      headers: {
        authorization: `Bearer ${await token()}`,
        accept: "application/vnd.github+json",
        "content-type": "application/json",
        "x-github-api-version": GITHUB_API_VERSION,
      },
      body: init.body,
    });
    return {
      status: response.status,
      json: () => response.json() as Promise<unknown>,
      cancel: () => response.body?.cancel().catch(() => undefined) ?? Promise.resolve(),
    };
  };
}

/** The GitHub App credentials a route needs; no pre-minted token exists. */
export type GitHubAppEnv = Readonly<{
  GITHUB_APP_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  GITHUB_INSTALLATION_ID?: string;
  GITHUB_REPOSITORY?: string;
}>;

export function githubAppConfigured(
  env: RuntimeEnv,
  config: GitHubAppConfig = DEFAULT_GITHUB_APP_CONFIG,
): boolean {
  return Boolean(
    env[config.appIdEnv] &&
      env[config.privateKeyEnv] &&
      env[config.installationIdEnv] &&
      env[config.repositoryEnv],
  );
}

export function repositoryFromEnv(
  env: RuntimeEnv,
  config: GitHubAppConfig = DEFAULT_GITHUB_APP_CONFIG,
): string {
  return requiredEnv(env, config.repositoryEnv);
}
