import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import catalog from "../../../generated/catalog.json";
import type { CatalogData } from "../../../modules/catalog/model";

const requestHeaders = new Headers({ host: "127.0.0.1:8787", "x-forwarded-proto": "http" });

vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));

import MaterialPage from "./page";

const data = catalog as CatalogData;
const pdf = data.materials.find((material) => material.previewKind === "pdf")!;
const office = data.materials.find((material) => material.previewKind === "office")!;

async function render(path: string): Promise<string> {
  return renderToStaticMarkup(await MaterialPage({ params: Promise.resolve({ path: path.split("/") }) }));
}

describe("GET /materiais/[...path]", () => {
  it("renders a public material page with no auth configuration at all", async () => {
    // Importing `modules/identity/server-auth` runs `createAuth` at module scope,
    // and that rejects a non-HTTPS base URL. Wiring the Office embed through it
    // took down this public reading page in every local run, where the base URL
    // is `http://127.0.0.1:8787`. Rendering here with no auth env is the guard:
    // re-introducing that import throws before this assertion is reached.
    const html = await render(pdf.ref.path);

    expect(html).toContain(pdf.name);
    expect(html).toContain(`data-material-preview="pdf"`);
  });

  it("derives the office embed origin from the request, not from a configured base URL", async () => {
    const html = await render(office.ref.path);

    expect(html).toContain(encodeURIComponent("http://127.0.0.1:8787"));
  });

  it("answers a path outside the catalog without rendering a preview", async () => {
    const html = await render("DSM1/ALP/inexistente.pdf");

    expect(html).toContain("Material não encontrado");
    expect(html).not.toContain("data-material-preview");
  });
});
