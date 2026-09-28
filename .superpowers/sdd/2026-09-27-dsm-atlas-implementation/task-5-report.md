# Task 5 report

## RED / GREEN

- RED API: `corepack pnpm test tests/api-search.test.ts` failed because `src/app/api/search/route.ts` did not exist.
- RED E2E: `corepack pnpm exec playwright test tests/e2e/material-search.spec.ts --reporter=line` produced 6 expected failures for absent discipline/material/search surfaces; the width-only assertion passed before behavior existed.
- GREEN unit/API: `corepack pnpm test src/modules/catalog/catalog-query.test.ts tests/api-search.test.ts` — 17 passed.
- GREEN E2E against a remotely reachable indexed commit: `GITHUB_SHA=68221b674e5645722ef03058f3f7a7d82f2f0f3a` build plus `material-search.spec.ts` — 7 passed.
- Build and type safety: production build and `corepack pnpm typecheck` exited 0. `git diff --check` exited 0 with only Windows LF/CRLF notices.

## Real repository smoke

- PDF: `DSM1/ALP/LISTAS DE EXERCÍCIOS/Lista 01 - Pseudocódigo.docx.pdf` rendered in the native PDF object. Its exact-commit URL returned HTTP 200.
- Image: `DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/BARRA_STATUS_VISUALG3.PNG` rendered in a passive `img`. Its URL returned HTTP 200 and `image/png`.
- Source: `DSM2/DW2/dw2-nodejs-express/exercicios-js/arrays-e-objetos/script.js` rendered as escaped `pre/code` from the exact committed blob bundled at catalog build time.
- Active source: repository HTML was rendered as inert escaped text; no repository iframe or script was introduced. SVG remains excluded from native image preview.
- ZIP: `DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/Exemplos/Exemplos.zip` displayed metadata and fallback actions. Its exact-commit download returned HTTP 200 and `application/zip`.

## Behavior and UI

- Discipline pages preserve semester breadcrumbs and group by the first meaningful subfolder with counts and exact material links.
- `/api/search` validates trimmed query length 1–120 and opaque numeric base64url cursors with Zod, returns `{ data, nextCursor }`, and uses stable 400 errors.
- Search is metadata-only, accent-insensitive, paginated at 30, server-rendered, and keyboard-operable with native form/links.
- Chromium at 390 × 844 showed zero horizontal overflow on search and material surfaces. Keyboard search submission and result activation navigated correctly. Accessibility inspection exposed named structural navigation, preview region, and native download/GitHub links.
- Visual review confirmed the technical-paper grid, square rules, Archivo headings, IBM Plex metadata, route-blue focus system, and responsive Atlas composition.

## Files

- Added discipline page, exact catch-all material page, search route, conservative preview component, API tests, and E2E behavior tests.
- Updated catalog generation to store inert text previews separately from search metadata while reading exact commit blobs in one `git cat-file --batch` pass.
- Updated catalog home search results and shared Atlas styles; added Zod as the boundary validator.

## Self-review and concerns

Correctness, security, readability, architecture, and performance were reviewed. Search input is validated at the HTTP boundary; material paths must resolve through exact catalog path+commit identity; URL segments are encoded; React escapes text; HTML/JS/SVG never render as active same-origin content. Text previews add about 3.5 MB uncompressed build data in a route-specific server chunk, while the metadata/search catalog remains separate. The local feature commit itself is not remotely published, so final smoke pinned the catalog to reachable ancestor `68221b6`; production CI will use its own reachable `GITHUB_SHA`.

## Commit

Implementation and report commit: `268f010` (`feat(atlas): add material discovery and safe previews`). This line was appended in a report-only follow-up commit.

## Review fix round 1

- RED: builder regression failed because no capped per-file asset existed; deployed output contained `apigamessecret` through the monolithic JSON import. Route regression captured literal `%` and malformed encoding semantics.
- Fix: removed `material-text.json` and its route import. The builder now allows only explicit educational text/code extensions, rejects config/credential paths and secret markers, streams each Git blob by object ID, retains at most 200,000 bytes, and emits isolated `.txt` assets. Blocked content receives the download/GitHub fallback. The generated catalog only records `previewUrl` after a file passes scanning.
- Fix: material route resolution prefers framework-decoded segments and uses one guarded legacy-decoded candidate, preserving literal percent paths and avoiding malformed `decodeURIComponent` failures while retaining exact catalog path+commit lookup.
- GREEN: production build passed; 18 focused unit/API tests and 8 material/search E2E tests passed. `corepack pnpm typecheck` and `git diff --check` passed. Deployed server/client scans found no `apigamessecret` or `material-text.json`; combined artifacts measured 4,337,606 bytes, below the 10 MiB Worker guard.
