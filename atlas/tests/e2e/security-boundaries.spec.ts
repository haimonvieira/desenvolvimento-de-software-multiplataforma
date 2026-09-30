import { expect, test } from "@playwright/test";

// The preview Worker runs with no DATABASE_URL. Every `/api/admin/*` route
// module resolves `requiredRuntimeEnv("DATABASE_URL")` while it is evaluated
// (`server-admin` -> `server-auth`), so Next answers 500 before a handler — and
// therefore before `requireAdmin` — ever runs. The preview cannot reach either
// the authorized path or the 403-mapped path; the exact per-handler 403 mapping
// is pinned in-process by `tests/security-boundaries.test.ts`, which builds
// every real handler with a visitor `requireAdmin` and proves the removal of a
// mapping fails that test.
//
// This spec pins the deployment-level guarantee instead: with the deployment
// unconfigured, no admin route answers 200 (a status a wrong 500 would also
// satisfy is deliberately avoided) and none leaks a batch payload.
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
  test(`${endpoint.name} fails closed with 500 while unconfigured and leaks no batch payload`, async ({ request }) => {
    const response = endpoint.method === "GET"
      ? await request.get(endpoint.path)
      : await request.post(endpoint.path, { data: "data" in endpoint ? endpoint.data : undefined });
    const body = await response.text();

    expect(response.status()).toBe(500);
    expect(body).not.toContain("confirmationPhrase");
    expect(body).not.toContain("publishedCommit");
    expect(body).not.toContain("owner_admin_id");
    expect(body).not.toContain("blobSha");
  });
}

test("the public catalogue stays readable while the admin surface is closed", async ({ page }) => {
  await page.goto("/?semester=DSM1&view=list");

  await expect(page.locator('[data-representation="list"] [data-material-link]').first()).toBeVisible();
});
