import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const atlasRoot = fileURLToPath(new URL("..", import.meta.url));

/**
 * The migrations are hand-authored (they define plpgsql functions and comments
 * `drizzle-kit generate` cannot reproduce), so `schema.ts` and the shipped SQL
 * can drift. A regenerate from the schema would silently drop a guard the SQL
 * declares. This pins every CHECK constraint in the applied SQL to a matching
 * declaration in `schema.ts`, and rejects the reverse so a schema-only check
 * cannot be lost either.
 */
describe("schema and migration parity", () => {
  it("declares every CHECK constraint present in the shipped migrations", async () => {
    const schema = await readFile(`${atlasRoot}/src/integrations/neon/schema.ts`, "utf8");
    const migrationsRoot = `${atlasRoot}/drizzle/migrations`;
    const files = (await readdir(migrationsRoot)).filter((file) => file.endsWith(".sql")).sort();

    const declared = new Set([...schema.matchAll(/check\("([^"]+)"/g)].map((match) => match[1]));
    const shipped = new Set<string>();
    for (const file of files) {
      const sql = await readFile(`${migrationsRoot}/${file}`, "utf8");
      for (const match of sql.matchAll(/CONSTRAINT "([^"]+)" CHECK/g)) shipped.add(match[1]);
    }

    expect([...shipped].filter((name) => !declared.has(name))).toEqual([]);
    expect([...declared].filter((name) => !shipped.has(name))).toEqual([]);
  });
});
