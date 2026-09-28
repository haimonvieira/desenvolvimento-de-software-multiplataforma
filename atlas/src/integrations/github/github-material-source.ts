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
  readBlob(blobSha: string): Promise<Uint8Array>;
  createBlob(bytes: Uint8Array): Promise<string>;
}

export interface GitTreeEntry {
  readonly path: string;
  readonly sha: string;
  readonly type: "blob" | "tree";
}

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
      const data = (await call(
        `/repos/${repository}/git/trees/${commitSha}?recursive=1`,
        "GET",
      )) as { tree: GitTreeEntry[] };
      return data.tree;
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
