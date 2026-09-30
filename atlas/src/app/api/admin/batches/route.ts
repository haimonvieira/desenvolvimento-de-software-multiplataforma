import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../integrations/neon/db";
import { createBatchCreateHandler } from "../../../../modules/publication/batch-create";
import { createBatchListHandler } from "../../../../modules/publication/batch-list";

type BatchEnv = {
  DATABASE_URL?: string;
};

export const POST = async (request: Request): Promise<Response> => {
  const databaseUrl = (env as BatchEnv).DATABASE_URL;
  if (!databaseUrl) return Response.json({ error: "unconfigured" }, { status: 503 });
  return createBatchCreateHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
  })(request);
};

export async function GET(request: Request): Promise<Response> {
  const databaseUrl = (env as BatchEnv).DATABASE_URL;
  if (!databaseUrl) return Response.json({ error: "unconfigured" }, { status: 503 });
  return createBatchListHandler({
    requireAdmin: (req) => serverAdmin.requireAdmin(req),
    query: (text, params) =>
      createSqlExecutor(databaseUrl).query(text, params) as Promise<Record<string, unknown>[]>,
  })(request);
}

export { GET as get, POST as post };
