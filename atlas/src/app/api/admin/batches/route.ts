import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../integrations/neon/db";
import {
  BATCH_TTL_MS,
  validateUploadBatch,
} from "../../../../modules/publication/validate-upload";

type BatchEnv = {
  DATABASE_URL?: string;
};

function json(status: number, body: unknown): Response {
  return Response.json(body, { status });
}

function baseCommitSha(value: unknown): string | null {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) return null;
  return value;
}

export async function POST(request: Request): Promise<Response> {
  const { adminId } = await serverAdmin.requireAdmin(request);
  const body = (await request.json().catch(() => null)) as {
    baseCommitSha?: unknown;
    files?: readonly { destination?: unknown; mimeType?: unknown; size?: unknown }[];
  } | null;
  const sha = body ? baseCommitSha(body.baseCommitSha) : null;
  if (!sha) return json(400, { error: "baseCommitSha" });
  const files = Array.isArray(body?.files) ? body.files : [];
  const validation = validateUploadBatch(
    files.map((file) => ({
      destination: typeof file.destination === "string" ? file.destination : "",
      mimeType: typeof file.mimeType === "string" ? file.mimeType : "",
      size: typeof file.size === "number" ? file.size : -1,
    })),
  );
  if (!validation.ok) return json(400, { error: "validation", rejections: validation.rejections });
  const databaseUrl = (env as BatchEnv).DATABASE_URL;
  if (!databaseUrl) return json(503, { error: "unconfigured" });
  const db = createSqlExecutor(databaseUrl);
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + BATCH_TTL_MS).toISOString();
  await db.query(
    `INSERT INTO upload_batch (id, base_commit_sha, owner_admin_id, status, total_bytes, expires_at) VALUES ($1, $2, $3, 'draft', $4, $5)`,
    [id, sha, adminId, validation.totalBytes, expiresAt],
  );
  for (const file of files) {
    await db.query(
      `INSERT INTO staged_upload_file (batch_id, destination, mime_type, size, blob_sha) VALUES ($1, $2, $3, $4, NULL)`,
      [id, file.destination, file.mimeType, file.size],
    );
  }
  return json(201, {
    id,
    baseCommitSha: sha,
    status: "draft",
    totalBytes: validation.totalBytes,
    expiresAt,
  });
}

export async function GET(request: Request): Promise<Response> {
  const { adminId } = await serverAdmin.requireAdmin(request);
  const databaseUrl = (env as BatchEnv).DATABASE_URL;
  if (!databaseUrl) return json(503, { error: "unconfigured" });
  const db = createSqlExecutor(databaseUrl);
  const rows = await db.query(
    `SELECT id, base_commit_sha, status, total_bytes, expires_at FROM upload_batch WHERE owner_admin_id = $1 ORDER BY created_at DESC LIMIT 20`,
    [adminId],
  );
  return json(200, { batches: rows });
}

export { GET as get, POST as post };
