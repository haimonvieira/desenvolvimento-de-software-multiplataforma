import { expect, test } from "@playwright/test";

// The preview Worker runs with no session, no DATABASE_URL and no GitHub App
// credentials: every administrative route must fail closed before a handler
// runs. This pins that a visitor can never list, review, upload to or publish a
// batch through the admin surface.
const ADMIN_ENDPOINTS = [
  { name: "admin bootstrap", method: "POST", path: "/api/admin/bootstrap" },
  { name: "batch listing", method: "GET", path: "/api/admin/batches" },
  { name: "batch creation", method: "POST", path: "/api/admin/batches", data: { baseCommitSha: "a".repeat(40), files: [] } },
  { name: "batch review (GET)", method: "GET", path: "/api/admin/batches/batch-1" },
  { name: "batch review (POST)", method: "POST", path: "/api/admin/batches/batch-1", data: { revisions: [] } },
  { name: "blob upload", method: "POST", path: "/api/admin/batches/batch-1/blobs" },
  { name: "classification", method: "POST", path: "/api/admin/batches/batch-1/classify" },
  { name: "publication", method: "POST", path: "/api/admin/batches/batch-1/publish", data: { baseCommitSha: "a".repeat(40), confirmation: "PUBLICAR 1 ARQUIVOS EM main #00000000" } },
] as const;

for (const endpoint of ADMIN_ENDPOINTS) {
  test(`${endpoint.name} fails closed for an unauthenticated visitor`, async ({ request }) => {
    const response = endpoint.method === "GET"
      ? await request.get(endpoint.path)
      : await request.post(endpoint.path, { data: "data" in endpoint ? endpoint.data : undefined });
    const body = await response.text();

    expect(response.status()).not.toBe(200);
    expect(body).not.toContain("confirmationPhrase");
    expect(body).not.toContain("commitSha");
    expect(body).not.toContain("publishedCommit");
  });
}

test("the public catalogue stays readable while the admin surface is closed", async ({ page }) => {
  await page.goto("/?semester=DSM1&view=list");

  await expect(page.locator('[data-representation="list"] [data-material-link]').first()).toBeVisible();
});
