import type { MaterialRef } from "../catalog/model";

export type LineLocator = Readonly<{ type: "lines"; start: number; end: number }>;
export type PageLocator = Readonly<{ type: "page"; page: number }>;
export type ExcerptLocator = Readonly<{ type: "excerpt"; hash: string }>;
export type Locator = LineLocator | PageLocator | ExcerptLocator;

export type RetrievedExcerpt = Readonly<{
  material: MaterialRef;
  locator: Locator;
  text: string;
  score: number;
}>;

export interface ContentRetriever {
  retrieve(context: readonly MaterialRef[], query: string, limit: number): Promise<readonly RetrievedExcerpt[]>;
}

export type ContentChunk = Readonly<{
  locator: LineLocator;
  hash: string;
  text: string;
}>;

export type IndexedFormat = "markdown" | "sql" | "text" | "code";

export type MaterialIndex = Readonly<{
  material: MaterialRef;
  format: IndexedFormat;
  chunks: readonly ContentChunk[];
}>;

export type IndexManifest = Readonly<{
  commitSha: string;
  indexedMaterials: number;
  indexedChunks: number;
  skippedMaterials: number;
}>;

export type CitationCheck = Readonly<{
  supported: boolean;
  citations: readonly RetrievedExcerpt[];
}>;

/**
 * Deterministic, dependency-free string hash (cyrb53) shared by the build-time
 * indexer and the runtime retriever so both derive the same asset names.
 */
export function hashText(value: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const digest = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return digest.toString(36).padStart(11, "0");
}

/** Stable asset name for one material at one commit. */
export function materialHash(ref: MaterialRef): string {
  return hashText(`${ref.commitSha}\n${ref.path}`);
}

export function chunkHash(locator: LineLocator, text: string): string {
  return hashText(`${locator.start}:${locator.end}\n${text}`);
}

/** Accent- and case-insensitive form used for ranking and citation matching. */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function sameLocator(left: Locator, right: Locator): boolean {
  if (left.type === "lines" && right.type === "lines") {
    return left.start === right.start && left.end === right.end;
  }
  if (left.type === "page" && right.type === "page") return left.page === right.page;
  if (left.type === "excerpt" && right.type === "excerpt") return left.hash === right.hash;
  return false;
}

/**
 * Accepts a model citation only when its material, locator and quoted text all
 * match a excerpt retrieved during the current turn. Anything else is discarded;
 * when nothing survives the answer is marked unsupported.
 */
export function validateCitations(
  candidates: readonly RetrievedExcerpt[],
  excerpts: readonly RetrievedExcerpt[],
): CitationCheck {
  const citations: RetrievedExcerpt[] = [];
  for (const candidate of candidates) {
    const quote = normalizeText(candidate.text).trim();
    if (quote.length === 0) continue;
    const match = excerpts.find((excerpt) =>
      excerpt.material.path === candidate.material.path
      && excerpt.material.commitSha === candidate.material.commitSha
      && sameLocator(excerpt.locator, candidate.locator)
      && normalizeText(excerpt.text).includes(quote),
    );
    if (match && !citations.includes(match)) citations.push(match);
  }
  return Object.freeze({
    supported: citations.length > 0,
    citations: Object.freeze(citations),
  });
}
