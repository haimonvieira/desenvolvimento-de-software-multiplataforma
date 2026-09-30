import { expect, test } from "@playwright/test";

test("reports missing runtime secrets without fabricating health", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({
    status: "unconfigured",
    runtime: "cloudflare",
    database: "unconfigured",
    github: "unconfigured",
  });
});
