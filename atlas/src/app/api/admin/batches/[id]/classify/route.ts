import { env } from "cloudflare:workers";

import catalog from "../../../../../../generated/catalog.json";
import { createGroqAdminClassifierAi } from "../../../../../../integrations/ai/admin-classifier-ai";
import { createGitHubMaterialSource } from "../../../../../../integrations/github/github-material-source";
import { createSqlExecutor } from "../../../../../../integrations/neon/db";
import type { CatalogData } from "../../../../../../modules/catalog/model";
import { serverAdmin } from "../../../../../../modules/identity/server-admin";
import { createClassifyBatchHandler } from "../../../../../../modules/publication/classify-batch";
import { createUsageLedger } from "../../../../../../modules/tutor/usage-ledger";

type ClassifyEnv = {
  DATABASE_URL?: string;
  GITHUB_INSTALLATION_TOKEN?: string;
  GITHUB_REPOSITORY?: string;
  /** Administrative credential, separate from the public tutor's GROQ_API_KEY. */
  GROQ_ADMIN_API_KEY?: string;
};

export const POST = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await context.params;
  const runtime = env as ClassifyEnv;
  if (!runtime.DATABASE_URL) return Response.json({ error: "unconfigured" }, { status: 503 });
  if (!runtime.GITHUB_INSTALLATION_TOKEN || !runtime.GITHUB_REPOSITORY) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  if (!runtime.GROQ_ADMIN_API_KEY) {
    return Response.json({ error: "admin-ai-unconfigured" }, { status: 503 });
  }
  const installationToken = runtime.GITHUB_INSTALLATION_TOKEN;
  const repository = runtime.GITHUB_REPOSITORY;
  const database = createSqlExecutor(runtime.DATABASE_URL);
  const query = (text: string, params: readonly unknown[]) =>
    database.query(text, params) as Promise<Record<string, unknown>[]>;

  return createClassifyBatchHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query,
    source: createGitHubMaterialSource(
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
    ),
    catalog: catalog as CatalogData,
    ai: createGroqAdminClassifierAi({ apiKey: runtime.GROQ_ADMIN_API_KEY }),
    ledger: createUsageLedger({ query }),
  })(request, id);
};

export { POST as post };
