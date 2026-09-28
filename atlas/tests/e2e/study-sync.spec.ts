import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { createPostgresStudyStore } from "../../src/modules/study/neon-study-store";
import { createStudySyncHandler } from "../../src/modules/study/sync-handler";

const migrationsFolder = fileURLToPath(new URL("../../drizzle/migrations", import.meta.url));
const material = { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" };

test("two devices use the production sync handler and SQL function and expose note conflicts", async ({ browser }) => {
  const database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
  await database.exec(`
    INSERT INTO "user" (id,name,email,email_verified,is_anonymous,created_at,updated_at)
    VALUES ('profile-1','Visitante','profile-1@anonymous.placeholder.invalid',false,true,now(),now());
    INSERT INTO passkey (id,public_key,user_id,credential_id,counter,device_type,backed_up,created_at)
    VALUES ('key-1','public','profile-1','credential-1',0,'singleDevice',false,now());
  `);
  const store = createPostgresStudyStore({ query: async (sql, params) => (await database.query(sql, [...params])).rows as Record<string, unknown>[] }, "profile-1");
  const handler = createStudySyncHandler({ profileId: async () => "profile-1", store: () => store });
  const deviceA = await browser.newContext();
  const deviceB = await browser.newContext();

  for (const context of [deviceA, deviceB]) await attachActualHandler(context, handler);
  const pageA = await deviceA.newPage();
  const pageB = await deviceB.newPage();
  await pageA.goto("/");
  await pageB.goto("/");

  await saveLocalNote(pageA, "base", "2026-09-28T10:00:00.000Z");
  await pageA.getByRole("button", { name: "Sincronizar agora" }).click();
  await pageB.getByRole("button", { name: "Sincronizar agora" }).click();

  await saveLocalNote(pageA, "versão A", "2026-09-28T11:00:00.000Z");
  await saveLocalNote(pageB, "versão B", "2026-09-28T11:01:00.000Z");
  await pageA.getByRole("button", { name: "Sincronizar agora" }).click();
  await pageB.getByRole("button", { name: "Sincronizar agora" }).click();

  await expect(pageB.getByRole("alert")).toContainText("versão A");
  await expect(pageB.getByRole("alert")).toContainText("versão B");
  await deviceA.close();
  await deviceB.close();
  await database.close();
});

async function attachActualHandler(context: BrowserContext, handler: (request: Request) => Promise<Response>) {
  await context.route("**/api/auth/get-session", (route) => route.fulfill({ json: { user: { id: "profile-1" } } }));
  await context.route("**/api/study/sync", async (route) => {
    const request = route.request();
    const response = await handler(new Request(request.url(), { method: request.method(), headers: request.headers(), body: request.postData() }));
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() });
  });
}

async function saveLocalNote(page: Page, text: string, updatedAt: string) {
  await page.evaluate(async ({ material, text, updatedAt }) => {
    const request = indexedDB.open("dsm-atlas", 3);
    const opened = Promise.withResolvers<void>();
    request.onsuccess = () => opened.resolve(); request.onerror = () => opened.reject(request.error);
    await opened.promise;
    const db = request.result;
    const transaction = db.transaction(["notes", "outbox"], "readwrite");
    const note = { id: "note-1", material, text, updatedAt, deletedAt: null };
    transaction.objectStore("notes").put(note);
    transaction.objectStore("outbox").add({ id: crypto.randomUUID(), updatedAt, deletedAt: null, change: { type: "note.save", note } });
    const complete = Promise.withResolvers<void>();
    transaction.oncomplete = () => complete.resolve(); transaction.onerror = () => complete.reject(transaction.error);
    await complete.promise;
    db.close();
  }, { material, text, updatedAt });
}
