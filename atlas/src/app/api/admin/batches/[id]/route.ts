import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../../integrations/neon/db";
import { createGitHubMaterialSource } from "../../../../../integrations/github/github-material-source";
import {
  createBatchReviewHandler,
  createPublishHandler,
} from "../../../../../modules/publication/publication-workflow";

type PublicationEnv = {
  DATABASE_URL?: string;
  GITHUB_INSTALLATION_TOKEN?: string;
  GITHUB_REPOSITORY?: string;
};

function githubSource(installationToken: string, repository: string) {
  return createGitHubMaterialSource(
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
}

function unconfigured() {
  return Response.json({ error: "unconfigured" }, { status: 503 });
}

export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as PublicationEnv;
  if (!runtime.DATABASE_URL) return unconfigured();
  if (!runtime.GITHUB_INSTALLATION_TOKEN || !runtime.GITHUB_REPOSITORY) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  const databaseUrl = runtime.DATABASE_URL;
  return createBatchReviewHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
    source: githubSource(
      runtime.GITHUB_INSTALLATION_TOKEN,
      runtime.GITHUB_REPOSITORY,
    ),
  })(request, id);
};

export const POST = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as PublicationEnv;
  if (!runtime.DATABASE_URL) return unconfigured();
  if (!runtime.GITHUB_INSTALLATION_TOKEN || !runtime.GITHUB_REPOSITORY) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  const databaseUrl = runtime.DATABASE_URL;
  return createBatchReviewHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
    source: githubSource(
      runtime.GITHUB_INSTALLATION_TOKEN,
      runtime.GITHUB_REPOSITORY,
    ),
  })(request, id);
};

export { GET as get, POST as post };
