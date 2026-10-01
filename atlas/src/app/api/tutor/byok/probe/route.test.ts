import { describe, expect, it, vi } from "vitest";

import { createByokProbeHandler } from "./route";

const KEY = "sk-visitor-secret-9F3";
const BASE = "https://provider.test/v1";

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

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://atlas.test/api/tutor/byok/probe", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/tutor/byok/probe", () => {
  it("reads the key from the header only and approves a JSON-mode provider", async () => {
    const seen: Array<Record<string, string>> = [];
    const fetchImpl = vi.fn(async (url: string, init: RequestInit) => {
      seen.push(Object.fromEntries(new Headers(init.headers).entries()));
      return url.endsWith("/models") ? catalogue(["m-1"]) : completion(JSON.stringify({ answer: "pong" }));
    });

    const response = await createByokProbeHandler({ fetchImpl })(
      request({ baseUrl: BASE, model: "m-1" }, { authorization: `Bearer ${KEY}` }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, models: ["m-1"] });
    expect(seen[0]).not.toHaveProperty("authorization");
    expect(seen[1]?.["authorization"]).toBe(`Bearer ${KEY}`);
  });

  it("ignores a key smuggled into the body", async () => {
    const fetchImpl = vi.fn(async () => catalogue(["m-1"]));

    // `.strict()` refuses the extra field outright; the run never starts and
    // the body key is never read.
    const response = await createByokProbeHandler({ fetchImpl })(request({ baseUrl: BASE, model: "m-1", apiKey: KEY }));

    expect(response.status).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("never returns the key or the provider body on failure", async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      url.endsWith("/models")
        ? catalogue(["m-1"])
        : new Response(`secret for ${KEY}: boom`, { status: 503 }),
    );

    const response = await createByokProbeHandler({ fetchImpl })(
      request({ baseUrl: BASE, model: "m-1" }, { authorization: `Bearer ${KEY}` }),
    );

    expect(await response.json()).toEqual({ ok: false, reason: "unreachable" });
    const raw = await (
      await createByokProbeHandler({ fetchImpl })(request({ baseUrl: BASE, model: "m-1" }, { authorization: `Bearer ${KEY}` }))
    ).text();
    expect(raw).not.toContain(KEY);
    expect(raw).not.toContain("boom");
  });
});
