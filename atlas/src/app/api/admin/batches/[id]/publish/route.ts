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
import { createPublishHandler } from "../../../../../../modules/publication/publication-workflow";

type PublishEnv = GitHubAppEnv & { DATABASE_URL?: string };

export const POST = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as PublishEnv;
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
  return createPublishHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
    source,
    audit: async () => {
      await serverAdmin.auditBatchPublication(request);
    },
  })(request, id);
};

export { POST as post };
