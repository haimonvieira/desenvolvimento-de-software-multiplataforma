import "fake-indexeddb/auto";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createIndexedDbStudyWorkspace, deleteStudyDatabase } from "./indexed-db-study-store";
import { createPostgresStudyStore } from "./neon-study-store";
import { createStudySyncHandler } from "./sync-handler";
import { synchronizeStudy } from "./synchronize-study";
import type { Note, OutboxEntry } from "./model";

const migrationsFolder = fileURLToPath(new URL("../../../drizzle/migrations", import.meta.url));
const material = { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" } as const;
const databaseName = "sync-review-race";
let database: PGlite;

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
  await database.exec(`
    INSERT INTO "user" (id, name, email, email_verified, is_anonymous, created_at, updated_at)
    VALUES ('profile-1', 'Visitante', 'profile-1@anonymous.placeholder.invalid', false, true, now(), now());
    INSERT INTO passkey (id, public_key, user_id, credential_id, counter, device_type, backed_up, created_at)
    VALUES ('key-1', 'public', 'profile-1', 'credential-1', 0, 'singleDevice', false, now());
  `);
});

afterEach(async () => {
  await database.close();
  await deleteStudyDatabase(databaseName);
});

function entry(id: string, deviceText: string, at: string): OutboxEntry {
  const note: Note = { id: "note-1", material, text: deviceText, updatedAt: at, deletedAt: null };
  return { id, updatedAt: at, deletedAt: null, change: { type: "note.save", note } };
}

function store() {
  return createPostgresStudyStore({ query: async (sql, params) => (await database.query(sql, [...params])).rows as Record<string, unknown>[] }, "profile-1");
}

describe("reviewed synchronization invariants", () => {
  it("rejects future and regressive cursors but accepts a new device at zero", async () => {
    const remote = store();
    await expect(remote.sync({ requestId: "00000000-0000-4000-8000-000000000001", deviceId: "a", cursor: "9", outbox: [] })).rejects.toThrow(/cursor mismatch/);
    const first = await remote.sync({ requestId: "00000000-0000-4000-8000-000000000002", deviceId: "a", cursor: "0", outbox: [entry("op-1", "base", "2026-09-28T10:00:00.000Z")] });
    await expect(remote.sync({ requestId: "00000000-0000-4000-8000-000000000003", deviceId: "a", cursor: "0", outbox: [] })).rejects.toThrow(/cursor mismatch/);
    await expect(remote.sync({ requestId: "00000000-0000-4000-8000-000000000004", deviceId: "b", cursor: "0", outbox: [] })).resolves.toMatchObject({ cursor: first.cursor });
  });

  it("serializes concurrent same-base note edits and preserves both texts", async () => {
    const remote = store();
    await remote.sync({ requestId: "00000000-0000-4000-8000-000000000005", deviceId: "a", cursor: "0", outbox: [entry("base", "base", "2026-09-28T10:00:00.000Z")] });
    await remote.sync({ requestId: "00000000-0000-4000-8000-000000000006", deviceId: "b", cursor: "0", outbox: [] });
    const [a, b] = await Promise.all([
      remote.sync({ requestId: "00000000-0000-4000-8000-000000000007", deviceId: "a", cursor: "1", outbox: [entry("edit-a", "versão A", "2026-09-28T11:00:00.000Z")] }),
      remote.sync({ requestId: "00000000-0000-4000-8000-000000000008", deviceId: "b", cursor: "1", outbox: [entry("edit-b", "versão B", "2026-09-28T11:01:00.000Z")] }),
    ]);
    const conflicts = [...a.conflicts, ...b.conflicts];
    expect(conflicts.some((conflict) => conflict.versions.map(({ text }) => text).toSorted().join("|") === "versão A|versão B")).toBe(true);
  });

  it("chooses the same equal-timestamp winner regardless of delivery order", async () => {
    const sameTime = "2026-09-28T12:00:00.000Z";
    const first = store();
    await first.sync({ requestId: "00000000-0000-4000-8000-000000000009", deviceId: "b", cursor: "0", outbox: [entry("op-b", "B", sameTime)] });
    const firstResult = await first.sync({ requestId: "00000000-0000-4000-8000-000000000010", deviceId: "a", cursor: "0", outbox: [entry("op-a", "A", sameTime)] });

    await database.exec("DELETE FROM note_conflict; DELETE FROM sync_cursor; DELETE FROM sync_operation; DELETE FROM note;");
    const second = store();
    await second.sync({ requestId: "00000000-0000-4000-8000-000000000011", deviceId: "a", cursor: "0", outbox: [entry("op-a", "A", sameTime)] });
    const secondResult = await second.sync({ requestId: "00000000-0000-4000-8000-000000000012", deviceId: "b", cursor: "0", outbox: [entry("op-b", "B", sameTime)] });

    expect(firstResult.snapshot.notes[0].text).toBe(secondResult.snapshot.notes[0].text);
  });

  it("replays local edits made while a sync response is paused", async () => {
    const local = createIndexedDbStudyWorkspace({ databaseName, createOperationId: (() => { let i = 0; return () => `local-${++i}`; })() });
    await local.apply({ type: "note.save", note: { id: "note-1", material, text: "enviada", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null } });
    const gate = Promise.withResolvers<void>();
    const captured = Promise.withResolvers<void>();
    const syncing = synchronizeStudy(local, { sync: async (request) => {
      captured.resolve();
      await gate.promise;
      return { cursor: "1", acknowledgedIds: request.outbox.map(({ id }) => id), conflicts: [], snapshot: { progress: [], favorites: [], notes: [request.outbox[0].change.type === "note.save" ? request.outbox[0].change.note : neverNote()], flashcards: [], outbox: [], conflicts: [], currentMaterial: null } };
    } }, { deviceId: "00000000-0000-4000-8000-000000000001", retryDelaysMs: [] });
    await captured.promise;
    await local.apply({ type: "note.save", note: { id: "note-1", material, text: "durante o sync", updatedAt: "2026-09-28T11:00:00.000Z", deletedAt: null } });
    gate.resolve();
    await syncing;
    const final = await local.load();
    expect(final.notes[0].text).toBe("durante o sync");
    expect(final.outbox).toHaveLength(1);
  });


  it("runs the production HTTP handler against the real SQL repository", async () => {
    const handler = createStudySyncHandler({ profileId: async () => "profile-1", store });
    const response = await handler(new Request("https://atlas.example/api/study/sync", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
        requestId: "00000000-0000-4000-8000-000000000099", deviceId: "00000000-0000-4000-8000-000000000001", cursor: "0",
        outbox: [entry("http-op", "via handler", "2026-09-28T13:00:00.000Z")],
      }),
    }));
    expect(response.status).toBe(200);
    expect((await response.json() as { snapshot: { notes: Note[] } }).snapshot.notes[0].text).toBe("via handler");
  });

  it("replays a committed response for the same request ID and rejects a changed body", async () => {
    const remote = store();
    const request = { requestId: "00000000-0000-4000-8000-000000000010", deviceId: "a", cursor: "0", outbox: [entry("lost-op", "committed", "2026-09-28T14:00:00.000Z")] };
    const committed = await remote.sync(request);
    await expect(remote.sync(request)).resolves.toEqual(committed);
    await expect(remote.sync({ ...request, outbox: [entry("changed-op", "tampered", "2026-09-28T14:01:00.000Z")] })).rejects.toThrow(/request mismatch/);
    await expect(remote.sync({ requestId: "00000000-0000-4000-8000-000000000011", deviceId: "a", cursor: "0", outbox: [] })).rejects.toThrow(/cursor mismatch/);
  });

  it("keeps one stable request ID through retries and a later invocation until reconciliation", async () => {
    const local = createIndexedDbStudyWorkspace({ databaseName, createOperationId: () => "pending-op", createSyncRequestId: () => "00000000-0000-4000-8000-000000000020" });
    await local.apply({ type: "note.save", note: { id: "note-1", material, text: "pending", updatedAt: "2026-09-28T15:00:00.000Z", deletedAt: null } });
    const seen: string[] = [];
    await expect(synchronizeStudy(local, { sync: async (request) => { seen.push(request.requestId); throw new TypeError("lost response"); } }, { deviceId: "00000000-0000-4000-8000-000000000021", retryDelaysMs: [0] })).rejects.toThrow("lost response");
    await expect(synchronizeStudy(local, { sync: async (request) => { seen.push(request.requestId); throw new TypeError("still lost"); } }, { deviceId: "00000000-0000-4000-8000-000000000021", retryDelaysMs: [] })).rejects.toThrow("still lost");
    expect(new Set(seen)).toEqual(new Set(["00000000-0000-4000-8000-000000000020"]));
  });

  it("persists and replays the immutable pending body after restart while preserving newer edits", async () => {
    let requestSequence = 30;
    let operationSequence = 30;
    const makeLocal = () => createIndexedDbStudyWorkspace({
      databaseName,
      createOperationId: () => `operation-${++operationSequence}`,
      createSyncRequestId: () => `00000000-0000-4000-8000-${String(++requestSequence).padStart(12, "0")}`,
    });
    const firstLocal = makeLocal();
    await firstLocal.apply({ type: "note.save", note: { id: "note-1", material, text: "primeira", updatedAt: "2026-09-28T16:00:00.000Z", deletedAt: null } });
    const remote = store();
    let committedRequest: Parameters<typeof remote.sync>[0] | undefined;
    await expect(synchronizeStudy(firstLocal, { sync: async (request) => {
      committedRequest = structuredClone(request);
      await remote.sync(request);
      throw new TypeError("response lost");
    } }, { deviceId: "00000000-0000-4000-8000-000000000031", retryDelaysMs: [] })).rejects.toThrow("response lost");

    await firstLocal.apply({ type: "note.save", note: { id: "note-1", material, text: "mais nova", updatedAt: "2026-09-28T17:00:00.000Z", deletedAt: null } });
    const restarted = makeLocal();
    const replayed: Parameters<typeof remote.sync>[0][] = [];
    const recovered = await synchronizeStudy(restarted, { sync: async (request) => { replayed.push(structuredClone(request)); return remote.sync(request); } }, { deviceId: "00000000-0000-4000-8000-000000000031", retryDelaysMs: [] });

    expect(replayed[0]).toEqual(committedRequest);
    expect(recovered.snapshot.notes[0].text).toBe("mais nova");
    expect(recovered.snapshot.outbox).toHaveLength(1);
    const next: Parameters<typeof remote.sync>[0][] = [];
    await synchronizeStudy(restarted, { sync: async (request) => { next.push(structuredClone(request)); return remote.sync(request); } }, { deviceId: "00000000-0000-4000-8000-000000000031", retryDelaysMs: [] });
    expect(next[0].requestId).not.toBe(replayed[0].requestId);
    expect(next[0].outbox).toHaveLength(1);
    const queuedChange = next[0].outbox[0].change;
    if (queuedChange.type !== "note.save") throw new Error("expected queued note");
    expect(queuedChange.note.text).toBe("mais nova");
  });
});
function neverNote(): never { throw new Error("expected note operation"); }
