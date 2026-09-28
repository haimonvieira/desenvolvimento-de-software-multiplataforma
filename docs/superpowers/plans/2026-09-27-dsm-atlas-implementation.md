# DSM Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o DSM Atlas como catálogo público, espaço de estudo anônimo, publicação administrativa no GitHub e base segura para tutoria por IA e futura sincronização com Microsoft Teams.

**Architecture:** Uma aplicação Next.js/TypeScript em `atlas/`, implantada em Cloudflare Workers, lê materiais exclusivamente das raízes `DSM1`–`DSM6` e gera um catálogo versionado pelo commit do GitHub. Estado pessoal começa no IndexedDB e sincroniza com Neon após passkey anônima opcional. Integrações externas ficam atrás de interfaces pequenas; publicação usa blobs/árvore/commit/ref da GitHub Git Data API para tornar um lote visível atomicamente.

**Tech Stack:** Next.js App Router, TypeScript strict, Cloudflare Workers + Static Assets, Neon PostgreSQL serverless, Drizzle ORM, Better Auth + passkey/anonymous plugins, Zod, IndexedDB nativo, Vitest, Playwright, CSS Modules/CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-09-27-dsm-atlas-design.md`

## Global Constraints

- O GitHub é a fonte de verdade dos materiais; Neon nunca armazena os arquivos acadêmicos.
- Visitantes estudam sem conta; passkey anônima é opcional e não solicita nome ou e-mail.
- Conversas integrais do tutor permanecem no dispositivo; somente progresso, favoritos, notas, flashcards e resumos explicitamente salvos sincronizam.
- Identidade administrativa é autorizada por vínculo positivo em `AdminIdentity`; não existe `role?: "admin"` editável pelo visitante.
- Tutor público não possui ferramenta administrativa nem acesso de escrita ao GitHub.
- Credenciais e orçamentos das IAs pública e administrativa são separados.
- Cota patrocinada falha fechada antes de cobrança; catálogo e estudo sem IA continuam funcionando.
- BYOK nunca é persistida, sincronizada ou registrada.
- O primeiro limite operacional de upload será 10 MiB por arquivo e 25 MiB por lote; mudar somente após medir limites atuais do Worker e GitHub.
- A visualização de lista é semanticamente equivalente ao mapa.
- Movimento respeita `prefers-reduced-motion` e nunca esconde conteúdo por padrão.
- Implementação test-first: cada comportamento começa com teste falhando pelo motivo esperado.
- Antes de cada integração, conferir a API atual na documentação oficial listada em “Fontes técnicas”; não copiar exemplos antigos por memória.

---

## File Structure

```text
atlas/
├── package.json                         # scripts e dependências exclusivos do portal
├── next.config.ts                       # configuração Next.js
├── wrangler.jsonc                       # Worker, assets, secrets declarados por nome
├── drizzle.config.ts                    # migrations do Neon
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Atlas
│   │   ├── disciplinas/[code]/page.tsx
│   │   ├── materiais/[...path]/page.tsx
│   │   ├── caderno/page.tsx
│   │   ├── tutor/page.tsx
│   │   ├── admin/page.tsx
│   │   └── api/                         # handlers HTTP finos
│   ├── modules/
│   │   ├── catalog/                     # modelo, consulta e busca do catálogo
│   │   ├── study/                       # estado local, sync, notas e flashcards
│   │   ├── identity/                    # visitante, passkeys e autorização admin
│   │   ├── publication/                 # lote, validação, revisão e commit
│   │   └── tutor/                       # retrieval, cotas e turno agentivo
│   ├── integrations/
│   │   ├── github/                      # GitHub App e Git Data API
│   │   ├── neon/                        # conexão e schema Drizzle
│   │   └── ai/                          # adapters público/admin escolhidos depois
│   ├── generated/                       # catálogo gerado no build; ignorado pelo Git
│   └── styles/                          # tokens e superfícies do Atlas Guiado
├── scripts/
│   ├── build-catalog.ts                 # lê somente ../DSM[1-6]
│   └── build-content-index.ts           # extrai texto suportado por commit
├── drizzle/
│   └── migrations/
└── tests/
    ├── fixtures/
    ├── integration/
    └── e2e/
```

Não criar workspace, pacote compartilhado ou API separada. O repositório ainda possui um único produto novo.

---

### Task 1: Provar o runtime antes da arquitetura crescer

**Files:**
- Create: `atlas/package.json`
- Create: `atlas/src/app/page.tsx`
- Create: `atlas/src/app/api/health/route.ts`
- Create: `atlas/wrangler.jsonc`
- Create: `atlas/tests/e2e/health.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `GET /api/health -> { status: "ok", runtime: "cloudflare", database: "ok", github: "ok" }`
- The route reads one row from Neon and the repository HEAD from GitHub without exposing secrets.

- [ ] **Step 1: Verify current official setup**

Read the current Cloudflare Next.js/vinext guide, Neon serverless driver guide, and Workers limits. Record the exact package/runtime choices in `atlas/README.md`. Abort this task if current Next.js support requires a paid Cloudflare feature; do not silently switch hosts.

- [ ] **Step 2: Scaffold the smallest Cloudflare-compatible Next.js app**

Use the command currently documented by Cloudflare C3 for a new Next.js Worker. Keep App Router, TypeScript strict, pnpm, ESLint, and `src/`; decline Tailwind because the approved visual world uses authored CSS.

Expected scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "vinext preview",
    "deploy": "vinext deploy",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Adjust script names only when the current official adapter documents a different executable.

- [ ] **Step 3: Write the failing health test**

The test starts the Worker preview and asserts:

```ts
expect(await response.json()).toEqual({
  status: "ok",
  runtime: "cloudflare",
  database: "ok",
  github: "ok",
});
```

It must fail while `/api/health` does not exist.

- [ ] **Step 4: Implement health checks with Worker-safe APIs**

Use `@neondatabase/serverless` and native `fetch`; no filesystem, TCP socket, Node crypto, or process-global mutable cache in request code. Secrets are named in `wrangler.jsonc` but stored only with Cloudflare secret management.

- [ ] **Step 5: Exercise the real runtime**

Run:

```bash
pnpm --dir atlas typecheck
pnpm --dir atlas test
pnpm --dir atlas build
pnpm --dir atlas preview
pnpm --dir atlas test:e2e tests/e2e/health.spec.ts
```

Expected: Worker preview answers the health route; build and checks exit 0.

- [ ] **Step 6: Ignore generated/local artifacts**

Add `.superpowers/`, `atlas/.next/`, `atlas/.vinext/`, `atlas/.wrangler/`, `atlas/src/generated/`, `atlas/test-results/`, `atlas/playwright-report/`, and local env files to `.gitignore`. Keep `.impeccable/config.json` tracked.

- [ ] **Step 7: Commit**

```bash
git add .gitignore atlas
 git commit -m "chore(atlas): prove Cloudflare Neon runtime"
```

**Acceptance:** one public page and one server-only route run under the actual Worker adapter; Neon and GitHub are reachable without secrets entering the client bundle.

---

### Task 2: Generate a catalog deterministic from the repository

**Files:**
- Create: `atlas/src/modules/catalog/model.ts`
- Create: `atlas/scripts/build-catalog.ts`
- Create: `atlas/src/modules/catalog/catalog-query.ts`
- Create: `atlas/tests/fixtures/catalog-repo/DSM1/ALP/aula-01.md`
- Create: `atlas/src/modules/catalog/catalog-query.test.ts`

**Interfaces:**

```ts
export type MaterialRef = Readonly<{ path: string; commitSha: string }>;
export type CatalogSelection = Readonly<{ semester?: string; discipline?: string }>;
export interface CatalogQuery {
  browse(selection: CatalogSelection): readonly Material[];
  search(query: string, cursor?: string): SearchPage;
  getMaterial(ref: MaterialRef): Material | null;
}
```

`Material` contains `ref`, `name`, `extension`, `size`, `disciplineCode`, `semesterCode`, `kind`, `downloadUrl`, and `previewKind`.

- [ ] **Step 1: Write failing parser tests**

Cover these behaviors with a temporary fixture tree:

- only roots matching `DSM[1-6]` enter the catalog;
- a discipline is the first path segment below the semester;
- generated/cache/private files (`node_modules`, `.git`, `.env`, `__pycache__`, executables and build output) are excluded;
- paths are normalized to `/` on Windows;
- identical input and commit SHA produce byte-identical JSON;
- unknown extensions become `kind: "other"`, not an exception.

Run `pnpm --dir atlas test src/modules/catalog/catalog-query.test.ts` and observe the expected failure.

- [ ] **Step 2: Implement the minimum catalog builder**

Use Node standard library only in the build script. Derive the commit from `GITHUB_SHA`, `CF_PAGES_COMMIT_SHA`, or local `git rev-parse HEAD`, in that order. Emit `atlas/src/generated/catalog.json`; do not commit the file.

- [ ] **Step 3: Implement `CatalogQuery` over generated immutable data**

Normalize search with `String.prototype.normalize("NFD")`, remove combining marks, lowercase, and search names, paths, semester names, and discipline names. Cursor is the next array offset encoded as an opaque base64url string. Page size is 30.

- [ ] **Step 4: Integrate generation with build**

Add `catalog:build` and run it before `dev`, `build`, and `test:e2e`. The application must never scan the repository at request time.

- [ ] **Step 5: Verify against the real repository**

Run the builder and assert it discovers `DSM1`, `DSM2`, `DSM3` and the eighteen documented disciplines. Manually compare a sample against `README.md` and paths such as `DSM3/BDNR` and `DSM2/TPI`.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): generate catalog from study repository"
```

**Acceptance:** catálogo reproduzível, limitado às raízes acadêmicas e versionado por commit; nenhum arquivo do portal entra como material.

---

### Task 3: Materializar a direção visual Atlas Guiado

**Files:**
- Create: `DESIGN.md`
- Create: `.impeccable/design.json`
- Create: `atlas/src/styles/tokens.css`
- Create: `atlas/src/app/globals.css`
- Create: `atlas/src/app/layout.tsx`
- Create: `atlas/tests/e2e/atlas-visual.spec.ts`

**Interfaces:**
- Produces a durable token contract consumed by all later screens.
- No product behavior changes in this task.

- [ ] **Step 1: Produce the approved comp before UI code**

Use Impeccable comp-first from the approved “Atlas Guiado” direction. Save the final desktop and mobile comps under `.impeccable/mocks/approved/atlas-guided-desktop.png` and `atlas-guided-mobile.png`, including prompt provenance. The comp must use real discipline names from the repository and the approved legend: line = discipline, station = material, filled station = current position.

- [ ] **Step 2: Write the visual contract**

Document exact colors, typography roles, grid, border language, motion durations/easing, focus style, map/list equivalence, and forbidden patterns in `DESIGN.md`; generate matching `.impeccable/design.json`.

- [ ] **Step 3: Add visual smoke assertions before implementation**

Playwright asserts semantic landmarks, a visible skip link, color-scheme-independent focus, no horizontal overflow at 390/768/1440 widths, and zero animated displacement when reduced motion is enabled. Tests fail against the scaffold.

- [ ] **Step 4: Implement tokens and application shell**

Use CSS custom properties and authored CSS. Self-host selected fonts under `atlas/public/fonts/`; no runtime Google Fonts request. Keep content visible before JavaScript.

- [ ] **Step 5: Compare real renders with approved comps**

Capture `desktop.png` at 1440 px and `mobile.png` at 390 px into `.impeccable/review/`. Run the Impeccable detector once after the surface is complete, batch-fix mechanical findings, then invoke the Impeccable finish reviewer.

- [ ] **Step 6: Commit**

```bash
git add DESIGN.md .impeccable atlas
 git commit -m "feat(atlas): establish guided atlas design system"
```

**Acceptance:** design contract committed, shell accessible/responsive, and approved visual direction represented by evidence rather than prose alone.

---

### Task 4: Deliver Atlas and list navigation from one query

**Files:**
- Create: `atlas/src/modules/catalog/atlas-map.tsx`
- Create: `atlas/src/modules/catalog/catalog-list.tsx`
- Create: `atlas/src/modules/catalog/catalog-view.tsx`
- Modify: `atlas/src/app/page.tsx`
- Create: `atlas/tests/e2e/catalog-navigation.spec.ts`

**Interfaces:**
- Consumes: `CatalogQuery.browse`.
- Produces: URL state `?semester=DSM3&view=map|list`.

- [ ] **Step 1: Write failing user-flow tests**

Test that a visitor can select `DSM3`, focus a discipline by keyboard, switch to list without losing the selection, and follow the discipline link. Assert map and list expose identical discipline links and counts.

- [ ] **Step 2: Implement the semantic list first**

Render native links and headings from `CatalogQuery`; this is the no-JavaScript and assistive-technology baseline.

- [ ] **Step 3: Implement the map as progressive enhancement**

Use SVG only for route geometry; every route and station remains a semantic link/button outside or inside accessible SVG markup. Draw routes once on entry; suppress transitions under reduced motion.

- [ ] **Step 4: Preserve state in the URL**

Back/forward navigation restores semester and map/list mode. Invalid values fall back to the latest known semester and `map` without redirect loops.

- [ ] **Step 5: Exercise desktop, mobile, keyboard and reduced motion**

Run the focused Playwright spec in both Chromium viewports. Verify actual tab order and route navigation, not only snapshots.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): add guided map and equivalent list"
```

**Acceptance:** first complete public path—choose semester, understand disciplines immediately, and navigate without an account.

---

### Task 5: Deliver discipline, material, preview and search

**Files:**
- Create: `atlas/src/app/disciplinas/[code]/page.tsx`
- Create: `atlas/src/app/materiais/[...path]/page.tsx`
- Create: `atlas/src/app/api/search/route.ts`
- Create: `atlas/src/modules/catalog/material-preview.tsx`
- Create: `atlas/tests/e2e/material-search.spec.ts`

**Interfaces:**
- Consumes: `CatalogQuery.search`, `CatalogQuery.getMaterial`.
- Produces: `GET /api/search?q=&cursor=` returning `{ data, nextCursor }` with stable error shape `{ error: { code, message } }`.

- [ ] **Step 1: Write failing behavior tests**

Cover accented search, empty query, pagination, invalid material path, a native PDF/image preview, a safe text/code preview, and download fallback for ZIP/DOCX/PPTX or unsupported formats.

- [ ] **Step 2: Implement discipline pages**

Group materials by first meaningful subfolder, expose counts and recent paths, and preserve the selected semester in breadcrumbs.

- [ ] **Step 3: Implement previews conservatively**

Render text/code as escaped text; render public images and PDFs using browser-native elements with restrictive attributes. Never execute repository HTML, JavaScript, notebooks or SVG as active same-origin content. Unsupported files show metadata, GitHub link and download.

- [ ] **Step 4: Implement search route and command surface**

Validate query length (1–120 characters) and cursor with Zod at the boundary. Search stays metadata-first; no vector database.

- [ ] **Step 5: Smoke the actual material path**

Open one PDF/image if present, one source file, and one ZIP from the real catalog. Confirm fallback and download URLs resolve to the indexed commit.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): add material discovery and safe previews"
```

**Acceptance:** visitor can find, inspect, and download real material; unsupported content fails safely and usefully.

---

### Task 6: Persist study state locally without account

**Files:**
- Create: `atlas/src/modules/study/model.ts`
- Create: `atlas/src/modules/study/indexed-db-study-store.ts`
- Create: `atlas/src/modules/study/study-workspace.ts`
- Create: `atlas/src/modules/study/study-workspace.test.ts`
- Modify: material and discipline surfaces to expose study actions

**Interfaces:**

```ts
export type StudyChange =
  | { type: "progress.set"; material: MaterialRef; status: "new" | "studying" | "done"; at: string }
  | { type: "favorite.set"; material: MaterialRef; value: boolean; at: string }
  | { type: "note.save"; note: Note }
  | { type: "flashcard.save"; flashcard: Flashcard }
  | { type: "item.delete"; entity: "note" | "flashcard"; id: string; at: string };

export interface StudyWorkspace {
  load(): Promise<StudySnapshot>;
  apply(change: StudyChange): Promise<StudySnapshot>;
}
```

- [ ] **Step 1: Write failing tests using real IndexedDB semantics**

Use `fake-indexeddb` only as the browser implementation substitute. Cover refresh persistence, progress transition, favorite toggle, note/flashcard save, tombstone deletion, and migration from schema version 1 to 2.

- [ ] **Step 2: Implement one IndexedDB database**

Database name `dsm-atlas`, stores `progress`, `favorites`, `notes`, `flashcards`, `meta`, and `outbox`. Every record has `id`, `updatedAt`, and `deletedAt`; clocks are ISO timestamps supplied by the caller for deterministic tests.

- [ ] **Step 3: Integrate study controls**

Material page offers “Iniciar”, “Concluir”, favorite, note and flashcard actions. Atlas highlights the latest `studying` material as “Você está aqui”.

- [ ] **Step 4: Verify offline behavior**

Load a material once, switch browser offline, update progress and create a note, reload, and confirm local state survives. Public static/catalog assets may be cached later; this check only proves state safety.

- [ ] **Step 5: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): persist anonymous study state locally"
```

**Acceptance:** complete study loop works without account or Neon, including reload and offline mutation.

---

### Task 7: Add Neon schema and anonymous passkey identity

**Files:**
- Create: `atlas/src/integrations/neon/schema.ts`
- Create: `atlas/src/integrations/neon/db.ts`
- Create: `atlas/src/modules/identity/auth.ts`
- Create: `atlas/src/app/api/auth/[...all]/route.ts`
- Create: `atlas/tests/integration/anonymous-passkey.test.ts`
- Create: `atlas/drizzle/migrations/0001_identity_and_study.sql`

**Interfaces:**

```ts
export interface VisitorIdentity {
  current(): Promise<{ kind: "local" } | { kind: "profile"; profileId: string }>;
  createPasskeyProfile(): Promise<{ profileId: string }>;
}
```

- [ ] **Step 1: Verify Better Auth’s current anonymous + passkey flow**

Confirm the current official packages, Cloudflare compatibility, required WebAuthn RP configuration, and Neon adapter transactions. Use the official anonymous plugin to create a pseudonymous user, then register a discoverable passkey; never synthesize a fake user email unless the documented adapter requires and hides it.

- [ ] **Step 2: Write failing integration tests**

Cover anonymous bootstrap, passkey registration challenge, challenge expiry/replay, session restoration, and absence of required name/e-mail fields. WebAuthn protocol code uses the library; tests assert application authorization and persistence, not cryptographic internals.

- [ ] **Step 3: Define schema with constraints and indexes**

Add Better Auth tables plus `study_profile`, `study_progress`, `favorite`, `note`, `flashcard`, and `sync_cursor`. Use unique `(profile_id, material_path, material_commit_sha)` where appropriate and indexes beginning with `profile_id`. Foreign keys cascade on profile deletion.

- [ ] **Step 4: Configure production security**

Use 32+ byte secret, HTTPS, fixed `rpId`, explicit trusted origins, CSRF enabled, secure HttpOnly cookies, database-backed rate limiting, and only Cloudflare’s verified client IP header. Preview domains use separate passkeys and database branch; they are not treated as production credentials.

- [ ] **Step 5: Run migrations against a dedicated Neon development branch**

Apply, inspect schema, run integration tests, then reset the branch and reapply to prove migrations are reproducible.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): add anonymous passkey profiles"
```

**Acceptance:** optional pseudonymous profile works without personal fields; losing all passkeys has the documented irreversible consequence.

---

### Task 8: Synchronize local study data without silent loss

**Files:**
- Create: `atlas/src/modules/study/neon-study-store.ts`
- Create: `atlas/src/modules/study/synchronize-study.ts`
- Create: `atlas/src/app/api/study/sync/route.ts`
- Create: `atlas/src/modules/study/synchronize-study.test.ts`
- Create: `atlas/tests/e2e/study-sync.spec.ts`

**Interfaces:**

```ts
export type SyncResult = Readonly<{
  snapshot: StudySnapshot;
  conflicts: readonly NoteConflict[];
  cursor: string;
}>;
```

- [ ] **Step 1: Write failing merge tests**

Prove these rules:

- progress, favorites and flashcards use latest `updatedAt` per record;
- tombstone newer than content wins;
- concurrent note edits produce two visible versions in `conflicts` rather than dropping either;
- replaying the same outbox is idempotent;
- records belonging to another profile are never returned.

- [ ] **Step 2: Implement one transaction per sync request**

Validate session first. Upsert changes with ownership predicates and unique constraints. Return remote changes after cursor plus conflicts. Do not let the client choose `profileId`.

- [ ] **Step 3: Implement local outbox and retry**

Acknowledged operations leave the outbox; network failure keeps them. Backoff is bounded and triggered by user/session activity, not a permanent background loop.

- [ ] **Step 4: Add profile deletion**

A fresh passkey assertion deletes the profile and server data. Local data remains only after an explicit choice: “Manter neste dispositivo” or “Apagar também”.

- [ ] **Step 5: Exercise two browser contexts**

Create profile, save on device A, sign in with passkey on device B, synchronize, create a conflicting note edit, and confirm both versions appear.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): synchronize pseudonymous study profiles"
```

**Acceptance:** optional cross-device continuity with deterministic merge, visible note conflicts and no conversation-history upload.

---

### Task 9: Establish positive administrative authorization

**Files:**
- Create: `atlas/src/modules/identity/admin-authorizer.ts`
- Create: `atlas/src/app/admin/page.tsx`
- Create: `atlas/src/app/api/admin/bootstrap/route.ts`
- Create: `atlas/src/modules/identity/admin-authorizer.test.ts`
- Add migration: `atlas/drizzle/migrations/0002_admin_identity.sql`

**Interfaces:**

```ts
export interface AdminAuthorizer {
  requireAdmin(request: Request): Promise<{ adminId: string }>;
}
```

- [ ] **Step 1: Write authorization matrix tests**

Unauthenticated, anonymous visitor, ordinary passkey profile, wrong GitHub account, expired admin session, and valid owner. Only the final case passes.

- [ ] **Step 2: Add immutable owner bootstrap**

GitHub OAuth identity must match `ADMIN_GITHUB_USER_ID` from server secret configuration. On first successful match, create `admin_identity`. Recovery repeats GitHub verification before allowing a new admin passkey.

- [ ] **Step 3: Guard every `/admin` page and `/api/admin/*` route server-side**

UI hiding does not count. `requireAdmin` is the only entry to administrative modules. Audit successful bootstrap, passkey addition, batch publication and recovery without storing tokens.

- [ ] **Step 4: Verify no role escalation**

Use the visitor session cookie against every current admin endpoint and assert 403. Attempt to submit an `admin` field through public sync APIs and assert it is rejected by schema.

- [ ] **Step 5: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): separate administrative authorization"
```

**Acceptance:** visitor identities have no data field or route capable of self-promotion; only the configured GitHub owner can bootstrap/recover administration.

---

### Task 10: Stage upload batches safely without object storage

**Files:**
- Create: `atlas/src/modules/publication/model.ts`
- Create: `atlas/src/modules/publication/validate-upload.ts`
- Create: `atlas/src/integrations/github/github-material-source.ts`
- Create: `atlas/src/app/api/admin/batches/route.ts`
- Create: `atlas/src/app/api/admin/batches/[id]/blobs/route.ts`
- Create: `atlas/src/modules/publication/validate-upload.test.ts`
- Add migration: `atlas/drizzle/migrations/0003_upload_batch.sql`

**Interfaces:**

```ts
export interface GitHubMaterialSource {
  readHead(): Promise<string>;
  readTree(commitSha: string): Promise<readonly GitTreeEntry[]>;
  readBlob(ref: MaterialRef): Promise<Uint8Array>;
  createBlob(bytes: Uint8Array): Promise<string>;
}
```

- [ ] **Step 1: Write failing trust-boundary tests**

Reject path traversal, NUL/control characters, reserved names, executables, MIME/extension mismatch, duplicate normalized destinations, file over 10 MiB, and batch over 25 MiB. Accept representative PDF, DOCX, PPTX, ZIP, image, text and source files.

- [ ] **Step 2: Create batch metadata before uploading bytes**

`UploadBatch` starts as `draft` with `baseCommitSha`, owner, total bytes and expiry. Browser uploads files sequentially, not as one buffered multipart body.

- [ ] **Step 3: Stream each validated file to the GitHub Blob API**

Use GitHub App installation tokens only server-side. Store blob SHA and client metadata in Neon; the academic bytes are not stored in Neon. A failed batch may leave unreachable Git objects, which are acceptable and never visible in the branch.

- [ ] **Step 4: Add resumable administrative UI**

Show per-file validation/upload status. Refresh reloads batch metadata; reselecting a local file is required only if its blob creation failed.

- [ ] **Step 5: Verify with boundary sizes**

Exercise 0-byte invalid file, exactly 10 MiB, one byte above, and total batch exactly/above 25 MiB against Worker preview. If runtime rejects before application logic, lower constants and record measured ceiling in the spec before continuing.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): stage validated GitHub upload batches"
```

**Acceptance:** bytes cross the Worker in bounded sequential requests and land only as unreachable blobs until final confirmation.

---

### Task 11: Review and publish one atomic Git commit

**Files:**
- Create: `atlas/src/modules/publication/publication-workflow.ts`
- Create: `atlas/src/app/api/admin/batches/[id]/route.ts`
- Create: `atlas/src/app/api/admin/batches/[id]/publish/route.ts`
- Create: `atlas/src/modules/publication/publication-workflow.test.ts`
- Create: `atlas/tests/e2e/admin-publication.spec.ts`

**Interfaces:**

```ts
export type PublishResult =
  | { type: "published"; commitSha: string; commitUrl: string }
  | { type: "conflict"; currentHead: string }
  | { type: "rejected"; errors: readonly PublicationError[] };

export interface PublicationWorkflow {
  reviseBatch(batchId: string, revisions: readonly FileRevision[]): Promise<BatchReview>;
  publishBatch(batchId: string, baseCommitSha: string, confirmation: string): Promise<PublishResult>;
}
```

- [ ] **Step 1: Write failing atomicity tests**

Prove: all files appear in one new tree; HEAD divergence returns `conflict`; failed blob/tree/commit creation never updates the branch ref; duplicate confirmation is idempotent; changed review invalidates prior confirmation.

- [ ] **Step 2: Implement revision and logical diff**

Destination is constrained to existing `DSM*/discipline` roots unless the admin explicitly adds a new semester/discipline through a separate reviewed metadata action. Display old HEAD, proposed paths, file sizes and collision status.

- [ ] **Step 3: Publish through Git Data primitives**

Create tree from blob SHAs against `baseCommitSha`, create commit, then update the main ref only if it still matches the base. The confirmation phrase includes file count and target branch, e.g. `PUBLICAR 7 ARQUIVOS`.

- [ ] **Step 4: Handle conflicts by recalculation**

Fetch new HEAD, check each proposed path, rebuild the logical diff and require a new confirmation. Never force-update.

- [ ] **Step 5: Verify against a disposable branch**

Use a dedicated test branch in the repository/GitHub fixture repo. Confirm one commit contains all files and a simulated concurrent commit produces conflict with no overwrite.

- [ ] **Step 6: Connect deployment visibility**

Cloudflare build-on-push rebuilds generated catalog after main changes. Admin success page states “Commit publicado; catálogo será atualizado após o deploy” and links to commit/deploy status. Do not claim immediate visibility before deploy completion.

- [ ] **Step 7: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): publish reviewed batches atomically"
```

**Acceptance:** manual administrative publication is complete before any classification AI exists.

---

### Task 12: Build a source-addressable text index

**Files:**
- Create: `atlas/src/modules/tutor/model.ts`
- Create: `atlas/scripts/build-content-index.ts`
- Create: `atlas/src/modules/tutor/content-retriever.ts`
- Create: `atlas/src/modules/tutor/content-retriever.test.ts`
- Modify: `atlas/package.json`

**Interfaces:**

```ts
export type RetrievedExcerpt = Readonly<{
  material: MaterialRef;
  locator: { type: "lines"; start: number; end: number } | { type: "page"; page: number } | { type: "excerpt"; hash: string };
  text: string;
  score: number;
}>;

export interface ContentRetriever {
  retrieve(context: readonly MaterialRef[], query: string, limit: number): Promise<readonly RetrievedExcerpt[]>;
}
```

- [ ] **Step 1: Write failing extraction and retrieval tests**

Use fixtures for Markdown, TXT, SQL and source code. Assert stable line locators, deterministic chunk hashes, exact commit SHA propagation, accent-insensitive ranking and no result outside selected material/discipline context.

- [ ] **Step 2: Implement deterministic plain-text extraction**

Start with UTF-8 text, Markdown, SQL and source code. Chunk by headings/functions when recognized, otherwise bounded paragraphs with overlap. Binary Office/PDF extraction is added only through a parser proven Worker/build compatible; until then those files remain citable only by metadata and browser preview.

- [ ] **Step 3: Emit per-material static index assets**

Write `public/_index/<commitSha>/<materialHash>.json` plus a small manifest. Generated assets are build output, not source-controlled. Retrieval fetches only candidate material files, avoiding one giant Worker bundle.

- [ ] **Step 4: Validate citations**

A citation is accepted only when its `MaterialRef`, locator and quoted text match a retrieved excerpt from the current turn. Invalid model citation output is discarded and the answer is marked unsupported.

- [ ] **Step 5: Smoke real content**

Retrieve a MongoDB exercise, a Python source file and a Markdown note from the real repository; open returned paths and verify quoted lines match.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): build source-addressable study index"
```

**Acceptance:** deterministic lexical retrieval with verifiable sources; no vector dependency.

---

### Task 13: Reserve AI budget atomically before provider calls

**Files:**
- Create: `atlas/src/modules/tutor/usage-policy.ts`
- Create: `atlas/src/modules/tutor/usage-ledger.ts`
- Create: `atlas/src/modules/tutor/usage-ledger.test.ts`
- Add migration: `atlas/drizzle/migrations/0004_ai_usage.sql`
- Create: `atlas/src/app/api/tutor/quota/route.ts`

**Interfaces:**

```ts
export type BudgetDecision =
  | { type: "reserved"; reservationId: string; maxInputTokens: number; maxOutputTokens: number; maxToolCalls: number }
  | { type: "denied"; reason: "minute" | "daily" | "global" | "disabled"; resetsAt: string };
```

- [ ] **Step 1: Fix conservative initial policy values in code**

Sponsored default: 5 requests/hour, 15/day per anonymous device/profile, 4,000 input tokens, 1,000 output tokens, 4 tool calls/turn, 30-second deadline, 300 sponsored turns/day globally. These are safety ceilings, not product promises; lowering them is allowed operationally, raising them requires cost evidence.

- [ ] **Step 2: Write failing concurrency tests**

Simulate concurrent final-quota requests and prove only one reservation wins. Test token reconciliation, expired reservations, timeout as `unknown`, global circuit breaker and separation between `public` and `admin` scopes.

- [ ] **Step 3: Implement atomic reservation**

Use one PostgreSQL transaction and row locking/atomic `UPDATE ... WHERE used + reserved <= limit RETURNING`. Reserve worst-case tokens before the provider call; reconcile actual usage afterward. Unknown outcomes keep reservation charged until expiry/reconciliation.

- [ ] **Step 4: Derive anonymous keys privately**

Combine validated Cloudflare client IP prefix, signed first-party device token and profile ID when available. Store keyed hashes, not raw IP. Turnstile gates first sponsored use and suspicious resets, not every study turn.

- [ ] **Step 5: Verify no provider call occurs after denial**

Use an adapter spy only at this seam: denied decisions must leave provider invocation count at zero. This is behavior worth mocking because the external effect must not happen.

- [ ] **Step 6: Commit**

```bash
git add atlas
 git commit -m "feat(atlas): enforce hard sponsored AI budgets"
```

**Acceptance:** quotas and global budget are race-safe and fail closed before inference spend.

---

### Task 14: Select the public provider and ship the cited tutor

**Files:**
- Create after provider decision: `docs/superpowers/specs/2026-09-27-dsm-atlas-public-ai-provider.md`
- Create: `atlas/src/integrations/ai/public-tutor-ai.ts`
- Create: `atlas/src/modules/tutor/study-tutor.ts`
- Create: `atlas/src/app/api/tutor/turn/route.ts`
- Create: `atlas/src/app/tutor/page.tsx`
- Create: `atlas/src/modules/tutor/study-tutor.test.ts`
- Create: `atlas/tests/e2e/tutor.spec.ts`

**Interfaces:**

```ts
export type TutorTurnResult = Readonly<{
  answer: string;
  citations: readonly RetrievedExcerpt[];
  proposedNotebookActions: readonly (
    | { type: "note"; title: string; body: string; source: MaterialRef }
    | { type: "flashcard"; front: string; back: string; source: MaterialRef }
  )[];
}>;

export interface PublicTutorAi {
  answer(input: TutorModelInput, budget: ReservedBudget): Promise<TutorModelOutput>;
}
```

- [ ] **Step 1: Resolve the explicitly deferred provider decision**

Before code, benchmark only providers that offer enforceable zero-spend/hard-limit behavior for the sponsored key and document CORS/BYOK behavior, tool calling, streaming, structured output, Portuguese quality, token accounting and free allowance. The user approves one provider. Record the exact SDK/API, model and failure policy in the provider spec; do not implement a generic OpenAI-compatible gateway.

- [ ] **Step 2: Write failing orchestration tests**

Test: retrieval occurs before answer; only allowlisted tools execute; unsupported claims yield “não encontrei isso nos materiais”; citation output must match retrieved excerpts; notebook actions are proposals only; tool-call cap ends the turn; quota denial bypasses provider.

- [ ] **Step 3: Implement a code-controlled agent loop**

The orchestrator owns retrieval, tool allowlist, limits and notebook confirmations. Prompt text cannot grant permissions. A saved note/flashcard requires a separate authenticated/local `StudyWorkspace.apply` action initiated by the visitor.

- [ ] **Step 4: Implement private sponsored mode**

Provider credential stays in Worker secrets. Stream response only after reservation. Reconcile provider usage. Do not send unrelated profile data or full historic conversations.

- [ ] **Step 5: Implement BYOK mode according to provider evidence**

Prefer browser-direct request when official CORS support permits it. Otherwise proxy through a dedicated no-log route that accepts the key only in an authorization header, strips it before telemetry, disables body logging, and never writes it to Neon/KV/cache. Keep it in memory by default; session storage requires an explicit visitor toggle and warning.

- [ ] **Step 6: Exercise real study scenarios**

Ask a sourced question, an unsupported question, request an exercise, save one proposed flashcard, hit the sponsored quota, then switch to BYOK. Inspect network/log/database evidence to confirm no BYOK persistence.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/specs atlas
 git commit -m "feat(atlas): add cited public study tutor"
```

**Acceptance:** bounded tutor helps study real materials, cites evidence, saves only explicit notebook actions and cannot spend beyond reserved budget.

---

### Task 15: Add administrative classification to the proven publication flow

**Files:**
- Create after provider decision: `docs/superpowers/specs/2026-09-27-dsm-atlas-admin-ai-provider.md`
- Create: `atlas/src/integrations/ai/admin-classifier-ai.ts`
- Create: `atlas/src/modules/publication/classify-batch.ts`
- Create: `atlas/src/app/api/admin/batches/[id]/classify/route.ts`
- Create: `atlas/src/modules/publication/classify-batch.test.ts`
- Modify: admin batch review surface

**Interfaces:**

```ts
export type ClassificationSuggestion = Readonly<{
  blobSha: string;
  semesterCode: string | null;
  disciplineCode: string | null;
  relativePath: string | null;
  title: string;
  kind: MaterialKind;
  confidence: Readonly<Record<"semester" | "discipline" | "path" | "title" | "kind", number>>;
  warning?: string;
}>;

export interface AdminClassifierAi {
  suggestBatch(input: AdminClassificationInput): Promise<readonly ClassificationSuggestion[]>;
}
```

- [ ] **Step 1: Resolve the separate admin provider decision**

Evaluate document support, structured output, batch cost, data retention and hard budgets independently of the public tutor. Record selected provider/model; never reuse public credentials merely because the interface is similar.

- [ ] **Step 2: Write failing validation tests**

Reject invented semester/discipline, path traversal, missing blob SHA, confidence outside 0–1 and suggestion for a blob outside the batch. Unsupported binary parsing returns a warning and null destination rather than guessed placement.

- [ ] **Step 3: Build classification context from trusted catalog data**

Send the allowlisted semester/discipline catalog and bounded filename/extracted content. Treat file text as untrusted prompt-injection-bearing data and delimit it as evidence, never instructions.

- [ ] **Step 4: Merge suggestions into the existing review UI**

Show confidence per field, warning and editable destination. No suggestion changes batch state to confirmed; existing manual review/publish path remains authoritative.

- [ ] **Step 5: Exercise mixed batch**

Use one obvious source file, one ambiguous document and one unreadable archive. Confirm all require review and the archive is not silently classified.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs atlas
 git commit -m "feat(atlas): suggest reviewed upload classification"
```

**Acceptance:** AI accelerates organization but cannot bypass schema, catalog constraints or final human confirmation.

---

### Task 16: Production hardening, free-tier guardrails and deployment

**Files:**
- Create: `atlas/tests/e2e/security-boundaries.spec.ts`
- Create: `atlas/tests/e2e/degraded-mode.spec.ts`
- Create: `atlas/README.md`
- Modify: root `README.md`
- Modify: `docs/superpowers/specs/2026-09-27-dsm-atlas-design.md` only with measured final limits

**Interfaces:**
- No new product interface; validates the complete initial release.

- [ ] **Step 1: Run full automated verification**

```bash
pnpm --dir atlas lint
pnpm --dir atlas typecheck
pnpm --dir atlas test
pnpm --dir atlas build
pnpm --dir atlas test:e2e
```

Expected: all exit 0 with no skipped critical-flow tests.

- [ ] **Step 2: Exercise degraded modes**

Force GitHub read failure, GitHub write conflict, Neon outage, AI quota denial, AI provider timeout, unsupported preview, offline local study and sync conflict. Confirm the user-visible recovery described in the specification.

- [ ] **Step 3: Verify security boundaries**

Attempt visitor-to-admin access, CSRF from untrusted origin, path traversal, MIME spoofing, oversized upload, replayed WebAuthn challenge, quota race, forged citation and BYOK leakage. Inspect Cloudflare logs and Neon rows for secret/token absence.

- [ ] **Step 4: Measure free-tier ceilings**

Record Worker request/CPU usage, Neon database size/CU usage and sponsored AI reservation totals from a representative session. Configure alerts below provider free-tier ceilings. Billing upgrade/auto-charge remains disabled.

- [ ] **Step 5: Complete Impeccable finish review**

Capture desktop/mobile Atlas, discipline, material, tutor and admin review surfaces in one inspection batch. Fix the reviewer’s material findings once, recapture, run final verdict, then document final visual system.

- [ ] **Step 6: Smoke production**

On the deployed URL: open catalog anonymously, save local progress, create/passkey-sync a test profile, publish a disposable test file to a disposable branch, ask a cited tutor question and verify quota display. Remove test profile/branch/file afterward.

- [ ] **Step 7: Update documentation**

Root README links to DSM Atlas setup. `atlas/README.md` documents local development, required secrets by name, Neon branch workflow, Cloudflare deploy, GitHub App permissions, provider selection specs and operational limit adjustment.

- [ ] **Step 8: Commit**

```bash
git add README.md atlas docs PRODUCT.md DESIGN.md .impeccable
 git commit -m "docs(atlas): verify and document initial release"
```

**Acceptance:** initial release operates within configured free limits, protects every trust boundary and remains useful when Neon, GitHub write or AI is unavailable.

---

## Follow-up Plan: Microsoft Teams synchronization

Create a separate implementation plan only after Tasks 1–16 are running in production. It must reuse `PublicationWorkflow.createBatch` and the same review UI. Its scope is:

1. register a Microsoft Entra application with minimum delegated permissions approved by the owner;
2. map Teams/classes/channels to existing DSM semesters and disciplines;
3. poll or receive change notifications for professor materials;
4. download each candidate into bounded staging and create a normal `UploadBatch`;
5. deduplicate by Microsoft item/version ID and content hash;
6. require the existing administrative review and atomic GitHub publication;
7. persist delta cursors and recover from expired subscriptions without republishing old files.

Do not grant Microsoft Graph access to visitors or the public tutor. Teams content is untrusted input and never publishes automatically.

---

## Sources to re-check immediately before implementation

- Cloudflare Next.js on Workers: <https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/>
- Cloudflare Workers limits and pricing: <https://developers.cloudflare.com/workers/platform/limits/> and <https://developers.cloudflare.com/workers/platform/pricing/>
- Neon plans and serverless driver: <https://neon.com/docs/introduction/plans> and <https://neon.com/docs/serverless/serverless-driver>
- Better Auth passkeys and anonymous users: <https://better-auth.com/docs/plugins/passkey> and <https://better-auth.com/docs/plugins/anonymous>
- GitHub repository contents, Git data and limits: <https://docs.github.com/en/rest/repos/contents>, <https://docs.github.com/en/rest/git>, and <https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits>
- WebAuthn: <https://www.w3.org/TR/webauthn-3/> and <https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API>
- Microsoft Graph Teams files/change notifications: <https://learn.microsoft.com/graph/teams-concept-overview> and <https://learn.microsoft.com/graph/change-notifications-overview>

Provider/model documentation is intentionally absent until Tasks 14 and 15 resolve the two deferred AI-provider decisions.