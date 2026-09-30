import { describe, expect, it } from "vitest";

import { createProviderProbe } from "./provider-probe";
import type { GroqFetch } from "./groq-transport";

const KEY = "sk-visitor-secret-9F3";
const BASE = "https://provider.test/v1";

type Recorded = Readonly<{ url: string; init: RequestInit }>;

function catalogue(ids: readonly string[]): Response {
  return new Response(JSON.stringify({ object: "list", data: ids.map((id) => ({ id })) }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function completion(content: string): Response {
  return new Response(
    JSON.stringify({ choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }] }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

function probeWith(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const calls: Recorded[] = [];
  const fetchImpl: GroqFetch = async (url, init) => {
    calls.push({ url, init });
    return handler(url, init);
  };
  return { calls, probe: createProviderProbe({ fetchImpl }) };
}

describe("provider probe", () => {
  it("refuses a URL that is not absolute https before any request is made", async () => {
    const { calls, probe } = probeWith(() => {
      throw new Error("the probe must not reach the network for a bad URL");
    });

    for (const baseUrl of ["http://provider.test/v1", "not-a-url", "ftp://provider.test/v1", "//provider.test/v1"]) {
      await expect(probe({ baseUrl, apiKey: KEY, model: "m" })).resolves.toEqual({ ok: false, reason: "bad-url" });
    }
    expect(calls).toHaveLength(0);
  });

  it("reports unreachable when the models request throws, after reaching it", async () => {
    const { calls, probe } = probeWith(() => {
      throw new Error("socket closed");
    });

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "unreachable",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`]);
  });

  it("reports unreachable when the timeout aborts the request", async () => {
    const calls: Recorded[] = [];
    const fetchImpl: GroqFetch = (_url, init) => {
      calls.push({ url: _url, init });
      return new Promise<Response>((_resolve, reject) => {
        init.signal?.addEventListener("abort", () => {
          const error = new Error("aborted");
          error.name = "AbortError";
          reject(error);
        });
      });
    };

    const verdict = await createProviderProbe({ fetchImpl })({
      baseUrl: BASE,
      apiKey: KEY,
      model: "m",
      timeoutMs: 5,
    });

    expect(verdict).toEqual({ ok: false, reason: "unreachable" });
    expect(calls[0]!.init.signal).toBeInstanceOf(AbortSignal);
  });

  it("reports not-openai when the models response is not 200", async () => {
    const { calls, probe } = probeWith(() => new Response("nope", { status: 500 }));

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "not-openai",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`]);
  });

  it("reports not-openai when the models body has no data array", async () => {
    const { calls, probe } = probeWith(() => new Response(JSON.stringify({ object: "list" }), { status: 200 }));

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "not-openai",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`]);
  });

  it("reports auth on a 401 from chat completions", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models") ? catalogue(["m-1"]) : new Response(null, { status: 401 }),
    );

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({ ok: false, reason: "auth" });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("reports model-not-subscribed on a 403 from chat completions", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models")
        ? catalogue(["m-1"])
        : new Response(
            JSON.stringify({ error: { message: "you don't have an active subscription for the requested model" } }),
            { status: 403 },
          ),
    );

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "model-not-subscribed",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("reports no-json-mode on a 400 that mentions response_format", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models")
        ? catalogue(["m-1"])
        : new Response(JSON.stringify({ error: { message: "response_format is not supported" } }), { status: 400 }),
    );

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "no-json-mode",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("reports bad-shape when the provider ignores JSON mode and answers in prose", async () => {
    const { calls, probe } = probeWith((url) => (url.endsWith("/models") ? catalogue(["m-1"]) : completion("pong")));

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "bad-shape",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("reports bad-shape when the JSON body has no string answer", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models") ? catalogue(["m-1"]) : completion(JSON.stringify({ result: "pong" })),
    );

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "bad-shape",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("reports unreachable on any other non-200 from chat completions", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models") ? catalogue(["m-1"]) : new Response("boom", { status: 503 }),
    );

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m" })).resolves.toEqual({
      ok: false,
      reason: "unreachable",
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("accepts a JSON-mode provider and carries the catalogue model ids", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models") ? catalogue(["m-1", "m-2"]) : completion(JSON.stringify({ answer: "pong" })),
    );

    await expect(probe({ baseUrl: BASE, apiKey: KEY, model: "m-1" })).resolves.toEqual({
      ok: true,
      models: ["m-1", "m-2"],
    });
    expect(calls.map((call) => call.url)).toEqual([`${BASE}/models`, `${BASE}/chat/completions`]);
  });

  it("keeps the models call keyless and the chat call bearer-keyed, with a minimal body", async () => {
    const { calls, probe } = probeWith((url) =>
      url.endsWith("/models") ? catalogue(["m-1"]) : completion(JSON.stringify({ answer: "pong" })),
    );

    await probe({ baseUrl: BASE, apiKey: KEY, model: "m-1" });

    expect(new Headers(calls[0]!.init.headers).has("authorization")).toBe(false);
    expect(new Headers(calls[1]!.init.headers).get("authorization")).toBe(`Bearer ${KEY}`);

    const body = JSON.parse(String(calls[1]!.init.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      model: "m-1",
      response_format: { type: "json_object" },
      max_completion_tokens: 32,
      temperature: 0,
      stream: false,
    });
  });

  it("never lets the key appear in a verdict", async () => {
    const scenarios: ReadonlyArray<Readonly<{ name: string; handler: (url: string, init: RequestInit) => Response }>> = [
      { name: "bad-url", handler: () => new Response(null, { status: 200 }) },
      {
        name: "unreachable",
        handler: () => {
          throw new Error("socket closed");
        },
      },
      { name: "not-openai", handler: () => new Response("nope", { status: 500 }) },
      { name: "auth", handler: (url) => (url.endsWith("/models") ? catalogue(["m-1"]) : new Response(null, { status: 401 })) },
      {
        name: "model-not-subscribed",
        handler: (url) => (url.endsWith("/models") ? catalogue(["m-1"]) : new Response(null, { status: 403 })),
      },
      {
        name: "no-json-mode",
        handler: (url) =>
          url.endsWith("/models")
            ? catalogue(["m-1"])
            : new Response(JSON.stringify({ error: { message: "response_format unsupported" } }), { status: 400 }),
      },
      {
        name: "bad-shape",
        handler: (url) => (url.endsWith("/models") ? catalogue(["m-1"]) : completion("not json at all")),
      },
    ];

    for (const scenario of scenarios) {
      const { probe } = probeWith(scenario.handler);
      const baseUrl = scenario.name === "bad-url" ? "http://provider.test/v1" : BASE;
      const verdict = await probe({ baseUrl, apiKey: KEY, model: "m" });
      expect(verdict.ok, scenario.name).toBe(false);
      expect(JSON.stringify(verdict), scenario.name).not.toContain(KEY);
    }
  });
});
