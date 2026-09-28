import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { createIndexedDbStudyWorkspace, deleteStudyDatabase } from "./indexed-db-study-store";
import type { Flashcard, Note } from "./model";

const material = { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" } as const;
const databaseName = "dsm-atlas-test";

const note: Note = {
  id: "note-1",
  material,
  text: "Revisar estruturas condicionais",
  updatedAt: "2026-09-28T10:03:00.000Z",
  deletedAt: null,
};

const flashcard: Flashcard = {
  id: "card-1",
  material,
  front: "O que é uma variável?",
  back: "Um nome associado a um valor.",
  updatedAt: "2026-09-28T10:04:00.000Z",
  deletedAt: null,
};

afterEach(async () => {
  await deleteStudyDatabase(databaseName);
});

describe("IndexedDB study workspace", () => {
  it("persists progress and favorites across workspace reloads", async () => {
    const first = createIndexedDbStudyWorkspace({ databaseName });
    await first.apply({ type: "progress.set", material, status: "studying", at: "2026-09-28T10:00:00.000Z" });
    await first.apply({ type: "favorite.set", material, value: true, at: "2026-09-28T10:01:00.000Z" });

    const refreshed = createIndexedDbStudyWorkspace({ databaseName });
    const snapshot = await refreshed.load();

    expect(snapshot.progress).toEqual([{ id: "abc123:DSM1/ALP/aula-01.md", material, status: "studying", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null }]);
    expect(snapshot.favorites).toEqual([{ id: "abc123:DSM1/ALP/aula-01.md", material, value: true, updatedAt: "2026-09-28T10:01:00.000Z", deletedAt: null }]);
    expect(snapshot.currentMaterial).toEqual(material);
  });

  it("transitions progress and keeps the latest studying material as current", async () => {
    const workspace = createIndexedDbStudyWorkspace({ databaseName });
    const second = { path: "DSM1/ALP/aula-02.md", commitSha: "abc123" } as const;
    await workspace.apply({ type: "progress.set", material, status: "studying", at: "2026-09-28T10:00:00.000Z" });
    await workspace.apply({ type: "progress.set", material: second, status: "studying", at: "2026-09-28T10:01:00.000Z" });
    const snapshot = await workspace.apply({ type: "progress.set", material: second, status: "done", at: "2026-09-28T10:02:00.000Z" });

    expect(snapshot.progress.map(({ material: ref, status }) => [ref.path, status])).toEqual([
      ["DSM1/ALP/aula-01.md", "studying"],
      ["DSM1/ALP/aula-02.md", "done"],
    ]);
    expect(snapshot.currentMaterial).toEqual(material);
  });

  it("keeps distinct outbox operations for identical entities and timestamps", async () => {
    const operationIds = ["op-note-save", "op-note-delete", "op-note-delete-again"];
    const workspace = createIndexedDbStudyWorkspace({ databaseName, createOperationId: () => operationIds.shift()! });
    await workspace.apply({ type: "note.save", note });
    await workspace.apply({ type: "item.delete", entity: "note", id: note.id, at: note.updatedAt });
    const snapshot = await workspace.apply({ type: "item.delete", entity: "note", id: note.id, at: note.updatedAt });

    expect(snapshot.outbox.map(({ id, change }) => [id, change.type])).toEqual([
      ["op-note-delete", "item.delete"],
      ["op-note-delete-again", "item.delete"],
      ["op-note-save", "note.save"],
    ]);
  });

  it("saves notes and flashcards and emits stable injected outbox IDs", async () => {
    const operationIds = ["op-note", "op-card"];
    const workspace = createIndexedDbStudyWorkspace({ databaseName, createOperationId: () => operationIds.shift()! });
    await workspace.apply({ type: "note.save", note });
    const snapshot = await workspace.apply({ type: "flashcard.save", flashcard });

    expect(snapshot.notes).toEqual([note]);
    expect(snapshot.flashcards).toEqual([flashcard]);
    expect(snapshot.outbox.map(({ id, change }) => [id, change.type])).toEqual([
      ["op-note", "note.save"],
      ["op-card", "flashcard.save"],
    ]);
  });

  it("deletes notes and flashcards with tombstones retained for sync", async () => {
    const workspace = createIndexedDbStudyWorkspace({ databaseName });
    await workspace.apply({ type: "note.save", note });
    await workspace.apply({ type: "flashcard.save", flashcard });
    await workspace.apply({ type: "item.delete", entity: "note", id: note.id, at: "2026-09-28T10:05:00.000Z" });
    const snapshot = await workspace.apply({ type: "item.delete", entity: "flashcard", id: flashcard.id, at: "2026-09-28T10:06:00.000Z" });

    expect(snapshot.notes[0]).toMatchObject({ id: "note-1", deletedAt: "2026-09-28T10:05:00.000Z", updatedAt: "2026-09-28T10:05:00.000Z" });
    expect(snapshot.flashcards[0]).toMatchObject({ id: "card-1", deletedAt: "2026-09-28T10:06:00.000Z", updatedAt: "2026-09-28T10:06:00.000Z" });
  });

  it("migrates a version 1 database to version 2 without losing records", async () => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of ["progress", "favorites", "notes", "flashcards", "meta"]) db.createObjectStore(name, { keyPath: "id" });
      request.transaction?.objectStore("notes").put(note);
    };
    request.onsuccess = () => { request.result.close(); resolve(); };
    request.onerror = () => reject(request.error);
    await promise;

    const workspace = createIndexedDbStudyWorkspace({ databaseName });
    const snapshot = await workspace.load();

    expect(snapshot.notes).toEqual([note]);
    expect([...await listStores(databaseName)]).toEqual(["favorites", "flashcards", "meta", "notes", "outbox", "progress"]);
  });
});

async function listStores(name: string): Promise<DOMStringList> {
  const { promise, resolve, reject } = Promise.withResolvers<DOMStringList>();
  const request = indexedDB.open(name);
  request.onsuccess = () => { const stores = request.result.objectStoreNames; request.result.close(); resolve(stores); };
  request.onerror = () => reject(request.error);
  return promise;
}
