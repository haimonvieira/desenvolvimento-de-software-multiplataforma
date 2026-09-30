import { describe, expect, it } from "vitest";

import catalog from "../src/generated/catalog.json";
import { createCatalogQuery } from "../src/modules/catalog/catalog-query";
import type { CatalogData } from "../src/modules/catalog/model";
import { createClassifyBatchHandler } from "../src/modules/publication/classify-batch";
import type { GitHubMaterialSource } from "../src/modules/publication/model";
import { createPublicationWorkflow } from "../src/modules/publication/publication-workflow";
import { synchronizeStudy } from "../src/modules/study/synchronize-study";
import type { SyncableStudyWorkspace } from "../src/modules/study/indexed-db-study-store";
import type { RemoteStudyStore } from "../src/modules/study/neon-study-store";
import { createStudySyncHandler } from "../src/modules/study/sync-handler";
import { policyFor } from "../src/modules/tutor/usage-policy";
import type { BudgetDecision, UsageLedger } from "../src/modules/tutor/usage-ledger";

const catalogQuery = createCatalogQuery(catalog as CatalogData);

/** Every GitHub operation fails, as it does during a GitHub outage. */
const unreachableGitHub = new Proxy(
  {},
  {
    get: () => async () => {
      throw new Error("GitHub is unavailable");
    },
  },
) as unknown as GitHubMaterialSource;

function draftBatchQuery() {
  const statements: string[] = [];
  const query = async (text: string): Promise<Record<string, unknown>[]> => {
    statements.push(text.replace(/\s+/g, " ").trim());
    if (text.includes("FROM upload_batch")) {
      return [{
        id: "batch-1",
        base_commit_sha: "a".repeat(40),
        status: "draft",
        expires_at: new Date(Date.now() + 3_600_000).toISOString(),
        published_commit_sha: null,
        published_commit_url: null,
      }];
    }
    if (text.includes("FROM staged_upload_file")) {
      return [{ destination: "DSM1/ALP/aula.pdf", mime_type: "application/pdf", size: 1024, blob_sha: "blob-1" }];
    }
    return [];
  };
  return { query, statements };
}

function ledgerWith(decision: BudgetDecision): UsageLedger {
  return {
    policy: () => policyFor("admin"),
    reserve: async () => decision,
    reconcile: async () => undefined,
    expireStaleReservations: async () => 0,
    readQuota: async () => ({
      scope: "admin",
      enabled: true,
      requestsThisHour: 0,
      requestsPerHour: 10,
      requestsToday: 0,
      requestsPerDay: 60,
      globalTurnsToday: 0,
      globalTurnsPerDay: 100,
      globalTokensToday: 0,
      globalTokensPerDay: 500_000,
      resetsAt: "2026-09-29T00:00:00.000Z",
    }),
    hasSponsoredHistory: async () => true,
  };
}

describe("GitHub unavailable", () => {
  it("blocks publication and leaves the batch in draft without touching the database", async () => {
    const { query, statements } = draftBatchQuery();
    const workflow = createPublicationWorkflow({ query, source: unreachableGitHub, branch: "main" });

    const review = await workflow.reviseBatch("batch-1", []);
    expect(review.errors).toEqual([{ destination: "", reason: "github-failure" }]);

    const result = await workflow.publishBatch("batch-1", "a".repeat(40), "PUBLICAR 1 ARQUIVOS EM main #00000000");
    expect(result).toEqual({ type: "rejected", errors: [{ destination: "", reason: "github-failure" }] });
    // The batch row is only ever flipped to published after the ref moves; a
    // GitHub outage must not reach that statement.
    expect(statements.some((statement) => statement.startsWith("UPDATE upload_batch"))).toBe(false);
    // The catalogue is served from the generated snapshot and never calls
    // GitHub, so the same outage that blocks publication leaves browsing
    // intact: the failure is confined to the publication surface.
    expect(catalogQuery.browse({ semester: "DSM1" }).length).toBeGreaterThan(0);
    expect(catalogQuery.search("logica").items.length).toBeGreaterThan(0);
  });
});

describe("Neon unavailable", () => {
  it("reports a failed sync without discarding local changes", async () => {
    const reconcileCalls: string[] = [];
    const local = {
      pendingSyncRequest: async () => ({
        requestId: "00000000-0000-4000-8000-000000000001",
        deviceId: "00000000-0000-4000-8000-000000000002",
        cursor: "0",
        outbox: [],
      }),
      reconcile: async () => {
        reconcileCalls.push("reconcile");
        throw new Error("unreachable");
      },
    } as unknown as SyncableStudyWorkspace;
    const remote = {
      sync: async () => {
        throw new TypeError("Neon is unavailable");
      },
    } as unknown as RemoteStudyStore;

    await expect(
      synchronizeStudy(local, remote, { deviceId: "device", retryDelaysMs: [0, 0] }),
    ).rejects.toThrow("Neon is unavailable");
    // Reconciliation is what applies the server snapshot; skipping it on
    // failure is what keeps the pending local outbox intact.
    expect(reconcileCalls).toEqual([]);
  });

  it("answers the sync endpoint with a retryable error", async () => {
    const handler = createStudySyncHandler({
      profileId: async () => "profile-1",
      store: () => ({
        sync: async () => {
          throw new Error("Neon is unavailable");
        },
      }) as unknown as RemoteStudyStore,
    });
    const response = await handler(new Request("https://atlas.test/api/study/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        requestId: "00000000-0000-4000-8000-000000000001",
        deviceId: "00000000-0000-4000-8000-000000000002",
        cursor: "0",
        outbox: [],
      }),
    }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Não foi possível sincronizar" });
  });
});

describe("AI unavailable or out of quota", () => {
  it("denies administrative classification without mutating the batch", async () => {
    const statements: string[] = [];
    const query = async (text: string): Promise<Record<string, unknown>[]> => {
      statements.push(text.replace(/\s+/g, " ").trim());
      if (text.includes("FROM upload_batch")) {
        return [{
          id: "batch-1",
          owner_admin_id: "owner",
          status: "draft",
          expires_at: new Date(Date.now() + 3_600_000).toISOString(),
        }];
      }
      if (text.includes("FROM staged_upload_file")) {
        return [{ destination: "DSM1/ALP/aula.ts", mime_type: "text/typescript", size: 1, blob_sha: "blob-1" }];
      }
      return [];
    };
    const classify = createClassifyBatchHandler({
      requireAdmin: async () => ({ adminId: "owner" }),
      query,
      source: { readBlob: async () => new TextEncoder().encode("export const a = 1;") },
      catalog: catalog as CatalogData,
      ai: {
        suggestBatch: async () => {
          throw new Error("the classifier must not run on a denied quota");
        },
      },
      ledger: ledgerWith({ type: "denied", reason: "global", resetsAt: "2026-09-29T00:00:00.000Z" }),
    });

    const response = await classify(
      new Request("https://atlas.test/api/admin/batches/batch-1/classify", { method: "POST" }),
      "batch-1",
    );

    expect(response.status).toBe(429);
    expect(await response.json()).toMatchObject({ error: "quota", reason: "global" });
    expect(statements.some((statement) => /^(UPDATE|INSERT|DELETE)/.test(statement))).toBe(false);
  });
});
