
## Recapture after independent review

The independent follow-up disposition was `recapture`, not a production defect. No application source changed in this round.

A temporary focused Playwright capture spec opened the current production build at 1440 × 900, 768 × 900, and 390 × 844 with `reducedMotion: "reduce"`, waited for `networkidle`, disabled screenshot animations, and asserted both corrected strings before each capture:

- `Exemplo · 68% concluído`
- `Exemplo visual · 12 materiais · 4 exercícios`

Command: `corepack pnpm exec playwright test tests/e2e/recapture-evidence.spec.ts --reporter=line`

Result: **3 passed**. The temporary capture spec was removed after evidence generation. Refreshed files:

- `.impeccable/review/desktop.png`
- `.impeccable/review/tablet.png`
- `.impeccable/review/mobile.png`
- `.impeccable/review/hero-repro.png`

The three images were opened and validated: each begins at the document top, shows the expected viewport composition, contains no blank/black or half-loaded region, and visibly includes both illustrative-data labels.

Final comparison command: `D:\Fatec\impeccable.exe comp-diff --comp .impeccable/mocks/approved/atlas-guided-desktop.png --build .impeccable/review/desktop.png --spec .impeccable/build/spec.json --out-dir .impeccable/review/diff/final`

Result: **94% overall / 93% structure / 97% color / 91% detail / 96% bands**. Topbar, semester rail, headline, view toggle, map, and detail rail score `match`; the complete, more legible legend remains the sole `drift` region at 74%. Build-state hero/responsive/review gates now point to the refreshed captures and diff report.
