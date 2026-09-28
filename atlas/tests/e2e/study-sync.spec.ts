import { expect, test } from "@playwright/test";

// WebAuthn ceremonies are covered by the isolated Better Auth/PGlite integration harness.
// This browser contract uses two independent contexts and a deterministic route harness so
// browser storage, acknowledgement, merge display, and profile isolation remain exercised.
test("two devices synchronize study state and expose both note conflict versions", async ({ browser }) => {
  const server = { note: "versão A", operationIds: new Set<string>() };
  const deviceA = await browser.newContext();
  const deviceB = await browser.newContext();

  for (const context of [deviceA, deviceB]) {
    await context.route("**/api/auth/get-session", (route) => route.fulfill({ json: { user: { id: "profile-1" } } }));
    await context.route("**/api/study/sync", async (route) => {
      const request = route.request().postDataJSON() as { outbox: Array<{ id: string; change: { type: string; note?: { text: string } } }> };
      for (const operation of request.outbox) {
        if (server.operationIds.has(operation.id)) continue;
        server.operationIds.add(operation.id);
        if (operation.change.type === "note.save") server.note = operation.change.note!.text;
      }
      await route.fulfill({ json: {
        cursor: String(server.operationIds.size), acknowledgedIds: request.outbox.map(({ id }) => id),
        conflicts: server.note === "versão B" ? [{ id: "conflict-1", noteId: "note-1", versions: [
          { id: "note-1", material: { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" }, text: "versão A", updatedAt: "2026-09-28T11:00:00.000Z", deletedAt: null },
          { id: "note-1", material: { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" }, text: "versão B", updatedAt: "2026-09-28T11:01:00.000Z", deletedAt: null },
        ] }] : [],
        snapshot: { progress: [], favorites: [], notes: [], flashcards: [], outbox: [], conflicts: [], currentMaterial: null },
      } });
    });
  }

  const pageA = await deviceA.newPage();
  const pageB = await deviceB.newPage();
  await pageA.goto("/");
  await pageB.goto("/");
  await pageA.getByRole("button", { name: "Sincronizar agora" }).click();
  await expect(pageA.getByRole("status")).toContainText("sincronizados");

  await pageB.evaluate(async () => {
    const request = indexedDB.open("dsm-atlas", 3);
    const opened = Promise.withResolvers<void>();
    request.onsuccess = () => opened.resolve(); request.onerror = () => opened.reject(request.error);
    await opened.promise;
    const db = request.result;
    const tx = db.transaction(["notes", "outbox"], "readwrite");
    const material = { path: "DSM1/ALP/aula-01.md", commitSha: "abc123" };
    const note = { id: "note-1", material, text: "versão B", updatedAt: "2026-09-28T11:01:00.000Z", deletedAt: null };
    tx.objectStore("notes").put(note);
    tx.objectStore("outbox").put({ id: crypto.randomUUID(), updatedAt: note.updatedAt, deletedAt: null, change: { type: "note.save", note } });
    const complete = Promise.withResolvers<void>();
    tx.oncomplete = () => complete.resolve(); tx.onerror = () => complete.reject(tx.error);
    await complete.promise;
    db.close();
  });
  await pageB.getByRole("button", { name: "Sincronizar agora" }).click();
  await expect(pageB.getByRole("alert")).toContainText("versão A");
  await expect(pageB.getByRole("alert")).toContainText("versão B");

  await deviceA.close();
  await deviceB.close();
});
