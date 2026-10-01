import { describe, expect, it, vi } from "vitest";

import { createByokModelsHandler } from "./route";

const BASE = "https://provider.test/v1";

function catalogue(ids: readonly string[]): Response {
  return new Response(JSON.stringify({ object: "list", data: ids.map((id) => ({ id })) }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function request(baseUrl: string | null): Request {
  const url = baseUrl === null ? "https://atlas.test/api/tutor/byok/models" : `https://atlas.test/api/tutor/byok/models?baseUrl=${encodeURIComponent(baseUrl)}`;
  return new Request(url);
}

describe("GET /api/tutor/byok/models", () => {
  it("returns the model ids without an Authorization header", async () => {
    const seen: string[][] = [];
    const fetchImpl = vi.fn(async (url: string, init: RequestInit) => {
      seen.push([...new Headers(init.headers).keys()]);
      expect(url).toBe(`${BASE}/models`);
      return catalogue(["m-1", "m-2"]);
    });

    const response = await createByokModelsHandler({ fetchImpl })(request(BASE));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ models: ["m-1", "m-2"] });
    expect(seen[0]).not.toContain("authorization");
  });

  it("rejects a URL the gate refuses before reaching the network", async () => {
    const fetchImpl = vi.fn(async () => catalogue(["m-1"]));

    for (const baseUrl of ["http://provider.test/v1", "https://127.0.0.1/v1", "https://localhost/v1"]) {
      const response = await createByokModelsHandler({ fetchImpl })(request(baseUrl));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: { code: "INVALID_BYOK_PROVIDER", message: "Provedor BYOK inválido." } });
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("never echoes the provider body when the catalogue is not OpenAI-shaped", async () => {
    const fetchImpl = vi.fn(async () => new Response("upstream secret detail", { status: 200 }));

    const response = await createByokModelsHandler({ fetchImpl })(request(BASE));

    expect(response.status).toBe(502);
    const body = await response.text();
    expect(body).not.toContain("upstream secret detail");
  });
});
