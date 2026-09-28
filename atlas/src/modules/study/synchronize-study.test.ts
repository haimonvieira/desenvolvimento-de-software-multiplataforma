import "fake-indexeddb/auto";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createIndexedDbStudyWorkspace, deleteStudyDatabase } from "./indexed-db-study-store";
import { createPostgresStudyStore } from "./neon-study-store";
import { synchronizeStudy } from "./synchronize-study";
import type { Note } from "./model";

const migrationsFolder = fileURLToPath(new URL("../../../drizzle/migrations", import.meta.url));
const material = { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" } as const;
let database: PGlite;
let sequence = 0;
const databases = ["sync-device-a", "sync-device-b"];

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
  for (const profileId of ["profile-1", "profile-2"]) {
    await database.exec(`
      INSERT INTO "user" (id, name, email, email_verified, is_anonymous, created_at, updated_at)
      VALUES ('${profileId}', 'Visitante', '${profileId}@anonymous.placeholder.invalid', false, true, now(), now());
      INSERT INTO passkey (id, public_key, user_id, credential_id, counter, device_type, backed_up, created_at)
      VALUES ('key-${profileId}', 'public', '${profileId}', 'credential-${profileId}', 0, 'singleDevice', false, now());
    `);
  }
});

afterEach(async () => {
  await database.close();
  await Promise.all(databases.map((name) => deleteStudyDatabase(name)));
});

function operationId() {
  sequence += 1;
  return `operation-${sequence}`;
}

function local(name: string) {
  return createIndexedDbStudyWorkspace({ databaseName: name, createOperationId: operationId });
}

function note(text: string, updatedAt: string): Note {
  return { id: "note-1", material, text, updatedAt, deletedAt: null };
}

async function createProfileStore(profileId: string) {
  const executor = {
    query: async (sql: string, params: readonly unknown[]) => {
      const result = await database.query(sql, [...params]);
      return result.rows as Record<string, unknown>[];
    },
  };
  return createPostgresStudyStore(executor, profileId);
}

describe("study synchronization", () => {
  it("merges progress, favorites, and flashcards by latest updatedAt and lets a newer tombstone win", async () => {
    const deviceA = local(databases[0]);
    const deviceB = local(databases[1]);
    const server = await createProfileStore("profile-1");

    await deviceA.apply({ type: "progress.set", material, status: "studying", at: "2026-09-28T10:00:00.000Z" });
    await deviceA.apply({ type: "favorite.set", material, value: true, at: "2026-09-28T10:00:00.000Z" });
    await deviceA.apply({ type: "flashcard.save", flashcard: { id: "card-1", material, front: "A", back: "old", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null } });
    await synchronizeStudy(deviceA, server, { deviceId: "a", retryDelaysMs: [] });

    await synchronizeStudy(deviceB, server, { deviceId: "b", retryDelaysMs: [] });
    await deviceB.apply({ type: "progress.set", material, status: "done", at: "2026-09-28T11:00:00.000Z" });
    await deviceB.apply({ type: "favorite.set", material, value: false, at: "2026-09-28T11:00:00.000Z" });
    await deviceB.apply({ type: "flashcard.save", flashcard: { id: "card-1", material, front: "A", back: "new", updatedAt: "2026-09-28T11:00:00.000Z", deletedAt: null } });
    await deviceB.apply({ type: "item.delete", entity: "flashcard", id: "card-1", at: "2026-09-28T12:00:00.000Z" });
    await synchronizeStudy(deviceB, server, { deviceId: "b", retryDelaysMs: [] });

    const merged = await synchronizeStudy(deviceA, server, { deviceId: "a", retryDelaysMs: [] });
    expect(merged.snapshot.progress[0].status).toBe("done");
    expect(merged.snapshot.favorites[0].value).toBe(false);
    expect(merged.snapshot.flashcards[0]).toMatchObject({ back: "new", deletedAt: "2026-09-28T12:00:00.000Z" });
  });

  it("retains both concurrent note versions as a visible conflict", async () => {
    const deviceA = local(databases[0]);
    const deviceB = local(databases[1]);
    const server = await createProfileStore("profile-1");

    await deviceA.apply({ type: "note.save", note: note("base", "2026-09-28T10:00:00.000Z") });
    await synchronizeStudy(deviceA, server, { deviceId: "a", retryDelaysMs: [] });
    await synchronizeStudy(deviceB, server, { deviceId: "b", retryDelaysMs: [] });

    await deviceA.apply({ type: "note.save", note: note("versão A", "2026-09-28T11:00:00.000Z") });
    await deviceB.apply({ type: "note.save", note: note("versão B", "2026-09-28T11:01:00.000Z") });
    await synchronizeStudy(deviceA, server, { deviceId: "a", retryDelaysMs: [] });
    const result = await synchronizeStudy(deviceB, server, { deviceId: "b", retryDelaysMs: [] });

    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].versions.map((version) => version.text).sort()).toEqual(["versão A", "versão B"]);
    expect((await deviceB.load()).conflicts).toEqual(result.conflicts);
  });

  it("is idempotent when the same acknowledged outbox is replayed", async () => {
    const device = local(databases[0]);
    const server = await createProfileStore("profile-1");
    await device.apply({ type: "note.save", note: note("uma vez", "2026-09-28T10:00:00.000Z") });
    const outbox = (await device.load()).outbox;

    const first = await server.sync({ requestId: "00000000-0000-4000-8000-000000000001", deviceId: "a", cursor: "0", outbox });
    const replay = await server.sync({ requestId: "00000000-0000-4000-8000-000000000001", deviceId: "a", cursor: "0", outbox });

    expect(replay).toEqual(first);
    expect(replay.snapshot.notes).toHaveLength(1);
  });

  it("never returns records owned by another profile", async () => {
    const profileOne = await createProfileStore("profile-1");
    const profileTwo = await createProfileStore("profile-2");
    const device = local(databases[0]);
    await device.apply({ type: "note.save", note: note("privada", "2026-09-28T10:00:00.000Z") });
    const outbox = (await device.load()).outbox;

    await profileOne.sync({ requestId: "00000000-0000-4000-8000-000000000003", deviceId: "a", cursor: "0", outbox });
    const other = await profileTwo.sync({ requestId: "00000000-0000-4000-8000-000000000004", deviceId: "b", cursor: "0", outbox: [] });

    expect(other.snapshot.notes).toEqual([]);
    expect(other.conflicts).toEqual([]);
  });

  it("keeps unacknowledged outbox entries after bounded network retries", async () => {
    const device = local(databases[0]);
    await device.apply({ type: "favorite.set", material, value: true, at: "2026-09-28T10:00:00.000Z" });
    let attempts = 0;

    await expect(synchronizeStudy(device, {
      sync: async () => {
        attempts += 1;
        throw new TypeError("offline");
      },
    }, { deviceId: "a", retryDelaysMs: [0, 0] })).rejects.toThrow("offline");

    expect(attempts).toBe(3);
    expect((await device.load()).outbox).toHaveLength(1);
  });
});
