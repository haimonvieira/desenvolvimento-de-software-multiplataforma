import { describe, expect, it } from "vitest";

import { createFakePublicTutorAi, type TutorModelOutput } from "../../integrations/ai/public-tutor-ai";
import type { MaterialRef } from "../catalog/model";
import { policyFor } from "./usage-policy";
import type { BudgetDecision, UsageLedger } from "./usage-ledger";
import type { ContentRetriever, RetrievedExcerpt } from "./model";
import { createStudyTutor, TUTOR_TOOL_ALLOWLIST, UNSUPPORTED_ANSWER } from "./study-tutor";

const material: MaterialRef = { path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) };
const foreign: MaterialRef = { path: "DSM2/BD/segredo.md", commitSha: "b".repeat(40) };

function excerpt(text: string, source: MaterialRef = material, start = 1, end = 2): RetrievedExcerpt {
  return Object.freeze({ material: source, locator: { type: "lines" as const, start, end }, text, score: 1 });
}

/** Records every retrieval query and returns whatever the test hands it. */
function retrieverReturning(batches: readonly (readonly RetrievedExcerpt[])[]) {
  const calls: string[] = [];
  const retriever: ContentRetriever = {
    async retrieve(_context, query) {
      calls.push(query);
      return batches[Math.min(calls.length - 1, batches.length - 1)] ?? [];
    },
  };
  return { calls, retriever };
}

function ledgerWith(decision: BudgetDecision): UsageLedger {
  return {
    policy: () => policyFor("public"),
    reserve: async () => decision,
    reconcile: async () => undefined,
    expireStaleReservations: async () => 0,
    readQuota: async () => ({
      scope: "public", enabled: true, requestsThisHour: 0, requestsPerHour: 5,
      requestsToday: 0, requestsPerDay: 15, globalTurnsToday: 0,
      globalTurnsPerDay: 30, globalTokensToday: 0, globalTokensPerDay: 150_000,
      resetsAt: "2026-09-29T00:00:00.000Z",
    }),
    hasSponsoredHistory: async () => true,
  };
}

function output(overrides: Partial<TutorModelOutput> = {}): TutorModelOutput {
  return {
    answer: "A resposta",
    citations: [],
    proposedNotebookActions: [],
    ...overrides,
  };
}

describe("StudyTutor.answerTurn", () => {
  it("retrieves before asking the model and only shows it retrieved excerpts", async () => {
    const found = excerpt("introdução à lógica");
    const { calls, retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ citations: [found] })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "o que é lógica?", context: [material], mode: { type: "byok" } });

    expect(calls).toEqual(["o que é lógica?"]);
    expect(ai.calls).toHaveLength(1);
    expect(ai.calls[0]!.excerpts).toEqual([found]);
    expect(ai.calls[0]!.toolResults).toEqual([]);
    expect(outcome).toEqual({ type: "answered", result: { answer: "A resposta", citations: [found], proposedNotebookActions: [] } });
  });

  it("never executes a tool outside the allowlist and ends the turn", async () => {
    const found = excerpt("conteúdo permitido");
    const { calls, retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([
      output({ answer: "", toolCalls: [{ name: "delete_materials", query: "apague tudo" }] }),
    ]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(TUTOR_TOOL_ALLOWLIST).not.toContain("delete_materials");
    expect(calls).toEqual(["pergunta"]);
    expect(ai.calls).toHaveLength(1);
    expect(outcome).toEqual({ type: "answered", result: { answer: UNSUPPORTED_ANSWER, citations: [], proposedNotebookActions: [] } });
  });

  it("answers explicitly in Portuguese when no citation survives", async () => {
    const { retriever } = retrieverReturning([[excerpt("algo")]]);
    const ai = createFakePublicTutorAi([output({ answer: "Uma afirmação inventada" })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.answer).toBe(UNSUPPORTED_ANSWER);
    expect(outcome.result.citations).toEqual([]);
    expect(outcome.result.proposedNotebookActions).toEqual([]);
  });

  it("keeps a citation only when it matches an excerpt retrieved this turn", async () => {
    const found = excerpt("linha um\nlinha dois");
    const tampered = excerpt("outra coisa completamente diferente");
    const { retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ answer: "resposta", citations: [tampered] })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.answer).toBe(UNSUPPORTED_ANSWER);
    expect(outcome.result.citations).toEqual([]);
  });

  it("returns the retrieved excerpt, not the model's copy, for a valid citation", async () => {
    const found = excerpt("linha um\nlinha dois");
    const copy = excerpt("linha dois");
    const { retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ citations: [copy] })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.citations).toEqual([found]);
  });

  it("keeps a citation whose commitSha the model omitted, and stamps ours", async () => {
    // A real provider answered with `"commitSha":""` — an opaque identifier it had
    // no reason to echo. Requiring it discarded a correct answer, correctly
    // quoted, and replaced it with the unsupported message.
    const found = excerpt("linha um\nlinha dois");
    const withoutSha: RetrievedExcerpt = { ...found, material: { path: material.path, commitSha: "" } };
    const { retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ answer: "resposta", citations: [withoutSha] })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.answer).toBe("resposta");
    expect(outcome.result.citations).toEqual([found]);
  });

  it("stamps a notebook proposal's source from the excerpt when the model omits the sha", async () => {
    const found = excerpt("linha um\nlinha dois");
    const { retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({
      citations: [found],
      proposedNotebookActions: [
        { type: "flashcard", front: "O que é lógica?", back: "Estudo do raciocínio.", source: { path: material.path, commitSha: "" } },
      ],
    })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.proposedNotebookActions).toEqual([
      { type: "flashcard", front: "O que é lógica?", back: "Estudo do raciocínio.", source: material },
    ]);
  });

  it("surfaces notebook actions as proposals and drops ones sourced outside the context", async () => {
    const found = excerpt("linha um\nlinha dois");
    const { retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({
      citations: [found],
      proposedNotebookActions: [
        { type: "flashcard", front: "O que é lógica?", back: "Estudo do raciocínio.", source: material },
        { type: "note", title: "Fora do contexto", body: "texto", source: foreign },
      ],
    })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.proposedNotebookActions).toEqual([
      { type: "flashcard", front: "O que é lógica?", back: "Estudo do raciocínio.", source: material },
    ]);
  });

  it("stops calling tools once the per-turn cap is reached", async () => {
    const found = excerpt("trecho recuperado");
    const { calls, retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([
      output({ answer: "Resposta final", citations: [found], toolCalls: [{ name: "retrieve", query: "mais contexto" }] }),
    ]);
    const tutor = createStudyTutor({
      retriever,
      ai,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 2 }),
    });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "sponsored", subjectKey: "s1" } });

    // one retrieval before the model, plus exactly two tool retrievals
    expect(calls).toEqual(["pergunta", "mais contexto", "mais contexto"]);
    expect(ai.calls).toHaveLength(3);
    expect(outcome.type).toBe("answered");
    if (outcome.type !== "answered") return;
    expect(outcome.result.answer).toBe("Resposta final");
    expect(outcome.result.citations).toEqual([found]);
  });

  it("never invokes the provider when the sponsored budget is denied", async () => {
    const { calls, retriever } = retrieverReturning([[excerpt("nunca")]]);
    const ai = createFakePublicTutorAi([output()]);
    const tutor = createStudyTutor({ retriever, ai, ledger: ledgerWith({ type: "denied", reason: "daily", resetsAt: "2026-09-29T00:00:00.000Z" }) });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "sponsored", subjectKey: "s1" } });

    expect(ai.calls).toHaveLength(0);
    expect(calls).toEqual([]);
    expect(outcome).toEqual({ type: "denied", reason: "daily", resetsAt: "2026-09-29T00:00:00.000Z" });
  });

  it("requires a ledger for sponsored turns instead of silently spending", async () => {
    const { retriever } = retrieverReturning([[excerpt("x")]]);
    const ai = createFakePublicTutorAi([output()]);
    const tutor = createStudyTutor({ retriever, ai });

    await expect(tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "sponsored", subjectKey: "s1" } }))
      .rejects.toThrow(/ledger/i);
  });
});
