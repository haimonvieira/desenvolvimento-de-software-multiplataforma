import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../integrations/neon/db";
import { createBatchCreateHandler } from "../../../../modules/publication/batch-create";

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
  const { adminId } = await serverAdmin.requireAdmin(request);
  const databaseUrl = (env as BatchEnv).DATABASE_URL;
  if (!databaseUrl) return Response.json({ error: "unconfigured" }, { status: 503 });
  const db = createSqlExecutor(databaseUrl);
  const rows = await db.query(
    `SELECT id, base_commit_sha, status, total_bytes, expires_at FROM upload_batch WHERE owner_admin_id = $1 ORDER BY created_at DESC LIMIT 20`,
    [adminId],
  );
  return Response.json({ batches: rows });
}

export { GET as get, POST as post };
