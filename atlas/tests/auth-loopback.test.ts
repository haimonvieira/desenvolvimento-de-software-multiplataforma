import { describe, expect, it } from "vitest";
import { createAuthForDatabase } from "./src/modules/identity/auth";
import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { authSchema } from "./src/integrations/neon/schema";
import { fileURLToPath } from "node:url";

const migrationsFolder = fileURLToPath(new URL("../drizzle/migrations", import.meta.url));

describe("loopback HTTPS relaxation", () => {
  it("accepts http loopback base URL and rejects other http origins", async () => {
    const database = new PGlite();
    await migrate(drizzle(database, { schema: authSchema }), { migrationsFolder });
    // loopback must pass
    const auth = createAuthForDatabase({
      databaseUrl: "unused",
      secret: "a".repeat(32),
      baseUrl: "http://127.0.0.1:8787",
      rpId: "127.0.0.1",
      trustedOrigins: ["http://127.0.0.1:8787"],
    }, drizzle(database, { schema: authSchema }));
    expect(auth).toBeTruthy();
    // non-loopback http must still fail
    expect(() => createAuthForDatabase({
      databaseUrl: "unused",
      secret: "a".repeat(32),
      baseUrl: "http://atlas.example",
      rpId: "atlas.example",
      trustedOrigins: ["http://atlas.example"],
    }, drizzle(database, { schema: authSchema }))).toThrow(/HTTPS/);
    await database.close();
  });
});
