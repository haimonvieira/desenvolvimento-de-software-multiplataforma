import { describe, expect, it } from "vitest";

import {
  createByokGroqPublicTutorAi,
  createGroqPublicTutorAi,
  GROQ_BASE_URL,
  GROQ_FALLBACK_MODEL,
  GROQ_PRIMARY_MODEL,
  parseGroqAnswer,
  readGroqStream,
  type GroqFetch,
} from "./groq-public-tutor-ai";
import { TutorProviderError } from "./public-tutor-ai";
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
      tool_choice: "auto",
      response_format: { type: "json_object" },
      max_completion_tokens: 1_000,
      temperature: 0.2,
      n: 1,
      stream: false,
    });
    const tools = sent.tools as { function: { name: string } }[];
    expect(tools.map((tool) => tool.function.name)).toEqual(["retrieve"]);
    expect(calls[0]!.init.headers).toMatchObject({ authorization: "Bearer gsk-sponsored" });
    expect(output.answer).toBe("A lógica estuda o raciocínio.");
    expect(output.citations).toHaveLength(1);
  });

  it("maps wire tool_calls onto the orchestrator contract and drops anything else", () => {
    const parsed = parseGroqAnswer(jsonBody("x"), [
      { id: "call_1", type: "function", function: { name: "retrieve", arguments: "{\"query\": \"mais contexto\"}" } },
      { id: "call_2", type: "function", function: { name: "delete_materials", arguments: "{\"query\": \"apague\"}" } },
    ]);

    expect(parsed.toolCalls).toEqual([{ name: "retrieve", query: "mais contexto" }]);
  });

  it("degrades to the fallback model once on 429 or 5xx, then surfaces quota without retry", async () => {
    const { calls, fetchImpl } = recordedFetch((url, init) => {
      const sent = JSON.parse(init.body as string) as { model: string };
      if (sent.model === GROQ_PRIMARY_MODEL) {
        return new Response(JSON.stringify({ error: { message: "Rate limit reached", type: "rate_limit_error" } }), {
          status: 429,
          headers: { "retry-after": "7" },
        });
      }
      return chatResponse(jsonBody("Resposta do modelo menor."));
    });
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl });

    const output = await ai.answer(input, budget);

    expect(calls).toHaveLength(2);
    expect(JSON.parse(calls[1]!.init.body as string)).toMatchObject({ model: GROQ_FALLBACK_MODEL });
    expect(output.answer).toBe("Resposta do modelo menor.");
  });

  it("reports quota exhaustion with retry-after and never auto-retries", async () => {
    const { calls, fetchImpl } = recordedFetch(() => new Response(
      JSON.stringify({ error: { message: "Rate limit reached", type: "rate_limit_error" } }),
      { status: 429, headers: { "retry-after": "12" } },
    ));
    const ai = createGroqPublicTutorAi({ apiKey: "gsk-sponsored", fetchImpl, fallbackModel: GROQ_PRIMARY_MODEL });

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

  it("returns empty citations for unparseable answers so the orchestrator marks them unsupported", () => {
    expect(parseGroqAnswer("not json at all")).toMatchObject({ answer: "", citations: [] });
    expect(parseGroqAnswer(null)).toMatchObject({ answer: "", citations: [] });
    expect(parseGroqAnswer(JSON.stringify({ answer: 42 }))).toMatchObject({ answer: "", citations: [] });
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
