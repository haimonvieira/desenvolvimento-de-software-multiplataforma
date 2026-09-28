import { expect, test } from "@playwright/test";

// Integration smoke only. The panel contract (review → 409 → re-fetch →
// new phrase → published copy) is covered by the real-component test in
// `src/modules/publication/batch-review-panel.test.tsx`, and the workflow
// atomicity by `publication-workflow.test.ts`.
//
// A full page render is impossible in this environment: the preview Worker has
// no DATABASE_URL/session, and every admin route module resolves
// `requiredRuntimeEnv("DATABASE_URL")` at import time, so `/admin` and both
// publication endpoints fail closed before any handler runs. This test pins
// that fail-closed registration: the routes exist and never expose a
// publication (no commit, no published payload) without configuration.
test("publication routes are registered and never expose a write unconfigured", async ({
  request,
}) => {
  const review = await request.get("/api/admin/batches/batch-1");
  const reviewBody = await review.text();
  expect(review.status()).not.toBe(200);
  expect(reviewBody).not.toContain("confirmationPhrase");

  const publish = await request.post("/api/admin/batches/batch-1/publish", {
    data: {
      baseCommitSha: "a".repeat(40),
      confirmation: "PUBLICAR 1 ARQUIVOS EM main #00000000",
    },
  });
  const publishBody = await publish.text();
  expect(publish.status()).not.toBe(200);
  expect(publishBody).not.toContain("commitSha");

  const listing = await request.get("/api/admin/batches");
  const listingBody = await listing.text();
  expect(listing.status()).not.toBe(200);
  expect(listingBody).not.toContain("batches");
});
