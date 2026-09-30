import { describe, expect, it } from "vitest";

import {
  createByokGroqPublicTutorAi,
  createGroqPublicTutorAi,
  GROQ_BASE_URL,
  GROQ_FALLBACK_MODEL,
  GROQ_PRIMARY_MODEL,
  validateGroqAnswer,
  readGroqStream,
} from "./groq-public-tutor-ai";
import type { GroqFetch } from "./groq-transport";
import { TutorProviderError } from "./provider-failure";
import type { ReservedBudget } from "../../modules/tutor/usage-ledger";

const budget: ReservedBudget = Object.freeze({
  reservationId: "r1",
  maxInputTokens: 4_000,
  maxOutputTokens: 1_000,
  maxToolCalls: 4,
  deadlineSeconds: 30,
});

const input = {
  question: "o que é lógica?",
  excerpts: [
    {
      material: { path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) },
      locator: { type: "lines" as const, start: 1, end: 2 },
      text: "linha um\nlinha dois",
      score: 1,
    },
  ],
  toolResults: [],
  remainingToolCalls: 4,
};

function jsonBody(answer: string) {
  return JSON.stringify({
    answer,
    citations: [{
      path: "DSM1/ALP/introducao.md",
      commitSha: "a".repeat(40),
      locator: { type: "lines", start: 1, end: 2 },
      quote: "linha dois",
    }],
    proposedNotebookActions: [],
  });
}

function chatResponse(content: string, usage = { prompt_tokens: 120, completion_tokens: 40, total_tokens: 160 }) {
  return new Response(JSON.stringify({
    id: "chatcmpl-1",
    object: "chat.completion",
    created: 1_700_000_000,
    model: GROQ_PRIMARY_MODEL,
    choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }],
    usage,
  }), { status: 200, headers: { "content-type": "application/json" } });
}

function recordedFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>): {
  fetchImpl: GroqFetch;
  calls: { url: string; init: RequestInit }[];
} {
  const calls: { url: string; init: RequestInit }[] = [];
  return {
    calls,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return handler(url, init);
    },
  };
}

describe("Groq public tutor adapter", () => {
  it("posts an OpenAI-compatible chat completion to the primary model", async () => {
    const { calls, fetchImpl } = recordedFetch(() => chatResponse(jsonBody("A lógica estuda o raciocínio.")));
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl });

    const output = await ai.answer(input, budget);

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(`${GROQ_BASE_URL}/chat/completions`);
    const sent = JSON.parse(calls[0]!.init.body as string) as Record<string, unknown>;
    expect(sent).toMatchObject({
      model: GROQ_PRIMARY_MODEL,
      response_format: { type: "json_object" },
      max_completion_tokens: 1_000,
      temperature: 0.2,
      n: 1,
      stream: false,
    });
    // Groq rejects this pairing with a 400 — "json mode cannot be combined with
    // tool/function calling" — and a transport double can never catch that, so
    // the absence is asserted here on purpose. Retrieval rides the inline
    // `toolCalls` field the prompt documents and the validator reads.
    expect(sent).not.toHaveProperty("tools");
    expect(sent).not.toHaveProperty("tool_choice");
    expect(calls[0]!.init.headers).toMatchObject({ authorization: "Bearer gsk-sponsored" });
    expect(output.answer).toBe("A lógica estuda o raciocínio.");
    expect(output.citations).toHaveLength(1);
  });

  it("sends exactly this system contract", async () => {
    const { fetchImpl, calls } = recordedFetch(() => chatResponse(jsonBody("ok")));
    const ai = createGroqPublicTutorAi({ apiKey: "k", fetchImpl });

    await ai.answer(input, budget);

    const sent = JSON.parse(calls[0]!.init.body as string) as { messages: readonly { role: string; content: string }[] };
    expect(sent.messages[0]).toEqual({
      role: "system",
      content: [
        "Você é o tutor de estudo do DSM Atlas. Responda em português.",
        "Use APENAS os trechos recuperados abaixo. Se eles não sustentarem a resposta, diga exatamente: Não encontrei isso nos materiais.",
        "Responda sempre em JSON com o formato: {\"answer\": string, \"citations\": [{\"path\": string, \"commitSha\": string, \"locator\": {\"type\": \"lines\", \"start\": number, \"end\": number} | {\"type\": \"page\", \"page\": number} | {\"type\": \"excerpt\", \"hash\": string}, \"quote\": string}], \"proposedNotebookActions\": [{\"type\": \"note\", \"title\": string, \"body\": string, \"source\": {\"path\": string, \"commitSha\": string}} | {\"type\": \"flashcard\", \"front\": string, \"back\": string, \"source\": {\"path\": string, \"commitSha\": string}}], \"toolCalls\": [{\"name\": \"retrieve\", \"query\": string}]}.",
        "Cada citação deve copiar um trecho recuperado palavra por palavra no campo quote, com path/commitSha/locator iguais aos do trecho. toolCalls só pode pedir a ferramenta \"retrieve\" com uma pergunta de busca; no máximo o número restante informado.",
        "Chamadas de ferramenta restantes: 4.",
      ].join("\n"),
    });
  });

  it("leads the user message with the question and includes the retrieved quote", async () => {
    const { fetchImpl, calls } = recordedFetch(() => chatResponse(jsonBody("ok")));
    const ai = createGroqPublicTutorAi({ apiKey: "k", fetchImpl });

    await ai.answer(input, budget);

    const sent = JSON.parse(calls[0]!.init.body as string) as { messages: readonly { content: string }[] };
    const user = sent.messages[1]!;
    expect(user.content.startsWith("Pergunta: o que é lógica?\n\nTrechos recuperados:\n")).toBe(true);
    expect(user.content).toContain("linha dois");
  });

  it("bounds the assembled prompt within the reserved input budget across accumulated excerpts", async () => {
    const { calls, fetchImpl } = recordedFetch(() => chatResponse(jsonBody("ok")));
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl });
    const huge = {
      material: { path: "DSM1/ALP/gigante.md", commitSha: "a".repeat(40) },
      locator: { type: "lines" as const, start: 1, end: 1 },
      text: "x".repeat(400_000),
      score: 1,
    };
    const history = Array.from({ length: 4 }, (_, index) => ({
      name: "retrieve",
      query: `consulta ${index}`,
      excerpts: [{ ...huge, material: { path: `DSM1/ALP/g-${index}.md`, commitSha: "a".repeat(40) } }],
    }));

    await ai.answer({ ...input, excerpts: [huge, huge], toolResults: history, remainingToolCalls: 0 }, budget);

    const sent = JSON.parse(calls[0]!.init.body as string) as { messages: readonly { content: string }[] };
    const chars = sent.messages.reduce((total, message) => total + message.content.length, 0);
    // The prompt is assembled at the pessimistic 3-chars-per-token floor, so it
    // cannot exceed the reserved per-turn input ceiling.
    expect(chars).toBeLessThanOrEqual(budget.maxInputTokens * 3);
  });

  it("maps wire tool_calls onto the orchestrator contract and drops anything else", () => {
    const validation = validateGroqAnswer(jsonBody("x"), [
      { id: "call_1", type: "function", function: { name: "retrieve", arguments: "{\"query\": \"mais contexto\"}" } },
      { id: "call_2", type: "function", function: { name: "delete_materials", arguments: "{\"query\": \"apague\"}" } },
    ]);
    if (!validation.ok) throw new Error("the documented shape must validate");

    expect(validation.output.toolCalls).toEqual([{ name: "retrieve", query: "mais contexto" }]);
  });

  it("degrades to the fallback model once when the primary is unavailable (5xx)", async () => {
    const { calls, fetchImpl } = recordedFetch((url, init) => {
      const sent = JSON.parse(init.body as string) as { model: string };
      if (sent.model === GROQ_PRIMARY_MODEL) {
        return new Response(JSON.stringify({ error: { message: "engine down", type: "server_error" } }), { status: 503 });
      }
      return chatResponse(jsonBody("Resposta do modelo menor."));
    });
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl });

    const output = await ai.answer(input, budget);

    expect(calls).toHaveLength(2);
    expect(JSON.parse(calls[1]!.init.body as string)).toMatchObject({ model: GROQ_FALLBACK_MODEL });
    expect(output.answer).toBe("Resposta do modelo menor.");
  });

  it("never degrades on 429: the quota ends the turn on the primary with retry-after", async () => {
    // The default primary/fallback pair: a 429 must not produce a second
    // provider call, because the fallback shares the same organization limits.
    const { calls, fetchImpl } = recordedFetch(() => new Response(
      JSON.stringify({ error: { message: "Rate limit reached", type: "rate_limit_error" } }),
      { status: 429, headers: { "retry-after": "12" } },
    ));
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl });

    const error = await ai.answer(input, budget).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(TutorProviderError);
    expect((error as TutorProviderError).failure).toEqual({ kind: "rate_limited", retryAfterSeconds: 12 });
    expect(calls).toHaveLength(1);
    expect(JSON.parse(calls[0]!.init.body as string)).toMatchObject({ model: GROQ_PRIMARY_MODEL });
  });

  it("reports quota exhaustion with retry-after and never auto-retries", async () => {
    const { calls, fetchImpl } = recordedFetch(() => new Response(
      JSON.stringify({ error: { message: "Rate limit reached", type: "rate_limit_error" } }),
      { status: 429, headers: { "retry-after": "12" } },
    ));
    // The default primary/fallback pair: the no-retry rule is proven on the
    // real configuration, not on a test override that disables degradation.
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl });

    const error = await ai.answer(input, budget).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(TutorProviderError);
    expect((error as TutorProviderError).failure).toEqual({ kind: "rate_limited", retryAfterSeconds: 12 });
    // Primary plus one same-model attempt is the whole budget: no backoff loop.
    expect(calls).toHaveLength(1);
  });

  it("fails closed on 5xx without leaking the provider body", async () => {
    const { fetchImpl } = recordedFetch(() => new Response(
      JSON.stringify({ error: { message: "internal engine failure detail", type: "server_error" } }),
      { status: 500 },
    ));
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl, fallbackModel: GROQ_PRIMARY_MODEL });

    const error = await ai.answer(input, budget).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(TutorProviderError);
    expect((error as TutorProviderError).failure.kind).toBe("unavailable");
    expect((error as Error).message).not.toContain("internal engine failure");
  });

  it("fails closed on auth errors without leaking the key or the provider body", async () => {
    const key = "gsk-super-secret-key";
    const { fetchImpl } = recordedFetch(() => new Response(
      JSON.stringify({ error: { message: `invalid key ${key}`, type: "invalid_request_error" } }),
      { status: 401 },
    ));
    const ai = createGroqPublicTutorAi({ apiKey: key, fetchImpl });

    const error = await ai.answer(input, budget).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(TutorProviderError);
    expect((error as TutorProviderError).failure.kind).toBe("auth");
    expect((error as Error).message).not.toContain(key);
    expect((error as Error).message).not.toContain("invalid key");
  });

  it("treats a timeout as unknown, never as permission to retry", async () => {
    const fetchImpl: GroqFetch = async () => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      throw error;
    };
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl, timeoutMs: 5 });

    const error = await ai.answer(input, budget).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(TutorProviderError);
    expect((error as TutorProviderError).failure.kind).toBe("timeout");
  });

  it("streams deltas, tool fragments and the final usage chunk", async () => {
    const frames = [
      `data: ${JSON.stringify({ choices: [{ delta: { content: "{\"answer\": \"" } }] })}`,
      `data: ${JSON.stringify({ choices: [{ delta: { tool_calls: [{ index: 0, id: "call_9", function: { name: "retr", arguments: "" } }] } }] })}`,
      `data: ${JSON.stringify({ choices: [{ delta: { content: "oi", tool_calls: [{ index: 0, function: { name: "ieve", arguments: "{\"query\": \"x\"}" } }] } }] })}`,
      `data: ${JSON.stringify({ usage: { prompt_tokens: 90, completion_tokens: 10, total_tokens: 100 }, choices: [] })}`,
      "data: [DONE]",
    ].join("\n\n");
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(frames));
        controller.close();
      },
    });

    const { content, toolCalls, usage } = await readGroqStream(new Response(stream));

    expect(content).toBe("{\"answer\": \"oi");
    expect(toolCalls).toEqual([{ id: "call_9", type: "function", function: { name: "retrieve", arguments: "{\"query\": \"x\"}" } }]);
    expect(usage).toMatchObject({ prompt_tokens: 90, completion_tokens: 10 });
  });

  it("accepts every documented locator and notebook action variant", () => {
    const sha = "a".repeat(40);
    const validation = validateGroqAnswer(JSON.stringify({
      answer: "A lógica estuda o raciocínio.",
      citations: [
        { path: "p.md", commitSha: sha, locator: { type: "lines", start: 1, end: 2 }, quote: "q1" },
        { path: "p.md", commitSha: sha, locator: { type: "page", page: 3 }, quote: "q2" },
        { path: "p.md", commitSha: sha, locator: { type: "excerpt", hash: "h" }, quote: "q3" },
      ],
      proposedNotebookActions: [
        { type: "note", title: "t", body: "b", source: { path: "p.md", commitSha: sha } },
        { type: "flashcard", front: "f", back: "b", source: { path: "p.md", commitSha: sha } },
      ],
    }));
    if (!validation.ok) throw new Error("the documented shape must validate");

    expect(validation.output.answer).toBe("A lógica estuda o raciocínio.");
    expect(validation.output.citations.map((citation) => citation.locator.type)).toEqual(["lines", "page", "excerpt"]);
    expect(validation.output.citations.map((citation) => citation.text)).toEqual(["q1", "q2", "q3"]);
    expect(validation.output.proposedNotebookActions.map((action) => action.type)).toEqual(["note", "flashcard"]);
    expect(validation.output.citations[0]!.material).toEqual({ path: "p.md", commitSha: sha });
  });

  it("refuses a documented field that is off-shape", () => {
    const sha = "a".repeat(40);
    expect(validateGroqAnswer("not json at all").ok).toBe(false);
    expect(validateGroqAnswer(null).ok).toBe(false);
    expect(validateGroqAnswer(JSON.stringify({ answer: 42 })).ok).toBe(false);
    expect(validateGroqAnswer(JSON.stringify({ answer: "x", citations: [{ path: 1 }], proposedNotebookActions: [] })).ok).toBe(false);
    expect(validateGroqAnswer(JSON.stringify({
      answer: "x",
      citations: [{ path: "p.md", commitSha: sha, locator: { type: "lines", start: 1 }, quote: "q" }],
      proposedNotebookActions: [],
    })).ok).toBe(false);
    expect(validateGroqAnswer(JSON.stringify({ answer: "x", citations: [], proposedNotebookActions: [{ type: "note", title: "t" }] })).ok).toBe(false);
  });

  it("refuses the whole turn when a citation is off-shape, charging the measured spend", async () => {
    // The defect this change closes: the old parser dropped the malformed
    // citation and returned the rest of the answer, hiding that the claim may
    // have rested on exactly the evidence that was discarded.
    const malformed = JSON.stringify({
      answer: "A lógica estuda o raciocínio.",
      citations: [{ path: "p.md", commitSha: "a".repeat(40), locator: { type: "page" }, quote: "linha dois" }],
      proposedNotebookActions: [],
    });
    const { fetchImpl } = recordedFetch(() => chatResponse(malformed));
    const ai = createGroqPublicTutorAi({ apiKey: "k", fetchImpl });

    const error = await ai.answer(input, budget).catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(TutorProviderError);
    expect((error as TutorProviderError).failure.kind).toBe("unusable");
    expect((error as TutorProviderError).usage).toEqual({ inputTokens: 120, outputTokens: 40 });
  });

  it("keeps the BYOK key header-only and out of errors", async () => {
    const key = "gsk-visitor-secret-key";
    const { calls, fetchImpl } = recordedFetch(() => new Response("boom", { status: 500 }));
    const byok = createByokGroqPublicTutorAi(key, { fetchImpl, fallbackModel: GROQ_PRIMARY_MODEL });

    expect(() => createByokGroqPublicTutorAi("   ", { fetchImpl })).toThrow(/BYOK key/);
    const error = await byok.answer(input, budget).catch((failure: unknown) => failure);

    expect(calls).toHaveLength(1);
    expect(calls[0]!.init.headers).toMatchObject({ authorization: `Bearer ${key}` });
    expect(JSON.stringify(calls[0]!.init.body)).not.toContain(key);
    expect((error as Error).message).not.toContain(key);
  });

  it("requires an API key instead of calling Groq anonymously", () => {
    expect(() => createGroqPublicTutorAi({ apiKey: "" })).toThrow(/API key/);
  });
});
