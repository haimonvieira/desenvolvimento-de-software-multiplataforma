import { z } from "zod";

import catalog from "../../../generated/catalog.json";
import { createCatalogQuery } from "../../../modules/catalog/catalog-query";
import type { CatalogData, CatalogQuery } from "../../../modules/catalog/model";

const parametersSchema = z.object({
  q: z.string().trim().min(1).max(120),
  cursor: z.string().regex(/^[A-Za-z0-9_-]{1,128}$/).refine((value) => {
    try {
      const decoded = atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "="));
      return /^\d+$/.test(decoded) && Number.isSafeInteger(Number(decoded));
    } catch {
      return false;
    }
  }).optional(),
});

const invalidParameters = {
  error: {
    code: "INVALID_SEARCH_PARAMETERS",
    message: "Informe uma busca de 1 a 120 caracteres.",
  },
} as const;

export function createSearchHandler(query: CatalogQuery) {
  return async function GET(request: Request) {
    const url = new URL(request.url);
    const parsed = parametersSchema.safeParse({
      q: url.searchParams.get("q") ?? "",
      ...(url.searchParams.has("cursor") ? { cursor: url.searchParams.get("cursor") ?? "" } : {}),
    });

    if (!parsed.success) return Response.json(invalidParameters, { status: 400 });

    const page = query.search(parsed.data.q, parsed.data.cursor);
    return Response.json({ data: page.items, ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}) });
  };
}

export const GET = createSearchHandler(createCatalogQuery(catalog as CatalogData));
