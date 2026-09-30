import { describe, expect, it, vi } from "vitest";

import { createGitHubHealthCheck, createHealthHandler } from "../src/app/api/health/route";

const appEnv = {
  GITHUB_APP_ID: "12345",
  GITHUB_APP_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----\nstub\n-----END RSA PRIVATE KEY-----",
  GITHUB_INSTALLATION_ID: "67890",
  GITHUB_REPOSITORY: "owner/repo",
} as const;

const TOKEN_URL = "https://api.github.com/app/installations/67890/access_tokens";

/** Answers the token exchange, then hands back `status` on the data endpoint. */
function healthDeps(dataResponse: Response) {
  return {
    // The stub PEM is not a real key; signing is stubbed so no key is needed.
    sign: () => "signed.app.jwt",
    fetchImpl: async (url: string): Promise<Response> => {
      if (url === TOKEN_URL) {
        return new Response(
          JSON.stringify({
            token: "ghs_installation",
            expires_at: new Date(Date.now() + 3_600_000).toISOString(),
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      return dataResponse;
    },
  };
}

function trackedResponse(status: number) {
  let cancelled = false;
  const body = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  return { response: new Response(body, { status }), wasCancelled: () => cancelled };
}

describe("GET /api/health GitHub probe", () => {
  it("releases the GitHub response body on the success path", async () => {
    const tracked = trackedResponse(200);
    const check = createGitHubHealthCheck(appEnv, healthDeps(tracked.response));

    await expect(check()).resolves.toBeUndefined();

    expect(tracked.wasCancelled()).toBe(true);
  });

  it("releases the GitHub response body before failing on a bad status", async () => {
    const tracked = trackedResponse(503);
    const check = createGitHubHealthCheck(appEnv, healthDeps(tracked.response));

    await expect(check()).rejects.toThrow(/503/);

    expect(tracked.wasCancelled()).toBe(true);
  });
});

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

  it("logs why a check failed so an operator can tell 403 from a timeout", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await createHealthHandler({
        github: vi.fn().mockRejectedValue(new Error("GitHub returned 403")),
      })();

      expect(response.status).toBe(503);
      expect(spy).toHaveBeenCalledWith(expect.stringContaining("GitHub returned 403"));
    } finally {
      spy.mockRestore();
    }
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
