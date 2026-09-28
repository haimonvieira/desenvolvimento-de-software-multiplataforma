import {
  MAX_BATCH_BYTES,
  MAX_FILE_BYTES,
  validateUploadBatch,
} from "./validate-upload";

export type BlobQuery = (
  text: string,
  params: readonly unknown[],
) => Promise<Record<string, unknown>[]>;

export type BlobUploadDependencies = Readonly<{
  requireAdmin: (request: Request) => Promise<{ adminId: string }>;
  query: BlobQuery;
  createBlob: (bytes: Uint8Array) => Promise<string>;
  now?: () => number;
}>;

function json(status: number, body: unknown): Response {
  return Response.json(body, { status });
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

export function createBlobUploadHandler(
  dependencies: BlobUploadDependencies,
): (request: Request, batchId: string) => Promise<Response> {
  const now = dependencies.now ?? Date.now;
  return async function handleBlobUpload(
    request: Request,
    batchId: string,
  ): Promise<Response> {
    const { adminId } = await dependencies.requireAdmin(request);
    const form = await request.formData().catch(() => null);
    const destination = form?.get("destination");
    const file = form?.get("file");
    if (typeof destination !== "string" || !(file instanceof File)) {
      return json(400, { error: "destination-file-required" });
    }
    const mimeType = file.type || "application/octet-stream";
    const batchRows = await dependencies.query(
      `SELECT id, owner_admin_id, status, expires_at FROM upload_batch WHERE id = $1`,
      [batchId],
    );
    const batch = batchRows[0];
    if (!batch) return json(404, { error: "batch-not-found" });
    if (asString(batch["owner_admin_id"]) !== adminId) {
      return json(403, { error: "not-owner" });
    }
    if (asString(batch["status"]) !== "draft") {
      return json(409, { error: "batch-not-draft" });
    }
    const expiresAt = Date.parse(asString(batch["expires_at"]) ?? "");
    if (!Number.isFinite(expiresAt) || expiresAt <= now()) {
      return json(410, { error: "batch-expired" });
    }
    const stagedRows = await dependencies.query(
      `SELECT destination, mime_type, size, blob_sha FROM staged_upload_file WHERE batch_id = $1 AND destination = $2`,
      [batchId, destination],
    );
    const staged = stagedRows[0];
    if (!staged) return json(404, { error: "not-staged" });
    const stagedSize = asInteger(staged["size"]);
    const stagedMime = asString(staged["mime_type"]);
    if (stagedSize === null || stagedSize !== file.size) {
      return json(400, { error: "size-mismatch" });
    }
    if (stagedMime === null || stagedMime.toLowerCase() !== mimeType.toLowerCase()) {
      return json(400, { error: "mime-mismatch" });
    }
    const validation = validateUploadBatch([
      { destination, mimeType, size: file.size },
    ]);
    if (!validation.ok) {
      return json(400, {
        error: "validation",
        rejections: validation.rejections,
      });
    }
    if (file.size > MAX_FILE_BYTES) return json(413, { error: "file-too-large" });
    const usedRows = await dependencies.query(
      `SELECT COALESCE(SUM(size), 0) AS used FROM staged_upload_file WHERE batch_id = $1 AND blob_sha IS NOT NULL AND destination <> $2`,
      [batchId, destination],
    );
    const used = Number(usedRows[0]?.["used"] ?? 0);
    if (used + file.size > MAX_BATCH_BYTES) {
      return json(413, { error: "batch-too-large" });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const sha = await dependencies.createBlob(bytes);
    await dependencies.query(
      `UPDATE staged_upload_file SET blob_sha = $1 WHERE batch_id = $2 AND destination = $3`,
      [sha, batchId, destination],
    );
    return json(201, { destination, blobSha: sha });
  };
}
