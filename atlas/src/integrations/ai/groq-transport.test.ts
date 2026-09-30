import { describe, expect, it } from "vitest";

import { postGroqChatCompletions, throwForGroqStatus } from "./groq-transport";

describe("Groq transport", () => {
  it("maps a 429 with retry-after onto rate_limited", async () => {
    const response = new Response(null, { status: 429, headers: { "retry-after": "12" } });
    await expect(throwForGroqStatus(response)).rejects.toMatchObject({
      failure: { kind: "rate_limited", retryAfterSeconds: 12 },
    });
  });

  it("reports no reset when a 429 carries no usable retry-after", async () => {
    await expect(throwForGroqStatus(new Response(null, { status: 429 }))).rejects.toMatchObject({
      failure: { kind: "rate_limited", retryAfterSeconds: null },
    });
  });

  it("maps 401 and 403 onto auth, 400 and 422 onto invalid, and the rest onto unavailable", async () => {
    for (const status of [401, 403]) {
      await expect(throwForGroqStatus(new Response(null, { status }))).rejects.toMatchObject({ failure: { kind: "auth" } });
    }
    for (const status of [400, 422]) {
      await expect(throwForGroqStatus(new Response(null, { status }))).rejects.toMatchObject({ failure: { kind: "invalid" } });
    }
    for (const status of [500, 502, 503]) {
      await expect(throwForGroqStatus(new Response(null, { status }))).rejects.toMatchObject({ failure: { kind: "unavailable" } });
    }
  });

  it("turns an abort into timeout and a transport failure into unavailable", async () => {
    const aborted = new Error("The operation was aborted");
    aborted.name = "AbortError";
    await expect(postGroqChatCompletions({
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: "k",
      body: {},
      timeoutMs: 5,
      fetchImpl: async () => {
        throw aborted;
      },
    })).rejects.toMatchObject({ failure: { kind: "timeout" } });

    await expect(postGroqChatCompletions({
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: "k",
      body: {},
      timeoutMs: 5,
      fetchImpl: async () => {
        throw new Error("socket closed");
      },
    })).rejects.toMatchObject({ failure: { kind: "unavailable" } });
  });

  it("posts to the base URL it is given with the caller's bearer key", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const response = await postGroqChatCompletions({
      baseUrl: "https://example.test/v1",
      apiKey: "gsk-key",
      body: { model: "m" },
      timeoutMs: 5,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return new Response("{}", { status: 200 });
      },
    });

    expect(await response.json()).toEqual({});
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://example.test/v1/chat/completions");
    expect(calls[0]!.init.headers).toMatchObject({ authorization: "Bearer gsk-key" });
  });
});
