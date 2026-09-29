import type { CatalogData, MaterialKind } from "../catalog/model";
import type {
  AdminClassificationFile,
  AdminClassificationInput,
  AdminClassifierAi,
  ClassificationSuggestion,
} from "../../integrations/ai/admin-classifier-ai";
import { TutorProviderError } from "../../integrations/ai/public-tutor-ai";
import { AdminAuthorizationError } from "../identity/admin-authorizer";
import { runSponsoredTurn, type BudgetDecision, type ReservedBudget, type UsageLedger } from "../tutor/usage-ledger";
import type { GitHubMaterialSource } from "./model";

/**
 * Administrative classification of staged uploads.
 *
 * The AI only *suggests*: every field is validated against the trusted catalog
 * and the batch's own blob set before it reaches the review surface, and a
 * suggestion never changes batch state. The existing manual review/publish path
 * stays authoritative.
 *
 * File text is untrusted, prompt-injection-bearing input: it is extracted
 * within a hard bound, delimited as evidence by the adapter, and can never add
 * a catalog code, widen the allowlist or confirm a batch.
 */

/** Maximum characters of a single file fed to the classifier. */
export const CLASSIFY_FILE_TEXT_LIMIT = 2_000;

const TEXT_MIME: Readonly<Record<string, true>> = {
  "application/json": true,
  "application/xml": true,
  "application/javascript": true,
  "application/x-sh": true,
  "application/sql": true,
  "application/typescript": true,
  "image/svg+xml": true,
};

const TEXT_EXTENSION: Readonly<Record<string, true>> = {
  c: true, cpp: true, cs: true, css: true, csv: true, go: true, html: true, java: true,
  js: true, json: true, jsx: true, kt: true, log: true, md: true, php: true, py: true,
  rb: true, rs: true, sh: true, sql: true, svg: true, ts: true, tsx: true, txt: true,
  vue: true, xml: true, yaml: true, yml: true,
};

const ARCHIVE_EXTENSION: Readonly<Record<string, true>> = { "7z": true, gz: true, rar: true, tar: true, zip: true };
const IMAGE_EXTENSION: Readonly<Record<string, true>> = { gif: true, jpeg: true, jpg: true, png: true, svg: true, webp: true };
const CODE_EXTENSION: Readonly<Record<string, true>> = {
  c: true, cpp: true, cs: true, css: true, go: true, html: true, java: true, js: true, jsx: true,
  kt: true, php: true, py: true, rb: true, rs: true, sh: true, sql: true, ts: true, tsx: true,
  vue: true, xml: true,
};
const DOCUMENT_EXTENSION: Readonly<Record<string, true>> = {
  csv: true, doc: true, docx: true, md: true, odt: true, pdf: true, ppt: true, pptx: true,
  txt: true, xls: true, xlsx: true,
};
const KIND_BY_NAME: Readonly<Record<MaterialKind, true>> = {
  document: true,
  code: true,
  image: true,
  archive: true,
  other: true,
};

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot > 0 ? filename.slice(dot + 1).toLowerCase() : "";
}

function hasControlChars(value: string): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}

/** A file the classifier can read as UTF-8 text; binaries stay metadata-only. */
export function isReadableText(mimeType: string, filename: string): boolean {
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("text/")) return true;
  if (mime.endsWith("+json") || mime.endsWith("+xml")) return true;
  if (TEXT_MIME[mime]) return true;
  return TEXT_EXTENSION[extensionOf(filename)] === true;
}

/**
 * Decodes at most `limit` characters of UTF-8 text. Unsupported or non-UTF-8
 * input returns `null` — never a guessed decode — so the caller can fall back
 * to metadata plus manual review.
 */
export function extractBoundedText(
  bytes: Uint8Array,
  mimeType: string,
  filename: string,
  limit = CLASSIFY_FILE_TEXT_LIMIT,
): string | null {
  if (!isReadableText(mimeType, filename)) return null;
  let decoded: string;
  try {
    decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
  return decoded.replace(/\u0000/g, "").slice(0, Math.max(0, limit));
}

export function inferMaterialKind(filename: string, mimeType: string): MaterialKind {
  const extension = extensionOf(filename);
  if (ARCHIVE_EXTENSION[extension]) return "archive";
  if (IMAGE_EXTENSION[extension]) return "image";
  if (CODE_EXTENSION[extension]) return "code";
  if (DOCUMENT_EXTENSION[extension]) return "document";
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("text/")) return "document";
  return "other";
}

export function buildClassificationInput(
  batchId: string,
  files: readonly AdminClassificationFile[],
  catalog: CatalogData,
  budget: ReservedBudget,
): AdminClassificationInput {
  return {
    batchId,
    budget,
    catalog: {
      semesters: catalog.semesters.map(({ code, name }) => ({ code, name })),
      disciplines: catalog.disciplines.map(({ code, name, semesterCode }) => ({ code, name, semesterCode })),
    },
    files,
  };
}

export type ReviewedClassification = ClassificationSuggestion & Readonly<{ destination: string }>;

export type SuggestionValidationContext = Readonly<{
  catalog: CatalogData;
  files: readonly AdminClassificationFile[];
}>;

function validPath(
  relativePath: string,
  catalog: CatalogData,
): Readonly<{ semesterCode: string; disciplineCode: string; path: string }> | null {
  if (hasControlChars(relativePath) || relativePath.includes("\\") || relativePath.startsWith("/")) return null;
  const segments = relativePath.split("/");
  if (segments.length < 3) return null;
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) return null;
  const semesterCode = segments[0] as string;
  const disciplineCode = segments[1] as string;
  if (!catalog.semesters.some((semester) => semester.code === semesterCode)) return null;
  if (!catalog.disciplines.some((discipline) => discipline.semesterCode === semesterCode && discipline.code === disciplineCode)) return null;
  return { semesterCode, disciplineCode, path: segments.join("/") };
}

function inRange(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

/**
 * Validates the model's suggestions against the real catalog and the batch's
 * own blob set. Invented semesters, disciplines and paths are dropped (with a
 * warning), confidence outside 0–1 becomes 0, a suggestion for a foreign blob
 * is ignored, and a file whose content could not be read is always returned
 * with a null destination — the model's guess for it is discarded.
 */
export function validateSuggestions(
  raw: readonly ClassificationSuggestion[],
  context: SuggestionValidationContext,
): readonly ReviewedClassification[] {
  const byBlob = new Map<string, ClassificationSuggestion>();
  for (const candidate of raw) {
    if (typeof candidate?.blobSha === "string" && candidate.blobSha !== "") byBlob.set(candidate.blobSha, candidate);
  }

  return context.files.map((file) => {
    const inferredKind = inferMaterialKind(file.filename, file.mimeType);
    const candidate = byBlob.get(file.blobSha);

    if (!candidate) {
      return {
        destination: file.destination,
        blobSha: file.blobSha,
        semesterCode: null,
        disciplineCode: null,
        relativePath: null,
        title: file.filename,
        kind: inferredKind,
        confidence: { semester: 0, discipline: 0, path: 0, title: 0, kind: 0 },
        warning: "sem sugestão do modelo; revisão manual necessária",
      };
    }

    if (file.text === null) {
      return {
        destination: file.destination,
        blobSha: file.blobSha,
        semesterCode: null,
        disciplineCode: null,
        relativePath: null,
        title: candidate.title || file.filename,
        kind: KIND_BY_NAME[candidate.kind] ? candidate.kind : inferredKind,
        confidence: { semester: 0, discipline: 0, path: 0, title: 0, kind: 0 },
        warning: "conteúdo não legível; classificação manual necessária",
      };
    }

    const discarded: string[] = [];
    const rawConfidence = candidate.confidence ?? { semester: 0, discipline: 0, path: 0, title: 0, kind: 0 };
    const confidence = {
      semester: inRange(rawConfidence.semester) ? rawConfidence.semester : 0,
      discipline: inRange(rawConfidence.discipline) ? rawConfidence.discipline : 0,
      path: inRange(rawConfidence.path) ? rawConfidence.path : 0,
      title: inRange(rawConfidence.title) ? rawConfidence.title : 0,
      kind: inRange(rawConfidence.kind) ? rawConfidence.kind : 0,
    };

    let semesterCode: string | null = null;
    if (typeof candidate.semesterCode === "string" && context.catalog.semesters.some((semester) => semester.code === candidate.semesterCode)) {
      semesterCode = candidate.semesterCode;
    } else if (candidate.semesterCode !== null) {
      discarded.push("semester");
    }

    let disciplineCode: string | null = null;
    if (
      typeof candidate.disciplineCode === "string" &&
      semesterCode !== null &&
      context.catalog.disciplines.some((discipline) => discipline.semesterCode === semesterCode && discipline.code === candidate.disciplineCode)
    ) {
      disciplineCode = candidate.disciplineCode;
    } else if (candidate.disciplineCode !== null) {
      discarded.push("discipline");
    }

    let relativePath: string | null = null;
    if (typeof candidate.relativePath === "string") {
      const valid = validPath(candidate.relativePath, context.catalog);
      if (valid) {
        relativePath = valid.path;
        // The path is what would be applied, so its catalog-validated root wins.
        semesterCode = valid.semesterCode;
        disciplineCode = valid.disciplineCode;
      } else {
        discarded.push("path");
      }
    } else if (candidate.relativePath !== null) {
      discarded.push("path");
    }

    const kind = KIND_BY_NAME[candidate.kind] ? candidate.kind : inferredKind;
    if (!KIND_BY_NAME[candidate.kind]) discarded.push("kind");

    // A blank model title falls back to the trusted filename; that title was
    // not the model's claim, so it must not inherit the model's confidence.
    const modelTitle = typeof candidate.title === "string" ? candidate.title.trim() : "";
    const title = modelTitle ? modelTitle.slice(0, 200) : file.filename;
    if (!modelTitle) discarded.push("title");

    if (semesterCode === null) confidence.semester = 0;
    if (disciplineCode === null) confidence.discipline = 0;
    if (relativePath === null) confidence.path = 0;
    if (!modelTitle) confidence.title = 0;
    if (!KIND_BY_NAME[candidate.kind]) confidence.kind = 0;

    const dropped = [...new Set(discarded)].sort().join(", ");
    const warning = dropped
      ? `campos descartados: ${dropped}`
      : typeof candidate.warning === "string" && candidate.warning.trim()
        ? candidate.warning.trim()
        : undefined;

    return {
      destination: file.destination,
      blobSha: file.blobSha,
      semesterCode,
      disciplineCode,
      relativePath,
      title,
      kind,
      confidence,
      ...(warning ? { warning } : {}),
    };
  });
}

export type ClassifyBatchQuery = (text: string, params: readonly unknown[]) => Promise<Record<string, unknown>[]>;

export type ClassifyBatchDependencies = Readonly<{
  requireAdmin: (request: Request) => Promise<{ adminId: string }>;
  query: ClassifyBatchQuery;
  source: Pick<GitHubMaterialSource, "readBlob">;
  catalog: CatalogData;
  ai: AdminClassifierAi;
  ledger: UsageLedger;
  now?: () => number;
}>;

export type ClassificationReview = Readonly<{
  batchId: string;
  suggestions: readonly ReviewedClassification[];
}>;

function json(status: number, body: unknown): Response {
  return Response.json(body, { status });
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function providerFailure(error: unknown): Response {
  if (!(error instanceof TutorProviderError)) throw error;
  switch (error.failure.kind) {
    case "rate_limited":
      return json(429, { error: "rate-limited", retryAfterSeconds: error.failure.retryAfterSeconds });
    case "timeout":
      return json(504, { error: "timeout" });
    case "auth":
      return json(503, { error: "provider-auth" });
    case "invalid":
      return json(502, { error: "provider-invalid" });
    default:
      return json(503, { error: "provider-unavailable" });
  }
}

/**
 * The classification HTTP handler: admin-authorized, batch-scoped and read-only
 * with respect to batch state. It reserves admin-scope budget, reads the staged
 * blobs, and returns validated suggestions for review — it never publishes,
 * confirms or mutates a batch.
 */
export function createClassifyBatchHandler(
  dependencies: ClassifyBatchDependencies,
): (request: Request, batchId: string) => Promise<Response> {
  const now = dependencies.now ?? Date.now;

  return async function handleClassify(request: Request, batchId: string): Promise<Response> {
    let adminId: string;
    try {
      ({ adminId } = await dependencies.requireAdmin(request));
    } catch (error) {
      if (error instanceof AdminAuthorizationError) return json(403, { error: "Proibido" });
      throw error;
    }

    const batchRows = await dependencies.query(
      `SELECT id, owner_admin_id, status, expires_at FROM upload_batch WHERE id = $1`,
      [batchId],
    );
    const batch = batchRows[0];
    if (!batch) return json(404, { error: "batch-not-found" });
    if (asString(batch["owner_admin_id"]) !== adminId) return json(403, { error: "not-owner" });
    const status = asString(batch["status"]) ?? "";
    if (status !== "draft" && status !== "ready") return json(409, { error: "batch-not-draft" });
    // The driver may hand back a Date or an ISO string (the publication
    // workflow accepts both); a value that parses to neither is expired.
    const rawExpiry = batch["expires_at"];
    const expiresAt = rawExpiry instanceof Date ? rawExpiry.getTime() : Date.parse(asString(rawExpiry) ?? "");
    if (!Number.isFinite(expiresAt) || expiresAt <= now()) return json(410, { error: "batch-expired" });

    const stagedRows = await dependencies.query(
      `SELECT destination, mime_type, size, blob_sha FROM staged_upload_file WHERE batch_id = $1 ORDER BY destination`,
      [batchId],
    );

    const files: AdminClassificationFile[] = [];
    for (const row of stagedRows) {
      const destination = asString(row["destination"]) ?? "";
      const mimeType = asString(row["mime_type"]) ?? "";
      const blobSha = asString(row["blob_sha"]);
      const filename = destination.split("/").pop() ?? destination;
      let text: string | null = null;
      if (blobSha) {
        try {
          text = extractBoundedText(await dependencies.source.readBlob(blobSha), mimeType, filename);
        } catch {
          text = null;
        }
      }
      files.push({
        blobSha: blobSha ?? "",
        destination,
        filename,
        mimeType,
        size: asInteger(row["size"]) ?? 0,
        text,
      });
    }

    let outcome: Readonly<{ decision: BudgetDecision; output?: readonly ClassificationSuggestion[] }>;
    try {
      outcome = await runSponsoredTurn(
        dependencies.ledger,
        { scope: "admin", subjectKey: adminId },
        async (budget) => {
          // The provider's real token usage is reported so `reconcile` settles
          // the reservation with measured spend; without it the global window
          // would only ever hold reservations and the token ceiling could not
          // bind (requestsPerDay × reserved would overshoot it).
          const result = await dependencies.ai.suggestBatch(buildClassificationInput(batchId, files, dependencies.catalog, budget));
          return { output: result.suggestions, usage: result.usage };
        },
      );
    } catch (error) {
      return providerFailure(error);
    }
    if (outcome.decision.type === "denied") {
      return json(429, { error: "quota", reason: outcome.decision.reason, resetsAt: outcome.decision.resetsAt });
    }

    return json(200, {
      batchId,
      suggestions: validateSuggestions(outcome.output ?? [], { catalog: dependencies.catalog, files }),
    } satisfies ClassificationReview);
  };
}
