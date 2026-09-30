import { describe, expect, it } from "vitest";

import { createTurnstileGate, TURNSTILE_VERIFY_URL } from "./turnstile-gate";

function siteverify(success: boolean, status = 200) {
  return new Response(JSON.stringify(success ? { success: true } : { success: false, "error-codes": ["invalid-input-response"] }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("Turnstile first-use gate", () => {
  it("accepts a verified token and posts secret, token and client ip", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const gate = createTurnstileGate({
      secret: "turnstile-secret",
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return siteverify(true);
      },
    });

    const verified = await gate({
      request: new Request("https://atlas.test/api/tutor/turn", { headers: { "cf-connecting-ip": "203.0.113.42" } }),
      turnstileToken: "token-abc",
    });

    expect(verified).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(TURNSTILE_VERIFY_URL);
    expect(JSON.parse(calls[0]!.init.body as string)).toEqual({
      secret: "turnstile-secret",
      response: "token-abc",
      remoteip: "203.0.113.42",
    });
  });

  it("fails closed on rejection, transport errors and missing material", async () => {
    const rejecting = createTurnstileGate({ secret: "s", fetchImpl: async () => siteverify(false) });
    expect(await rejecting({ request: new Request("https://atlas.test/"), turnstileToken: "t" })).toBe(false);

    const erroring = createTurnstileGate({
      secret: "s",
      fetchImpl: async () => { throw new Error("boom"); },
    });
    expect(await erroring({ request: new Request("https://atlas.test/"), turnstileToken: "t" })).toBe(false);

    const failing = createTurnstileGate({ secret: "s", fetchImpl: async () => new Response("bad", { status: 500 }) });
    expect(await failing({ request: new Request("https://atlas.test/"), turnstileToken: "t" })).toBe(false);

    const gate = createTurnstileGate({ secret: "s", fetchImpl: async () => siteverify(true) });
    expect(await gate({ request: new Request("https://atlas.test/"), turnstileToken: null })).toBe(false);
    expect(await createTurnstileGate({ secret: "", fetchImpl: async () => siteverify(true) })({
      request: new Request("https://atlas.test/"),
      turnstileToken: "t",
    })).toBe(false);
  });
});
