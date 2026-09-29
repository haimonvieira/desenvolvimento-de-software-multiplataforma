import { describe, expect, it } from "vitest";

import type { CatalogData } from "../catalog/model";
import type {
  AdminClassificationFile,
  AdminClassifierAi,
  ClassificationSuggestion,
} from "../../integrations/ai/admin-classifier-ai";
import { createFakeAdminClassifierAi } from "../../integrations/ai/admin-classifier-ai";
import { TutorProviderError } from "../../integrations/ai/public-tutor-ai";
import { AdminAuthorizationError } from "../identity/admin-authorizer";
import type { UsageLedger } from "../tutor/usage-ledger";
import { policyFor } from "../tutor/usage-policy";
import type { UsageScope } from "../tutor/usage-policy";
import {
  buildClassificationInput,
  createClassifyBatchHandler,
  extractBoundedText,
  inferMaterialKind,
  validateSuggestions,
} from "./classify-batch";

const CATALOG: CatalogData = {
  commitSha: "a".repeat(40),
  semesters: [
    { code: "DSM1", name: "1º semestre" },
    { code: "DSM2", name: "2º semestre" },
  ],
  disciplines: [
    { code: "ALP", name: "Algoritmos e Lógica de Programação", semesterCode: "DSM1" },
    { code: "DW2", name: "Desenvolvimento Web II", semesterCode: "DSM2" },
  ],
  materials: [],
};

const encoder = new TextEncoder();

function file(overrides: Partial<AdminClassificationFile> = {}): AdminClassificationFile {
  return {
    blobSha: "blob-a",
    destination: "DSM1/ALP/lista.ts",
    filename: "lista.ts",
    mimeType: "text/typescript",
    size: 42,
    text: "export const soma = 1;",
    ...overrides,
  };
}

function suggestion(overrides: Partial<ClassificationSuggestion> = {}): ClassificationSuggestion {
  return {
    blobSha: "blob-a",
    semesterCode: "DSM1",
    disciplineCode: "ALP",
    relativePath: "DSM1/ALP/lista.ts",
    title: "Lista",
    kind: "code",
    confidence: { semester: 0.9, discipline: 0.8, path: 0.7, title: 0.6, kind: 0.95 },
    ...overrides,
  };
}

describe("classification context", () => {
  it("carries the catalog allowlist and the budget, never the catalog materials", () => {
    const budget = { reservationId: "r", maxInputTokens: 8_000, maxOutputTokens: 2_000, maxToolCalls: 8, deadlineSeconds: 60 };
    const input = buildClassificationInput("batch-1", [file()], CATALOG, budget);

    expect(input.batchId).toBe("batch-1");
    expect(input.budget).toBe(budget);
    expect(input.catalog.semesters).toEqual([{ code: "DSM1", name: "1º semestre" }, { code: "DSM2", name: "2º semestre" }]);
    expect(input.catalog.disciplines).toEqual([
      { code: "ALP", name: "Algoritmos e Lógica de Programação", semesterCode: "DSM1" },
      { code: "DW2", name: "Desenvolvimento Web II", semesterCode: "DSM2" },
    ]);
    expect(input.files).toHaveLength(1);
  });

  it("extracts bounded UTF-8 text and refuses binary formats", () => {
    expect(extractBoundedText(encoder.encode("conteúdo"), "text/markdown", "a.md")).toBe("conteúdo");
    expect(extractBoundedText(encoder.encode("x".repeat(5_000)), "text/plain", "a.txt")).toHaveLength(2_000);
    expect(extractBoundedText(Uint8Array.from([0x50, 0x4b, 0x03, 0x04]), "application/zip", "a.zip")).toBeNull();
    expect(extractBoundedText(Uint8Array.from([0xff, 0xfe, 0x00]), "text/plain", "a.txt")).toBeNull();
    expect(inferMaterialKind("a.zip", "application/zip")).toBe("archive");
    expect(inferMaterialKind("a.ts", "text/typescript")).toBe("code");
    expect(inferMaterialKind("a.pdf", "application/pdf")).toBe("document");
  });
});

describe("suggestion validation", () => {
  it("keeps a catalog-consistent suggestion and preserves the staged destination", () => {
    const [reviewed] = validateSuggestions([suggestion()], { catalog: CATALOG, files: [file()] });

    expect(reviewed).toMatchObject({
      destination: "DSM1/ALP/lista.ts",
      blobSha: "blob-a",
      semesterCode: "DSM1",
      disciplineCode: "ALP",
      relativePath: "DSM1/ALP/lista.ts",
    });
    expect(reviewed!.warning).toBeUndefined();
  });

  it("drops an invented semester and discipline", () => {
    const [reviewed] = validateSuggestions(
      [suggestion({ semesterCode: "DSM9", disciplineCode: "ZZZ", relativePath: "DSM9/ZZZ/x.ts" })],
      { catalog: CATALOG, files: [file()] },
    );

    expect(reviewed).toMatchObject({ semesterCode: null, disciplineCode: null, relativePath: null });
    expect(reviewed!.warning).toContain("descartados");
    expect(reviewed!.confidence.semester).toBe(0);
    expect(reviewed!.confidence.discipline).toBe(0);
    expect(reviewed!.confidence.path).toBe(0);
  });

  it("rejects path traversal and absolute paths", () => {
    for (const relativePath of ["../../etc/passwd", "/etc/passwd", "DSM1/ALP/../../x.ts", "DSM1\\ALP\\x.ts", "DSM1//ALP/x.ts", "DSM1/ALP"]) {
      const [reviewed] = validateSuggestions([suggestion({ relativePath })], { catalog: CATALOG, files: [file()] });
      expect(reviewed!.relativePath, relativePath).toBeNull();
    }
  });

  it("rejects a discipline that does not belong to the suggested semester", () => {
    const [reviewed] = validateSuggestions(
      [suggestion({ semesterCode: "DSM2", disciplineCode: "ALP", relativePath: "DSM2/ALP/x.ts" })],
      { catalog: CATALOG, files: [file()] },
    );

    expect(reviewed).toMatchObject({ semesterCode: "DSM2", disciplineCode: null, relativePath: null });
  });

  it("ignores a suggestion for a blob outside the batch", () => {
    const reviewed = validateSuggestions(
      [suggestion({ blobSha: "foreign-blob" })],
      { catalog: CATALOG, files: [file()] },
    );

    expect(reviewed).toHaveLength(1);
    expect(reviewed[0]!.blobSha).toBe("blob-a");
    expect(reviewed[0]!.semesterCode).toBeNull();
    expect(reviewed[0]!.warning).toContain("sem sugestão");
  });

  it("ignores a suggestion without a blob SHA", () => {
    const reviewed = validateSuggestions(
      [suggestion({ blobSha: "" })],
      { catalog: CATALOG, files: [file()] },
    );

    expect(reviewed).toHaveLength(1);
    expect(reviewed[0]!.warning).toContain("sem sugestão");
  });

  it("clamps confidence outside 0–1", () => {
    const [reviewed] = validateSuggestions(
      [suggestion({ confidence: { semester: 2, discipline: -1, path: Number.NaN, title: 0.5, kind: Number.POSITIVE_INFINITY } })],
      { catalog: CATALOG, files: [file()] },
    );

    expect(reviewed!.confidence).toEqual({ semester: 0, discipline: 0, path: 0, title: 0.5, kind: 0 });
  });

  it("returns a warning and a null destination for an unreadable archive", () => {
    const archive = file({
      blobSha: "blob-zip",
      destination: "DSM2/DW2/pacote.zip",
      filename: "pacote.zip",
      mimeType: "application/zip",
      text: null,
    });
    const [reviewed] = validateSuggestions(
      [suggestion({ blobSha: "blob-zip", semesterCode: "DSM2", disciplineCode: "DW2", relativePath: "DSM2/DW2/pacote.zip", kind: "archive" })],
      { catalog: CATALOG, files: [archive] },
    );

    expect(reviewed).toMatchObject({
      destination: "DSM2/DW2/pacote.zip",
      semesterCode: null,
      disciplineCode: null,
      relativePath: null,
      kind: "archive",
    });
    expect(reviewed!.warning).toContain("não legível");
    expect(reviewed!.confidence).toEqual({ semester: 0, discipline: 0, path: 0, title: 0, kind: 0 });
  });
});

type StagedRow = Record<string, unknown>;

function fakeDatabase(rows: StagedRow[], status = "draft") {
  const statements: string[] = [];
  const query = async (text: string, params: readonly unknown[]): Promise<Record<string, unknown>[]> => {
    statements.push(text);
    if (text.includes("FROM upload_batch")) {
      return [{
        id: params[0],
        owner_admin_id: "owner",
        status,
        expires_at: new Date(Date.now() + 3_600_000).toISOString(),
      }];
    }
    if (text.includes("FROM staged_upload_file")) return rows;
    return [];
  };
  return { query, statements };
}

function fakeLedger(reserves: Array<{ scope: string; subjectKey: string }>): UsageLedger {
  // Only reserve/policy/reconcile are exercised by runSponsoredTurn; the rest
  // are inert doubles.
  return {
    policy: policyFor,
    reserve: async (input: Readonly<{ scope: UsageScope; subjectKey: string }>) => {
      reserves.push({ scope: input.scope, subjectKey: input.subjectKey });
      return { type: "reserved", reservationId: "r1", maxInputTokens: 8_000, maxOutputTokens: 2_000, maxToolCalls: 8 };
    },
    reconcile: async () => undefined,
    expireStaleReservations: async () => 0,
    readQuota: async () => {
      throw new Error("not used");
    },
    hasSponsoredHistory: async () => false,
  } as unknown as UsageLedger;
}

function handler(
  ai: AdminClassifierAi,
  options: { rows: StagedRow[]; blobs?: ReadonlyMap<string, Uint8Array>; reserves?: Array<{ scope: string; subjectKey: string }>; status?: string },
) {
  const database = fakeDatabase(options.rows, options.status);
  const blobs = options.blobs ?? new Map<string, Uint8Array>();
  return {
    database,
    handler: createClassifyBatchHandler({
      requireAdmin: async () => ({ adminId: "owner" }),
      query: database.query,
      source: {
        readBlob: async (blobSha) => {
          const bytes = blobs.get(blobSha);
          if (!bytes) throw new Error(`missing blob ${blobSha}`);
          return bytes;
        },
      },
      catalog: CATALOG,
      ai,
      ledger: fakeLedger(options.reserves ?? []),
    }),
  };
}

const request = () =>
  new Request("https://atlas.example/api/admin/batches/batch-1/classify", { method: "POST" });

describe("classify batch handler", () => {
  it("exercises a mixed batch: obvious source, ambiguous document and unreadable archive", async () => {
    const blobs = new Map<string, Uint8Array>([
      ["blob-source", encoder.encode("export const soma = (a: number, b: number) => a + b;")],
      ["blob-doc", encoder.encode("# Anotações\nConteúdo genérico sobre a disciplina.")],
      ["blob-zip", Uint8Array.from([0x50, 0x4b, 0x03, 0x04, 0x00])],
    ]);
    const rows: StagedRow[] = [
      { destination: "DSM1/ALP/exercicio.ts", mime_type: "text/typescript", size: 50, blob_sha: "blob-source" },
      { destination: "DSM1/ALP/anotacoes.md", mime_type: "text/markdown", size: 40, blob_sha: "blob-doc" },
      { destination: "DSM2/DW2/pacote.zip", mime_type: "application/zip", size: 5, blob_sha: "blob-zip" },
    ];
    const ai = createFakeAdminClassifierAi([[
      suggestion({ blobSha: "blob-source", relativePath: "DSM1/ALP/exercicio.ts", title: "Exercício 1", kind: "code" }),
      suggestion({ blobSha: "blob-doc", semesterCode: "DSM1", disciplineCode: null, relativePath: null, title: "Anotações", kind: "document", confidence: { semester: 0.3, discipline: 0.2, path: 0, title: 0.4, kind: 0.8 } }),
      // A confident guess for a binary the model cannot read: it must be discarded.
      suggestion({ blobSha: "blob-zip", semesterCode: "DSM2", disciplineCode: "DW2", relativePath: "DSM2/DW2/pacote.zip", title: "Pacote", kind: "archive" }),
    ]]);
    const reserves: Array<{ scope: string; subjectKey: string }> = [];
    const { handler: classify, database } = handler(ai, { rows, blobs, reserves });

    const response = await classify(request(), "batch-1");
    const body = (await response.json()) as { batchId: string; suggestions: readonly Record<string, unknown>[] };

    expect(response.status).toBe(200);
    expect(body.batchId).toBe("batch-1");
    expect(body.suggestions).toHaveLength(3);

    const source = body.suggestions.find((entry) => entry["blobSha"] === "blob-source");
    expect(source).toMatchObject({ relativePath: "DSM1/ALP/exercicio.ts", semesterCode: "DSM1", disciplineCode: "ALP" });

    const document = body.suggestions.find((entry) => entry["blobSha"] === "blob-doc");
    expect(document).toMatchObject({ semesterCode: "DSM1", disciplineCode: null, relativePath: null, title: "Anotações" });
    expect((document!["confidence"] as Record<string, number>)["semester"]).toBe(0.3);

    const archive = body.suggestions.find((entry) => entry["blobSha"] === "blob-zip");
    expect(archive).toMatchObject({ relativePath: null, semesterCode: null, disciplineCode: null, kind: "archive" });
    expect(archive!["warning"]).toContain("não legível");

    // The archive never reaches the model as readable text...
    expect(ai.calls[0]!.files.find((entry) => entry.blobSha === "blob-zip")?.text).toBeNull();
    // ...and classification never mutates batch state towards confirmed.
    expect(database.statements.some((statement) => /update\s+upload_batch/i.test(statement))).toBe(false);
    // The reservation runs on the separate admin scope with the admin as subject.
    expect(reserves).toEqual([{ scope: "admin", subjectKey: "owner" }]);
  });

  it("rejects a non-owner without calling the provider", async () => {
    const ai = createFakeAdminClassifierAi([[]]);
    const database = fakeDatabase([{ destination: "DSM1/ALP/a.ts", mime_type: "text/typescript", size: 1, blob_sha: "b" }]);
    const classify = createClassifyBatchHandler({
      requireAdmin: async () => ({ adminId: "intruder" }),
      query: database.query,
      source: { readBlob: async () => encoder.encode("x") },
      catalog: CATALOG,
      ai,
      ledger: fakeLedger([]),
    });

    const response = await classify(request(), "batch-1");

    expect(response.status).toBe(403);
    expect(ai.calls).toHaveLength(0);
  });

  it("maps an authorization failure to 403", async () => {
    const database = fakeDatabase([]);
    const classify = createClassifyBatchHandler({
      requireAdmin: async () => {
        throw new AdminAuthorizationError();
      },
      query: database.query,
      source: { readBlob: async () => encoder.encode("x") },
      catalog: CATALOG,
      ai: createFakeAdminClassifierAi([[]]),
      ledger: fakeLedger([]),
    });

    expect((await classify(request(), "batch-1")).status).toBe(403);
  });

  it("fails closed with a quota response when the provider is rate limited", async () => {
    const rows: StagedRow[] = [{ destination: "DSM1/ALP/a.ts", mime_type: "text/typescript", size: 1, blob_sha: "b" }];
    const blobs = new Map([["b", encoder.encode("x")]]);
    const ai: AdminClassifierAi = {
      suggestBatch: async () => {
        throw new TutorProviderError({ kind: "rate_limited", retryAfterSeconds: 30 });
      },
    };
    const { handler: classify } = handler(ai, { rows, blobs });

    const response = await classify(request(), "batch-1");

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "rate-limited", retryAfterSeconds: 30 });
  });
});
