import { describe, expect, it, vi } from "vitest";

import { createHealthHandler } from "../src/app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok only after both injected adapters respond", async () => {
    const database = vi.fn().mockResolvedValue(undefined);
    const github = vi.fn().mockResolvedValue(undefined);

    const response = await createHealthHandler({ database, github })();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      runtime: "cloudflare",
      database: "ok",
      github: "ok",
    });
  });

  it("reports an adapter failure without exposing its error", async () => {
    const response = await createHealthHandler({
      database: vi.fn().mockRejectedValue(new Error("secret detail")),
      github: vi.fn().mockResolvedValue(undefined),
    })();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      status: "error",
      runtime: "cloudflare",
      database: "error",
      github: "ok",
    });
  });

  it("reports missing configuration honestly", async () => {
    const response = await createHealthHandler({})();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      status: "unconfigured",
      runtime: "cloudflare",
      database: "unconfigured",
      github: "unconfigured",
    });
  });
});
