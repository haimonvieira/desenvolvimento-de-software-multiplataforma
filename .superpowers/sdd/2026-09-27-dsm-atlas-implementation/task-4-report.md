# Task 4 report

## RED / GREEN

- RED: created `atlas/tests/e2e/catalog-navigation.spec.ts` before production changes. `corepack pnpm build && corepack pnpm exec playwright test tests/e2e/catalog-navigation.spec.ts --reporter=line` produced 5 expected failures: semester links still used fragments; map/list representations, invalid fallbacks, no-JS list, and reduced-motion SVG routes did not exist.
- GREEN: `corepack pnpm exec playwright test tests/e2e/atlas-visual.spec.ts tests/e2e/catalog-navigation.spec.ts --reporter=line` — 13 passed.
- Type safety: `corepack pnpm typecheck` — exit 0.
- Diff hygiene: `git diff --check` — exit 0 (Git only reported the repository's Windows LF/CRLF normalization notice).

## Browser flow

Actual Chromium was exercised at 1440 × 900 and 390 × 844. The visitor selected DSM3, switched between map/list while retaining `semester=DSM3`, used browser back/forward to restore each representation, focused a native discipline link by keyboard, and followed `/disciplinas/BDNR?semester=DSM3`. The map and list exposed the same five href/count/text records. A JavaScript-disabled context rendered and followed the semantic list. Invalid semester/view values rendered the latest known semester and map without a redirect. Reduced-motion Chromium reported `animation-name: none` for routes and effectively instant station transitions. Desktop/mobile accessibility trees exposed named landmarks, headings, legend, five native discipline links, material counts, and the illustrative progress disclaimer. Browser console errors: 0. Mobile horizontal overflow: 0 px; keyboard focus outline: solid.

## Files

- Added `atlas/src/modules/catalog/catalog-list.tsx`: semantic headings, native links, and counts.
- Added `atlas/src/modules/catalog/atlas-map.tsx`: decorative SVG route geometry plus semantic HTML links/stations and explicit illustrative-position copy.
- Added `atlas/src/modules/catalog/catalog-view.tsx`: one map/list representation boundary.
- Updated `atlas/src/app/page.tsx`: one `CatalogQuery.browse` result feeds both modes; server-rendered URL state/fallbacks and native query links.
- Updated `atlas/src/app/globals.css`: responsive Atlas/list styling and reduced-motion behavior.
- Added `atlas/tests/e2e/catalog-navigation.spec.ts`; updated obsolete Task 3 visual assertions to the real catalog markup.

## Commands and results

1. RED command above: 5 failed for the expected missing feature.
2. GREEN focused spec: 5 passed.
3. Existing affected visual + navigation specs: 13 passed.
4. `corepack pnpm typecheck`: passed.
5. Manual Chromium desktop/mobile, keyboard, reduced-motion, accessibility-tree and console checks: passed; screenshots reviewed.

## Self-review and concerns

The implementation is server-rendered and uses native anchors, so the list and all state controls remain usable without JavaScript. SVG is limited to `aria-hidden` route geometry; links and station semantics remain HTML. No progress data is invented: the lime legend is labeled “Posição ilustrativa” and the visible note says progress will be available later. Discipline destinations intentionally match Task 5's `/disciplinas/[code]` contract; until Task 5 lands, following a link proves navigation but resolves to the framework's not-found surface.

## Commit

Implementation and report commit: `a86f411` (`feat(atlas): add guided map and equivalent list`). This line was appended in a report-only follow-up commit so the implementation commit can be identified exactly.
