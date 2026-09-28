import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://127.0.0.1:8787" },
  webServer: {
    command: "corepack pnpm preview --port 8787",
    port: 8787,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
