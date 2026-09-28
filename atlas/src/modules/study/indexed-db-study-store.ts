import type { Favorite, Flashcard, Note, OutboxEntry, Progress, StudyChange, StudyRecord, StudySnapshot } from "./model";
import type { StudyWorkspace } from "./study-workspace";

const DATABASE_VERSION = 2;
const DATA_STORES = ["progress", "favorites", "notes", "flashcards"] as const;
const ALL_STORES = [...DATA_STORES, "meta", "outbox"] as const;
type StoreName = typeof ALL_STORES[number];
type StoredData = Progress | Favorite | Note | Flashcard | OutboxEntry | StudyRecord;

export function createIndexedDbStudyWorkspace(options: Readonly<{
  databaseName?: string;
  indexedDB?: IDBFactory;
}> = {}): StudyWorkspace {
  const factory = options.indexedDB ?? globalThis.indexedDB;
  const databaseName = options.databaseName ?? "dsm-atlas";

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
      const [progress, favorites, notes, flashcards, outbox] = await Promise.all([
        getAll<Progress>(transaction.objectStore("progress")),
        getAll<Favorite>(transaction.objectStore("favorites")),
        getAll<Note>(transaction.objectStore("notes")),
        getAll<Flashcard>(transaction.objectStore("flashcards")),
        getAll<OutboxEntry>(transaction.objectStore("outbox")),
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
      const record = await recordForChange(store, change);
      store.put(record);
      transaction.objectStore("outbox").put(outboxFor(change, record.updatedAt));
      await transactionDone(transaction);
    } finally {
      db.close();
    }
    return load();
  }

  return { load, apply };
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

function outboxFor(change: StudyChange, updatedAt: string): OutboxEntry {
  const subject = change.type === "progress.set" || change.type === "favorite.set"
    ? materialId(change.material)
    : change.type === "note.save" ? `note:${change.note.id}`
      : change.type === "flashcard.save" ? `flashcard:${change.flashcard.id}`
        : `${change.entity}:${change.id}`;
  return { id: `${subject}:${updatedAt}`, change, updatedAt, deletedAt: null };
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
