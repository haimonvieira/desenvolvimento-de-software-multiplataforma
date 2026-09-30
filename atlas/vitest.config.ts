import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "cloudflare:workers": new URL(
        "./tests/cloudflare-workers.ts",
        import.meta.url,
      ).pathname,
    },
  },
  test: {
    // PGlite suites spin a WASM database and apply every migration in a
    // beforeAll hook. Under parallel file execution that init contends for CPU
    // and can exceed vitest's 10s default, failing the hook rather than the
    // test. The assertions themselves are fast; only the shared init is slow.
    hookTimeout: 60_000,
    // The catalog and content-index suites shell out to `git` and write many
    // files under the OS temp directory; under the same parallel CPU/FS
    // contention those fixtures can exceed vitest's 5s default and fail with a
    // timeout (or an EBUSY on Windows temp cleanup) rather than an assertion.
    // They run in ~1s in isolation, so the bound only absorbs contention.
    testTimeout: 30_000,
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
    ],
  },
});
