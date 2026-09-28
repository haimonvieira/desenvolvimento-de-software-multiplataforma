# Task 1 report — Cloudflare/Neon runtime baseline

## Status

Implemented and locally verified. No deployment or external resource was created. A live Neon/GitHub smoke remains pending because this worktree has no `DATABASE_URL` or GitHub credential; normal runtime reports `unconfigured` rather than fabricating `ok`.

## Official-source decisions (checked 2026-09-27)

- Cloudflare recommends vinext for new Next.js Workers apps; App Router, route handlers and Cloudflare bindings are supported, while vinext remains beta: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Current Cloudflare path uses `vinext` + `@vinext/cloudflare`, Vite, Cloudflare Vite plugin and Wrangler. The official scaffold scripts are Vite build/dev, Wrangler preview, and `vinext-cloudflare deploy`.
- Neon documents `@neondatabase/serverless` HTTP queries for one-shot edge/serverless operations. The route uses `neon(DATABASE_URL)` and a tagged-template `SELECT 1`: https://neon.com/docs/serverless/serverless-driver
- Workers Free does not require a paid feature for this path. Relevant published limits: 100,000 requests/day, 10 ms CPU/request, 128 MB, 50 subrequests/request, six simultaneous outgoing connections. Network wait does not count as CPU: https://developers.cloudflare.com/workers/platform/limits/

Pinned runtime/tooling choices are recorded in `atlas/package.json`; operational rationale and sources are also in `atlas/README.md`.

## Files

- Modified `.gitignore` for Atlas generated output, reports, and local env files.
- Created `atlas/package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`.
- Created Worker/vinext config: `vite.config.ts`, `wrangler.jsonc`, `worker-configuration.d.ts`, `tsconfig.json`.
- Created lint/test config: `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`.
- Created public app: `src/app/page.tsx`, `layout.tsx`, `globals.css`.
- Created health route: `src/app/api/health/route.ts`.
- Created unit contract and Worker preview test: `tests/health.test.ts`, `tests/cloudflare-workers.ts`, `tests/e2e/health.spec.ts`.
- Created `atlas/README.md`.

## RED

Command:

```text
corepack pnpm test -- tests/health.test.ts
```

Observed expected failure before route implementation:

```text
FAIL tests/health.test.ts
Error: Cannot find module '../src/app/api/health/route'
Test Files 1 failed (1)
```

## GREEN

Initial focused command after implementation:

```text
corepack pnpm test -- tests/health.test.ts
```

Result: 1 file passed, 3 tests passed. The tests prove configured injected adapters produce `ok`, missing adapters produce `unconfigured`, and a failing adapter produces a redacted `error` response.

Final scoped verification:

```text
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm build
corepack pnpm test:e2e tests/e2e/health.spec.ts
```

Results:

- TypeScript strict check: exit 0.
- ESLint: exit 0.
- Vitest: 1 file passed, 3 tests passed.
- vinext/Vite Worker build: exit 0; routes `/` and `/api/health` emitted.
- Playwright against Wrangler preview: 1 test passed; no-secret endpoint returned HTTP 503 and exact `unconfigured` payload.
- `pnpm install --frozen-lockfile`: exit 0 after explicitly allowing only required reviewed native installer packages (`esbuild`, `sharp`, `unrs-resolver`, `workerd`).

The vinext build emits upstream informational warnings about static/dynamic imports and route classification; build exits 0 and the actual Worker preview contract passes.

## Health behavior and security

- Database check performs one HTTP query (`SELECT 1`) through Neon serverless; no TCP/filesystem/process-global request cache.
- GitHub check uses native `fetch` for repository `HEAD`, authenticated server-side when configured.
- `ok` is impossible unless both adapters complete successfully.
- Missing secret/configuration yields `unconfigured`; dependency failure yields `error`; error detail and secrets are not returned.
- Real secret values are absent from source, config, client code, and staged diff. `.env*` is ignored.

## Self-review

- Scope is limited to Task 1 files plus official scaffold/config files needed to compile and test them.
- No Tailwind dependency or generated Tailwind styling remains.
- No deploy command was invoked.
- Package install scripts are fail-closed except four reviewed native binary selectors/installers required by the selected official toolchain.

## Commit

Pending at report-writing time; final commit SHA is recorded in the task result after `chore(atlas): prove Cloudflare Neon runtime`.

## Concerns

1. **Live proof pending:** without configured `DATABASE_URL`, `GITHUB_TOKEN`, and `GITHUB_REPOSITORY`, no real Neon/GitHub request was made. This is explicitly deferred to a configured environment and Task 16 by the ruling in `progress.md`.
2. **Beta adapter:** Cloudflare currently recommends vinext, but it is beta. Re-run `vinext check` and the Worker preview contract when upgrading.
3. **Free CPU ceiling:** Cloudflare documents 10 ms CPU/request on Free. The current endpoint is I/O-bound and small, but production observations are still required.
