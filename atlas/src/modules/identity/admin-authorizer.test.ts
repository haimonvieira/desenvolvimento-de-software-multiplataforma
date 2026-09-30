import { describe, expect, it } from "vitest";

import { createAdminAuthorizer, createAdminBootstrapHandler, createGitHubIdentityVerifier, type AdminDependencies } from "./admin-authorizer";
import { createStudySyncHandler } from "../study/sync-handler";

const ownerGithubId = "12345678";

function request(path = "/admin", body?: unknown) {
  return new Request(`https://atlas.example${path}`, body === undefined ? undefined : {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function dependencies(overrides: Partial<AdminDependencies> = {}): AdminDependencies {
  return {
    configuredOwnerGithubId: ownerGithubId,
    session: async () => ({ userId: "owner", expiresAt: new Date(Date.now() + 60_000) }),
    githubIdentity: async () => ({ userId: ownerGithubId }),
    identity: async () => ({ adminId: "owner", githubUserId: ownerGithubId }),
    createIdentity: async () => ({ adminId: "owner", created: true }),
    audit: async () => undefined,
    ...overrides,
  };
}

describe("positive administrative authorization", () => {
  it.each<[string, Partial<AdminDependencies>]>([
    ["unauthenticated", { session: async () => null }],
    ["anonymous visitor", { session: async () => ({ userId: "visitor", expiresAt: new Date(Date.now() + 60_000) }), identity: async () => null }],
    ["ordinary passkey profile", { session: async () => ({ userId: "profile", expiresAt: new Date(Date.now() + 60_000) }), identity: async () => null }],
    ["wrong GitHub account", { githubIdentity: async () => ({ userId: "87654321" }) }],
    ["expired admin session", { session: async () => ({ userId: "owner", expiresAt: new Date(Date.now() - 1) }) }],
  ])("rejects %s", async (_name, overrides) => {
    await expect(createAdminAuthorizer(dependencies(overrides)).requireAdmin(request())).rejects.toMatchObject({ status: 403 });
  });

  it("allows only the configured owner with a current GitHub verification", async () => {
    await expect(createAdminAuthorizer(dependencies()).requireAdmin(request())).resolves.toEqual({ adminId: "owner" });
  });

  it("verifies the session-bound GitHub account against the current-user API", async () => {
    const authorizationHeaders: string[] = [];
    const verify = createGitHubIdentityVerifier({
      listUserAccounts: async () => [{ id: "account-row", userId: "owner", providerId: "github", accountId: ownerGithubId }],
      getAccessToken: async () => ({ accessToken: "secret-access-token" }),
    }, async (_url, init) => {
      authorizationHeaders.push(new Headers(init?.headers).get("authorization") ?? "");
      return Response.json({ id: Number(ownerGithubId) });
    });

    await expect(verify(request(), "owner")).resolves.toEqual({ userId: ownerGithubId });
    expect(authorizationHeaders).toEqual(["Bearer secret-access-token"]);
  });

  it("rejects a GitHub token whose current-user response differs from its immutable account subject", async () => {
    const verify = createGitHubIdentityVerifier({
      listUserAccounts: async () => [{ id: "account-row", userId: "owner", providerId: "github", accountId: ownerGithubId }],
      getAccessToken: async () => ({ accessToken: "secret-access-token" }),
    }, async () => Response.json({ id: 87654321 }));

    await expect(verify(request(), "owner")).resolves.toBeNull();
  });

  it("fails closed with 403 at every admin entry when the GitHub identity check throws", async () => {
    const githubFailure = async (): Promise<{ userId: string }> => {
      throw new Error("GitHub is unreachable");
    };
    const authorizer = createAdminAuthorizer(dependencies({ githubIdentity: githubFailure }));
    const handler = createAdminBootstrapHandler(createAdminAuthorizer(dependencies({ identity: async () => null, githubIdentity: githubFailure })));

    await expect(authorizer.requireAdmin(request())).rejects.toMatchObject({ status: 403 });
    await expect(authorizer.authorizePasskeyAddition(request(), "recovery")).rejects.toMatchObject({ status: 403 });
    expect((await handler(request("/api/admin/bootstrap", {}))).status).toBe(403);
  });

  it("bootstraps the configured numeric GitHub owner once and audits no token", async () => {
    const created: string[] = [];
    const audited: unknown[] = [];
    const handler = createAdminBootstrapHandler(createAdminAuthorizer(dependencies({
      identity: async () => null,
      createIdentity: async ({ adminId, githubUserId }) => {
        created.push(`${adminId}:${githubUserId}`);
        return { adminId, created: true };
      },
      audit: async (event) => { audited.push(event); },
    })));

    const response = await handler(request("/api/admin/bootstrap", {}));

    expect(response.status).toBe(201);
    expect(created).toEqual([`owner:${ownerGithubId}`]);
    expect(audited).toEqual([{ action: "admin.bootstrap", adminId: "owner" }]);
    expect(JSON.stringify(audited)).not.toMatch(/token/i);
  });

  it("keeps the first identity immutable when bootstrap is repeated", async () => {
    const identity = { adminId: "owner", githubUserId: ownerGithubId };
    let creates = 0;
    const handler = createAdminBootstrapHandler(createAdminAuthorizer(dependencies({
      identity: async () => identity,
      createIdentity: async () => { creates += 1; return { adminId: "replacement", created: true }; },
    })));

    expect((await handler(request("/api/admin/bootstrap", { adminId: "replacement", role: "admin" }))).status).toBe(200);
    expect(creates).toBe(0);
    expect(identity).toEqual({ adminId: "owner", githubUserId: ownerGithubId });
  });

  it("creates the owner identity exactly once across repeated bootstrap visits", async () => {
    let stored: { adminId: string; githubUserId: string } | null = null;
    let creates = 0;
    const handler = createAdminBootstrapHandler(createAdminAuthorizer(dependencies({
      identity: async () => stored,
      createIdentity: async ({ adminId, githubUserId }) => {
        creates += 1;
        stored = { adminId, githubUserId };
        return { adminId, created: true };
      },
    })));

    expect((await handler(request("/api/admin/bootstrap", {}))).status).toBe(201);
    expect((await handler(request("/api/admin/bootstrap", {}))).status).toBe(200);
    expect((await handler(request("/api/admin/bootstrap", {}))).status).toBe(200);

    expect(creates).toBe(1);
    expect(stored).toEqual({ adminId: "owner", githubUserId: ownerGithubId });
  });

  it("refuses a non-owner GitHub account without creating an identity row", async () => {
    let creates = 0;
    const response = await createAdminBootstrapHandler(createAdminAuthorizer(dependencies({
      githubIdentity: async () => ({ userId: "87654321" }),
      identity: async () => null,
      createIdentity: async () => {
        creates += 1;
        return { adminId: "owner", created: true };
      },
    })))(request("/api/admin/bootstrap", {}));

    expect(response.status).toBe(403);
    expect(creates).toBe(0);
    expect(await response.json()).toEqual({ error: "Proibido" });
  });

  it.each<[string, Partial<AdminDependencies>]>([
    ["wrong owner", { githubIdentity: async () => ({ userId: "87654321" }) }],
    ["non-numeric configured owner", { configuredOwnerGithubId: "octocat" }],
  ])("refuses bootstrap for %s", async (_name, overrides) => {
    const response = await createAdminBootstrapHandler(createAdminAuthorizer(dependencies({ identity: async () => null, ...overrides })))(request("/api/admin/bootstrap", {}));
    expect(response.status).toBe(403);
  });

  it("recovers only after repeating current GitHub verification and then permits a new admin passkey", async () => {
    let githubId = "87654321";
    const authorizer = createAdminAuthorizer(dependencies({ githubIdentity: async () => ({ userId: githubId }) }));

    await expect(authorizer.authorizePasskeyAddition(request(), "recovery")).rejects.toMatchObject({ status: 403 });
    githubId = ownerGithubId;
    await expect(authorizer.authorizePasskeyAddition(request(), "recovery")).resolves.toEqual({ adminId: "owner" });
  });

  it("returns 403 to a visitor at every current admin endpoint", async () => {
    const visitor = createAdminAuthorizer(dependencies({ session: async () => ({ userId: "visitor", expiresAt: new Date(Date.now() + 60_000) }), githubIdentity: async () => null, identity: async () => null }));
    const endpoints = [
      createAdminBootstrapHandler(visitor),
    ];
    for (const endpoint of endpoints) expect((await endpoint(request("/api/admin/bootstrap", {}))).status).toBe(403);
  });

  it("rejects attempted public role escalation before touching the study store", async () => {
    let usedStore = false;
    const handler = createStudySyncHandler({
      profileId: async () => "visitor",
      store: () => {
        usedStore = true;
        return { sync: async () => { throw new Error("unreachable"); } };
      },
    });
    const response = await handler(request("/api/study/sync", {
      requestId: "7b29dd1d-1d1c-4fca-8791-177383d5191f",
      deviceId: "cff4eecd-f377-40bf-9168-7591d3120c78",
      cursor: "0",
      outbox: [],
      admin: true,
    }));

    expect(response.status).toBe(422);
    expect(usedStore).toBe(false);
  });
});
