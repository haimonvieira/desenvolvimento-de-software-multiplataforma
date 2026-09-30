import { neon } from "@neondatabase/serverless";
import type { NoteConflict, OutboxEntry, StudySnapshot } from "./model";

export type SyncRequest = Readonly<{ requestId: string; deviceId: string; cursor: string; outbox: readonly OutboxEntry[] }>;
export type SyncResult = Readonly<{ snapshot: StudySnapshot; conflicts: readonly NoteConflict[]; cursor: string; acknowledgedIds: readonly string[] }>;
export interface RemoteStudyStore { sync(request: SyncRequest): Promise<SyncResult> }
export interface PostgresExecutor { query(sql: string, params: readonly unknown[]): Promise<readonly Record<string, unknown>[]> }

export function createNeonStudyStore(databaseUrl: string, profileId: string): RemoteStudyStore {
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  const sql = neon(databaseUrl);
  return createPostgresStudyStore({
    query: async (text, params) => {
      const rows = await sql.query(text, [...params]);
      return rows as Record<string, unknown>[];
    },
  }, profileId);
}

export function createPostgresStudyStore(database: PostgresExecutor, profileId: string): RemoteStudyStore {
  if (!profileId) throw new Error("Authenticated profile is required");

  return {
    async sync(request) {
      const payload = JSON.stringify({
        requestId: request.requestId,
        deviceId: request.deviceId,
        cursor: request.cursor,
        outbox: request.outbox,
      });
      const rows = await database.query("SELECT sync_study($1, $2::jsonb) AS result", [profileId, payload]);
      if (!rows[0]?.result) throw new Error("Study sync returned no result");
      return parseSyncResult(rows[0].result);
    },
  };
}

function parseSyncResult(value: unknown): SyncResult {
  const result = typeof value === "string" ? JSON.parse(value) as SyncResult : value as SyncResult;
  return {
    ...result,
    snapshot: { ...result.snapshot, outbox: [], conflicts: result.conflicts },
  };
}
