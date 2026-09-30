# Material Viewing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every catalogued material open, render and download correctly from the app's own origin, and present the material tree the way the repository is actually organised.

**Architecture:** A single same-origin asset route (`/api/material/...`) becomes the only source of bytes, so content type and disposition stop depending on GitHub. A new shared module (`material-asset.ts`) owns the extension→content-type mapping and the URL shapes, and is read by both the build script and the route. The catalog gains `assetUrl` and stops gating text previews behind a hand-reviewed allowlist.

**Tech Stack:** TypeScript, Next.js 16 App Router on vinext + Cloudflare Workers, Drizzle/Neon, vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-30-dsm-atlas-material-viewing-design.md`

## Global Constraints

- Run commands from `atlas/`. Package manager is pnpm via `corepack pnpm`.
- Never run `pnpm test` (its `pretest` runs a full build); run `corepack pnpm exec vitest run <path>` instead.
- Typecheck: `corepack pnpm exec tsc --noEmit`. Lint: `corepack pnpm exec eslint <paths>`.
- Project rule: no one-line wrapper functions; a static string-keyed lookup is a `Record<K, V>`, not a `Set`. Dynamic membership is a `Set`.
- Project rule: every file the app serves must be looked up in the published catalog. The client never supplies a commit sha and never supplies a free path.
- Comments explain *why*, in the voice of the surrounding code. No hedging, no marketing.
- Portuguese for all user-facing copy.
- The existing suite must stay green: 37 files / 351 tests.

## Frozen interfaces (already committed — do not change without telling the lead)

`atlas/src/modules/catalog/material-asset.ts`:

```ts
export type AssetDisposition = "inline" | "attachment";
export const TEXT_PREVIEW_EXTENSIONS: Readonly<Record<string, true>>;
export const OFFICE_PREVIEW_EXTENSIONS: Readonly<Record<string, true>>;
export function contentTypeFor(extension: string): string;
export function materialAssetPath(path: string, disposition: AssetDisposition): string;
export function rawGitHubUrl(repositoryUrl: string, commitSha: string, path: string): string;
```

`atlas/src/modules/catalog/model.ts` — `Material` now carries:

```ts
/** Same-origin, `Content-Disposition: attachment`. Backs "Baixar arquivo". */
downloadUrl: string;
/** Same-origin, `Content-Disposition: inline`. Backs every preview surface. */
assetUrl: string;
previewKind: PreviewKind;            // "text" | "image" | "pdf" | "office" | "none"
previewUrl?: string;                 // build-generated text asset
previewTruncated?: true;             // set when the preview was cut at PREVIEW_LIMIT
```

`atlas/src/modules/catalog/material-path.ts` already exports `materialPathCandidates(segments)` — reuse it for URL→catalog lookup instead of re-deriving the encode/decode dance.

---

### Task A: Text preview coverage

**Files:**
- Modify: `atlas/scripts/build-catalog.ts`
- Modify: `atlas/src/modules/catalog/catalog-query.test.ts` (the preview expectations)
- Test: `atlas/src/modules/catalog/catalog-query.test.ts`

**Interfaces:**
- Consumes: `TEXT_PREVIEW_EXTENSIONS`, `OFFICE_PREVIEW_EXTENSIONS`, `materialAssetPath` from `material-asset.ts`.
- Produces: every `Material` in the generated catalog carries `assetUrl` and `downloadUrl`; text-extensible materials carry `previewUrl`; oversized ones also carry `previewTruncated: true`.

- [ ] **Step 1: Widen `classify` and drop the manual allowlist**

In `build-catalog.ts`, delete `REVIEWED_PREVIEW_PATHS`. Classify by the shared tables:

```ts
function classify(extension: string): { kind: MaterialKind; previewKind: PreviewKind } {
  if (IMAGE_EXTENSIONS.has(extension)) return { kind: "image", previewKind: "image" };
  if (extension === ".pdf") return { kind: "document", previewKind: "pdf" };
  if (OFFICE_PREVIEW_EXTENSIONS[extension]) return { kind: "document", previewKind: "office" };
  if (TEXT_PREVIEW_EXTENSIONS[extension]) {
    return { kind: CODE_EXTENSIONS.has(extension) ? "code" : "document", previewKind: "text" };
  }
  if (DOCUMENT_EXTENSIONS.has(extension)) return { kind: "document", previewKind: "none" };
  if (ARCHIVE_EXTENSIONS.has(extension)) return { kind: "archive", previewKind: "none" };
  return { kind: "other", previewKind: "none" };
}
```

Note `TEXT_PREVIEW_EXTENSIONS` contains `""`, so extensionless files (`Makefile`, `LICENSE`) become text. `.md` and `.txt` must still classify as text — they are in the table. `CODE_EXTENSIONS` keeps deciding `kind` only.

- [ ] **Step 2: Emit both URLs in `buildCatalog`**

Replace the single `downloadUrl` line with:

```ts
      downloadUrl: materialAssetPath(entry.path, "attachment"),
      assetUrl: materialAssetPath(entry.path, "inline"),
```

- [ ] **Step 3: Generate a preview for every text material, and mark truncation**

In `writeTextPreviews`, `canPreview` becomes `material.previewKind === "text"`, and the size guard adds the flag:

```ts
    const previewUrl = `/material-previews/${material.ref.path.split("/").map(encodeURIComponent).join("/")}.txt`;
    const outputPath = resolve(outputRoot, ...material.ref.path.split("/").slice(0, -1), `${basename(material.ref.path)}.txt`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content);
    materials.push(material.size > PREVIEW_LIMIT ? { ...material, previewUrl, previewTruncated: true } : { ...material, previewUrl });
```

- [ ] **Step 4: Update the tests that pinned the old behaviour**

In `catalog-query.test.ts`, the test "writes only capped safe preview assets and excludes credential-like content" changes meaning: the fixture's `unreviewed.js` now **does** get a preview, because the secret scanner — not a manual list — is the gate. Rewrite so it asserts:

```ts
    expect(catalog.materials.find((m) => m.ref.path === approvedPath)?.previewUrl).toBe(`/material-previews/${approvedPath}.txt`);
    expect(catalog.materials.find((m) => m.ref.path === approvedPath)?.previewTruncated).toBe(true);  // 210_000 bytes > PREVIEW_LIMIT
    expect(catalog.materials.find((m) => m.name === "unreviewed.js")?.previewUrl).toBe("/material-previews/DSM1/ALP/unreviewed.js.txt");
    for (const name of ["session.js", "senha.js", "private.js", "config.json"]) {
      expect(catalog.materials.find((material) => material.name === name)?.previewUrl).toBeUndefined();
    }
```

Keep the assertion that no preview file exists for the refused names. `.env` stays excluded by `isExcludedPath`.

- [ ] **Step 5: Run and commit**

```bash
cd atlas
corepack pnpm exec vitest run src/modules/catalog/catalog-query.test.ts
corepack pnpm exec tsc --noEmit
git add atlas/scripts/build-catalog.ts atlas/src/modules/catalog/catalog-query.test.ts
git commit -m "feat(atlas): preview every text material the scanner clears, and serve bytes from our own origin"
```

---

### Task B: The asset route

**Files:**
- Create: `atlas/src/app/api/material/[...path]/route.ts`
- Test: `atlas/src/app/api/material/[...path]/route.test.ts`

**Interfaces:**
- Consumes: `contentTypeFor`, `rawGitHubUrl`; `materialPathCandidates`; `GITHUB_USER_AGENT` from `../../.../integrations/github/github-material-source`.
- Produces: `GET /api/material/<encoded path>?disposition=inline|attachment` → the file's bytes, or `404`.

- [ ] **Step 1: Write the failing test**

Model it on `atlas/tests/api-search.test.ts` for how routes are invoked. The proxy fetch is injected by a module-level `vi.mock` of nothing — instead structure the route with an exported factory so the test can pass a fake fetch:

```ts
export function createMaterialAssetHandler(dependencies: Readonly<{
  catalog: CatalogData;
  repositoryUrl: string;
  fetchAsset(url: string, init: { headers: Record<string, string> }): Promise<Response>;
}>): (request: Request, context: { params: Promise<{ path: string[] }> }) => Promise<Response>;

export const GET = createMaterialAssetHandler({ /* production wiring */ });
```

Test cases, each asserting one behaviour:

```ts
it("retypes a PDF the CDN serves as octet-stream", async () => { /* expects content-type: application/pdf, x-content-type-options: nosniff */ });
it("asks for attachment only when asked", async () => { /* ?disposition=attachment → content-disposition starts with attachment; default → inline */ });
it("forwards a range request and keeps the 206", async () => { /* header range: bytes=0-99 → status 206 + content-range echoed */ });
it("refuses a path outside the catalog without calling upstream", async () => {
  const fetchAsset = vi.fn();
  const response = await handler(new Request("https://atlas.example/api/material/DSM1/ALP/../../etc/passwd"), ctx);
  expect(response.status).toBe(404);
  expect(fetchAsset).not.toHaveBeenCalled();
});
it("answers 502 without leaking the upstream body when the CDN fails", async () => { /* upstream 500 with a body → status 502, body does not contain the upstream text */ });
it("percent-encodes a non-ascii filename in content-disposition", async () => { /* filename*=UTF-8''... present */ });
```

- [ ] **Step 2: Run it and watch it fail** — `corepack pnpm exec vitest run 'src/app/api/material/[...path]/route.test.ts'`

- [ ] **Step 3: Implement**

```ts
export function createMaterialAssetHandler({ catalog, repositoryUrl, fetchAsset }) {
  const byPath = new Map(catalog.materials.map((material) => [material.ref.path, material]));

  return async function handler(request, context) {
    const segments = (await context.params).path;
    const material = materialPathCandidates(segments).map((path) => byPath.get(path)).find(Boolean);
    if (!material) return new Response("Material não catalogado.", { status: 404 });

    const url = new URL(request.url);
    const disposition = url.searchParams.get("disposition") === "attachment" ? "attachment" : "inline";
    const range = request.headers.get("range");
    const upstream = await fetchAsset(
      rawGitHubUrl(repositoryUrl, material.ref.commitSha, material.ref.path),
      { headers: { "user-agent": GITHUB_USER_AGENT, accept: "*/*", ...(range ? { range } : {}) } },
    );
    if (!upstream.ok && upstream.status !== 206) {
      await upstream.body?.cancel();
      return new Response("Arquivo indisponível no repositório.", { status: 502 });
    }

    const headers = new Headers({
      "content-type": contentTypeFor(material.extension),
      "content-disposition": contentDispositionFor(disposition, material.name),
      "cache-control": "public, max-age=31536000, immutable",
      "etag": `"${material.ref.commitSha}-${material.extension}-${material.size}"`,
      "x-content-type-options": "nosniff",
      "accept-ranges": "bytes",
    });
    for (const name of ["content-length", "content-range"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status === 206 ? 206 : 200, headers });
  };
}
```

`contentDispositionFor` must emit an ASCII `filename="..."` plus an RFC 5987 `filename*=UTF-8''<percent-encoded>` so `LISTAS DE EXERCÍCIOS` survives. It is a real two-part encoding recipe, not a rename.

- [ ] **Step 4: Run the test, then typecheck and lint.** Expect `Content-Type: application/pdf` and the 404-without-fetch case to pass.

- [ ] **Step 5: Commit** — `feat(atlas): serve material bytes from our own origin so PDFs render instead of downloading`

---

### Task C: Nested folder grouping

**Files:**
- Create: `atlas/src/modules/catalog/material-tree.ts`
- Modify: `atlas/src/modules/study/study-discipline-materials.tsx`
- Test: `atlas/src/modules/catalog/material-tree.test.ts`

**Interfaces:**
- Produces:

```ts
export type MaterialFolder = Readonly<{
  name: string;
  depth: number;
  materials: readonly Material[];   // files sitting directly in this folder
  folders: readonly MaterialFolder[]; // sorted by name
}>;
export function buildMaterialTree(materials: readonly Material[]): MaterialFolder;
```

- [ ] **Step 1: Write the failing test**

```ts
it("keeps every level instead of collapsing to the first folder", () => {
  const tree = buildMaterialTree([
    material("DSM1/ALP/SLIDES/aula.pdf"),
    material("DSM1/ALP/SLIDES/IMAGENS/fig.png"),
    material("DSM1/ALP/raiz.md"),
  ]);
  expect(tree.folders.map((f) => f.name)).toEqual(["SLIDES"]);
  expect(tree.materials.map((m) => m.name)).toEqual(["raiz.md"]);
  const slides = tree.folders[0]!;
  expect(slides.materials.map((m) => m.name)).toEqual(["aula.pdf"]);
  expect(slides.folders[0]!.name).toBe("IMAGENS");
  expect(slides.folders[0]!.depth).toBe(2);
});

it("survives the deepest path in the catalog", () => { /* 11 levels → depth 11, no collapse */ });
it("omits an empty folder", () => { /* a path whose only descendant is excluded produces no folder node */ });
it("sorts files and folders the way the repository lists them", () => { /* compareCodeUnits order preserved */ });
```

`depth` is relative to the discipline root: a file directly in the discipline sits at depth 0.

- [ ] **Step 2: Run it and watch it fail.**

- [ ] **Step 3: Implement** — walk each material's `ref.path.split("/").slice(2, -1)` creating one node per segment. **Preserve the incoming order** — do not sort. `buildCatalog` already emits materials in `compareCodeUnits` order of the Git tree and `query.browse` filters without reordering, so encounter order is repository order; a second comparator here could only disagree with it. No empty-folder cleanup pass is needed: a node is only created while descending into a material that exists.

- [ ] **Step 4: Render the tree**

Replace the single-level `Map.groupBy` in `study-discipline-materials.tsx` with a recursive renderer over `buildMaterialTree`. Constraints:

- A folder is a heading with its name and file count, then its files, then its subfolders — no open/closed state, everything visible.
- Indentation from `--depth` via `style={{ "--depth": folder.depth }}`, clamped in CSS so 11 levels still fit a 390 px viewport.
- Keep the existing `[data-material-link]`, `.material-group`, `.material-groups`, `.file-type` and `.current-marker` hooks: `tests/e2e/catalog-navigation.spec.ts` and `atlas-visual.spec.ts` select on them. Read both specs before changing markup.
- Keep the accessible name per folder (`aria-label` including the folder name and its material count).

- [ ] **Step 5: Run the test, typecheck, lint, commit** — `feat(atlas): show the material tree the way the repository is organised`

---

### Task D: Preview surfaces and fixed actions

**Files:**
- Modify: `atlas/src/modules/catalog/material-preview.tsx`
- Modify: `atlas/src/app/globals.css`
- Test: `atlas/src/modules/catalog/material-preview.test.tsx` (create)

**Interfaces:**
- Consumes: `material.assetUrl`, `material.downloadUrl`, `material.previewUrl`, `material.previewTruncated`, `OFFICE_PREVIEW_EXTENSIONS`.
- Produces: `MaterialPreview({ material, origin }: Readonly<{ material: Material; origin: string }>)` — previews point at `assetUrl`, and a `MaterialActions` block renders in **every** branch, not only the fallback.
- The Office viewer needs an absolute URL, so `origin` is a required prop. `src/app/materiais/[...path]/page.tsx` passes `requiredRuntimeEnv("BETTER_AUTH_URL")`, importing it from `modules/identity/server-auth` (the page does not import it today). Do not hardcode the production host.

- [ ] **Step 1: Write the failing test**

```ts
it("points the PDF viewer at our own origin, not at GitHub", async () => {
  const html = renderToStaticMarkup(await MaterialPreview({ material: pdfMaterial }));
  expect(html).toContain(`data="${pdfMaterial.assetUrl}"`);
  expect(html).not.toContain("raw.githubusercontent.com");
});
it("offers the download next to a preview that worked", async () => {
  const html = renderToStaticMarkup(await MaterialPreview({ material: imageMaterial }));
  expect(html).toContain(`href="${imageMaterial.downloadUrl}"`);
  expect(html).toContain("Baixar arquivo");
});
it("opens the image at its own size", async () => { /* a link to assetUrl, not a resized <img> only */ });
it("embeds office documents in the online viewer", async () => { /* iframe src contains view.officeapps.live.com and the encoded assetUrl */ });
it("says when the text preview was cut", async () => { /* previewTruncated → visible warning + download */ });
it("falls back when there is no preview at all", async () => { /* previewKind none → fallback + both actions */ });
```

`TextPreview` is a client component with a `useEffect`; keep asserting only its rendered shell here, as the existing tests do.

- [ ] **Step 2: Run it and watch it fail.**

- [ ] **Step 3: Implement** — rewrite `material-preview.tsx`:

- image: `<img data-material-preview="image" src={material.assetUrl}>` plus a link "Abrir em tamanho real" to `material.assetUrl` (`target="_blank" rel="noreferrer"`).
- pdf: `<object data-material-preview="pdf" data={material.assetUrl} type="application/pdf">` with the existing fallback inside.
- office: `<iframe data-material-preview="office" src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteAssetUrl)}`} title=... >`. `absoluteAssetUrl` must be absolute — build it from `BETTER_AUTH_URL` or derive the origin from request headers the way `admin/entrar/page.tsx` does; do not hardcode the production host.
- text: unchanged behaviour, plus the truncation warning when `previewTruncated`.
- every branch ends with a `MaterialActions` block: "Baixar arquivo" (`downloadUrl`, `download` attribute) and "Ver no GitHub".

- [ ] **Step 4: CSS** — in `globals.css`:

- `.native-preview` must stop floating small images in a 34 rem void: keep a sane minimum but let the image define its own size, cap it at the viewport, and never upscale.
- office iframe sizing, with the same reduced-motion and narrow-viewport rules the neighbours use.
- `.material-tree`-style indentation from `--depth`, clamped (`calc(min(var(--depth), 6) * …)`).
- Preserve the palette and the "no card grid, no block shadows, no radii above 2 px" rules from `DESIGN.md`. Read it before writing CSS.

- [ ] **Step 5: Run the tests, typecheck, lint, commit** — `feat(atlas): render PDFs, images and office files, with the download always at hand`

---

## Verification (lead, after all four tasks land)

- `corepack pnpm exec vitest run` (full unit suite, no pretest build).
- `corepack pnpm exec tsc --noEmit` and `corepack pnpm exec eslint .`
- `corepack pnpm build` — the catalog and preview assets regenerate; check `public/material-previews` file count jumped from 2 to ~1000 and total size stays near 6 MiB.
- **Real browser:** start the built Worker, open a PDF material page, and confirm the PDF renders in the page rather than downloading, plus that "Baixar arquivo" downloads and a `.java` material shows its text.
