import type { SyncResult, RemoteStudyStore } from "./neon-study-store";
import type { SyncableStudyWorkspace } from "./indexed-db-study-store";

export async function synchronizeStudy(
  local: SyncableStudyWorkspace,
  remote: RemoteStudyStore,
  options: Readonly<{ deviceId: string; retryDelaysMs?: readonly number[] }>,
): Promise<SyncResult> {
  const snapshot = await local.load();
  const cursor = await local.cursor();
  const requestId = await local.syncRequestId();
  const retryDelays = options.retryDelaysMs ?? [250, 1_000, 4_000];
  let result: SyncResult;

  for (let attempt = 0; ; attempt += 1) {
    try {
      result = await remote.sync({ requestId, deviceId: options.deviceId, cursor, outbox: snapshot.outbox });
      break;
    } catch (error) {
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
