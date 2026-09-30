import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import catalog from "../src/generated/catalog.json";
import { createTutorTurnHandler } from "../src/app/api/tutor/turn/route";
import { createGroqPublicTutorAi, GROQ_BASE_URL, GROQ_PRIMARY_MODEL } from "../src/integrations/ai/groq-public-tutor-ai";
import { createCatalogQuery } from "../src/modules/catalog/catalog-query";
import type { CatalogData, MaterialRef } from "../src/modules/catalog/model";
import { deleteStudyDatabase, createIndexedDbStudyWorkspace } from "../src/modules/study/indexed-db-study-store";
import { applyProposedNotebookAction } from "../src/modules/tutor/notebook";
import { selectTutorContext, tutorCandidates } from "../src/modules/study/tutor-context";
import { createContentRetriever } from "../src/modules/tutor/content-retriever";
import type { MaterialIndex } from "../src/modules/tutor/model";
import { materialHash } from "../src/modules/tutor/model";
import { policyFor } from "../src/modules/tutor/usage-policy";
import { createFakePublicTutorAi } from "../src/integrations/ai/public-tutor-ai";
import type { BudgetDecision, UsageLedger } from "../src/modules/tutor/usage-ledger";

/**
 * The plan's Task 14 step-6 scenarios, exercised end to end against a
 * transport-level Groq fake: the real adapter, the real orchestrator, the real
 * retriever and the real route, with no network, no API key and no database.
 */

const catalogQuery = createCatalogQuery(catalog as CatalogData);
const CANDIDATES = tutorCandidates(catalogQuery.browse({ semester: "DSM1" }));
const STUDY_MATERIAL: MaterialRef = CANDIDATES[0]!;
const QUOTE = "Lógica é o estudo do raciocínio válido.";
const databaseName = "dsm-atlas-tutor-scenarios";

const index: MaterialIndex = Object.freeze({
  material: STUDY_MATERIAL,
  format: "markdown",
  chunks: Object.freeze([
    Object.freeze({ locator: Object.freeze({ type: "lines" as const, start: 1, end: 3 }), hash: "h1", text: QUOTE }),
  ]),
});

const retriever = createContentRetriever({
  fetchAsset: async (url) => (url.includes(materialHash(STUDY_MATERIAL)) ? index : null),
});

afterEach(async () => {
  await deleteStudyDatabase(databaseName);
});

function groqAnswer(content: string, usage = { prompt_tokens: 120, completion_tokens: 40, total_tokens: 160 }) {
  return new Response(JSON.stringify({
    id: "chatcmpl-scenario",
    object: "chat.completion",
    created: 1_700_000_000,
    model: GROQ_PRIMARY_MODEL,
    choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }],
    usage,
  }), { status: 200, headers: { "content-type": "application/json" } });
}

function citation() {
  return { path: STUDY_MATERIAL.path, commitSha: STUDY_MATERIAL.commitSha, locator: { type: "lines", start: 1, end: 3 }, quote: QUOTE };
}

type Recorded = { body: Record<string, unknown>; authorization: string | null };

/** A Groq transport that replays scripted answers and records every request. */
function groqTransport(answers: readonly string[]) {
  const calls: Recorded[] = [];
  let cursor = 0;
  return {
    calls,
    fetchImpl: async (_url: string, init: RequestInit) => {
      calls.push({
        body: JSON.parse(String(init.body)) as Record<string, unknown>,
        authorization: (init.headers as Record<string, string>).authorization ?? null,
      });
      const answer = answers[Math.min(cursor, answers.length - 1)]!;
      cursor += 1;
      return groqAnswer(answer);
    },
  };
}

function scriptedLedger(limit: number) {
  const reservations: string[] = [];
  const ledger: UsageLedger = {
    policy: () => policyFor("public"),
    async reserve(): Promise<BudgetDecision> {
      if (reservations.length >= limit) {
        return { type: "denied", reason: "global", resetsAt: "2026-09-29T00:00:00.000Z" };
      }
      const reservationId = `r${reservations.length + 1}`;
      reservations.push(reservationId);
      return { type: "reserved", reservationId, maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 };
    },
    async reconcile() { /* nothing to settle in a scenario double */ },
    async expireStaleReservations() { return 0; },
    async readQuota() {
      return {
        scope: "public", enabled: true, requestsThisHour: reservations.length, requestsPerHour: 5,
        requestsToday: reservations.length, requestsPerDay: 15, globalTurnsToday: reservations.length,
        globalTurnsPerDay: 30, globalTokensToday: reservations.length * 5_000, globalTokensPerDay: 150_000,
        resetsAt: "2026-09-29T00:00:00.000Z",
      };
    },
    async hasSponsoredHistory() { return reservations.length > 0; },
  };
  return { ledger, reservations };
}

const pageContext = selectTutorContext(CANDIDATES, {
  currentMaterial: STUDY_MATERIAL,
  progress: [], favorites: [], notes: [], flashcards: [],
});

const question = { question: "o que é lógica?", context: pageContext };

describe("Task 14 step-6 study scenarios", () => {
  it("answers a sourced question with a validated citation", async () => {
    const transport = groqTransport([JSON.stringify({ answer: "Lógica estuda o raciocínio válido.", citations: [citation()], proposedNotebookActions: [] })]);
    const { ledger } = scriptedLedger(5);
    const post = createTutorTurnHandler({
      retriever,
      ledger,
      subjectKey: async () => "scenario-subject",
      firstUseGate: async () => true,
      sponsoredAi: createGroqPublicTutorAi({ apiKey: "gsk-scenario", fetchImpl: transport.fetchImpl }),
    });

    const response = await post(new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...question, mode: "sponsored" }),
    }));

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { result: { answer: string; citations: { text: string }[] } };
    expect(payload.result.answer).toBe("Lógica estuda o raciocínio válido.");
    expect(payload.result.citations).toEqual([expect.objectContaining({ text: QUOTE })]);
    // The request reached Groq's real endpoint shape with the study excerpts.
    expect(transport.calls).toHaveLength(1);
    expect(transport.calls[0]!.body.model).toBe(GROQ_PRIMARY_MODEL);
    expect(JSON.stringify(transport.calls[0]!.body)).toContain(QUOTE);
  });

  it("answers explicitly in Portuguese when nothing supports the question", async () => {
    const transport = groqTransport([JSON.stringify({ answer: "Uma afirmação inventada.", citations: [], proposedNotebookActions: [] })]);
    const { ledger } = scriptedLedger(5);
    const post = createTutorTurnHandler({
      retriever,
      ledger,
      subjectKey: async () => "scenario-subject",
      firstUseGate: async () => true,
      sponsoredAi: createGroqPublicTutorAi({ apiKey: "gsk-scenario", fetchImpl: transport.fetchImpl }),
    });

    const response = await post(new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "qual a capital da França?", context: pageContext, mode: "sponsored" }),
    }));

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { result: { answer: string; citations: unknown[] } };
    expect(payload.result.answer).toBe("Não encontrei isso nos materiais.");
    expect(payload.result.citations).toEqual([]);
  });

  it("runs the retrieve tool for an exercise request and returns a flashcard proposal", async () => {
    const first = JSON.stringify({
      answer: "",
      citations: [],
      proposedNotebookActions: [],
      toolCalls: [{ name: "retrieve", query: "exercícios de lógica" }],
    });
    const second = JSON.stringify({
      answer: "Exercício: classifique o argumento abaixo.",
      citations: [citation()],
      proposedNotebookActions: [{ type: "flashcard", front: "O que é lógica?", back: "O estudo do raciocínio válido.", source: STUDY_MATERIAL }],
    });
    const transport = groqTransport([first, second]);
    const { ledger } = scriptedLedger(5);
    const post = createTutorTurnHandler({
      retriever,
      ledger,
      subjectKey: async () => "scenario-subject",
      firstUseGate: async () => true,
      sponsoredAi: createGroqPublicTutorAi({ apiKey: "gsk-scenario", fetchImpl: transport.fetchImpl }),
    });

    const response = await post(new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "me dê um exercício", context: pageContext, mode: "sponsored" }),
    }));

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { result: { proposedNotebookActions: { type: string }[] } };
    expect(transport.calls).toHaveLength(2);
    expect(payload.result.proposedNotebookActions).toEqual([expect.objectContaining({ type: "flashcard" })]);

    // The proposal is inert until the visitor saves it explicitly.
    const workspace = createIndexedDbStudyWorkspace({ databaseName });
    expect((await workspace.load()).flashcards).toEqual([]);
    await applyProposedNotebookAction(workspace, {
      type: "flashcard", front: "O que é lógica?", back: "O estudo do raciocínio válido.", source: STUDY_MATERIAL,
    }, { id: "card-1", at: "2026-09-28T10:00:00.000Z" });
    expect((await workspace.load()).flashcards).toHaveLength(1);
  });

  it("denies the turn once the sponsored quota is hit, without calling the provider", async () => {
    const transport = groqTransport([JSON.stringify({ answer: "resposta", citations: [citation()], proposedNotebookActions: [] })]);
    const { ledger } = scriptedLedger(1);
    const post = createTutorTurnHandler({
      retriever,
      ledger,
      subjectKey: async () => "scenario-subject",
      firstUseGate: async () => true,
      sponsoredAi: createGroqPublicTutorAi({ apiKey: "gsk-scenario", fetchImpl: transport.fetchImpl }),
    });
    const turn = new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...question, mode: "sponsored" }),
    });

    expect((await post(turn.clone())).status).toBe(200);
    const denied = await post(turn.clone());

    expect(denied.status).toBe(429);
    expect(await denied.json()).toEqual({
      error: { code: "QUOTA_DENIED", message: "Sua cota de estudo patrocinado terminou." },
      decision: { reason: "global", resetsAt: "2026-09-29T00:00:00.000Z" },
    });
    expect(transport.calls).toHaveLength(1);
  });

  it("switches to BYOK without touching the sponsored ledger and keeps the key header-only", async () => {
    const visitorKey = "gsk-visitor-own-key";
    const transport = groqTransport([JSON.stringify({ answer: "Resposta com a chave do visitante.", citations: [citation()], proposedNotebookActions: [] })]);
    const { ledger, reservations } = scriptedLedger(5);
    const post = createTutorTurnHandler({
      retriever,
      ledger,
      subjectKey: async () => "scenario-subject",
      firstUseGate: async () => true,
      sponsoredAi: createFakePublicTutorAi([{ answer: "nunca", citations: [], proposedNotebookActions: [] }]),
      byokAi: (key) => createGroqPublicTutorAi({ apiKey: key, fetchImpl: transport.fetchImpl }),
    });

    const response = await post(new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${visitorKey}` },
      body: JSON.stringify({ ...question, mode: "byok" }),
    }));

    expect(response.status).toBe(200);
    expect(reservations).toEqual([]);
    expect(transport.calls[0]!.authorization).toBe(`Bearer ${visitorKey}`);
    expect(JSON.stringify(transport.calls[0]!.body)).not.toContain(visitorKey);
    expect(JSON.stringify(await response.json())).not.toContain(visitorKey);
    // Nothing in the BYOK path persisted the key: the notebook store is empty.
    const workspace = createIndexedDbStudyWorkspace({ databaseName });
    expect(await workspace.load()).toMatchObject({ notes: [], flashcards: [] });
  });

  it("targets Groq's [OI]-compatible endpoint", () => {
    expect(GROQ_BASE_URL).toBe("https://api.groq.com/openai/v1");
  });
});
