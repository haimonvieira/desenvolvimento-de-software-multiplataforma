import { describe, expect, it } from "vitest";

import { createFakePublicTutorAi, type PublicTutorAi, type TutorModelOutput } from "../../integrations/ai/public-tutor-ai";
import type { MaterialRef } from "../catalog/model";
import { policyFor } from "./usage-policy";
import type { BudgetDecision, UsageLedger } from "./usage-ledger";
import type { ContentRetriever, RetrievedExcerpt } from "./model";
import { createStudyTutor, TUTOR_TOOL_ALLOWLIST, UNSUPPORTED_ANSWER, type TutorStreamEvent } from "./study-tutor";

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

  it("runs a chat persona with retrieve and ignores a tool outside it", async () => {
    const found = excerpt("conteúdo permitido");
    const { calls, retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([
      output({ answer: "", toolCalls: [{ name: "retrieve", query: "mais contexto" }, { name: "web_search", query: "na internet" }] }),
      output({ answer: "resposta", citations: [found] }),
    ]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" }, persona: "chat" });

    // Only the retrieve call ran; the tool outside the persona's set never
    // reaches the provider as a tool result.
    expect(calls).toEqual(["pergunta", "mais contexto"]);
    expect(ai.calls.flatMap((call) => call.toolResults).map((result) => result.name)).toEqual(["retrieve"]);
    expect(outcome).toEqual({ type: "answered", result: { answer: "resposta", citations: [found], proposedNotebookActions: [] } });
  });

  it("defaults to chat when the turn carries no persona", async () => {
    const found = excerpt("conteúdo permitido");
    const { calls, retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ answer: "", toolCalls: [{ name: "web_search", query: "na internet" }] })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" } });

    expect(calls).toEqual(["pergunta"]);
    expect(ai.calls).toHaveLength(1);
    expect(outcome).toEqual({ type: "answered", result: { answer: UNSUPPORTED_ANSWER, citations: [], proposedNotebookActions: [] } });
  });

  it("passes a bounded history summary to the adapter on agent turns", async () => {
    const found = excerpt("conteúdo permitido");
    const { retriever } = retrieverReturning([[found]]);
    const agentAi = createFakePublicTutorAi([output({ citations: [found] })]);
    const tutor = createStudyTutor({ retriever, ai: agentAi });
    const history = [
      { question: "o que é lógica?", answer: "estudo do raciocínio", paths: [material.path] },
      { question: "e nesse outro capítulo?", answer: "continuação", paths: [material.path, foreign.path] },
    ];

    await tutor.answerTurn({ question: "e nesse outro capítulo?", context: [material], mode: { type: "byok" }, persona: "agent", history });

    expect(agentAi.calls).toHaveLength(1);
    const summary = agentAi.calls[0]!.historySummary;
    expect(summary).toContain("o que é lógica?");
    expect(summary).toContain("nesse outro capítulo");
    expect(summary!.length).toBeLessThanOrEqual(2_000);
  });

  it("truncates history entries and keeps only the last three turns", async () => {
    const found = excerpt("conteúdo permitido");
    const { retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ citations: [found] })]);
    const tutor = createStudyTutor({ retriever, ai });
    const history = Array.from({ length: 5 }, (_, index) => ({
      question: `pergunta ${index} ${"q".repeat(300)}`,
      answer: `resposta ${index} ${"a".repeat(600)}`,
      paths: ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
    }));

    await tutor.answerTurn({ question: "nova", context: [material], mode: { type: "byok" }, persona: "agent", history });

    const summary = ai.calls[0]!.historySummary!;
    expect(summary).not.toContain("pergunta 0");
    expect(summary).not.toContain("pergunta 1");
    expect(summary).toContain("pergunta 2");
    expect(summary).toContain("pergunta 4");
    expect(summary).not.toContain("p6");
    expect(summary.length).toBeLessThanOrEqual(2_000);
  });

  it("ignores history on chat turns, preserving the pre-memory behavior", async () => {
    const found = excerpt("conteúdo permitido");
    const { retriever } = retrieverReturning([[found]]);
    const chatAi = createFakePublicTutorAi([output({ citations: [found] })]);
    const tutor = createStudyTutor({ retriever, ai: chatAi });
    const history = [{ question: "antes", answer: "resposta anterior", paths: [material.path] }];

    await tutor.answerTurn({ question: "agora", context: [material], mode: { type: "byok" }, persona: "chat", history });

    expect(chatAi.calls[0]!.historySummary).toBeNull();
  });

  it("behaves like chat for an agent turn with no capability enabled", async () => {
    const found = excerpt("conteúdo permitido");
    const { calls, retriever } = retrieverReturning([[found]]);
    const ai = createFakePublicTutorAi([output({ answer: "", toolCalls: [{ name: "web_search", query: "na internet" }] })]);
    const tutor = createStudyTutor({ retriever, ai });

    const outcome = await tutor.answerTurn({ question: "pergunta", context: [material], mode: { type: "byok" }, persona: "agent" });

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

describe("StudyTutor.answerTurnStream", () => {
  /** A provider double that replays a scripted stream in the given order. */
  function scriptedStream(
    script: Readonly<{ status?: string; citations?: readonly RetrievedExcerpt[]; tokens?: readonly string[] }>,
    streamed: TutorModelOutput,
  ): PublicTutorAi {
    return {
      async answer() {
        return streamed;
      },
      async answerStream(_input, _budget, onToken, onStatus, onCitations) {
        if (script.status) onStatus?.(script.status);
        if (script.citations) onCitations?.(script.citations);
        for (const token of script.tokens ?? []) onToken(token);
        return { output: streamed, usage: { inputTokens: 1, outputTokens: 1 } };
      },
    };
  }

  async function collect(generator: AsyncGenerator<TutorStreamEvent>): Promise<TutorStreamEvent[]> {
    const events: TutorStreamEvent[] = [];
    for await (const event of generator) events.push(event);
    return events;
  }

  const byok = { type: "byok" as const };

  it("streams the answer only after the citations close and validate", async () => {
    const found = excerpt("linha um\nlinha dois");
    const { retriever } = retrieverReturning([[found]]);
    const ai = scriptedStream({ status: "buscando", citations: [found], tokens: ["A res", "posta"] }, output({ answer: "A resposta", citations: [found] }));
    const tutor = createStudyTutor({ retriever, ai });

    const events = await collect(tutor.answerTurnStream({ question: "pergunta", context: [material], mode: byok }));

    expect(events).toEqual([
      { type: "status", status: "buscando" },
      { type: "answer", delta: "A res" },
      { type: "answer", delta: "posta" },
      { type: "result", result: { answer: "A resposta", citations: [found], proposedNotebookActions: [] } },
    ]);
  });

  it("buffers answer text written before the citations close and releases it once the verdict is positive", async () => {
    const found = excerpt("linha um\nlinha dois");
    const { retriever } = retrieverReturning([[found]]);
    // The model disobeys the order: the answer arrives first, the citations
    // later. Nothing is emitted until the citations close and validate, then
    // the buffered text flushes in order.
    const ai = scriptedStream({ tokens: ["antes", " depois"], citations: [found] }, output({ answer: "antes depois", citations: [found] }));
    const tutor = createStudyTutor({ retriever, ai });

    const events = await collect(tutor.answerTurnStream({ question: "pergunta", context: [material], mode: byok }));

    expect(events).toEqual([
      { type: "answer", delta: "antes" },
      { type: "answer", delta: " depois" },
      { type: "result", result: { answer: "antes depois", citations: [found], proposedNotebookActions: [] } },
    ]);
  });

  it("emits no answer text and degrades to the result alone when the citations never close", async () => {
    const found = excerpt("linha um\nlinha dois");
    const { retriever } = retrieverReturning([[found]]);
    const ai = scriptedStream({ tokens: ["adiantada"] }, output({ answer: "adiantada", citations: [found] }));
    const tutor = createStudyTutor({ retriever, ai });

    const events = await collect(tutor.answerTurnStream({ question: "pergunta", context: [material], mode: byok }));

    expect(events.filter((event) => event.type === "answer")).toEqual([]);
    expect(events).toEqual([
      { type: "result", result: { answer: "adiantada", citations: [found], proposedNotebookActions: [] } },
    ]);
  });

  it("emits no answer text and the unsupported result when the citations do not match the excerpts", async () => {
    const found = excerpt("linha um\nlinha dois");
    const tampered = excerpt("outra coisa completamente diferente");
    const { retriever } = retrieverReturning([[found]]);
    const ai = scriptedStream({ citations: [tampered], tokens: ["resposta inventada"] }, output({ answer: "resposta inventada", citations: [tampered] }));
    const tutor = createStudyTutor({ retriever, ai });

    const events = await collect(tutor.answerTurnStream({ question: "pergunta", context: [material], mode: byok }));

    expect(events.filter((event) => event.type === "answer")).toEqual([]);
    expect(events).toEqual([
      { type: "result", result: { answer: UNSUPPORTED_ANSWER, citations: [], proposedNotebookActions: [] } },
    ]);
  });
});
