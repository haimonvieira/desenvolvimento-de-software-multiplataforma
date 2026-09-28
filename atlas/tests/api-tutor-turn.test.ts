import { describe, expect, it } from "vitest";

import { createTutorTurnHandler, type TutorTurnDependencies } from "../src/app/api/tutor/turn/route";
import { createFakePublicTutorAi } from "../src/integrations/ai/public-tutor-ai";
import type { ContentRetriever, RetrievedExcerpt } from "../src/modules/tutor/model";
import { policyFor } from "../src/modules/tutor/usage-policy";
import type { BudgetDecision, UsageLedger } from "../src/modules/tutor/usage-ledger";

const KEY = "sk-visitor-secret-key";
const material = { path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) };
const found: RetrievedExcerpt = Object.freeze({
  material, locator: { type: "lines" as const, start: 1, end: 2 }, text: "linha um\nlinha dois", score: 1,
});

const retriever: ContentRetriever = { async retrieve() { return [found]; } };

function ledgerWith(decision: BudgetDecision): UsageLedger {
  return {
    policy: () => policyFor("public"),
    reserve: async () => decision,
    reconcile: async () => undefined,
    expireStaleReservations: async () => 0,
    readQuota: async () => ({
      scope: "public", requestsThisHour: 0, requestsPerHour: 5, requestsToday: 0,
      requestsPerDay: 15, globalTurnsToday: 0, globalTurnsPerDay: 300, resetsAt: "2026-09-29T00:00:00.000Z",
    }),
    hasSponsoredHistory: async () => true,
  };
}

function post(dependencies: TutorTurnDependencies, body: unknown, headers: Record<string, string> = {}) {
  return createTutorTurnHandler(dependencies)(new Request("https://atlas.test/api/tutor/turn", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  }));
}

const turn = { question: "o que é lógica?", context: [material], mode: "sponsored" as const };

describe("POST /api/tutor/turn", () => {
  it("rejects an invalid turn with a stable error", async () => {
    const response = await post({ retriever }, { question: "", context: [] });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: "INVALID_TUTOR_TURN", message: "Pergunta inválida." } });
  });

  it("reports the sponsored provider as unbound without running anything", async () => {
    const response = await post({ retriever, ledger: ledgerWith({ type: "denied", reason: "daily", resetsAt: "2026-09-29T00:00:00.000Z" }), subjectKey: async () => "s1" }, turn);

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: { code: "PROVIDER_UNBOUND", message: "Provedor patrocinado ainda não configurado." } });
  });

  it("requires a BYOK key and reports the BYOK provider as unbound without echoing the key", async () => {
    const missing = await post({ retriever }, { ...turn, mode: "byok" });
    expect(missing.status).toBe(401);
    expect(await missing.json()).toEqual({ error: { code: "BYOK_KEY_REQUIRED", message: "Informe sua chave de API." } });

    const unbound = await post({ retriever }, { ...turn, mode: "byok" }, { authorization: `Bearer ${KEY}` });
    expect(unbound.status).toBe(503);
    expect(JSON.stringify(await unbound.json())).not.toContain(KEY);
  });

  it("never echoes a BYOK key when the provider fails", async () => {
    const failing = await post({
      retriever,
      byokAi: () => ({ async answer() { throw new Error(`provider rejected ${KEY}`); } }),
    }, { ...turn, mode: "byok" }, { authorization: `Bearer ${KEY}` });

    expect(failing.status).toBe(502);
    expect(JSON.stringify(await failing.json())).not.toContain(KEY);
  });

  it("answers a sponsored turn with validated citations", async () => {
    const ai = createFakePublicTutorAi([{ answer: "A lógica estuda o raciocínio.", citations: [found], proposedNotebookActions: [] }]);
    const response = await post({ retriever, ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }), subjectKey: async () => "s1", sponsoredAi: ai }, turn);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      result: { answer: "A lógica estuda o raciocínio.", citations: [found], proposedNotebookActions: [] },
    });
  });

  it("returns a quota denial without invoking the provider", async () => {
    const ai = createFakePublicTutorAi([{ answer: "nunca", citations: [], proposedNotebookActions: [] }]);
    const response = await post({ retriever, ledger: ledgerWith({ type: "denied", reason: "global", resetsAt: "2026-09-29T00:00:00.000Z" }), subjectKey: async () => "s1", sponsoredAi: ai }, turn);

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      error: { code: "QUOTA_DENIED", message: "Sua cota de estudo patrocinado terminou." },
      decision: { reason: "global", resetsAt: "2026-09-29T00:00:00.000Z" },
    });
    expect(ai.calls).toHaveLength(0);
  });
});
