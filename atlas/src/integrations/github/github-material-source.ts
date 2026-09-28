export type GitHubTransport = (
  path: string,
  init: { method: string; body?: string },
) => Promise<{ status: number; json: () => Promise<unknown> }>;

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

export function createInstallationTokenProvider(
  env: RuntimeEnv,
  config: GitHubAppConfig = DEFAULT_GITHUB_APP_CONFIG,
): () => Promise<string> {
  return async () => {
    const appId = requiredEnv(env, config.appIdEnv);
    const privateKey = requiredEnv(env, config.privateKeyEnv);
    const installationId = requiredEnv(env, config.installationIdEnv);
    void appId;
    void privateKey;
    void installationId;
    throw new Error(
      "GitHub App installation token minting is not configured in this environment",
    );
  };
}

export function repositoryFromEnv(
  env: RuntimeEnv,
  config: GitHubAppConfig = DEFAULT_GITHUB_APP_CONFIG,
): string {
  return requiredEnv(env, config.repositoryEnv);
}
