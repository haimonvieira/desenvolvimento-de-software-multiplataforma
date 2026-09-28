import {
  BATCH_TTL_MS,
  MAX_BATCH_BYTES,
  validateUploadBatch,
  type UploadCandidate,
} from "./validate-upload";

export const MAX_FILES_PER_BATCH = 100;

export type BatchQuery = (
  text: string,
  params: readonly unknown[],
) => Promise<Record<string, unknown>[]>;

export type BatchCreateDependencies = Readonly<{
  requireAdmin: (request: Request) => Promise<{ adminId: string }>;
  query: BatchQuery;
  now?: () => number;
  randomId?: () => string;
}>;

type RawFile = Readonly<{
  destination?: unknown;
  mimeType?: unknown;
  size?: unknown;
}>;

function json(status: number, body: unknown): Response {
  return Response.json(body, { status });
}

function baseCommitSha(value: unknown): string | null {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/.test(value)) return null;
  return value;
}

function sanitizeFile(file: RawFile): UploadCandidate {
  return {
    destination: typeof file.destination === "string" ? file.destination : "",
    mimeType: typeof file.mimeType === "string" ? file.mimeType : "",
    size:
      typeof file.size === "number" && Number.isInteger(file.size)
        ? file.size
        : -1,
  };
}

export function createBatchCreateHandler(
  dependencies: BatchCreateDependencies,
): (request: Request) => Promise<Response> {
  const now = dependencies.now ?? Date.now;
  const randomId = dependencies.randomId ?? (() => crypto.randomUUID());
  return async function handleCreateBatch(request: Request): Promise<Response> {
    const { adminId } = await dependencies.requireAdmin(request);
    const body = (await request.json().catch(() => null)) as {
      baseCommitSha?: unknown;
      files?: readonly RawFile[];
    } | null;
    const sha = body ? baseCommitSha(body.baseCommitSha) : null;
    if (!sha) return json(400, { error: "baseCommitSha" });
    const rawFiles = Array.isArray(body?.files) ? body.files : [];
    if (rawFiles.length > MAX_FILES_PER_BATCH) {
      return json(400, { error: "too-many-files", max: MAX_FILES_PER_BATCH });
    }
    const files = rawFiles.map(sanitizeFile);
    const validation = validateUploadBatch(files);
    if (!validation.ok) {
      return json(400, {
        error: "validation",
        rejections: validation.rejections,
      });
    }
    if (validation.totalBytes > MAX_BATCH_BYTES) {
      return json(413, { error: "batch-too-large" });
    }
    const id = randomId();
    const expiresAt = new Date(now() + BATCH_TTL_MS).toISOString();
    const query = dependencies.query;
    await query("BEGIN", []);
    try {
      await query(
        `INSERT INTO upload_batch (id, base_commit_sha, owner_admin_id, status, total_bytes, expires_at) VALUES ($1, $2, $3, 'draft', $4, $5)`,
        [id, sha, adminId, validation.totalBytes, expiresAt],
      );
      for (const file of files) {
        await query(
          `INSERT INTO staged_upload_file (batch_id, destination, mime_type, size, blob_sha) VALUES ($1, $2, $3, $4, NULL)`,
          [id, file.destination, file.mimeType, file.size],
        );
      }
      await query("COMMIT", []);
    } catch (error) {
      await query("ROLLBACK", []).catch(() => undefined);
      await query(`DELETE FROM upload_batch WHERE id = $1`, [id]).catch(
        () => undefined,
      );
      throw error;
    }
    return json(201, {
      id,
      baseCommitSha: sha,
      status: "draft",
      totalBytes: validation.totalBytes,
      expiresAt,
    });
  };
}
