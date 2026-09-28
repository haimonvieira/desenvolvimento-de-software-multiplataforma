import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createAdminRepository } from "./admin-repository";

const migrationsFolder = fileURLToPath(new URL("../../../drizzle/migrations", import.meta.url));
let database: PGlite;

function adminRepository() {
  return createAdminRepository({
    query: async (text, params) => (await database.query(text, [...params])).rows as Record<string, unknown>[],
  });
}

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
});

afterEach(async () => database.close());

describe("immutable admin identity persistence", () => {
  it("creates one owner identity idempotently and rejects replacement", async () => {
    await database.exec(`INSERT INTO "user" (id,name,email,email_verified,is_anonymous,created_at,updated_at) VALUES
      ('owner','Owner','owner@example.test',true,false,now(),now()),
      ('visitor','Visitante','visitor@anonymous.placeholder.invalid',false,true,now(),now())`);
    const repository = adminRepository();

    expect(await repository.createIdentity({ adminId: "owner", githubUserId: "12345678" })).toEqual({ adminId: "owner", created: true });
    expect(await repository.createIdentity({ adminId: "owner", githubUserId: "12345678" })).toEqual({ adminId: "owner", created: false });
    await expect(repository.createIdentity({ adminId: "visitor", githubUserId: "87654321" })).rejects.toThrow();
    expect(await repository.identity()).toEqual({ adminId: "owner", githubUserId: "12345678" });
  });

  it("database session lookup excludes expired sessions", async () => {
    await database.exec(`INSERT INTO "user" (id,name,email,email_verified,is_anonymous,created_at,updated_at)
      VALUES ('owner','Owner','owner@example.test',true,false,now(),now());
      INSERT INTO "session" (id,expires_at,token,user_id,created_at,updated_at)
      VALUES ('expired',now() - interval '1 minute','expired-token','owner',now(),now())`);

    expect((await database.query("SELECT user_id FROM session WHERE token = $1 AND expires_at > now()", ["expired-token"])).rows).toEqual([]);
  });

  it("records allowlisted audit metadata without any token column", async () => {
    await database.exec(`INSERT INTO "user" (id,name,email,email_verified,is_anonymous,created_at,updated_at)
      VALUES ('owner','Owner','owner@example.test',true,false,now(),now())`);
    const repository = adminRepository();
    await repository.createIdentity({ adminId: "owner", githubUserId: "12345678" });
    await repository.audit({ action: "admin.bootstrap", adminId: "owner" });

    const columns = await database.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'admin_audit_event' ORDER BY column_name");
    expect((columns.rows as { column_name: string }[]).map((row) => row.column_name)).toEqual(["action", "admin_id", "created_at", "id"]);
    expect((await database.query("SELECT action, admin_id FROM admin_audit_event")).rows).toEqual([{ action: "admin.bootstrap", admin_id: "owner" }]);
  });
});
