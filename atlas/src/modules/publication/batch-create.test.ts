import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createBatchCreateHandler } from "./batch-create";

const migrationsFolder = fileURLToPath(
  new URL("../../../drizzle/migrations", import.meta.url),
);

let database: PGlite;

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
  await database.exec(`
    INSERT INTO "user" (id, name, email) VALUES ('owner', 'Owner', 'owner@example.test');
    INSERT INTO admin_identity (admin_id, github_user_id) VALUES ('owner', '12345678');
  `);
});

afterEach(async () => {
  await database.close();
});

function query(text: string, params: readonly unknown[]) {
  return database
    .query(text, [...params])
    .then((result) => result.rows as Record<string, unknown>[]);
}

function handler() {
  return createBatchCreateHandler({
    requireAdmin: async () => ({ adminId: "owner" }),
    query,
    now: () => 1_000_000,
    randomId: () => "batch-1",
  });
}

function request(files: ReadonlyArray<{ destination: unknown; mimeType: unknown; size: unknown }>) {
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
    const files = Array.from({ length: 101 }, (_, i) => pdf(`DSM1/ALP/f${i}.pdf`));
    const response = await handler()(request(files));
    expect(response.status).toBe(400);
    const batches = await query(`SELECT id FROM upload_batch`, []);
    expect(batches).toEqual([]);
  });

  it("writes batch plus all staged rows in one atomic statement", async () => {
    const response = await handler()(
      request([pdf("DSM1/ALP/a.pdf", 2048), pdf("DSM1/ALP/b.pdf")]),
    );
    expect(response.status).toBe(201);
    const batches = await query(
      `SELECT id, status, total_bytes FROM upload_batch WHERE id = $1`,
      ["batch-1"],
    );
    expect(batches).toEqual([
      { id: "batch-1", status: "draft", total_bytes: 3072 },
    ]);
    const staged = await query(
      `SELECT destination, mime_type, size, blob_sha FROM staged_upload_file WHERE batch_id = $1 ORDER BY destination`,
      ["batch-1"],
    );
    expect(staged).toEqual([
      { destination: "DSM1/ALP/a.pdf", mime_type: "application/pdf", size: 2048, blob_sha: null },
      { destination: "DSM1/ALP/b.pdf", mime_type: "application/pdf", size: 1024, blob_sha: null },
    ]);
  });

  it("rolls back the batch row when a staged row violates its constraint", async () => {
    // A duplicate staged destination violates the (batch_id, destination)
    // primary key inside the function body: the batch row rolls back with it.
    await expect(
      query(
        `SELECT create_upload_batch($1, $2, $3, $4, $5, $6::jsonb)`,
        [
          "batch-2",
          "a".repeat(40),
          "owner",
          2048,
          new Date(2_000_000).toISOString(),
          JSON.stringify([
            { destination: "DSM1/ALP/a.pdf", mimeType: "application/pdf", size: 1024 },
            { destination: "DSM1/ALP/a.pdf", mimeType: "application/pdf", size: 1024 },
          ]),
        ],
      ),
    ).rejects.toThrow();
    const batches = await query(`SELECT id FROM upload_batch WHERE id = $1`, ["batch-2"]);
    const staged = await query(`SELECT destination FROM staged_upload_file WHERE batch_id = $1`, [
      "batch-2",
    ]);
    expect(batches).toEqual([]);
    expect(staged).toEqual([]);
  });

  it("inserts values identical to the validated ones", async () => {
    const response = await handler()(request([pdf("DSM1/ALP/a.pdf", 2048)]));
    expect(response.status).toBe(201);
    const staged = await query(
      `SELECT destination, mime_type, size FROM staged_upload_file WHERE batch_id = $1`,
      ["batch-1"],
    );
    expect(staged).toEqual([
      { destination: "DSM1/ALP/a.pdf", mime_type: "application/pdf", size: 2048 },
    ]);
  });
});
