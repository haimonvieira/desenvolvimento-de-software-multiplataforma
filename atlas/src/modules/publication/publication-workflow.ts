import { AdminAuthorizationError } from "../identity/admin-authorizer";
import type {
  GitHubMaterialSource,
  GitTreeEntry,
  TreeEntryInput,
} from "./model";
import { MAX_BATCH_BYTES, validateUploadBatch } from "./validate-upload";

export type PublicationFailureReason =
  | "batch-not-found"
  | "batch-not-draft"
  | "batch-expired"
  | "empty-batch"
  | "missing-blob"
  | "invalid-destination"
  | "unknown-root"
  | "duplicate-destination"
  | "unknown-revision-target"
  | "batch-too-large"
  | "file-too-large"
  | "confirmation-mismatch"
  | "already-published"
  | "github-failure";

export type PublicationError = Readonly<{
  destination: string;
  reason: PublicationFailureReason;
}>;

export type FileRevision = Readonly<{
  destination: string;
  newDestination: string;
}>;

export type ProposedFile = Readonly<{
  destination: string;
  size: number;
  mimeType: string;
  blobSha: string;
  collidesWithHead: boolean;
}>;

export type BatchReview = Readonly<{
  batchId: string;
  baseCommitSha: string;
  branch: string;
  fileCount: number;
  files: readonly ProposedFile[];
  errors: readonly PublicationError[];
  confirmationPhrase: string;
}>;

export type PublishResult =
  | { type: "published"; commitSha: string; commitUrl: string }
  | { type: "conflict"; currentHead: string }
  | { type: "rejected"; errors: readonly PublicationError[] };

export interface PublicationWorkflow {
  reviseBatch(
    batchId: string,
    revisions: readonly FileRevision[],
  ): Promise<BatchReview>;
  publishBatch(
    batchId: string,
    baseCommitSha: string,
    confirmation: string,
  ): Promise<PublishResult>;
}

export type PublicationQuery = (
  text: string,
  params: readonly unknown[],
) => Promise<Record<string, unknown>[]>;

export type PublicationWorkflowDependencies = Readonly<{
  query: PublicationQuery;
  source: GitHubMaterialSource;
  branch?: string;
  now?: () => number;
}>;

export const DEFAULT_PUBLICATION_BRANCH = "main";
export const MAX_FILES_PER_PUBLICATION = 100;

export function confirmationPhrase(count: number, branch: string): string {
  return `PUBLICAR ${count} ARQUIVOS EM ${branch}`;
}

type BatchRow = Readonly<{
  id: string;
  baseCommitSha: string;
  status: string;
  expiresAt: number;
  publishedCommitSha: string | null;
  publishedCommitUrl: string | null;
}>;

type StagedRow = Readonly<{
  destination: string;
  mimeType: string;
  size: number;
  blobSha: string | null;
}>;

const SEMESTER_ROOT = /^DSM[1-6]$/;

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function failure(
  destination: string,
  reason: PublicationFailureReason,
): PublicationError {
  return { destination, reason };
}

type HeadTree = Readonly<{
  paths: ReadonlySet<string>;
  hasRoot: (root: string) => boolean;
}>;

function treeOf(entries: readonly GitTreeEntry[]): HeadTree {
  const paths = new Set<string>();
  for (const entry of entries) paths.add(entry.path);
  return {
    paths,
    hasRoot(root) {
      for (const path of paths) {
        if (path === root || path.startsWith(`${root}/`)) return true;
      }
      return false;
    },
  };
}

function disciplineRoot(destination: string): string | null {
  const segments = destination.split("/");
  if (segments.length < 3) return null;
  if (!SEMESTER_ROOT.test(segments[0] ?? "")) return null;
  return `${segments[0]}/${segments[1]}`;
}

function emptyReview(
  batchId: string,
  branch: string,
  error: PublicationError,
): BatchReview {
  return {
    batchId,
    baseCommitSha: "",
    branch,
    fileCount: 0,
    files: [],
    errors: [error],
    confirmationPhrase: confirmationPhrase(0, branch),
  };
}

export function createPublicationWorkflow(
  dependencies: PublicationWorkflowDependencies,
): PublicationWorkflow {
  const query = dependencies.query;
  const source = dependencies.source;
  const branch = dependencies.branch ?? DEFAULT_PUBLICATION_BRANCH;
  const ref = `heads/${branch}`;
  const now = dependencies.now ?? Date.now;

  async function loadBatch(batchId: string): Promise<BatchRow | null> {
    const rows = await query(
      `SELECT id, base_commit_sha, status, expires_at, published_commit_sha, published_commit_url
         FROM upload_batch WHERE id = $1`,
      [batchId],
    );
    const row = rows[0];
    if (!row) return null;
    const rawExpiry = row["expires_at"]; const expiresAt = rawExpiry instanceof Date ? rawExpiry.getTime() : Date.parse(asString(rawExpiry) ?? "");
    return {
      id: asString(row["id"]) ?? batchId,
      baseCommitSha: asString(row["base_commit_sha"]) ?? "",
      status: asString(row["status"]) ?? "draft",
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
      publishedCommitSha: asString(row["published_commit_sha"]),
      publishedCommitUrl: asString(row["published_commit_url"]),
    };
  }

  async function loadStaged(batchId: string): Promise<StagedRow[]> {
    const rows = await query(
      `SELECT destination, mime_type, size, blob_sha FROM staged_upload_file
        WHERE batch_id = $1 ORDER BY destination`,
      [batchId],
    );
    return rows.map((row) => ({
      destination: asString(row["destination"]) ?? "",
      mimeType: asString(row["mime_type"]) ?? "",
      size: asInteger(row["size"]) ?? -1,
      blobSha: asString(row["blob_sha"]),
    }));
  }

  function evaluate(
    rows: readonly StagedRow[],
    tree: HeadTree,
  ): { files: ProposedFile[]; errors: PublicationError[] } {
    const errors: PublicationError[] = [];
    const files: ProposedFile[] = [];
    const validation = validateUploadBatch(
      rows.map((row) => ({
        destination: row.destination,
        mimeType: row.mimeType,
        size: row.size,
      })),
    );
    if (!validation.ok) {
      for (const rejection of validation.rejections) {
        const reason: PublicationFailureReason =
          rejection.reason === "file-too-large"
            ? "file-too-large"
            : rejection.reason === "empty-batch"
              ? "empty-batch"
              : "invalid-destination";
        errors.push(failure(rejection.destination, reason));
      }
      return { files, errors };
    }
    if (validation.totalBytes > MAX_BATCH_BYTES) {
      errors.push(failure("", "batch-too-large"));
      return { files, errors };
    }
    for (const row of rows) {
      if (!row.blobSha) {
        errors.push(failure(row.destination, "missing-blob"));
        continue;
      }
      const root = disciplineRoot(row.destination);
      if (root === null) {
        errors.push(failure(row.destination, "unknown-root"));
        continue;
      }
      if (!tree.hasRoot(root)) {
        errors.push(failure(row.destination, "unknown-root"));
        continue;
      }
      files.push({
        destination: row.destination,
        size: row.size,
        mimeType: row.mimeType,
        blobSha: row.blobSha,
        collidesWithHead: tree.paths.has(row.destination),
      });
    }
    return { files, errors };
  }

  async function reviewTree(
    commitSha: string,
  ): Promise<HeadTree | null> {
    try {
      return treeOf(await source.readTree(commitSha));
    } catch {
      return null;
    }
  }

  async function reviseBatch(
    batchId: string,
    revisions: readonly FileRevision[],
  ): Promise<BatchReview> {
    const batch = await loadBatch(batchId);
    if (!batch) {
      return emptyReview(batchId, branch, failure("", "batch-not-found"));
    }
    if (batch.status === "published") {
      return emptyReview(batchId, branch, failure("", "already-published"));
    }
    if (batch.status !== "draft" && batch.status !== "ready") {
      return emptyReview(batchId, branch, failure("", "batch-not-draft"));
    }
    if (batch.expiresAt <= now()) {
      return emptyReview(batchId, branch, failure("", "batch-expired"));
    }

    const rows = await loadStaged(batchId);
    const applied = applyRevisions(rows, revisions);
    const head = await source.readRef(ref).catch(() => null);
    if (head === null) {
      return emptyReview(batchId, branch, failure("", "github-failure"));
    }
    const tree = await reviewTree(head);
    if (tree === null) {
      return emptyReview(batchId, branch, failure("", "github-failure"));
    }
    const { files, errors } = evaluate(applied.rows, tree);
    if (applied.errors.length > 0 || errors.length > 0) {
      return {
        batchId,
        baseCommitSha: head,
        branch,
        fileCount: files.length,
        files,
        errors: [...applied.errors, ...errors],
        confirmationPhrase: confirmationPhrase(files.length, branch),
      };
    }
    if (applied.renames.length > 0) {
      await query(`SELECT rename_upload_batch_files($1, $2::jsonb)`, [
        batchId,
        JSON.stringify(applied.renames),
      ]);
    }
    return {
      batchId,
      baseCommitSha: head,
      branch,
      fileCount: files.length,
      files,
      errors,
      confirmationPhrase: confirmationPhrase(files.length, branch),
    };
  }

  async function publishBatch(
    batchId: string,
    baseCommitSha: string,
    confirmation: string,
  ): Promise<PublishResult> {
    const batch = await loadBatch(batchId);
    if (!batch) {
      return { type: "rejected", errors: [failure("", "batch-not-found")] };
    }
    const rows = await loadStaged(batchId);
    const head = await source.readRef(ref).catch(() => null);
    if (head === null) {
      return { type: "rejected", errors: [failure("", "github-failure")] };
    }
    const tree = await reviewTree(head);
    if (tree === null) {
      return { type: "rejected", errors: [failure("", "github-failure")] };
    }
    const { files, errors } = evaluate(rows, tree);
    if (errors.length > 0) return { type: "rejected", errors };

    const phrase = confirmationPhrase(files.length, branch);
    if (confirmation !== phrase) {
      return {
        type: "rejected",
        errors: [failure("", "confirmation-mismatch")],
      };
    }
    if (batch.status === "published") {
      if (!batch.publishedCommitSha || !batch.publishedCommitUrl) {
        return { type: "rejected", errors: [failure("", "already-published")] };
      }
      return {
        type: "published",
        commitSha: batch.publishedCommitSha,
        commitUrl: batch.publishedCommitUrl,
      };
    }
    if (batch.status !== "draft" && batch.status !== "ready") {
      return { type: "rejected", errors: [failure("", "batch-not-draft")] };
    }
    if (batch.expiresAt <= now()) {
      return { type: "rejected", errors: [failure("", "batch-expired")] };
    }
    if (head !== baseCommitSha) {
      return { type: "conflict", currentHead: head };
    }

    const entries: readonly TreeEntryInput[] = files.map((file) => ({
      path: file.destination,
      mode: "100644",
      type: "blob",
      sha: file.blobSha,
    }));
    let commit: Readonly<{ sha: string; url: string }>;
    try {
      const baseTreeSha = await source.readTreeSha(baseCommitSha);
      const treeSha = await source.createTree(entries, baseTreeSha);
      commit = await source.createCommit({
        message: `chore(materiais): publica ${files.length} arquivo(s) revisado(s)`,
        treeSha,
        parents: [baseCommitSha],
      });
    } catch {
      // Blobs, trees and commits created so far are unreachable objects; the
      // branch ref still points at baseCommitSha, so nothing becomes visible.
      return { type: "rejected", errors: [failure("", "github-failure")] };
    }
    try {
      const moved = await source.updateRef(ref, commit.sha);
      if (!moved) {
        const currentHead = await source.readRef(ref).catch(() => head);
        return { type: "conflict", currentHead };
      }
    } catch {
      return { type: "rejected", errors: [failure("", "github-failure")] };
    }

    const updated = await query(
      `UPDATE upload_batch
          SET status = 'published', published_commit_sha = $2,
              published_commit_url = $3, published_at = now()
        WHERE id = $1 AND status <> 'published'
        RETURNING published_commit_sha, published_commit_url`,
      [batchId, commit.sha, commit.url],
    );
    const stored = updated[0];
    return {
      type: "published",
      commitSha: asString(stored?.["published_commit_sha"]) ?? commit.sha,
      commitUrl: asString(stored?.["published_commit_url"]) ?? commit.url,
    };
  }

  return { reviseBatch, publishBatch };
}

function applyRevisions(
  rows: readonly StagedRow[],
  revisions: readonly FileRevision[],
): {
  rows: StagedRow[];
  renames: readonly FileRevision[];
  errors: PublicationError[];
} {
  if (revisions.length === 0) return { rows: [...rows], renames: [], errors: [] };
  const errors: PublicationError[] = [];
  const byDestination = new Map(rows.map((row) => [row.destination, row]));
  const targets = new Map<string, string>();
  for (const row of rows) targets.set(row.destination.toLowerCase(), row.destination);
  const renames: FileRevision[] = [];
  const renamed = new Map<string, StagedRow>();
  for (const revision of revisions) {
    const row = byDestination.get(revision.destination);
    if (!row) {
      errors.push(failure(revision.destination, "unknown-revision-target"));
      continue;
    }
    const target = revision.newDestination.trim();
    const occupant = targets.get(target.toLowerCase());
    if (occupant && occupant !== revision.destination) {
      errors.push(failure(target, "duplicate-destination"));
      continue;
    }
    targets.delete(revision.destination.toLowerCase());
    targets.set(target.toLowerCase(), target);
    renames.push({ destination: revision.destination, newDestination: target });
    renamed.set(revision.destination, { ...row, destination: target });
  }
  if (errors.length > 0) return { rows: [...rows], renames: [], errors };
  return {
    rows: rows.map((row) => renamed.get(row.destination) ?? row),
    renames,
    errors,
  };
}

export type PublicationHandlerDependencies = Readonly<{
  requireAdmin: (request: Request) => Promise<{ adminId: string }>;
  query: PublicationQuery;
  source: GitHubMaterialSource;
  branch?: string;
  now?: () => number;
  audit?: () => Promise<void>;
}>;

function json(status: number, body: unknown): Response {
  return Response.json(body, { status });
}

async function authorizeBatch(
  dependencies: PublicationHandlerDependencies,
  request: Request,
  batchId: string,
): Promise<{ adminId: string } | Response> {
  let adminId: string;
  try {
    ({ adminId } = await dependencies.requireAdmin(request));
  } catch (error) {
    if (error instanceof AdminAuthorizationError) return json(403, { error: "Proibido" });
    throw error;
  }
  const rows = await dependencies.query(
    `SELECT owner_admin_id FROM upload_batch WHERE id = $1`,
    [batchId],
  );
  const owner = rows[0]?.["owner_admin_id"];
  if (typeof owner !== "string") return json(404, { error: "batch-not-found" });
  if (owner !== adminId) return json(403, { error: "not-owner" });
  return { adminId };
}

export function createBatchReviewHandler(
  dependencies: PublicationHandlerDependencies,
): (request: Request, batchId: string) => Promise<Response> {
  const workflow = createPublicationWorkflow(dependencies);
  return async function handleBatchReview(request, batchId) {
    const authorization = await authorizeBatch(dependencies, request, batchId);
    if (authorization instanceof Response) return authorization;
    const body =
      request.method === "GET"
        ? null
        : ((await request.json().catch(() => null)) as {
            revisions?: readonly FileRevision[];
          } | null);
    const revisions = Array.isArray(body?.revisions) ? body.revisions : [];
    const review = await workflow.reviseBatch(
      batchId,
      revisions
        .filter(
          (revision): revision is FileRevision =>
            typeof revision?.destination === "string" &&
            typeof revision?.newDestination === "string",
        )
        .map((revision) => ({
          destination: revision.destination,
          newDestination: revision.newDestination,
        })),
    );
    if (review.errors.some((error) => error.reason === "batch-not-found")) {
      return json(404, { error: "batch-not-found" });
    }
    return json(200, review);
  };
}

export function createPublishHandler(
  dependencies: PublicationHandlerDependencies,
): (request: Request, batchId: string) => Promise<Response> {
  const workflow = createPublicationWorkflow(dependencies);
  return async function handlePublish(request, batchId) {
    const authorization = await authorizeBatch(dependencies, request, batchId);
    if (authorization instanceof Response) return authorization;
    const body = (await request.json().catch(() => null)) as {
      baseCommitSha?: unknown;
      confirmation?: unknown;
    } | null;
    const baseCommitSha =
      typeof body?.baseCommitSha === "string" && body.baseCommitSha.length > 0
        ? body.baseCommitSha
        : null;
    if (!baseCommitSha) return json(400, { error: "baseCommitSha" });
    const confirmation =
      typeof body?.confirmation === "string" ? body.confirmation : "";
    const result = await workflow.publishBatch(
      batchId,
      baseCommitSha,
      confirmation,
    );
    if (result.type === "published") {
      await dependencies.audit?.();
      return json(200, result);
    }
    if (result.type === "conflict") return json(409, result);
    return json(400, result);
  };
}
