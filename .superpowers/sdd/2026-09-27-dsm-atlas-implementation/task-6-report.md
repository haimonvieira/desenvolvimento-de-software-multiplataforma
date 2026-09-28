### Task 6 report — anonymous local study state

#### RED / GREEN

- RED: `corepack pnpm exec vitest run src/modules/study/study-workspace.test.ts` failed because `./indexed-db-study-store` did not exist.
- GREEN: the same targeted command passes 5 tests covering reload persistence, progress transitions/current material, favorite toggle, note and flashcard saves, deletion tombstones/outbox, and schema v1 → v2 migration.
- Type check: `corepack pnpm exec tsc --noEmit` exits 0.

#### IndexedDB behavior

- One native IndexedDB database named `dsm-atlas`, schema version 2.
- Stores: `progress`, `favorites`, `notes`, `flashcards`, `meta`, and `outbox`.
- All persisted records include `id`, caller-supplied `updatedAt`, and nullable `deletedAt`.
- Deletes preserve note/flashcard tombstones and append deterministic outbox entries for future sync.
- `fake-indexeddb` is a dev dependency used only by the workspace test; production uses `globalThis.indexedDB`.
- Migration creates the v2 `outbox` store while retaining v1 data.

#### Browser smoke

Actual Chromium smoke against the local Vite app:

1. Opened a catalog material and selected **Iniciar**.
2. Switched the browser context offline.
3. Created the note `Nota offline confirmada`; UI retained status `Em estudo`.
4. Returned online only so the uncached page shell could reload (no service worker or asset cache was introduced), reloaded, and observed status `Em estudo` plus the saved note.
5. Opened the discipline page and observed `Você está aqui` on that material.

Observed result: `{ offlineStatus: "Em estudo", reloadedStatus: "Em estudo", noteAfterReload: true, currentText: "Você está aqui" }`.

#### Self-review

- No account, Neon, fetch, or other network dependency in the study state path.
- Material controls use native buttons/forms, explicit labels, status semantics, focus styles inherited from the design system, and responsive one-column forms below 56rem.
- Current material is derived deterministically as the latest non-deleted `studying` progress record.
- No service worker or offline asset caching added; this task verifies local mutations after the UI is already loaded.

#### Commands

- `corepack pnpm add -D fake-indexeddb` — dependency installed and lockfile updated.
- `corepack pnpm exec vitest run src/modules/study/study-workspace.test.ts` — 1 file, 5 tests passed.
- `corepack pnpm exec tsc --noEmit` — passed.

#### Commit

`feat(atlas): persist anonymous study state locally`

#### Concerns

- A hard reload while the browser remains offline is intentionally outside this task because static/offline asset caching is explicitly deferred. IndexedDB state itself survives the reload boundary, as confirmed once the existing app shell was available again.

#### Review round 1

- Atlas now owns one client-side study wrapper that loads the workspace once and passes the latest studying `MaterialRef` to both map and list representations. Each renders exactly one `Você está aqui` marker; illustrative progress copy was removed.
- Outbox keys are native UUID operation IDs (injectable in tests), generated once per enqueue and stored with the change. Repeated operations for the same entity and caller timestamp no longer overwrite one another; `add` rejects an accidental duplicate operation ID.
- Study controls centralize pending/error handling: initial load failure leaves all controls unavailable with a persistent `role=alert`; mutations disable conflicting controls, catch rejection, restore controls, and keep a persistent mutation alert.
- RED: outbox regression initially collapsed three same-entity/same-timestamp changes into one; two Playwright error-path tests initially found no alert.
- GREEN: `vitest ...study-workspace.test.ts` passes 6/6; Atlas marker Playwright test passes 1/1; load/mutation failure Playwright tests pass 2/2; `tsc --noEmit` and production build pass.

#### Review round 2

- Material, Atlas, and discipline study loads now expose accessible retry status/actions. A successful retry clears the error and re-enables material controls.
- Discipline materials use one shared client loader rather than one IndexedDB load per row.
- Note and flashcard submissions use `onSubmit`; failed writes retain drafts, while successful writes explicitly reset only the submitted form.
- RED: retry controls/statuses were absent and uncontrolled forms lost drafts after caught write failures.
- GREEN: `study-state.spec.ts` passes 4/4 for material retry, mutation error, draft retention/success reset, and Atlas/discipline retries; typecheck and production build pass.
