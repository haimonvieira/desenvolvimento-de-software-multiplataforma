import type { Favorite, Flashcard, Note, NoteConflict, OutboxEntry, Progress, StudyChange, StudyRecord, StudySnapshot } from "./model";
import type { StudyWorkspace } from "./study-workspace";

const DATABASE_VERSION = 3;
const DATA_STORES = ["progress", "favorites", "notes", "flashcards"] as const;
const ALL_STORES = [...DATA_STORES, "meta", "outbox", "conflicts"] as const;
type StoreName = typeof ALL_STORES[number];
type StoredData = Progress | Favorite | Note | Flashcard | OutboxEntry | StudyRecord | NoteConflict;

export interface SyncableStudyWorkspace extends StudyWorkspace {
  reconcile(snapshot: StudySnapshot, conflicts: readonly NoteConflict[], acknowledgedIds: readonly string[], cursor: string): Promise<StudySnapshot>;
  cursor(): Promise<string>;
  clear(): Promise<void>;
}

export function createIndexedDbStudyWorkspace(options: Readonly<{
  databaseName?: string;
  indexedDB?: IDBFactory;
  createOperationId?: () => string;
}> = {}): SyncableStudyWorkspace {
  const factory = options.indexedDB ?? globalThis.indexedDB;
  const databaseName = options.databaseName ?? "dsm-atlas";
  const createOperationId = options.createOperationId ?? (() => crypto.randomUUID());

  async function open(): Promise<IDBDatabase> {
    const { promise, resolve, reject } = Promise.withResolvers<IDBDatabase>();
    const request = factory.open(databaseName, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      for (const name of ALL_STORES) {
        if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error(`IndexedDB ${databaseName} upgrade blocked`));
    return promise;
  }

  async function load(): Promise<StudySnapshot> {
    const db = await open();
    try {
      const transaction = db.transaction(ALL_STORES, "readonly");
      const [progress, favorites, notes, flashcards, outbox, conflicts] = await Promise.all([
        getAll<Progress>(transaction.objectStore("progress")),
        getAll<Favorite>(transaction.objectStore("favorites")),
        getAll<Note>(transaction.objectStore("notes")),
        getAll<Flashcard>(transaction.objectStore("flashcards")),
        getAll<OutboxEntry>(transaction.objectStore("outbox")),
        getAll<NoteConflict>(transaction.objectStore("conflicts")),
      ]);
      await transactionDone(transaction);
      const currentMaterial = progress
        .filter((entry) => !entry.deletedAt && entry.status === "studying")
        .toSorted(compareUpdatedAt)
        .at(-1)?.material ?? null;
      return {
        progress: progress.toSorted(compareId),
        favorites: favorites.toSorted(compareId),
        notes: notes.toSorted(compareId),
        flashcards: flashcards.toSorted(compareId),
        outbox: outbox.toSorted(compareUpdatedAt),
        conflicts: conflicts.toSorted((left, right) => left.id.localeCompare(right.id)),
        currentMaterial,
      };
    } finally {
      db.close();
    }
  }

  async function apply(change: StudyChange): Promise<StudySnapshot> {
    const db = await open();
    try {
      const stores = storesFor(change);
      const transaction = db.transaction([...stores, "outbox"], "readwrite");
      const store = transaction.objectStore(stores[0]);
      const record = await recordForChange(store, change) as Progress | Favorite | Note | Flashcard;
      store.put(record);
      transaction.objectStore("outbox").add(outboxFor(change, record.updatedAt, createOperationId()));
      await transactionDone(transaction);
    } finally {
      db.close();
    }
    return load();
  }

  async function cursor(): Promise<string> {
    const db = await open();
    try {
      const transaction = db.transaction("meta", "readonly");
      const value = await get<StudyRecord & { value: string }>(transaction.objectStore("meta"), "sync-cursor");
      await transactionDone(transaction);
      return value?.value ?? "0";
    } finally {
      db.close();
    }
  }

  async function reconcile(remote: StudySnapshot, conflicts: readonly NoteConflict[], acknowledgedIds: readonly string[], nextCursor: string): Promise<StudySnapshot> {
    const db = await open();
    try {
      const transaction = db.transaction(ALL_STORES, "readwrite");
      const acknowledged = new Set(acknowledgedIds);
      const pending = (await getAll<OutboxEntry>(transaction.objectStore("outbox"))).filter(({ id }) => !acknowledged.has(id));
      for (const name of DATA_STORES) {
        const store = transaction.objectStore(name);
        store.clear();
        for (const record of remote[name]) store.put(record);
      }
      for (const entry of pending.toSorted(compareUpdatedAt)) {
        const store = transaction.objectStore(storesFor(entry.change)[0]);
        store.put(await recordForChange(store, entry.change));
      }
      for (const id of acknowledgedIds) transaction.objectStore("outbox").delete(id);
      const conflictStore = transaction.objectStore("conflicts");
      conflictStore.clear();
      for (const conflict of conflicts) conflictStore.put(conflict);
      transaction.objectStore("meta").put({ id: "sync-cursor", value: nextCursor, updatedAt: new Date().toISOString(), deletedAt: null });
      await transactionDone(transaction);
    } finally {
      db.close();
    }
    return load();
  }

  async function clear(): Promise<void> {
    const db = await open();
    db.close();
    await deleteStudyDatabase(databaseName, factory);
  }

  return { load, apply, reconcile, cursor, clear };
}

function storesFor(change: StudyChange): readonly [StoreName] {
  if (change.type === "progress.set") return ["progress"];
  if (change.type === "favorite.set") return ["favorites"];
  if (change.type === "note.save" || (change.type === "item.delete" && change.entity === "note")) return ["notes"];
  return ["flashcards"];
}

async function recordForChange(store: IDBObjectStore, change: StudyChange): Promise<StoredData> {
  if (change.type === "progress.set") {
    return { id: materialId(change.material), material: change.material, status: change.status, updatedAt: change.at, deletedAt: null };
  }
  if (change.type === "favorite.set") {
    return { id: materialId(change.material), material: change.material, value: change.value, updatedAt: change.at, deletedAt: null };
  }
  if (change.type === "note.save") return change.note;
  if (change.type === "flashcard.save") return change.flashcard;

  const existing = await get<Note | Flashcard>(store, change.id);
  if (!existing) throw new Error(`${change.entity} ${change.id} does not exist`);
  return { ...existing, updatedAt: change.at, deletedAt: change.at };
}

function materialId(material: Readonly<{ commitSha: string; path: string }>): string {
  return `${material.commitSha}:${material.path}`;
}

function outboxFor(change: StudyChange, updatedAt: string, operationId: string): OutboxEntry {
  return { id: operationId, change, updatedAt, deletedAt: null };
}

function getAll<T>(store: IDBObjectStore): Promise<T[]> {
  const { promise, resolve, reject } = Promise.withResolvers<T[]>();
  const request = store.getAll();
  request.onsuccess = () => resolve(request.result as T[]);
  request.onerror = () => reject(request.error);
  return promise;
}

function get<T>(store: IDBObjectStore, key: IDBValidKey): Promise<T | undefined> {
  const { promise, resolve, reject } = Promise.withResolvers<T | undefined>();
  const request = store.get(key);
  request.onsuccess = () => resolve(request.result as T | undefined);
  request.onerror = () => reject(request.error);
  return promise;
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error);
  transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  return promise;
}

function compareId<T extends StudyRecord>(left: T, right: T): number {
  return left.id.localeCompare(right.id);
}

function compareUpdatedAt<T extends StudyRecord>(left: T, right: T): number {
  return left.updatedAt.localeCompare(right.updatedAt) || left.id.localeCompare(right.id);
}

export async function deleteStudyDatabase(databaseName = "dsm-atlas", factory: IDBFactory = globalThis.indexedDB): Promise<void> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  const request = factory.deleteDatabase(databaseName);
  request.onsuccess = () => resolve();
  request.onerror = () => reject(request.error);
  request.onblocked = () => reject(new Error(`IndexedDB ${databaseName} deletion blocked`));
  return promise;
}
