import { describe, expect, it } from "vitest";

import { createTutorTurnHandler, type TutorTurnDependencies } from "../src/app/api/tutor/turn/route";
import type { PublicTutorAi } from "../src/integrations/ai/public-tutor-ai";
import { TutorProviderError } from "../src/integrations/ai/provider-failure";
import type { ContentRetriever, RetrievedExcerpt } from "../src/modules/tutor/model";
import { policyFor } from "../src/modules/tutor/usage-policy";
import type { BudgetDecision, UsageLedger } from "../src/modules/tutor/usage-ledger";

const material = { path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) };
const found: RetrievedExcerpt = Object.freeze({
  material, locator: { type: "lines" as const, start: 1, end: 2 }, text: "linha um\nlinha dois", score: 1,
});
const ANSWER = "A lógica estuda o raciocínio.";
const output = { answer: ANSWER, citations: [found], proposedNotebookActions: [] };

const retriever: ContentRetriever = { async retrieve() { return [found]; } };

function ledgerWith(decision: BudgetDecision): UsageLedger {
  return {
    policy: () => policyFor("public"),
    reserve: async () => decision,
    reconcile: async () => undefined,
    expireStaleReservations: async () => 0,
    readQuota: async () => ({
      scope: "public", enabled: true, requestsThisHour: 0, requestsPerHour: 5, requestsToday: 0,
      requestsPerDay: 15, globalTurnsToday: 0, globalTurnsPerDay: 30,
      globalTokensToday: 0, globalTokensPerDay: 150_000, resetsAt: "2026-09-29T00:00:00.000Z",
    }),
    hasSponsoredHistory: async () => true,
  };
}

/** The one request shape a streaming client sends: `Accept: text/event-stream`. */
function postStream(dependencies: TutorTurnDependencies, body: unknown) {
  return createTutorTurnHandler(dependencies)(new Request("https://atlas.test/api/tutor/turn", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "text/event-stream" },
    body: JSON.stringify(body),
  }));
}

async function readEvents(response: Response): Promise<{ event: string; data: unknown }[]> {
  const text = await response.text();
  return text.split("\n\n").filter(Boolean).map((block) => {
    const [event, data] = block.split("\n");
    return { event: event!.replace("event: ", ""), data: JSON.parse(data!.replace("data: ", "")) };
  });
}

/** A streaming double: emits a status line and readable answer text, then resolves with the validated output. */
function streamingAi(onStream?: (onToken: (token: string) => void, onStatus?: (status: string) => void) => void): PublicTutorAi & { streams: number } {
  const ai = {
    streams: 0,
    async answer() { return output; },
    async answerStream(_input: unknown, _budget: unknown, onToken: (token: string) => void, onStatus?: (status: string) => void) {
      ai.streams += 1;
      if (onStream) onStream(onToken, onStatus);
      else {
        onStatus?.("analisando a lógica");
        for (const delta of ["A ló", "gica estuda ", "o raciocínio."]) onToken(delta);
      }
      return { output, usage: { inputTokens: 10, outputTokens: 5 } };
    },
  };
  return ai as PublicTutorAi & { streams: number };
}

const turn = { question: "o que é lógica?", context: [material], mode: "sponsored" as const };

describe("POST /api/tutor/turn (streaming)", () => {
  it("answers with readable answer events and the same result the JSON path returns", async () => {
    const ai = streamingAi();
    const response = await postStream({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(await readEvents(response)).toEqual([
      { event: "status", data: { status: "analisando a lógica" } },
      { event: "answer", data: { delta: "A ló" } },
      { event: "answer", data: { delta: "gica estuda " } },
      { event: "answer", data: { delta: "o raciocínio." } },
      { event: "done", data: { result: output } },
    ]);
  });

  it("emits no status event when the model sends no status", async () => {
    const ai = streamingAi((onToken) => { onToken("resposta sem status"); });
    const response = await postStream({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(await readEvents(response)).toEqual([
      { event: "answer", data: { delta: "resposta sem status" } },
      { event: "done", data: { result: output } },
    ]);
  });

  it("answers a denied turn with the ordinary JSON before opening a stream", async () => {
    const ai = streamingAi();
    const response = await postStream({
      retriever,
      ledger: ledgerWith({ type: "denied", reason: "daily", resetsAt: "2026-09-29T00:00:00.000Z" }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(429);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({
      error: { code: "QUOTA_DENIED", message: "Sua cota de estudo patrocinado terminou." },
      decision: { reason: "daily", resetsAt: "2026-09-29T00:00:00.000Z" },
    });
    expect(ai.streams).toBe(0);
  });

  it("delivers a provider failure after the first event as an error event, not a broken socket", async () => {
    const ai = streamingAi((onToken) => {
      onToken("oi");
      throw new TutorProviderError({ kind: "rate_limited", retryAfterSeconds: 7 });
    });
    const response = await postStream({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(200);
    expect(await readEvents(response)).toEqual([
      { event: "answer", data: { delta: "oi" } },
      { event: "error", data: { error: { code: "PROVIDER_QUOTA", message: "A cota do provedor de IA está esgotada." } } },
    ]);
  });

  it("keeps the non-streaming path for a client that does not ask for a stream", async () => {
    const ai = streamingAi();
    const response = await createTutorTurnHandler({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    })(new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(turn),
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ result: output });
    expect(ai.streams).toBe(0);
  });
});
