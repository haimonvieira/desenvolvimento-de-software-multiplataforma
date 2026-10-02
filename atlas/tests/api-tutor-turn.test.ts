import { describe, expect, it } from "vitest";

import catalog from "../src/generated/catalog.json";
import { createTutorTurnHandler, tutorTurnSchema, type TutorTurnDependencies } from "../src/app/api/tutor/turn/route";
import { createFakePublicTutorAi, type PublicTutorAi } from "../src/integrations/ai/public-tutor-ai";
import { createByokGroqPublicTutorAi } from "../src/integrations/ai/groq-public-tutor-ai";
import type { GroqFetch } from "../src/integrations/ai/groq-transport";
import { TutorProviderError } from "../src/integrations/ai/provider-failure";
import { createCatalogQuery } from "../src/modules/catalog/catalog-query";
import type { CatalogData } from "../src/modules/catalog/model";
import { selectTutorContext, tutorCandidates } from "../src/modules/study/tutor-context";
import { TUTOR_CONTEXT_LIMIT } from "../src/modules/tutor/study-tutor";
import type { ContentRetriever, RetrievedExcerpt } from "../src/modules/tutor/model";
import { policyFor } from "../src/modules/tutor/usage-policy";
import type { BudgetDecision, UsageLedger } from "../src/modules/tutor/usage-ledger";

const catalogQuery = createCatalogQuery(catalog as CatalogData);

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
      scope: "public", enabled: true, requestsThisHour: 0, requestsPerHour: 5, requestsToday: 0,
      requestsPerDay: 15, globalTurnsToday: 0, globalTurnsPerDay: 30,
      globalTokensToday: 0, globalTokensPerDay: 150_000, resetsAt: "2026-09-29T00:00:00.000Z",
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

  it("maps a provider rate limit to 429 with the retry hint and no auto-retry", async () => {
    let calls = 0;
    const ai: PublicTutorAi = {
      async answer() {
        calls += 1;
        throw new TutorProviderError({ kind: "rate_limited", retryAfterSeconds: 9 });
      },
    };
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("9");
    expect(await response.json()).toEqual({
      error: { code: "PROVIDER_QUOTA", message: "A cota do provedor de IA está esgotada." },
      retryAfterSeconds: 9,
    });
    expect(calls).toBe(1);
  });

  it("fails a provider timeout closed as an unknown outcome without echoing the body", async () => {
    const ai: PublicTutorAi = {
      async answer() {
        throw new TutorProviderError({ kind: "timeout" });
      },
    };
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: { code: "TUTOR_TURN_FAILED", message: "Não foi possível responder agora." } });
  });

  it("refuses an unusable answer as a failed turn, not as a quota or a success", async () => {
    const ai: PublicTutorAi = {
      async answer() {
        throw new TutorProviderError({ kind: "unusable" }, { inputTokens: 900, outputTokens: 120 });
      },
    };
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: { code: "TUTOR_TURN_FAILED", message: "Não foi possível responder agora." } });
  });

  it("fails closed on a provider failure that carries the key without echoing it", async () => {
    const ai: PublicTutorAi = {
      async answer() {
        // A real provider can put the credential in its error text; the route
        // must map it to a fixed failure instead of passing the message through.
        throw new Error(`provider rejected the credential ${KEY}`);
      },
    };
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(502);
    const body = JSON.stringify(await response.json());
    expect(body).not.toContain(KEY);
    expect(body).not.toContain("credencial");
  });

  it("accepts the context the tutor page actually produces", async () => {
    // The page's own path: semester catalog -> indexable candidates -> the
    // visitor's studied subset, capped to the route's limit. This is what a real
    // turn carries, so a mismatch between page and route shows up here.
    const pageCandidates = tutorCandidates(catalogQuery.browse({ semester: "DSM1" }));
    const pageContext = selectTutorContext(pageCandidates, null);
    expect(pageContext.length).toBe(TUTOR_CONTEXT_LIMIT);
    expect(pageContext.length).toBeGreaterThan(1);

    const ai = createFakePublicTutorAi([{ answer: "A lógica estuda o raciocínio.", citations: [], proposedNotebookActions: [] }]);
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, { question: "o que é lógica?", context: pageContext, mode: "sponsored" });

    expect(response.status).toBe(200);
    expect(ai.calls).toHaveLength(1);
    expect(ai.calls[0]!.excerpts).toEqual([found]);
  });

  it("rejects the unbounded semester context the page used to send", async () => {
    // Every DSM1 material is over a thousand refs; posting them is exactly the
    // defect the page fix removed, and the schema must keep rejecting it.
    const unbounded = catalogQuery.browse({ semester: "DSM1" }).map((material) => material.ref);
    expect(unbounded.length).toBeGreaterThan(TUTOR_CONTEXT_LIMIT);

    const response = await post({ retriever }, { question: "o que é lógica?", context: unbounded, mode: "sponsored" });

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

  it("fails a first sponsored turn closed without a verified Turnstile token", async () => {
    const ai = createFakePublicTutorAi([{ answer: "nunca", citations: [], proposedNotebookActions: [] }]);
    const ledger = ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 });
    const gated: typeof ledger = { ...ledger, hasSponsoredHistory: async () => false };

    const response = await post({
      retriever,
      ledger: gated,
      subjectKey: async () => "first-timer",
      sponsoredAi: ai,
    }, turn);

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: { code: "TURNSTILE_REQUIRED", message: "Verificação necessária." } });
    expect(ai.calls).toHaveLength(0);
  });

  it("answers a first sponsored turn after the Turnstile gate verifies it", async () => {
    const ai = createFakePublicTutorAi([{ answer: "A lógica estuda o raciocínio.", citations: [found], proposedNotebookActions: [] }]);
    const ledger = ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 });
    const gated: typeof ledger = { ...ledger, hasSponsoredHistory: async () => false };
    const seen: (string | null)[] = [];

    const response = await post({
      retriever,
      ledger: gated,
      subjectKey: async () => "first-timer",
      sponsoredAi: ai,
      firstUseGate: async ({ turnstileToken }) => {
        seen.push(turnstileToken);
        return turnstileToken === "token-abc";
      },
    }, { ...turn, turnstileToken: "token-abc" });

    expect(response.status).toBe(200);
    expect(seen).toEqual(["token-abc"]);
    expect(ai.calls).toHaveLength(1);
  });

  it("skips the Turnstile gate for returning sponsored subjects", async () => {
    const ai = createFakePublicTutorAi([{ answer: "A lógica estuda o raciocínio.", citations: [found], proposedNotebookActions: [] }]);
    let gateCalls = 0;

    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "returning",
      sponsoredAi: ai,
      firstUseGate: async () => {
        gateCalls += 1;
        return true;
      },
    }, turn);

    expect(response.status).toBe(200);
    expect(gateCalls).toBe(0);
  });

  it("answers a BYOK turn through the per-request adapter without touching the ledger", async () => {
    const ai = createFakePublicTutorAi([{ answer: "A lógica estuda o raciocínio.", citations: [found], proposedNotebookActions: [] }]);
    let reservations = 0;
    const ledger = ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 });
    const counting: typeof ledger = { ...ledger, reserve: async (input) => { reservations += 1; return ledger.reserve(input); } };
    const seenKeys: string[] = [];

    const response = await post({
      retriever,
      ledger: counting,
      byokAi: (key) => {
        seenKeys.push(key);
        return ai;
      },
    }, { ...turn, mode: "byok" }, { authorization: `Bearer ${KEY}` });

    expect(response.status).toBe(200);
    expect(seenKeys).toEqual([KEY]);
    expect(reservations).toBe(0);
    expect(JSON.stringify(await response.clone().json())).not.toContain(KEY);
  });
});

describe("turn persona", () => {
  it("defaults to chat, accepts agent, and rejects an unknown value", () => {
    const base = { question: "o que é lógica?", context: [material] };

    expect(tutorTurnSchema.parse(base).persona).toBe("chat");
    expect(tutorTurnSchema.parse({ ...base, persona: "agent" }).persona).toBe("agent");
    expect(tutorTurnSchema.parse({ ...base, persona: "chat" }).persona).toBe("chat");
    expect(tutorTurnSchema.safeParse({ ...base, persona: "x" }).success).toBe(false);
  });

  it("carries a chat persona end-to-end through the handler", async () => {
    const ai = createFakePublicTutorAi([{ answer: "ok", citations: [found], proposedNotebookActions: [] }]);
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: ai,
    }, { ...turn, persona: "chat" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ result: { answer: "ok", citations: [found], proposedNotebookActions: [] } });
  });

  it("rejects an unknown persona with a stable 400", async () => {
    const response = await post({ retriever }, { ...turn, persona: "x" });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: "INVALID_TUTOR_TURN", message: "Pergunta inválida." } });
  });
});

describe("BYOK provider descriptor", () => {
  const providerTurn = { ...turn, mode: "byok" as const };

  it("keeps the default endpoint when the descriptor is absent", async () => {
    const seen: (unknown)[] = [];
    const ai = createFakePublicTutorAi([{ answer: "ok", citations: [found], proposedNotebookActions: [] }]);
    const response = await post({
      retriever,
      byokAi: (key, provider) => {
        seen.push(provider);
        return ai;
      },
    }, providerTurn, { authorization: `Bearer ${KEY}` });

    expect(response.status).toBe(200);
    expect(seen).toEqual([undefined]);
  });

  it("refuses an unsafe descriptor before building the adapter", async () => {
    const unsafe = [
      "http://api.example.com/v1",
      "api.example.com/v1",
      "https://127.0.0.1/v1",
      "https://[::1]/v1",
      "https://localhost/v1",
      "https://box.local/v1",
      "https://foo.internal/v1",
      "https://intranet/v1",
      "https://user:pass@api.example.com/v1",
      "https://api.example.com/v1/resource",
    ];
    let adapters = 0;
    for (const baseUrl of unsafe) {
      const response = await post({
        retriever,
        byokAi: () => {
          adapters += 1;
          return createFakePublicTutorAi([]);
        },
      }, { ...providerTurn, provider: { baseUrl, model: "visitor-model" } }, { authorization: `Bearer ${KEY}` });

      expect(response.status, baseUrl).toBe(400);
      expect(await response.json(), baseUrl).toEqual({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } });
    }
    expect(adapters).toBe(0);
  });

  it("reaches the visitor's base URL with the visitor's model", async () => {
    const calls: { url: string; body: unknown }[] = [];
    const fetchImpl: GroqFetch = async (url, init) => {
      calls.push({ url, body: typeof init.body === "string" ? JSON.parse(init.body) : null });
      return new Response(JSON.stringify({
        id: "chatcmpl-1",
        object: "chat.completion",
        created: 1,
        model: "visitor-model",
        choices: [{
          index: 0,
          finish_reason: "stop",
          message: {
            role: "assistant",
            content: JSON.stringify({
              answer: "A lógica estuda o raciocínio.",
              citations: [{ path: found.material.path, commitSha: found.material.commitSha, locator: { type: "lines", start: 1, end: 2 }, quote: "linha dois" }],
              proposedNotebookActions: [],
            }),
          },
        }],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      }), { status: 200, headers: { "content-type": "application/json" } });
    };

    const response = await post({
      retriever,
      byokAi: (key, provider) => createByokGroqPublicTutorAi(key, { ...provider, fetchImpl }),
    }, { ...providerTurn, provider: { baseUrl: "https://provider.example/openai/v1", model: "visitor-model" } }, { authorization: `Bearer ${KEY}` });

    expect(response.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://provider.example/openai/v1/chat/completions");
    const requestBody = calls[0]!.body;
    const model = typeof requestBody === "object" && requestBody !== null && "model" in requestBody ? requestBody.model : undefined;
    expect(model).toBe("visitor-model");
  });

  it("keeps the server provider on a sponsored turn even when a descriptor is sent", async () => {
    const sponsored = createFakePublicTutorAi([{ answer: "patrocinado", citations: [found], proposedNotebookActions: [] }]);
    let byok = 0;
    const response = await post({
      retriever,
      ledger: ledgerWith({ type: "reserved", reservationId: "r1", maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4 }),
      subjectKey: async () => "s1",
      sponsoredAi: sponsored,
      byokAi: () => {
        byok += 1;
        return sponsored;
      },
    }, { ...turn, provider: { baseUrl: "https://provider.example/v1", model: "visitor-model" } });

    expect(response.status).toBe(200);
    expect(byok).toBe(0);
  });
});
