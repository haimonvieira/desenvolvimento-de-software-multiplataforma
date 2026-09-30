import { fileURLToPath } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import catalog from "../src/generated/catalog.json";
import { authSchema } from "../src/integrations/neon/schema";
import { createAuthForDatabase } from "../src/modules/identity/auth";
import { AdminAuthorizationError, createAdminAuthorizer, createAdminBootstrapHandler } from "../src/modules/identity/admin-authorizer";
import type { CatalogData } from "../src/modules/catalog/model";
import { createBatchCreateHandler } from "../src/modules/publication/batch-create";
import { createBatchListHandler } from "../src/modules/publication/batch-list";
import { createBlobUploadHandler } from "../src/modules/publication/blob-upload";
import { createClassifyBatchHandler } from "../src/modules/publication/classify-batch";
import type { GitHubMaterialSource } from "../src/modules/publication/model";
import { createBatchReviewHandler, createPublishHandler } from "../src/modules/publication/publication-workflow";
import { MAX_FILE_BYTES } from "../src/modules/publication/validate-upload";
import { policyFor } from "../src/modules/tutor/usage-policy";
import type { UsageLedger } from "../src/modules/tutor/usage-ledger";
import { createTutorTurnHandler } from "../src/app/api/tutor/turn/route";

/**
 * A visitor session never carries an administrative identity: the real
 * `requireAdmin` throws this before any handler reads a request body.
 */
const visitor = async (): Promise<never> => {
  throw new AdminAuthorizationError();
};

type SeamRecorder = Readonly<{
  touched: string[];
  never<T>(name: string): () => Promise<T>;
}>;

/** Records every seam call so a rejected request can be proven to touch nothing. */
function recorder(): SeamRecorder {
  const touched: string[] = [];
  return {
    touched,
    never<T>(name: string): () => Promise<T> {
      return async () => {
        touched.push(name);
        throw new Error(`${name} must not be reached`);
      };
    },
  };
}

/** Every GitHub operation, so a rejected request that reaches GitHub is visible. */
function unreachableSource(record: SeamRecorder): GitHubMaterialSource {
  return new Proxy(
    {},
    {
      get: (_target, property) => record.never(`source.${String(property)}`),
    },
  ) as unknown as GitHubMaterialSource;
}

function jsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function uploadRequest(): Request {
  const form = new FormData();
  form.set("destination", "DSM1/ALP/aula.pdf");
  form.set("file", new File([new Uint8Array(8)], "aula.pdf", { type: "application/pdf" }));
  return new Request("https://atlas.test/api/admin/batches/batch-1/blobs", { method: "POST", body: form });
}

describe("visitor identity never reaches an administrative endpoint", () => {
  it("returns 403 at every admin handler and touches no database or GitHub seam", async () => {
    const record = recorder();
    const query = record.never<Record<string, unknown>[]>("query");
    const source = unreachableSource(record);

    const bootstrap = createAdminBootstrapHandler(
      createAdminAuthorizer({
        configuredOwnerGithubId: "12345",
        session: async () => ({ userId: "visitor", expiresAt: new Date(Date.now() + 60_000) }),
        githubIdentity: async () => null,
        identity: async () => null,
        createIdentity: async () => ({ adminId: "unreachable", created: false }),
        audit: async () => {
          record.touched.push("audit");
        },
      }),
    );
    const batchCreate = createBatchCreateHandler({ requireAdmin: visitor, query });
    const batchList = createBatchListHandler({ requireAdmin: visitor, query });
    const review = createBatchReviewHandler({ requireAdmin: visitor, query, source });
    const publish = createPublishHandler({ requireAdmin: visitor, query, source });
    const blob = createBlobUploadHandler({ requireAdmin: visitor, query, createBlob: record.never("createBlob") });
    const classify = createClassifyBatchHandler({
      requireAdmin: visitor,
      query,
      source: { readBlob: record.never("source.readBlob") },
      catalog: catalog as CatalogData,
      ai: { suggestBatch: record.never("ai.suggestBatch") },
      ledger: {} as UsageLedger,
    });

    const responses = await Promise.all([
      bootstrap(new Request("https://atlas.test/api/admin/bootstrap", { method: "POST" })),
      batchCreate(jsonRequest("https://atlas.test/api/admin/batches", { baseCommitSha: "a".repeat(40), files: [] })),
      batchList(new Request("https://atlas.test/api/admin/batches", { method: "GET" })),
      review(new Request("https://atlas.test/api/admin/batches/batch-1", { method: "GET" }), "batch-1"),
      publish(jsonRequest("https://atlas.test/api/admin/batches/batch-1/publish", { baseCommitSha: "a".repeat(40), confirmation: "x" }), "batch-1"),
      blob(uploadRequest(), "batch-1"),
      classify(new Request("https://atlas.test/api/admin/batches/batch-1/classify", { method: "POST" }), "batch-1"),
    ]);

    expect(responses.map((response) => response.status)).toEqual([403, 403, 403, 403, 403, 403, 403]);
    expect(record.touched).toEqual([]);
  });
});

const migrationsFolder = fileURLToPath(new URL("../drizzle/migrations", import.meta.url));

describe("CSRF and origin allowlist at the auth boundary", () => {
  let database: PGlite;

  beforeEach(async () => {
    database = new PGlite();
    await migrate(drizzle(database), { migrationsFolder });
  });

  afterEach(async () => database.close());

  it("rejects a state-changing request from an untrusted origin and accepts the allowlisted one", async () => {
    const auth = createAuthForDatabase(
      {
        databaseUrl: "unused",
        secret: "a".repeat(32),
        baseUrl: "https://atlas.example",
        rpId: "atlas.example",
        trustedOrigins: ["https://atlas.example"],
      },
      drizzle(database, { schema: authSchema }),
    );
    const signIn = await auth.handler(new Request("https://atlas.example/api/auth/sign-in/anonymous", {
      method: "POST",
      headers: { origin: "https://atlas.example" },
    }));
    expect(signIn.status).toBe(200);
    const cookie = signIn.headers.get("set-cookie")!.split(";")[0];

    // A state-changing request that carries the session cookie is the CSRF
    // case: the origin allowlist must reject the untrusted origin and still
    // accept the configured one.
    const hostile = await auth.handler(new Request("https://atlas.example/api/auth/sign-out", {
      method: "POST",
      headers: { origin: "https://evil.example", cookie },
    }));
    expect(hostile.status).toBe(403);

    const trusted = await auth.handler(new Request("https://atlas.example/api/auth/sign-out", {
      method: "POST",
      headers: { origin: "https://atlas.example", cookie },
    }));
    expect(trusted.status).toBe(200);
  });
});

describe("upload trust boundary at the HTTP handler", () => {
  const BATCH = {
    id: "batch-1",
    owner_admin_id: "admin",
    status: "draft",
    expires_at: new Date(Date.now() + 60_000).toISOString(),
  };

  function handlerFor(staged: Record<string, unknown>) {
    const created: string[] = [];
    const handler = createBlobUploadHandler({
      requireAdmin: async () => ({ adminId: "admin" }),
      query: async (text) => {
        if (text.includes("FROM upload_batch")) return [BATCH];
        if (text.includes("FROM staged_upload_file")) return [staged];
        if (text.includes("SUM(size)")) return [{ used: 0 }];
        return [];
      },
      createBlob: async () => {
        created.push("blob");
        return "sha";
      },
    });
    return { handler, created };
  }

  function upload(destination: string, size: number, type: string): Request {
    const form = new FormData();
    form.set("destination", destination);
    form.set("file", new File([new Uint8Array(size)], destination.split("/").pop()!, { type }));
    return new Request("https://atlas.test/api/admin/batches/batch-1/blobs", { method: "POST", body: form });
  }

  it("rejects path traversal, an executable extension and an oversized file before storing bytes", async () => {
    const traversal = handlerFor({ destination: "../escape.pdf", mime_type: "application/pdf", size: 8, blob_sha: null });
    const traversalResponse = await traversal.handler(upload("../escape.pdf", 8, "application/pdf"), "batch-1");
    expect(traversalResponse.status).toBe(400);
    expect(await traversalResponse.json()).toMatchObject({ error: "validation", rejections: [{ reason: "path-traversal" }] });
    expect(traversal.created).toEqual([]);

    const executable = handlerFor({ destination: "DSM1/ALP/tool.exe", mime_type: "application/octet-stream", size: 8, blob_sha: null });
    const executableResponse = await executable.handler(upload("DSM1/ALP/tool.exe", 8, "application/octet-stream"), "batch-1");
    expect(executableResponse.status).toBe(400);
    expect(await executableResponse.json()).toMatchObject({ error: "validation", rejections: [{ reason: "executable" }] });
    expect(executable.created).toEqual([]);

    const oversized = handlerFor({ destination: "DSM1/ALP/aula.pdf", mime_type: "application/pdf", size: MAX_FILE_BYTES + 1, blob_sha: null });
    const oversizedResponse = await oversized.handler(upload("DSM1/ALP/aula.pdf", MAX_FILE_BYTES + 1, "application/pdf"), "batch-1");
    expect(oversizedResponse.status).toBe(400);
    expect(await oversizedResponse.json()).toMatchObject({ error: "validation", rejections: [{ reason: "file-too-large" }] });
    expect(oversized.created).toEqual([]);
  });

  it("rejects a MIME/extension spoof before storing bytes", async () => {
    // The staged row declares PDF; the uploaded bytes claim HTML.
    const spoof = handlerFor({ destination: "DSM1/ALP/aula.pdf", mime_type: "application/pdf", size: 8, blob_sha: null });
    const response = await spoof.handler(upload("DSM1/ALP/aula.pdf", 8, "text/html"), "batch-1");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "mime-mismatch" });
    expect(spoof.created).toEqual([]);
  });
});

describe("BYOK key never leaves the request", () => {
  const KEY = "sk-visitor-secret-key";
  const material = { path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) };

  it("is not echoed, not logged and never reaches the usage ledger", async () => {
    const ledgerCalls: string[] = [];
    const ledger: UsageLedger = {
      policy: () => policyFor("public"),
      reserve: async () => {
        ledgerCalls.push("reserve");
        throw new Error("a BYOK turn must not reserve sponsored budget");
      },
      reconcile: async () => {
        ledgerCalls.push("reconcile");
      },
      expireStaleReservations: async () => 0,
      readQuota: async () => ({
        scope: "public",
        enabled: true,
        requestsThisHour: 0,
        requestsPerHour: 5,
        requestsToday: 0,
        requestsPerDay: 15,
        globalTurnsToday: 0,
        globalTurnsPerDay: 30,
        globalTokensToday: 0,
        globalTokensPerDay: 150_000,
        resetsAt: "2026-09-29T00:00:00.000Z",
      }),
      hasSponsoredHistory: async () => {
        ledgerCalls.push("hasSponsoredHistory");
        return true;
      },
    };
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);

    try {
      const handler = createTutorTurnHandler({
        retriever: { async retrieve() { return []; } },
        ledger,
        subjectKey: async () => "subject",
        // The provider echoes the key in its failure: it must not survive.
        byokAi: () => ({ async answer() { throw new Error(`provider rejected ${KEY}`); } }),
      });
      const response = await handler(new Request("https://atlas.test/api/tutor/turn", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ question: "o que é lógica?", context: [material], mode: "byok" }),
      }));

      expect(response.status).toBe(502);
      expect(JSON.stringify(await response.json())).not.toContain(KEY);
      expect(ledgerCalls).toEqual([]);
      const logged = [...consoleError.mock.calls, ...consoleWarn.mock.calls, ...consoleLog.mock.calls]
        .flat()
        .map(String)
        .join(" ");
      expect(logged).not.toContain(KEY);
    } finally {
      consoleError.mockRestore();
      consoleWarn.mockRestore();
      consoleLog.mockRestore();
    }
  });
});
