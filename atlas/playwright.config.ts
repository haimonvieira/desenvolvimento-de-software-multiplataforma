import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://127.0.0.1:8787" },
  // Each spec drives a real Wrangler preview Worker that loads the generated
  // catalog and content index. At Playwright's default worker count the suite
  // contends for CPU and intermittently fails specs that pass in isolation;
  // pinning two workers makes the shipped command deterministic.
  workers: 2,
  webServer: {
    command: "corepack pnpm preview --port 8787",
    // `url` (not `port`) is what makes readiness meaningful: the port alone only
    // proves the socket is open, and Wrangler opens it before the Worker module
    // finishes initialising, so the earliest specs used to fail with ERR_ABORTED
    // or "Request context disposed". Waiting for a real 200 means the Worker
    // actually answered a request.
    url: "http://127.0.0.1:8787/",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
