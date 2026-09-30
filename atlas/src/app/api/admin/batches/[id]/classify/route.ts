import { env } from "cloudflare:workers";

import catalog from "../../../../../../generated/catalog.json";
import { createGroqAdminClassifierAi } from "../../../../../../integrations/ai/admin-classifier-ai";
import {
  createGitHubInstallationTransport,
  createGitHubMaterialSource,
  githubAppConfigured,
  repositoryFromEnv,
  type GitHubAppEnv,
} from "../../../../../../integrations/github/github-material-source";
import { createSqlExecutor } from "../../../../../../integrations/neon/db";
import type { CatalogData } from "../../../../../../modules/catalog/model";
import { serverAdmin } from "../../../../../../modules/identity/server-admin";
import { createClassifyBatchHandler } from "../../../../../../modules/publication/classify-batch";
import { createUsageLedger } from "../../../../../../modules/tutor/usage-ledger";

type ClassifyEnv = GitHubAppEnv & {
  DATABASE_URL?: string;
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
  if (!githubAppConfigured(runtime)) {
    return Response.json({ error: "github-unconfigured" }, { status: 503 });
  }
  if (!runtime.GROQ_ADMIN_API_KEY) {
    return Response.json({ error: "admin-ai-unconfigured" }, { status: 503 });
  }
  const database = createSqlExecutor(runtime.DATABASE_URL);
  const query = (text: string, params: readonly unknown[]) =>
    database.query(text, params) as Promise<Record<string, unknown>[]>;

  return createClassifyBatchHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query,
    // The installation token is minted server-side on first use.
    source: createGitHubMaterialSource(
      createGitHubInstallationTransport(runtime),
      repositoryFromEnv(runtime),
    ),
    catalog: catalog as CatalogData,
    ai: createGroqAdminClassifierAi({ apiKey: runtime.GROQ_ADMIN_API_KEY }),
    ledger: createUsageLedger({ query }),
  })(request, id);
};

export { POST as post };
