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
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
    ],
  },
});
