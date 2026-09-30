import { describe, expect, it } from "vitest";

import { createSearchHandler } from "../src/app/api/search/route";
import type { CatalogQuery, Material } from "../src/modules/catalog/model";

const item: Material = {
  ref: { path: "DSM1/ALP/introducao.md", commitSha: "abc123" },
  name: "Introdução.md",
  extension: ".md",
  size: 12,
  disciplineCode: "ALP",
  semesterCode: "DSM1",
  kind: "document",
  downloadUrl: "https://example.test/abc123/DSM1/ALP/introducao.md",
  assetUrl: "https://example.test/abc123/DSM1/ALP/introducao.md",
  previewKind: "text",
};

const query: CatalogQuery = {
  browse: () => [],
  getMaterial: () => null,
  search: (term, cursor) => ({
    items: term === "logica" ? [item] : [],
    ...(cursor ? {} : { nextCursor: "MzA" }),
  }),
};

const GET = createSearchHandler(query);

function request(search: string) {
  return GET(new Request(`https://atlas.test/api/search${search}`));
}

describe("GET /api/search", () => {
  it("returns the public data and pagination contract", async () => {
    const response = await request("?q=logica");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: [item], nextCursor: "MzA" });
  });

  it.each(["", "   ", "a".repeat(121)])("rejects an invalid query with a stable error", async (q) => {
    const response = await request(`?q=${encodeURIComponent(q)}`);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_SEARCH_PARAMETERS", message: "Informe uma busca de 1 a 120 caracteres." },
    });
  });

  it.each(["***", "abc=", "a".repeat(129)])("rejects an invalid cursor with the same stable error", async (cursor) => {
    const response = await request(`?q=logica&cursor=${encodeURIComponent(cursor)}`);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_SEARCH_PARAMETERS", message: "Informe uma busca de 1 a 120 caracteres." },
    });
  });
});
