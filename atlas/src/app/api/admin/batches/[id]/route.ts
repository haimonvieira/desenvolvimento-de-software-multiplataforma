import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../../integrations/neon/db";
import {
  createGitHubInstallationTransport,
  createGitHubMaterialSource,
  githubAppConfigured,
  repositoryFromEnv,
  type GitHubAppEnv,
} from "../../../../../integrations/github/github-material-source";
import { createBatchReviewHandler } from "../../../../../modules/publication/publication-workflow";

type PublicationEnv = GitHubAppEnv & { DATABASE_URL?: string };

function unconfigured() {
  return Response.json({ error: "unconfigured" }, { status: 503 });
}

function reviewHandler(runtime: PublicationEnv, databaseUrl: string) {
  // The installation token is minted server-side on first use.
  const source = createGitHubMaterialSource(
    createGitHubInstallationTransport(runtime),
    repositoryFromEnv(runtime),
  );
  return createBatchReviewHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
    source,
  });
}

export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as PublicationEnv;
  if (!runtime.DATABASE_URL) return unconfigured();
  if (!githubAppConfigured(runtime)) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  return reviewHandler(runtime, runtime.DATABASE_URL)(request, id);
};

export const POST = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as PublicationEnv;
  if (!runtime.DATABASE_URL) return unconfigured();
  if (!githubAppConfigured(runtime)) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  return reviewHandler(runtime, runtime.DATABASE_URL)(request, id);
};

export { GET as get, POST as post };
