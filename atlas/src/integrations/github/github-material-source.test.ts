import { createVerify, generateKeyPairSync } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createGitHubInstallationTransport,
  createGitHubMaterialSource,
  createInstallationTokenProvider,
  githubAppConfigured,
  githubAppJwtClaims,
  signGitHubAppJwt,
  type GitHubTransport,
} from "./github-material-source";

function transport(responses: Record<string, unknown>): GitHubTransport {
  return async (path) => {
    void path;
    return { status: 200, json: async () => responses[path] ?? {} };
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const decodeBase64Url = (value: string): string =>
  Buffer.from(value.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8");

describe("github material source adapter", () => {
  it("creates blobs as base64 and returns the SHA", async () => {
    const seen: string[] = [];
    const source = createGitHubMaterialSource(
      async (_path, init) => {
        if (init.body) seen.push(init.body);
        return { status: 201, json: async () => ({ sha: "abc123" }) };
      },
      "owner/repo",
    );
    const sha = await source.createBlob(new Uint8Array([72, 105]));
    expect(sha).toBe("abc123");
    expect(seen[0]).toContain("base64");
  });

  it("reads blobs and trees through the transport seam", async () => {
    const source = createGitHubMaterialSource(
      transport({
        "/repos/owner/repo/commits/HEAD": { sha: "head-sha" },
        "/repos/owner/repo/git/commits/head-sha": { tree: { sha: "tree-sha" } },
        "/repos/owner/repo/git/trees/tree-sha?recursive=1": { tree: [] },
      }),
      "owner/repo",
    );
    await expect(source.readHead()).resolves.toBe("head-sha");
    await expect(source.readTree("head-sha")).resolves.toEqual([]);
  });

  it("addresses the blob endpoint by blob SHA, never by commit SHA", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(async (path, init) => {
      calls.push(`${init.method} ${path}`);
      return {
        status: 200,
        json: async () => ({ content: "SGk=", encoding: "base64" }),
      };
    }, "owner/repo");
    const bytes = await source.readBlob("deadbeef");
    expect(bytes).toEqual(new Uint8Array([72, 105]));
    expect(calls).toEqual(["GET /repos/owner/repo/git/blobs/deadbeef"]);
  });

  it("resolves commit to tree before hitting the trees endpoint", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(async (path, init) => {
      calls.push(`${init.method} ${path}`);
      if (path === "/repos/owner/repo/git/commits/commit-sha") {
        return { status: 200, json: async () => ({ tree: { sha: "tree-sha" } }) };
      }
      return { status: 200, json: async () => ({ tree: [] }) };
    }, "owner/repo");
    await source.readTree("commit-sha");
    expect(calls).toEqual([
      "GET /repos/owner/repo/git/commits/commit-sha",
      "GET /repos/owner/repo/git/trees/tree-sha?recursive=1",
    ]);
  });

  it("never calls fetch directly", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(async (path, init) => {
      calls.push(`${init.method} ${path}`);
      return { status: 201, json: async () => ({ sha: "x" }) };
    }, "owner/repo");
    await source.createBlob(new Uint8Array([1]));
    expect(calls).toEqual(["POST /repos/owner/repo/git/blobs"]);
  });
});

const appEnv = {
  GITHUB_APP_ID: "12345",
  GITHUB_APP_PRIVATE_KEY:
    "-----BEGIN RSA PRIVATE KEY-----\nstub\n-----END RSA PRIVATE KEY-----",
  GITHUB_INSTALLATION_ID: "67890",
  GITHUB_REPOSITORY: "owner/repo",
} as const;

const TOKEN_URL = "https://api.github.com/app/installations/67890/access_tokens";

/** Records every request and answers the token exchange from `clock`. */
function tokenFetch(calls: { url: string; init: RequestInit }[], clock: () => number) {
  return async (url: string, init: RequestInit): Promise<Response> => {
    calls.push({ url, init });
    return jsonResponse({
      token: "ghs_installation",
      expires_at: new Date(clock() + 3_600_000).toISOString(),
    });
  };
}

describe("GitHub App installation tokens", () => {
  it("signs an RS256 JWT with a backdated iat and a short exp", () => {
    // Throwaway keypair generated in-test: no real credential is involved.
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });
    const nowMs = 1_700_000_000_000;
    const jwt = signGitHubAppJwt(githubAppJwtClaims("12345", nowMs), privateKey);
    const [header, payload, signature] = jwt.split(".") as [string, string, string];

    expect(JSON.parse(decodeBase64Url(header))).toEqual({ alg: "RS256", typ: "JWT" });
    const claims = JSON.parse(decodeBase64Url(payload)) as {
      iss: string;
      iat: number;
      exp: number;
    };
    expect(claims.iss).toBe("12345");
    // Backdated for clock drift, and short-lived: GitHub rejects exp > 10 min.
    expect(claims.iat).toBe(1_700_000_000 - 60);
    expect(claims.exp).toBeGreaterThan(1_700_000_000);
    expect(claims.exp - claims.iat).toBeLessThanOrEqual(600);
    expect(
      createVerify("RSA-SHA256")
        .update(`${header}.${payload}`)
        .verify(publicKey, Buffer.from(signature.replaceAll("-", "+").replaceAll("_", "/"), "base64")),
    ).toBe(true);
  });

  it("exchanges the App JWT once for an installation token scoped to the installation and the repository", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const token = createInstallationTokenProvider(appEnv, {
      fetchImpl: tokenFetch(calls, () => 1_700_000_000_000),
      sign: () => "signed.app.jwt",
      now: () => 1_700_000_000_000,
      cache: new Map(),
    });

    await expect(token()).resolves.toBe("ghs_installation");
    await expect(token()).resolves.toBe("ghs_installation");

    expect(calls.map((call) => call.url)).toEqual([TOKEN_URL]);
    expect(calls[0]!.init.method).toBe("POST");
    expect(calls[0]!.init.headers).toMatchObject({
      authorization: "Bearer signed.app.jwt",
      accept: "application/vnd.github+json",
    });
    // Least privilege: the token covers only the repository the routes use,
    // never every repository the installation was granted.
    expect(JSON.parse(calls[0]!.init.body as string)).toEqual({ repositories: ["repo"] });
  });

  it("scopes the token to the repository name from an owner/name pair", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const token = createInstallationTokenProvider(
      { ...appEnv, GITHUB_REPOSITORY: "some-owner/dsm-atlas" },
      {
        fetchImpl: tokenFetch(calls, () => 1_700_000_000_000),
        sign: () => "signed.app.jwt",
        cache: new Map(),
      },
    );

    await token();

    expect(JSON.parse(calls[0]!.init.body as string)).toEqual({ repositories: ["dsm-atlas"] });
  });

  it("caps the cached expiry at one hour even when GitHub reports a far-future date", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    let clock = 1_700_000_000_000;
    const token = createInstallationTokenProvider(appEnv, {
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        // GitHub documents a 1-hour lifetime; a far-future value must not keep
        // the token cached past its real validity.
        return jsonResponse({ token: "ghs_installation", expires_at: "3000-01-01T00:00:00Z" });
      },
      sign: () => "signed.app.jwt",
      now: () => clock,
      cache: new Map(),
    });

    await token();
    clock += 3_500_000;
    await token();

    expect(calls).toHaveLength(1);
    // Past the local one-hour cap (minus the expiry margin), it re-mints.
    clock += 100_000;
    await token();
    expect(calls).toHaveLength(2);
  });

  it("re-mints once the cached token is inside the expiry margin", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    let clock = 1_700_000_000_000;
    const token = createInstallationTokenProvider(appEnv, {
      fetchImpl: tokenFetch(calls, () => clock),
      sign: () => "signed.app.jwt",
      now: () => clock,
      cache: new Map(),
    });

    await token();
    // Past `expires_at - TOKEN_EXPIRY_MARGIN_MS`, so the cached token is no
    // longer usable and must be re-minted.
    clock += 3_550_000;
    await token();

    expect(calls).toHaveLength(2);
  });

  it("keeps the minted token in memory only, sharing it across providers in the isolate", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const env = { ...appEnv, GITHUB_APP_ID: "777" };
    const deps = {
      fetchImpl: tokenFetch(calls, () => 1_700_000_000_000),
      sign: () => "signed.app.jwt",
      now: () => 1_700_000_000_000,
    };

    await createInstallationTokenProvider(env, deps)();
    await createInstallationTokenProvider(env, deps)();

    expect(calls.map((call) => call.url)).toEqual([
      "https://api.github.com/app/installations/67890/access_tokens",
    ]);
  });

  it("fails closed on 401/403 without leaking the JWT, the private key or the provider body", async () => {
    const privateKey =
      "-----BEGIN RSA PRIVATE KEY-----\nSECRET-KEY-MATERIAL\n-----END RSA PRIVATE KEY-----";
    const jwt = "header.SECRET-JWT.payload";
    for (const status of [401, 403]) {
      const token = createInstallationTokenProvider(
        { ...appEnv, GITHUB_APP_PRIVATE_KEY: privateKey },
        {
          fetchImpl: async () => jsonResponse({ message: `Bad credentials for ${jwt}` }, status),
          sign: () => jwt,
          cache: new Map(),
        },
      );

      const error = await token().catch((failure: unknown) => failure);

      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain(String(status));
      expect((error as Error).message).not.toContain(jwt);
      expect((error as Error).message).not.toContain("SECRET-KEY-MATERIAL");
      expect((error as Error).message).not.toContain("Bad credentials");
    }
  });

  it("rejects an unusable token response instead of caching a blank token", async () => {
    const token = createInstallationTokenProvider(appEnv, {
      fetchImpl: async () => jsonResponse({ token: "", expires_at: "not-a-date" }),
      sign: () => "signed.app.jwt",
      cache: new Map(),
    });

    await expect(token()).rejects.toThrow(/unusable/);
  });

  it("requires the App credentials and never a pre-minted token", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const token = createInstallationTokenProvider(
      { GITHUB_REPOSITORY: "owner/repo" },
      {
        fetchImpl: tokenFetch(calls, () => 1_700_000_000_000),
        sign: () => "signed.app.jwt",
        cache: new Map(),
      },
    );

    await expect(token()).rejects.toThrow(/GITHUB_APP_ID is required/);
    expect(calls).toHaveLength(0);
  });

  it("reports the App configuration from the App env names alone", () => {
    expect(githubAppConfigured(appEnv)).toBe(true);
    expect(githubAppConfigured({ ...appEnv, GITHUB_APP_ID: undefined })).toBe(false);
    expect(githubAppConfigured({ ...appEnv, GITHUB_APP_PRIVATE_KEY: undefined })).toBe(false);
    expect(githubAppConfigured({ ...appEnv, GITHUB_INSTALLATION_ID: undefined })).toBe(false);
    expect(githubAppConfigured({ ...appEnv, GITHUB_REPOSITORY: undefined })).toBe(false);
  });

  it("releases the data response body for callers that only read the status", async () => {
    let cancelled = false;
    const body = new ReadableStream({
      cancel() {
        cancelled = true;
      },
    });
    const transport = createGitHubInstallationTransport(appEnv, {
      fetchImpl: async (url, init) => {
        if (url === TOKEN_URL) return tokenFetch([], () => 1_700_000_000_000)(url, init);
        return new Response(body, { status: 200 });
      },
      sign: () => "signed.app.jwt",
      cache: new Map(),
    });

    const response = await transport("/repos/owner/repo/commits/HEAD", { method: "GET" });
    await response.cancel?.();

    expect(cancelled).toBe(true);
  });

  it("sends the installation token, never the App JWT, to the data endpoints", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const source = createGitHubMaterialSource(
      createGitHubInstallationTransport(appEnv, {
        fetchImpl: async (url, init) => {
          if (url === TOKEN_URL) return tokenFetch(calls, () => 1_700_000_000_000)(url, init);
          calls.push({ url, init });
          return jsonResponse({ sha: "head-sha" });
        },
        sign: () => "signed.app.jwt",
        now: () => 1_700_000_000_000,
        cache: new Map(),
      }),
      "owner/repo",
    );

    await expect(source.readHead()).resolves.toBe("head-sha");
    await expect(source.readHead()).resolves.toBe("head-sha");

    expect(calls.map((call) => call.url)).toEqual([
      TOKEN_URL,
      "https://api.github.com/repos/owner/repo/commits/HEAD",
      "https://api.github.com/repos/owner/repo/commits/HEAD",
    ]);
    expect(calls[1]!.init.headers).toMatchObject({ authorization: "Bearer ghs_installation" });
    expect(JSON.stringify(calls.slice(1))).not.toContain("signed.app.jwt");
  });
});
