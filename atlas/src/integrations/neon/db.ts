import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export function createDatabase(databaseUrl: string) {
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  return drizzle(neon(databaseUrl), { schema });
}

export function createSqlExecutor(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return { query: async (text: string, params: readonly unknown[]) => sql.query(text, [...params]) as Promise<Record<string, unknown>[]> };
}

export type AtlasDatabase = NeonHttpDatabase<typeof schema>;
