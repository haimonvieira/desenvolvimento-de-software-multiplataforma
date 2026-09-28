import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../../../integrations/neon/db";
import { createGitHubMaterialSource } from "../../../../../../integrations/github/github-material-source";
import { createBlobUploadHandler } from "../../../../../../modules/publication/blob-upload";

type BlobEnv = {
  DATABASE_URL?: string;
  GITHUB_INSTALLATION_TOKEN?: string;
  GITHUB_REPOSITORY?: string;
};

export const POST = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as BlobEnv;
  if (!runtime.DATABASE_URL) {
    return Response.json({ error: "unconfigured" }, { status: 503 });
  }
  if (!runtime.GITHUB_INSTALLATION_TOKEN || !runtime.GITHUB_REPOSITORY) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  const installationToken = runtime.GITHUB_INSTALLATION_TOKEN;
  const repository = runtime.GITHUB_REPOSITORY;
  const databaseUrl = runtime.DATABASE_URL;
  const source = createGitHubMaterialSource(
    async (path, init) => {
      const response = await fetch(`https://api.github.com${path}`, {
        method: init.method,
        headers: {
          authorization: `Bearer ${installationToken}`,
          accept: "application/vnd.github+json",
          "content-type": "application/json",
        },
        body: init.body,
      });
      return {
        status: response.status,
        json: () => response.json() as Promise<unknown>,
      };
    },
    repository,
  );
  return createBlobUploadHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
    createBlob: (bytes) => source.createBlob(bytes),
  })(request, id);
};

export { POST as post };
