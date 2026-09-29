import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { MaterialRef } from "../src/modules/catalog/model";
import type { ContentChunk, IndexedFormat, IndexManifest, LineLocator, MaterialIndex } from "../src/modules/tutor/model";
import { chunkHash, indexFormatFor, materialHash } from "../src/modules/tutor/model.ts";
import { isExcludedPath, listGitTree, resolveCommitSha, SECRET_MARKER } from "./build-catalog.ts";

export { indexFormatFor };

const MAX_INDEX_BYTES = 400_000;
const MAX_CHUNK_LINES = 40;
const OVERLAP_LINES = 5;

const MARKDOWN_HEADING = /^#{1,6}\s/;
const SQL_STATEMENT = /^\s*(?:CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|SELECT|WITH|GRANT|REVOKE|TRUNCATE|MERGE|EXPLAIN|BEGIN|COMMIT|CALL|DECLARE)\b/i;
const CODE_DECLARATION = /^\s*(?:(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function|class|interface|enum|struct|namespace|module|def|impl|trait)\b|(?:public|private|protected|static|final|abstract|synchronized)\s)/;

type LineRange = readonly [number, number];

export type ContentIndexAsset = Readonly<{ file: string; index: MaterialIndex }>;
export type ContentIndexBuild = Readonly<{
  manifest: IndexManifest;
  assets: readonly ContentIndexAsset[];
}>;

function isBlank(line: string | undefined): boolean {
  return line === undefined || line.trim().length === 0;
}

function splitParagraphs(lines: readonly string[], start: number, end: number): LineRange[] {
  const paragraphs: LineRange[] = [];
  let cursor = start;
  while (cursor <= end) {
    if (isBlank(lines[cursor])) {
      cursor += 1;
      continue;
    }
    let stop = cursor;
    while (stop + 1 <= end && !isBlank(lines[stop + 1])) stop += 1;
    paragraphs.push([cursor, stop]);
    cursor = stop + 1;
  }
  return paragraphs;
}

function splitLongRange(start: number, end: number): LineRange[] {
  const windows: LineRange[] = [];
  let cursor = start;
  while (cursor <= end) {
    const stop = Math.min(cursor + MAX_CHUNK_LINES - 1, end);
    windows.push([cursor, stop]);
    if (stop >= end) break;
    cursor = stop - OVERLAP_LINES + 1;
  }
  return windows;
}

function packParagraphs(paragraphs: readonly LineRange[]): LineRange[] {
  const units = paragraphs.flatMap(([start, end]) =>
    end - start + 1 > MAX_CHUNK_LINES ? splitLongRange(start, end) : [[start, end] as LineRange],
  );
  const chunks: LineRange[] = [];
  let current: [number, number] | null = null;
  for (const [start, end] of units) {
    if (current === null) {
      current = [start, end];
      continue;
    }
    if (end - current[0] + 1 <= MAX_CHUNK_LINES) {
      current[1] = end;
      continue;
    }
    chunks.push(current);
    current = [Math.max(current[0], current[1] - OVERLAP_LINES + 1), end];
  }
  if (current) chunks.push(current);
  return chunks;
}

function findBoundaries(format: IndexedFormat, lines: readonly string[]): number[] {
  const pattern = format === "markdown"
    ? MARKDOWN_HEADING
    : format === "sql"
      ? SQL_STATEMENT
      : format === "code"
        ? CODE_DECLARATION
        : null;
  if (!pattern) return [];
  const boundaries: number[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) boundaries.push(index);
  }
  return boundaries;
}

function toSections(boundaries: readonly number[], length: number): LineRange[] {
  const starts = boundaries.length === 0 || boundaries[0] !== 0 ? [0, ...boundaries] : [...boundaries];
  return starts.map((start, index) => [start, (starts[index + 1] ?? length) - 1] as LineRange);
}

function toChunk(lines: readonly string[], [start, end]: LineRange): ContentChunk {
  const text = lines.slice(start, end + 1).join("\n");
  const locator: LineLocator = Object.freeze({ type: "lines", start: start + 1, end: end + 1 });
  return Object.freeze({ locator, hash: chunkHash(locator, text), text });
}

/**
 * Deterministic extraction: identical text at identical lines always yields the
 * same chunks and hashes. Headings, SQL statements and code declarations become
 * section boundaries; everything else is bounded, overlapping paragraphs.
 */
export function extractChunks(path: string, text: string): readonly ContentChunk[] {
  const format = indexFormatFor(extname(path).toLowerCase());
  if (!format) return Object.freeze([]);
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const sections = toSections(findBoundaries(format, lines), lines.length);
  const chunks: ContentChunk[] = [];
  for (const section of sections) {
    for (const range of packParagraphs(splitParagraphs(lines, section[0], section[1]))) {
      chunks.push(toChunk(lines, range));
    }
  }
  return Object.freeze(chunks);
}

/**
 * One `git cat-file --batch` pass for every candidate blob: the whole index is
 * built from a single child process, so build time stays linear and bounded.
 */
async function readBlobs(repositoryRoot: string, oids: readonly string[]): Promise<Map<string, Buffer>> {
  const child = spawn("git", ["cat-file", "--batch"], { cwd: repositoryRoot, stdio: ["pipe", "pipe", "pipe"] });
  const collected: Buffer[] = [];
  child.stdout.on("data", (chunk: Buffer) => collected.push(chunk));
  child.stdin.on("error", () => {});
  child.stdin.end(oids.map((oid) => `${oid}\n`).join(""));

  const done = Promise.withResolvers<void>();
  child.on("error", done.reject);
  child.on("close", (code) => code === 0 ? done.resolve() : done.reject(new Error(`git cat-file --batch exited ${code}`)));
  await done.promise;

  const output = Buffer.concat(collected);
  const blobs = new Map<string, Buffer>();
  let cursor = 0;
  while (cursor < output.length) {
    const headerEnd = output.indexOf(0x0a, cursor);
    if (headerEnd === -1) break;
    const [oid, type, size] = output.subarray(cursor, headerEnd).toString("utf8").split(" ");
    if (type !== "blob") throw new Error(`Unexpected git object ${type} for ${oid}`);
    const start = headerEnd + 1;
    const end = start + Number(size);
    blobs.set(oid, output.subarray(start, end));
    cursor = end + 1;
  }
  return blobs;
}

export async function buildContentIndex(repositoryRoot: string, commitSha: string): Promise<ContentIndexBuild> {
  const entries = listGitTree(repositoryRoot, commitSha).sort((left, right) =>
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  );
  const candidates = entries.filter((entry) => {
    const semesterCode = entry.path.split("/")[0];
    return /^DSM[1-6]$/.test(semesterCode)
      && entry.type === "blob"
      && entry.size !== null
      && !isExcludedPath(entry.path, entry.mode)
      && indexFormatFor(extname(entry.path).toLowerCase()) !== null;
  });
  const oversized = candidates.filter((entry) => (entry.size ?? 0) > MAX_INDEX_BYTES);
  const readable = candidates.filter((entry) => (entry.size ?? 0) <= MAX_INDEX_BYTES);
  const blobs = await readBlobs(repositoryRoot, readable.map((entry) => entry.oid));

  const assets: ContentIndexAsset[] = [];
  let indexedChunks = 0;
  let skippedMaterials = oversized.length;

  for (const entry of readable) {
    const format = indexFormatFor(extname(entry.path).toLowerCase()) as IndexedFormat;
    const bytes = blobs.get(entry.oid);
    if (!bytes) throw new Error(`Missing Git blob for ${entry.path}`);
    const text = bytes.toString("utf8");
    if (SECRET_MARKER.test(text)) {
      skippedMaterials += 1;
      continue;
    }
    const chunks = extractChunks(entry.path, text);
    if (chunks.length === 0) {
      skippedMaterials += 1;
      continue;
    }
    const material: MaterialRef = Object.freeze({ path: entry.path, commitSha });
    assets.push(Object.freeze({
      file: `${materialHash(material)}.json`,
      index: Object.freeze({ material, format, chunks }),
    }));
    indexedChunks += chunks.length;
  }

  return Object.freeze({
    manifest: Object.freeze({
      commitSha,
      indexedMaterials: assets.length,
      indexedChunks,
      skippedMaterials,
    }),
    assets: Object.freeze(assets),
  });
}

export async function writeContentIndex(
  repositoryRoot: string,
  outputRoot: string,
  commitSha: string,
): Promise<ContentIndexBuild> {
  if (!/^[0-9a-f]{7,64}$/i.test(commitSha)) throw new Error(`Refusing to write index for suspicious commit sha: ${commitSha}`);
  const build = await buildContentIndex(repositoryRoot, commitSha);
  const commitDirectory = resolve(outputRoot, commitSha);
  await rm(commitDirectory, { recursive: true, force: true });
  await mkdir(commitDirectory, { recursive: true });
  for (const asset of build.assets) {
    await writeFile(resolve(commitDirectory, asset.file), `${JSON.stringify(asset.index)}\n`);
  }
  await writeFile(resolve(commitDirectory, "manifest.json"), `${JSON.stringify(build.manifest, null, 2)}\n`);
  return build;
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const atlasRoot = resolve(import.meta.dirname, "..");
  const repositoryRoot = resolve(atlasRoot, "..");
  const commitSha = resolveCommitSha(repositoryRoot);
  const build = await writeContentIndex(repositoryRoot, resolve(atlasRoot, "public/_index"), commitSha);
  process.stdout.write(`indexed ${build.manifest.indexedMaterials} materials / ${build.manifest.indexedChunks} chunks at ${commitSha}\n`);
}
