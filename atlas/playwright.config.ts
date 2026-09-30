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
    port: 8787,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
