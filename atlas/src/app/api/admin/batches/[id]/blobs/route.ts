import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../../../integrations/neon/db";
import {
  createGitHubInstallationTransport,
  createGitHubMaterialSource,
  githubAppConfigured,
  repositoryFromEnv,
  type GitHubAppEnv,
} from "../../../../../../integrations/github/github-material-source";
import { createBlobUploadHandler } from "../../../../../../modules/publication/blob-upload";

type BlobEnv = GitHubAppEnv & { DATABASE_URL?: string };

export const POST = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as BlobEnv;
  if (!runtime.DATABASE_URL) {
    return Response.json({ error: "unconfigured" }, { status: 503 });
  }
  if (!githubAppConfigured(runtime)) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  const databaseUrl = runtime.DATABASE_URL;
  // The installation token is minted server-side on first use.
  const source = createGitHubMaterialSource(
    createGitHubInstallationTransport(runtime),
    repositoryFromEnv(runtime),
  );
  return createBlobUploadHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
    createBlob: (bytes) => source.createBlob(bytes),
  })(request, id);
};

export { POST as post };
