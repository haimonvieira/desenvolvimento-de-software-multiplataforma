import { env } from "cloudflare:workers";

import { serverAdmin } from "../../../../../../modules/identity/server-admin";
import { createSqlExecutor } from "../../../../../../integrations/neon/db";
import {
  MAX_FILE_BYTES,
  validateUploadBatch,
} from "../../../../../../modules/publication/validate-upload";
import { createGitHubMaterialSource } from "../../../../../../integrations/github/github-material-source";

type BlobEnv = {
  DATABASE_URL?: string;
  GITHUB_INSTALLATION_TOKEN?: string;
  GITHUB_REPOSITORY?: string;
};

function json(status: number, body: unknown): Response {
  return Response.json(body, { status });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  await serverAdmin.requireAdmin(request);
  const { id } = await context.params;
  const runtime = env as BlobEnv;
  if (!runtime.DATABASE_URL) return json(503, { error: "unconfigured" });
  if (!runtime.GITHUB_INSTALLATION_TOKEN || !runtime.GITHUB_REPOSITORY) {
    return json(503, { error: "github-unconfigured" });
  }
  const form = await request.formData().catch(() => null);
  const destination = form?.get("destination");
  const file = form?.get("file");
  if (typeof destination !== "string" || !(file instanceof File)) {
    return json(400, { error: "destination-file-required" });
  }
  const validation = validateUploadBatch([
    { destination, mimeType: file.type || "application/octet-stream", size: file.size },
  ]);
  if (!validation.ok) return json(400, { error: "validation", rejections: validation.rejections });
  if (file.size > MAX_FILE_BYTES) return json(413, { error: "file-too-large" });
  const db = createSqlExecutor(runtime.DATABASE_URL);
  const staged = await db.query(
    `SELECT destination, blob_sha FROM staged_upload_file WHERE batch_id = $1 AND destination = $2`,
    [id, destination],
  );
  if (staged.length === 0) return json(404, { error: "not-staged" });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const installationToken = runtime.GITHUB_INSTALLATION_TOKEN as string;
  const repository = runtime.GITHUB_REPOSITORY as string;
  const source = createGitHubMaterialSource(
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
      return { status: response.status, json: () => response.json() as Promise<unknown> };
    },
    async () => installationToken,
    repository,
  );
  const sha = await source.createBlob(bytes);
  await db.query(
    `UPDATE staged_upload_file SET blob_sha = $1 WHERE batch_id = $2 AND destination = $3`,
    [sha, id, destination],
  );
  return json(201, { destination, blobSha: sha });
}

export { POST as post };
