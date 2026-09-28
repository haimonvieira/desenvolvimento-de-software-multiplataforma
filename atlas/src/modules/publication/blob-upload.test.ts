import { describe, expect, it } from "vitest";

import { createBlobUploadHandler } from "./blob-upload";

type Row = Record<string, unknown>;
type Query = (text: string, params: readonly unknown[]) => Promise<Row[]>;

const BATCH_ID = "batch-1";
const DESTINATION = "DSM1/ALP/aula-01.pdf";

function batchRow(overrides: Row = {}): Row {
  return {
    id: BATCH_ID,
    base_commit_sha: "a".repeat(40),
    owner_admin_id: "owner",
    status: "draft",
    total_bytes: 1024,
    expires_at: new Date(2_000_000).toISOString(),
    ...overrides,
  };
}

function stagedRow(overrides: Row = {}): Row {
  return {
    destination: DESTINATION,
    mime_type: "application/pdf",
    size: 1024,
    blob_sha: null,
    ...overrides,
  };
}

function setup(options: {
  batch?: Row | null;
  staged?: Row | null;
  stagedSizes?: readonly number[];
  adminId?: string;
  now?: number;
}) {
  const updates: { text: string; params: readonly unknown[] }[] = [];
  const created: Uint8Array[] = [];
  const query: Query = async (text) => {
    if (text.startsWith("SELECT") && text.includes("FROM upload_batch")) {
      return options.batch === null || options.batch === undefined
        ? options.batch === null
          ? []
          : [batchRow()]
        : [options.batch];
    }
    if (text.includes("FROM staged_upload_file") && text.includes("destination =")) {
      return options.staged === null || options.staged === undefined
        ? options.staged === null
          ? []
          : [stagedRow()]
        : [options.staged];
    }
    if (text.includes("SUM(")) {
      const sizes = options.stagedSizes ?? [];
      return [{ used: sizes.reduce((a, b) => a + b, 0) }];
    }
    updates.push({ text, params: [] });
    return [];
  };
  const handler = createBlobUploadHandler({
    requireAdmin: async () => ({ adminId: options.adminId ?? "owner" }),
    query,
    createBlob: async (bytes) => {
      created.push(bytes);
      return "blob-sha-1";
    },
    now: () => options.now ?? 1_000_000,
  });
  return { handler, updates, created };
}

function uploadRequest(size = 1024, mimeType = "application/pdf"): Request {
  const form = new FormData();
  form.set("destination", DESTINATION);
  form.set("file", new File([new Uint8Array(size)], "aula-01.pdf", { type: mimeType }));
  return new Request(`https://atlas.example/api/admin/batches/${BATCH_ID}/blobs`, {
    method: "POST",
    body: form,
  });
}

describe("blob upload batch binding", () => {
  it("rejects a batch owned by another admin", async () => {
    const { handler, created } = setup({ adminId: "intruder" });
    const response = await handler(uploadRequest(), BATCH_ID);
    expect(response.status).toBe(403);
    expect(created.length).toBe(0);
  });

  it("rejects an expired batch", async () => {
    const { handler, created } = setup({
      batch: batchRow({ expires_at: new Date(500_000).toISOString() }),
    });
    const response = await handler(uploadRequest(), BATCH_ID);
    expect(response.status).toBe(410);
    expect(created.length).toBe(0);
  });

  it("rejects a non-draft batch", async () => {
    const { handler, created } = setup({ batch: batchRow({ status: "ready" }) });
    const response = await handler(uploadRequest(), BATCH_ID);
    expect(response.status).toBe(409);
    expect(created.length).toBe(0);
  });

  it("rejects when the uploaded size differs from the staged size", async () => {
    const { handler, created } = setup({ staged: stagedRow({ size: 2048 }) });
    const response = await handler(uploadRequest(1024), BATCH_ID);
    expect(response.status).toBe(400);
    expect(created.length).toBe(0);
  });

  it("rejects when the uploaded MIME differs from the staged MIME", async () => {
    const { handler, created } = setup({});
    const response = await handler(uploadRequest(1024, "text/html"), BATCH_ID);
    expect(response.status).toBe(400);
    expect(created.length).toBe(0);
  });

  it("rejects cumulative overflow above 25 MiB", async () => {
    const { handler, created } = setup({
      staged: stagedRow({ size: 1024 }),
      stagedSizes: [25 * 1024 * 1024],
    });
    const response = await handler(uploadRequest(1024), BATCH_ID);
    expect(response.status).toBe(413);
    expect(created.length).toBe(0);
  });

  it("stores the blob SHA on success", async () => {
    const { handler, created, updates } = setup({ stagedSizes: [512] });
    const response = await handler(uploadRequest(), BATCH_ID);
    expect(response.status).toBe(201);
    expect(created.length).toBe(1);
    expect(
      updates.some((update) => update.text.startsWith("UPDATE staged_upload_file")),
    ).toBe(true);
  });
});
