import { describe, expect, it } from "vitest";

import { createBatchCreateHandler } from "./batch-create";

type Query = (text: string, params: readonly unknown[]) => Promise<Record<string, unknown>[]>;

function setup(queryImpl: Query) {
  const calls: { text: string; params: readonly unknown[] }[] = [];
  const query: Query = async (text, params) => {
    calls.push({ text, params });
    return queryImpl(text, params);
  };
  const handler = createBatchCreateHandler({
    requireAdmin: async () => ({ adminId: "owner" }),
    query,
    now: () => 1_000_000,
    randomId: () => "batch-1",
  });
  return { handler, calls };
}

function request(files: readonly { destination: unknown; mimeType: unknown; size: unknown }[]) {
  return new Request("https://atlas.example/api/admin/batches", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      baseCommitSha: "a".repeat(40),
      files: files.map((file) => ({ ...file })),
    }),
  });
}

const pdf = (destination: string, size = 1024) => ({
  destination,
  mimeType: "application/pdf",
  size,
});

describe("batch creation contract", () => {
  it("rejects more than 100 files before touching the database", async () => {
    const { handler, calls } = setup(async () => []);
    const files = Array.from({ length: 101 }, (_, i) => pdf(`DSM1/ALP/f${i}.pdf`));
    const response = await handler(request(files));
    expect(response.status).toBe(400);
    expect(calls.length).toBe(0);
  });

  it("leaves no half-staged draft when a mid-loop insert fails", async () => {
    const { handler, calls } = setup(async (text) => {
      if (text.startsWith("INSERT INTO staged_upload_file") && calls.filter((c) => c.text.startsWith("INSERT INTO staged")).length >= 2) {
        throw new Error("mid-loop failure");
      }
      return [];
    });
    const response = await handler(
      request([pdf("DSM1/ALP/a.pdf"), pdf("DSM1/ALP/b.pdf"), pdf("DSM1/ALP/c.pdf")]),
    ).catch(() => Response.json({ error: "mid-loop failure" }, { status: 500 }));
    expect(response.status).toBe(500);
    const texts = calls.map((call) => call.text);
    expect(texts).toContain("ROLLBACK");
    expect(
      calls.some(
        (call) =>
          call.text.startsWith("DELETE FROM upload_batch") && call.params.includes("batch-1"),
      ),
    ).toBe(true);
  });

  it("inserts sanitized values identical to the validated ones", async () => {
    const { handler, calls } = setup(async () => []);
    const response = await handler(request([pdf("DSM1/ALP/a.pdf", 2048)]));
    expect(response.status).toBe(201);
    const staged = calls.find((call) => call.text.startsWith("INSERT INTO staged_upload_file"));
    expect(staged?.params).toEqual(["batch-1", "DSM1/ALP/a.pdf", "application/pdf", 2048]);
  });
});
