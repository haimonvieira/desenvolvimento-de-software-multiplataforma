import type { MaterialRef } from "../catalog/model";
import type { ContentRetriever, Locator, MaterialIndex, RetrievedExcerpt } from "./model";
import { materialHash, normalizeText } from "./model";

export type IndexAssetFetcher = (url: string) => Promise<MaterialIndex | null>;

export type ContentRetrieverOptions = Readonly<{
  fetchAsset?: IndexAssetFetcher;
  basePath?: string;
}>;

const DEFAULT_BASE_PATH = "/_index";

async function fetchIndexAsset(url: string): Promise<MaterialIndex | null> {
  const response = await fetch(url);
  if (!response.ok) return null;
  return await response.json() as MaterialIndex;
}

function tokenize(query: string): string[] {
  const terms = normalizeText(query).split(/[^\p{L}\p{N}]+/u).filter((term) => term.length >= 2);
  return [...new Set(terms)];
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  let cursor = haystack.indexOf(needle);
  while (cursor !== -1) {
    count += 1;
    cursor = haystack.indexOf(needle, cursor + needle.length);
  }
  return count;
}

function scoreText(normalizedText: string, terms: readonly string[]): number {
  let score = 0;
  for (const term of terms) score += countOccurrences(normalizedText, term);
  return score;
}

function locatorOrder(locator: Locator): number {
  if (locator.type === "lines") return locator.start;
  if (locator.type === "page") return locator.page;
  return 0;
}

/**
 * Deterministic lexical retriever. It only fetches the per-material index assets
 * named by the requested context refs (never a monolithic bundle) and never
 * returns text from a material outside that context.
 */
export function createContentRetriever(options: ContentRetrieverOptions = {}): ContentRetriever {
  const fetchAsset = options.fetchAsset ?? fetchIndexAsset;
  const basePath = options.basePath ?? DEFAULT_BASE_PATH;

  return Object.freeze({
    async retrieve(
      context: readonly MaterialRef[],
      query: string,
      limit: number,
    ): Promise<readonly RetrievedExcerpt[]> {
      const terms = tokenize(query);
      if (terms.length === 0 || !Number.isFinite(limit) || limit <= 0) return Object.freeze([]);

      const indexes = await Promise.all(context.map(async (ref) => {
        const url = `${basePath}/${encodeURIComponent(ref.commitSha)}/${materialHash(ref)}.json`;
        const index = await fetchAsset(url);
        if (!index || index.material.path !== ref.path || index.material.commitSha !== ref.commitSha) return null;
        return index;
      }));

      const scored: RetrievedExcerpt[] = [];
      for (const index of indexes) {
        if (!index) continue;
        for (const chunk of index.chunks) {
          const score = scoreText(normalizeText(chunk.text), terms);
          if (score <= 0) continue;
          scored.push(Object.freeze({
            material: index.material,
            locator: chunk.locator,
            text: chunk.text,
            score,
          }));
        }
      }

      scored.sort((left, right) =>
        right.score - left.score
        || (left.material.path < right.material.path ? -1 : left.material.path > right.material.path ? 1 : 0)
        || locatorOrder(left.locator) - locatorOrder(right.locator),
      );
      return Object.freeze(scored.slice(0, Math.floor(limit)));
    },
  });
}
