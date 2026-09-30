import type { SyncResult, RemoteStudyStore } from "./neon-study-store";
import type { SyncableStudyWorkspace } from "./indexed-db-study-store";

/**
 * The server's `cursor mismatch` rejection. A device whose local IndexedDB was
 * evicted keeps its `localStorage` id but loses its cursor, so it sends 0 while
 * the server still has a non-zero cursor for that device. The sync endpoint
 * answers 409; the caller recovers by minting a fresh device id (see
 * `resetDevice`) instead of retrying forever.
 */
export class SyncCursorMismatchError extends Error {
  constructor() {
    super("cursor mismatch");
    this.name = "SyncCursorMismatchError";
  }
}

function isCursorMismatch(error: unknown): boolean {
  return error instanceof SyncCursorMismatchError
    || (error instanceof Error && error.message.includes("cursor mismatch"));
}

export async function synchronizeStudy(
  local: SyncableStudyWorkspace,
  remote: RemoteStudyStore,
  options: Readonly<{
    deviceId: string;
    retryDelaysMs?: readonly number[];
    /**
     * Mints a fresh device id after a `cursor mismatch`. The workspace cursor is
     * reset first, so the server sees a brand-new device at cursor 0 and returns
     * the authoritative full snapshot. Omitted → the mismatch is not recoverable.
     */
    resetDevice?: () => string;
  }>,
): Promise<SyncResult> {
  let request = await local.pendingSyncRequest(options.deviceId);
  const retryDelays = options.retryDelaysMs ?? [250, 1_000, 4_000];
  let result: SyncResult;
  let recovered = false;

  for (let attempt = 0; ; attempt += 1) {
    try {
      result = await remote.sync(request);
      break;
    } catch (error) {
      if (isCursorMismatch(error) && options.resetDevice && !recovered) {
        recovered = true;
        await local.resetSync();
        request = await local.pendingSyncRequest(options.resetDevice());
        continue;
      }
      if (attempt >= retryDelays.length) throw error;
      await delay(retryDelays[attempt]);
    }
  }

  const reconciled = await local.reconcile(result.snapshot, result.conflicts, result.acknowledgedIds, result.cursor);
  return { ...result, snapshot: reconciled };
}

function delay(milliseconds: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, milliseconds);
  return promise;
}
