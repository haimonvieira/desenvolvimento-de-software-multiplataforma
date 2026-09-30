import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminAuthorizationError } from "../identity/admin-authorizer";
import type {
  GitHubMaterialSource,
  GitTreeEntry,
  TreeEntryInput,
} from "./model";
import { createBatchReviewHandler, createPublishHandler, createPublicationWorkflow } from "./publication-workflow";

const migrationsFolder = fileURLToPath(
  new URL("../../../drizzle/migrations", import.meta.url),
);

const BRANCH = "main";
const REF = "heads/main";
const BASE_FILES: Readonly<Record<string, string>> = {
  "DSM1/ALP/aula-01.md": "aula um",
  "DSM1/ALP/LISTAS/lista-01.pdf": "lista",
  "DSM3/BDNR/scripts/consulta.sql": "select 1",
};

type FakeCommit = {
  sha: string;
  tree: string;
  parents: string[];
  message: string;
};

type FakeGit = GitHubMaterialSource & {
  refs: Map<string, string>;
  commits: Map<string, FakeCommit>;
  trees: Map<string, readonly GitTreeEntry[]>;
  createTreeCalls: Array<{ entries: readonly TreeEntryInput[]; baseTreeSha: string }>;
  createCommitCalls: Array<{ message: string; treeSha: string; parents: readonly string[] }>;
  updateRefCalls: Array<{ ref: string; sha: string }>;
  failTree: boolean;
  failCommit: boolean;
  concurrentOnCommit: boolean;
  throwAfterUpdateRef: boolean;
  head: () => string;
  blobSha: (bytes: Uint8Array) => Promise<string>;
};

function createFakeGit(
  files: Readonly<Record<string, string>> = BASE_FILES,
): FakeGit {
  const blobs = new Map<string, Uint8Array>();
  const trees = new Map<string, readonly GitTreeEntry[]>();
  const commits = new Map<string, FakeCommit>();
  const refs = new Map<string, string>();
  let counter = 0;
  const nextSha = (prefix: string) => `${prefix}-${++counter}`;

  const treeEntries: GitTreeEntry[] = [];
  const encoder = new TextEncoder();
  for (const [path, content] of Object.entries(files)) {
    const sha = nextSha("blob");
    blobs.set(sha, encoder.encode(content));
    treeEntries.push({ path, sha, type: "blob" });
  }
  for (const root of ["DSM1/ALP", "DSM3/BDNR"]) {
    treeEntries.push({ path: root, sha: nextSha("tree"), type: "tree" });
  }
  const rootTree = nextSha("tree");
  trees.set(rootTree, treeEntries);
  const rootCommit = nextSha("commit");
  commits.set(rootCommit, {
    sha: rootCommit,
    tree: rootTree,
    parents: [],
    message: "initial",
  });
  refs.set(REF, rootCommit);

  const fake: FakeGit = {
    refs,
    commits,
    trees,
    createTreeCalls: [],
    createCommitCalls: [],
    updateRefCalls: [],
    failTree: false,
    failCommit: false,
    concurrentOnCommit: false,
    throwAfterUpdateRef: false,
    head: () => refs.get(REF) as string,
    blobSha: async (bytes) => fake.createBlob(bytes),
    async readHead() {
      return refs.get(REF) as string;
    },
    async readTree(commitSha) {
      return trees.get((commits.get(commitSha) as FakeCommit).tree) ?? [];
    },
    async readTreeSha(commitSha) {
      return (commits.get(commitSha) as FakeCommit).tree;
    },
    async readBlob(blobSha) {
      const bytes = blobs.get(blobSha);
      if (!bytes) throw new Error(`missing blob ${blobSha}`);
      return bytes;
    },
    async createBlob(bytes) {
      const sha = nextSha("blob");
      blobs.set(sha, bytes);
      return sha;
    },
    async createTree(entries, baseTreeSha) {
      fake.createTreeCalls.push({ entries, baseTreeSha });
      if (fake.failTree) throw new Error("tree creation failed");
      const merged = new Map<string, GitTreeEntry>();
      for (const entry of trees.get(baseTreeSha) ?? []) merged.set(entry.path, entry);
      for (const entry of entries) {
        merged.set(entry.path, { path: entry.path, sha: entry.sha, type: entry.type });
      }
      const sha = nextSha("tree");
      trees.set(sha, [...merged.values()]);
      return sha;
    },
    async createCommit(input) {
      fake.createCommitCalls.push(input);
      if (fake.failCommit) throw new Error("commit creation failed");
      const sha = nextSha("commit");
      commits.set(sha, {
        sha,
        tree: input.treeSha,
        parents: [...input.parents],
        message: input.message,
      });
      if (fake.concurrentOnCommit) {
        const concurrent = nextSha("commit");
        commits.set(concurrent, {
          sha: concurrent,
          tree: input.treeSha,
          parents: [refs.get(REF) as string],
          message: "concurrent",
        });
        refs.set(REF, concurrent);
      }
      return { sha, url: `https://github.example/commit/${sha}` };
    },
    async readRef(ref) {
      const sha = refs.get(ref);
      if (!sha) throw new Error(`missing ref ${ref}`);
      return sha;
    },
    async updateRef(ref, sha) {
      fake.updateRefCalls.push({ ref, sha });
      const current = refs.get(ref);
      const commit = commits.get(sha);
      if (!commit || !current || commit.parents[0] !== current) return false;
      refs.set(ref, sha);
      if (fake.throwAfterUpdateRef) throw new Error("ref response lost");
      return true;
    },
  };
  return fake;
}

let database: PGlite;

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
  await database.exec(`
    INSERT INTO "user" (id, name, email) VALUES ('owner', 'Owner', 'owner@example.test');
    INSERT INTO admin_identity (admin_id, github_user_id) VALUES ('owner', '12345678');
  `);
});

afterEach(async () => {
  await database.close();
});

function query(text: string, params: readonly unknown[]) {
  return database
    .query(text, [...params])
    .then((result) => result.rows as Record<string, unknown>[]);
}

async function seedBatch(
  git: FakeGit,
  options: {
    id?: string;
    status?: string;
    base?: string;
    owner?: string;
    files: ReadonlyArray<{
      destination: string;
      size?: number;
      mimeType?: string;
      blobSha?: string | null;
    }>;
  },
) {
  const id = options.id ?? "batch-1";
  const base = options.base ?? git.head();
  const expiresAt = new Date(Date.now() + 3_600_000).toISOString();
  const total = options.files.reduce((sum, file) => sum + (file.size ?? 1024), 0);
  await query(
    `INSERT INTO upload_batch (id, base_commit_sha, owner_admin_id, status, total_bytes, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, base, options.owner ?? "owner", options.status ?? "draft", total, expiresAt],
  );
  for (const file of options.files) {
    await query(
      `INSERT INTO staged_upload_file (batch_id, destination, mime_type, size, blob_sha)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, file.destination, file.mimeType ?? "application/pdf", file.size ?? 1024, file.blobSha ?? null],
    );
  }
  return { id, base };
}

async function staged(git: FakeGit, destination: string, size = 1024) {
  const blobSha = await git.blobSha(new TextEncoder().encode(destination));
  return { destination, size, mimeType: "application/pdf", blobSha };
}

function workflow(git: FakeGit) {
  return createPublicationWorkflow({
    query,
    source: git,
    branch: BRANCH,
  });
}

describe("atomic batch publication", () => {
  it("publishes every staged file in one new tree and one commit", async () => {
    const git = createFakeGit();
    const files = [
      await staged(git, "DSM1/ALP/novo-a.pdf"),
      await staged(git, "DSM1/ALP/novo-b.pdf"),
      await staged(git, "DSM3/BDNR/scripts/novo-c.pdf"),
    ];
    await seedBatch(git, { files });

    const review = await workflow(git).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);
    expect(review.baseCommitSha).toBe(git.head());
    expect(review.confirmationPhrase).toMatch(/^PUBLICAR 3 ARQUIVOS EM main #[0-9a-f]{8}$/);
    expect(review.files.map((file) => file.destination)).toEqual([
      "DSM1/ALP/novo-a.pdf",
      "DSM1/ALP/novo-b.pdf",
      "DSM3/BDNR/scripts/novo-c.pdf",
    ]);

    const result = await workflow(git).publishBatch(
      "batch-1",
      review.baseCommitSha,
      review.confirmationPhrase,
    );

    expect(result).toMatchObject({ type: "published" });
    if (result.type !== "published") throw new Error("expected published");
    expect(result.commitUrl).toContain(result.commitSha);
    expect(git.createTreeCalls).toHaveLength(1);
    expect(git.createCommitCalls).toHaveLength(1);
    expect(git.updateRefCalls).toHaveLength(1);
    expect(git.createCommitCalls[0].parents).toEqual([review.baseCommitSha]);
    const commit = git.commits.get(result.commitSha);
    const paths = (git.trees.get(commit?.tree ?? "") ?? []).map((entry) => entry.path);
    for (const file of files) expect(paths).toContain(file.destination);
    expect(paths).toContain("DSM1/ALP/aula-01.md");
    expect(git.refs.get(REF)).toBe(result.commitSha);
  });

  it("rejects a staged file without a blob before any Git write", async () => {
    const git = createFakeGit();
    await seedBatch(git, {
      files: [{ destination: "DSM1/ALP/pendente.pdf", blobSha: null }],
    });

    const result = await workflow(git).publishBatch(
      "batch-1",
      git.head(),
      "PUBLICAR 0 ARQUIVOS EM main #00000000",
    );

    expect(result).toMatchObject({ type: "rejected" });
    if (result.type !== "rejected") throw new Error("expected rejected");
    expect(result.errors[0]?.reason).toBe("missing-blob");
    expect(git.createTreeCalls).toHaveLength(0);
    expect(git.createCommitCalls).toHaveLength(0);
    expect(git.updateRefCalls).toHaveLength(0);
    expect(git.refs.get(REF)).toBe(git.head());
  });

  it("rejects destinations outside an existing DSM discipline root", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM9/ZZZ/novo.pdf")];
    await seedBatch(git, { files });

    const review = await workflow(git).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([
      { destination: "DSM9/ZZZ/novo.pdf", reason: "unknown-root" },
    ]);

    const result = await workflow(git).publishBatch(
      "batch-1",
      git.head(),
      review.confirmationPhrase,
    );
    expect(result).toMatchObject({ type: "rejected" });
    expect(git.updateRefCalls).toHaveLength(0);
  });

  it("returns conflict when the branch moved after the review without writing", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo.pdf")];
    await seedBatch(git, { files });
    const reviewed = git.head();
    const moved = await git.createCommit({
      message: "concurrent",
      treeSha: await git.readTreeSha(reviewed),
      parents: [reviewed],
    });
    git.refs.set(REF, moved.sha);
    const review = await workflow(git).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);

    const result = await workflow(git).publishBatch(
      "batch-1",
      reviewed,
      review.confirmationPhrase,
    );

    expect(result).toEqual({ type: "conflict", currentHead: moved.sha });
    expect(git.createTreeCalls).toHaveLength(0);
    // One commit exists from moving the ref in the test setup; publishBatch
    // itself must not create another one.
    expect(git.createCommitCalls).toHaveLength(1);
    expect(git.updateRefCalls).toHaveLength(0);
    expect(git.refs.get(REF)).toBe(moved.sha);
  });

  it("detects a concurrent commit at ref update time and never overwrites it", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo.pdf")];
    await seedBatch(git, { files });
    git.concurrentOnCommit = true;
    const review = await workflow(git).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);

    const result = await workflow(git).publishBatch(
      "batch-1",
      git.head(),
      review.confirmationPhrase,
    );

    expect(result).toMatchObject({ type: "conflict" });
    if (result.type !== "conflict") throw new Error("expected conflict");
    const concurrent = git.refs.get(REF) as string;
    expect(result.currentHead).toBe(concurrent);
    expect(concurrent).not.toBe(git.createCommitCalls.length ? git.commits.get("commit-3")?.sha : "");
    expect(git.updateRefCalls).toHaveLength(1);
    expect(git.updateRefCalls[0].sha).not.toBe(concurrent);
    expect(git.commits.get(concurrent)?.message).toBe("concurrent");
  });

  it("publishes and audits when the ref PATCH applies but its response is lost", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });
    git.throwAfterUpdateRef = true;
    const audits: string[] = [];
    const handler = createPublishHandler({
      requireAdmin: async () => ({ adminId: "owner" }),
      query,
      source: git,
      branch: BRANCH,
      audit: async () => {
        audits.push("published");
      },
    });
    const review = await createPublicationWorkflow({ query, source: git, branch: BRANCH }).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);

    const published = await handler(
      new Request("https://atlas.example/api/admin/batches/batch-1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ baseCommitSha: review.baseCommitSha, confirmation: review.confirmationPhrase }),
      }),
      "batch-1",
    );

    expect(published.status).toBe(200);
    const body = await published.json() as { type: string; commitSha: string };
    expect(body.type).toBe("published");
    // The commit is live on the branch; a re-read confirms it and the batch is
    // marked published instead of staying draft with a duplicate on retry.
    expect(git.refs.get(REF)).toBe(body.commitSha);
    expect(audits).toEqual(["published"]);
    expect((await query(`SELECT status FROM upload_batch WHERE id = $1`, ["batch-1"]))[0]?.status).toBe("published");
    expect(git.createCommitCalls).toHaveLength(1);
  });

  it("leaves the branch ref untouched when tree creation fails", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo.pdf")];
    await seedBatch(git, { files });
    const before = git.head();
    git.failTree = true;
    const review = await workflow(git).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);

    const result = await workflow(git).publishBatch(
      "batch-1",
      before,
      review.confirmationPhrase,
    );

    expect(result).toMatchObject({ type: "rejected" });
    if (result.type !== "rejected") throw new Error("expected rejected");
    expect(result.errors[0]?.reason).toBe("github-failure");
    expect(git.createCommitCalls).toHaveLength(0);
    expect(git.updateRefCalls).toHaveLength(0);
    expect(git.refs.get(REF)).toBe(before);
  });

  it("leaves the branch ref untouched when commit creation fails", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo.pdf")];
    await seedBatch(git, { files });
    const before = git.head();
    git.failCommit = true;
    const review = await workflow(git).reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);

    const result = await workflow(git).publishBatch(
      "batch-1",
      before,
      review.confirmationPhrase,
    );

    expect(result).toMatchObject({ type: "rejected" });
    expect(git.updateRefCalls).toHaveLength(0);
    expect(git.refs.get(REF)).toBe(before);
  });

  it("replays the same confirmation idempotently", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo.pdf")];
    await seedBatch(git, { files });
    const run = workflow(git);
    const base = git.head();
    const review = await run.reviseBatch("batch-1", []);
    expect(review.errors).toEqual([]);
    const phrase = review.confirmationPhrase;

    const first = await run.publishBatch("batch-1", base, phrase);
    const second = await run.publishBatch("batch-1", base, phrase);

    expect(first).toEqual(second);
    expect(git.createCommitCalls).toHaveLength(1);
    expect(git.updateRefCalls).toHaveLength(1);
    const rows = await query(`SELECT status, published_commit_sha FROM upload_batch WHERE id = $1`, [
      "batch-1",
    ]);
    expect(rows[0]?.["status"]).toBe("published");
    expect(rows[0]?.["published_commit_sha"]).toBe(
      first.type === "published" ? first.commitSha : null,
    );
  });

  it("invalidates a prior confirmation once the reviewed batch changes", async () => {
    const git = createFakeGit();
    const files = [
      await staged(git, "DSM1/ALP/novo-a.pdf"),
      await staged(git, "DSM1/ALP/novo-b.pdf"),
    ];
    await seedBatch(git, { files });
    const base = git.head();
    const before = await workflow(git).reviseBatch("batch-1", []);
    expect(before.errors).toEqual([]);
    const stale = before.confirmationPhrase;

    await query(
      `INSERT INTO staged_upload_file (batch_id, destination, mime_type, size, blob_sha)
       VALUES ('batch-1', 'DSM1/ALP/novo-c.pdf', 'application/pdf', 1024, $1)`,
      [await git.blobSha(new TextEncoder().encode("novo-c"))],
    );

    const rejected = await workflow(git).publishBatch("batch-1", base, stale);
    expect(rejected).toMatchObject({ type: "rejected" });
    if (rejected.type !== "rejected") throw new Error("expected rejected");
    expect(rejected.errors[0]?.reason).toBe("confirmation-mismatch");
    expect(git.updateRefCalls).toHaveLength(0);

    const fresh = await workflow(git).reviseBatch("batch-1", []);
    expect(fresh.errors).toEqual([]);
    const published = await workflow(git).publishBatch(
      "batch-1",
      base,
      fresh.confirmationPhrase,
    );
    expect(published).toMatchObject({ type: "published" });
  });

  it("rejects a same-count substitution that changes reviewed content", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo-a.pdf")];
    await seedBatch(git, { files });
    const base = git.head();
    const before = await workflow(git).reviseBatch("batch-1", []);
    expect(before.errors).toEqual([]);
    const stale = before.confirmationPhrase;

    await query(`DELETE FROM staged_upload_file WHERE batch_id = 'batch-1'`, []);
    await query(
      `INSERT INTO staged_upload_file (batch_id, destination, mime_type, size, blob_sha)
       VALUES ('batch-1', 'DSM1/ALP/novo-b.pdf', 'application/pdf', 1024, $1)`,
      [await git.blobSha(new TextEncoder().encode("novo-b"))],
    );

    const rejected = await workflow(git).publishBatch("batch-1", base, stale);
    expect(rejected).toMatchObject({ type: "rejected" });
    if (rejected.type !== "rejected") throw new Error("expected rejected");
    expect(rejected.errors[0]?.reason).toBe("confirmation-mismatch");
    expect(git.updateRefCalls).toHaveLength(0);

    const fresh = await workflow(git).reviseBatch("batch-1", []);
    expect(fresh.errors).toEqual([]);
    expect(fresh.confirmationPhrase).not.toBe(stale);
    const published = await workflow(git).publishBatch(
      "batch-1",
      base,
      fresh.confirmationPhrase,
    );
    expect(published).toMatchObject({ type: "published" });
  });

  it("rejects a confirmation naming another branch", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/novo.pdf")];
    await seedBatch(git, { files });

    const result = await workflow(git).publishBatch(
      "batch-1",
      git.head(),
      "PUBLICAR 1 ARQUIVOS EM preview #00000000",
    );

    expect(result).toMatchObject({ type: "rejected" });
    if (result.type !== "rejected") throw new Error("expected rejected");
    expect(result.errors[0]?.reason).toBe("confirmation-mismatch");
  });
});

describe("batch revision and logical diff", () => {
  it("renames staged destinations, reports collisions and persists the review", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/rascunho.pdf")];
    await seedBatch(git, { files });

    const review = await workflow(git).reviseBatch("batch-1", [
      { destination: "DSM1/ALP/rascunho.pdf", newDestination: "DSM1/ALP/apostila.pdf" },
    ]);

    expect(review.errors).toEqual([]);
    expect(review.files).toEqual([
      expect.objectContaining({
        destination: "DSM1/ALP/apostila.pdf",
        size: 1024,
        collidesWithHead: false,
      }),
    ]);
    expect(review.confirmationPhrase).toMatch(/^PUBLICAR 1 ARQUIVOS EM main #[0-9a-f]{8}$/);
    const rows = await query(`SELECT destination FROM staged_upload_file WHERE batch_id = $1`, [
      "batch-1",
    ]);
    expect(rows.map((row) => row["destination"])).toEqual(["DSM1/ALP/apostila.pdf"]);
  });

  it("flags a staged destination that overwrites an existing head path", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/aula-01.md")];
    await seedBatch(git, {
      files: [{ ...files[0], mimeType: "text/markdown", size: 512 }],
    });

    const review = await workflow(git).reviseBatch("batch-1", []);

    expect(review.errors).toEqual([]);
    expect(review.files).toEqual([
      expect.objectContaining({
        destination: "DSM1/ALP/aula-01.md",
        collidesWithHead: true,
      }),
    ]);
  });

  it("rejects a revision whose target is outside the existing roots", async () => {
    const git = createFakeGit();
    const files = [await staged(git, "DSM1/ALP/rascunho.pdf")];
    await seedBatch(git, { files });

    const review = await workflow(git).reviseBatch("batch-1", [
      { destination: "DSM1/ALP/rascunho.pdf", newDestination: "DSM9/ZZZ/rascunho.pdf" },
    ]);

    expect(review.errors).toEqual([
      { destination: "DSM9/ZZZ/rascunho.pdf", reason: "unknown-root" },
    ]);
    const rows = await query(`SELECT destination FROM staged_upload_file WHERE batch_id = $1`, [
      "batch-1",
    ]);
    expect(rows.map((row) => row["destination"])).toEqual(["DSM1/ALP/rascunho.pdf"]);
  });

  it("rejects a revision that collides with another staged destination", async () => {
    const git = createFakeGit();
    const files = [
      await staged(git, "DSM1/ALP/a.pdf"),
      await staged(git, "DSM1/ALP/b.pdf"),
    ];
    await seedBatch(git, { files });

    const review = await workflow(git).reviseBatch("batch-1", [
      { destination: "DSM1/ALP/a.pdf", newDestination: "DSM1/ALP/b.pdf" },
    ]);

    expect(review.errors).toEqual([
      { destination: "DSM1/ALP/b.pdf", reason: "duplicate-destination" },
    ]);
  });
});

describe("publication HTTP handlers", () => {
  function deps(git: FakeGit, adminId: string | null) {
    return {
      requireAdmin: async () => {
        if (adminId === null) throw new AdminAuthorizationError();
        return { adminId };
      },
      query,
      source: git,
      branch: BRANCH,
    };
  }

  const request = (body: unknown) =>
    new Request("https://atlas.example/api/admin/batches/batch-1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("reviews a batch owned by the requesting admin", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });

    const response = await createBatchReviewHandler(deps(git, "owner"))(
      new Request("https://atlas.example/api/admin/batches/batch-1"),
      "batch-1",
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      batchId: "batch-1",
      baseCommitSha: git.head(),
      fileCount: 1,
    });
  });

  it("forwards authorization headers on the GET review route", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });
    const seen: Array<string | null> = [];
    const response = await createBatchReviewHandler({
      requireAdmin: async (request) => {
        seen.push(request.headers.get("authorization"));
        return { adminId: "owner" };
      },
      query,
      source: git,
      branch: BRANCH,
    })(
      new Request("https://atlas.example/api/admin/batches/batch-1", {
        headers: { authorization: "Bearer session-token" },
      }),
      "batch-1",
    );

    expect(response.status).toBe(200);
    expect(seen).toEqual(["Bearer session-token"]);
  });

  it("refuses a batch owned by another admin", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });

    const response = await createBatchReviewHandler(deps(git, "intruder"))(
      new Request("https://atlas.example/api/admin/batches/batch-1"),
      "batch-1",
    );

    expect(response.status).toBe(403);
  });

  it("returns 404 for an unknown batch", async () => {
    const git = createFakeGit();
    const response = await createBatchReviewHandler(deps(git, "owner"))(
      new Request("https://atlas.example/api/admin/batches/missing"),
      "missing",
    );
    expect(response.status).toBe(404);
  });

  it("publishes, reports conflicts as 409 and rejections as 400", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });
    const handler = createPublishHandler(deps(git, "owner"));
    const base = git.head();
    expect(base.length).toBeGreaterThan(0);

    const malformed = await handler(request({ baseCommitSha: "stale", confirmation: "x" }), "batch-1");
    expect(malformed.status).toBe(400);

    const review = await createPublicationWorkflow({ query, source: git, branch: BRANCH }).reviseBatch(
      "batch-1",
      [],
    );
    expect(review.errors).toEqual([]);
    const published = await handler(
      request({ baseCommitSha: base, confirmation: review.confirmationPhrase }),
      "batch-1",
    );
    expect(published.status).toBe(200);
    expect(await published.json()).toMatchObject({ type: "published" });

    const other = createFakeGit();
    await seedBatch(other, {
      id: "batch-2",
      files: [await staged(other, "DSM1/ALP/outro.pdf")],
    });
    const otherReview = await createPublicationWorkflow({
      query,
      source: other,
      branch: BRANCH,
    }).reviseBatch("batch-2", []);
    expect(otherReview.errors).toEqual([]);
    const conflicted = await createPublishHandler(deps(other, "owner"))(
      request({
        baseCommitSha: "a".repeat(40),
        confirmation: otherReview.confirmationPhrase,
      }),
      "batch-2",
    );
    expect(conflicted.status).toBe(409);
    expect(await conflicted.json()).toMatchObject({ type: "conflict" });
  });

  it("audits only successful publications, never rejections or conflicts", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });
    const audits: string[] = [];
    const handler = createPublishHandler({
      ...deps(git, "owner"),
      audit: async () => {
        audits.push("published");
      },
    });
    const review = await createPublicationWorkflow({ query, source: git, branch: BRANCH }).reviseBatch(
      "batch-1",
      [],
    );

    const rejected = await handler(
      request({ baseCommitSha: git.head(), confirmation: "wrong phrase" }),
      "batch-1",
    );
    expect(rejected.status).toBe(400);
    expect(audits).toEqual([]);

    const published = await handler(
      request({ baseCommitSha: git.head(), confirmation: review.confirmationPhrase }),
      "batch-1",
    );
    expect(published.status).toBe(200);
    expect(audits).toEqual(["published"]);
  });

  it("still reports the published commit when the post-publish audit fails", async () => {
    const git = createFakeGit();
    await seedBatch(git, { files: [await staged(git, "DSM1/ALP/novo.pdf")] });
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const handler = createPublishHandler({
        ...deps(git, "owner"),
        audit: async () => {
          throw new Error("audit store unavailable");
        },
      });
      const review = await createPublicationWorkflow({
        query,
        source: git,
        branch: BRANCH,
      }).reviseBatch("batch-1", []);

      const response = await handler(
        request({ baseCommitSha: git.head(), confirmation: review.confirmationPhrase }),
        "batch-1",
      );

      expect(response.status).toBe(200);
      const payload = (await response.json()) as {
        type: string;
        commitSha: string;
      };
      expect(payload.type).toBe("published");
      expect(payload.commitSha).toBe(git.refs.get(REF));
      expect(logged).toHaveBeenCalled();
    } finally {
      logged.mockRestore();
    }
  });
});
