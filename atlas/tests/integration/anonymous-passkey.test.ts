import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createAuth, createAuthForDatabase, createVisitorIdentity } from "../../src/modules/identity/auth";
import { authSchema } from "../../src/integrations/neon/schema";

const migrationUrl = new URL(
  "../../drizzle/migrations/0001_identity_and_study.sql",
  import.meta.url,
);

let database: PGlite;

beforeEach(async () => {
  database = new PGlite();
  await database.exec(await readFile(migrationUrl, "utf8"));
});

afterEach(async () => database.close());

describe("pseudonymous visitor identity", () => {
  it("bootstraps anonymously, requests a discoverable passkey, and restores only pseudonymous session fields", async () => {
    let session: { user: { id: string } } | null = null;
    let hasPasskey = false;
    const calls: string[] = [];
    const identity = createVisitorIdentity({
      getSession: async () => session,
      signInAnonymous: async () => {
        calls.push("anonymous");
        session = { user: { id: "visitor-1" } };
        return session;
      },
      addPasskey: async () => {
        calls.push("passkey:required");
        hasPasskey = true;
      },
      hasPasskey: async () => hasPasskey,
    });

    expect(await identity.current()).toEqual({ kind: "local" });
    expect(await identity.createPasskeyProfile()).toEqual({ profileId: "visitor-1" });
    expect(calls).toEqual(["anonymous", "passkey:required"]);
    expect(await identity.current()).toEqual({ kind: "profile", profileId: "visitor-1" });
    expect(JSON.stringify(await identity.current())).not.toMatch(/name|email/i);
  });

  it("does not authorize a profile until passkey registration succeeds", async () => {
    const identity = createVisitorIdentity({
      getSession: async () => ({ user: { id: "visitor-2" } }),
      signInAnonymous: async () => {
        throw new Error("already signed in");
      },
      addPasskey: async () => {
        throw new DOMException("cancelled", "NotAllowedError");
      },
      hasPasskey: async () => false,
    });


    await expect(identity.createPasskeyProfile()).rejects.toThrow("cancelled");
    expect(await identity.current()).toEqual({ kind: "local" });
  });

  it("requires fixed HTTPS origins, a hostname RP ID, and a 32-byte secret", () => {
    const base = {
      databaseUrl: "postgresql://unused.invalid/atlas",
      secret: "a".repeat(32),
      baseUrl: "https://atlas.example",
      rpId: "atlas.example",
      trustedOrigins: ["https://atlas.example"],
    };

    expect(() => createAuth({ ...base, secret: "short" })).toThrow(/32 bytes/);
    expect(() => createAuth({ ...base, baseUrl: "http://atlas.example" })).toThrow(/HTTPS/);
    expect(() => createAuth({ ...base, rpId: "https://atlas.example" })).toThrow(/hostname/);
    expect(() => createAuth({ ...base, trustedOrigins: [] })).toThrow(/explicit HTTPS origins/);
  });
});

describe("Better Auth HTTP boundary", () => {
  it("bootstraps an anonymous session with opaque internal placeholders", async () => {
    const auth = createAuthForDatabase({
      databaseUrl: "unused",
      secret: "a".repeat(32),
      baseUrl: "https://atlas.example",
      rpId: "atlas.example",
      trustedOrigins: ["https://atlas.example"],
    }, drizzle(database, { schema: authSchema }));
    const response = await auth.handler(new Request("https://atlas.example/api/auth/sign-in/anonymous", {
      method: "POST",
      headers: { origin: "https://atlas.example", "cf-connecting-ip": "192.0.2.1" },
    }));

    expect(response.status).toBe(200);
    const body = await response.json() as { user: Record<string, unknown> };
    expect(body.user.isAnonymous).toBe(true);
    expect(body.user.id).toEqual(expect.any(String));
    expect(body.user.email).toMatch(/@anonymous\.placeholder\.invalid$/);
    expect(body.user.name).toBe("Anonymous");
    expect(body.user).not.toHaveProperty("role");
    expect(response.headers.get("set-cookie")).toMatch(/HttpOnly;.*Secure;.*SameSite=Lax/i);
  });

  it("requires the anonymous session and produces a fixed discoverable passkey challenge", async () => {
    const auth = createAuthForDatabase({
      databaseUrl: "unused",
      secret: "a".repeat(32),
      baseUrl: "https://atlas.example",
      rpId: "atlas.example",
      trustedOrigins: ["https://atlas.example"],
    }, drizzle(database, { schema: authSchema }));
    const anonymousResponse = await auth.handler(new Request("https://atlas.example/api/auth/sign-in/anonymous", {
      method: "POST",
      headers: { origin: "https://atlas.example" },
    }));
    const cookie = anonymousResponse.headers.get("set-cookie")?.split(";")[0];
    expect(cookie).toBeTruthy();

    const challengeResponse = await auth.handler(new Request("https://atlas.example/api/auth/passkey/generate-register-options", {
      headers: { cookie: cookie!, origin: "https://atlas.example" },
    }));
    expect(challengeResponse.status).toBe(200);
    const challenge = await challengeResponse.json() as {
      rp: { id: string };
      authenticatorSelection: { residentKey: string; requireResidentKey: boolean };
      challenge: string;
    };
    expect(challenge.rp.id).toBe("atlas.example");
    expect(challenge.authenticatorSelection).toMatchObject({ residentKey: "required", requireResidentKey: true });
    expect(challenge.challenge).toEqual(expect.any(String));

    const challengeCookie = challengeResponse.headers.get("set-cookie")?.split(";")[0];
    const headers = {
      "content-type": "application/json",
      cookie: `${cookie}; ${challengeCookie}`,
      origin: "https://atlas.example",
    };
    const body = JSON.stringify({ response: {} });
    const first = await auth.handler(new Request("https://atlas.example/api/auth/passkey/verify-registration", {
      method: "POST", headers, body,
    }));
    const replay = await auth.handler(new Request("https://atlas.example/api/auth/passkey/verify-registration", {
      method: "POST", headers, body,
    }));
    expect(first.status).toBe(500);
    expect(await replay.json()).toMatchObject({ code: "CHALLENGE_NOT_FOUND" });
  });
});

describe("identity schema boundaries", () => {
  it("creates the profile only after a passkey and cascades all visitor data", async () => {
    await database.exec(`
      INSERT INTO "user" (id, name, email, email_verified, is_anonymous, created_at, updated_at)
      VALUES ('visitor-1', 'Visitante', 'opaque@anonymous.placeholder.invalid', false, true, now(), now());
      INSERT INTO passkey (id, public_key, user_id, credential_id, counter, device_type, backed_up, created_at)
      VALUES ('key-1', 'public', 'visitor-1', 'credential-1', 0, 'singleDevice', false, now());
      INSERT INTO study_progress (id, profile_id, material_path, material_commit_sha, status, updated_at)
      VALUES ('progress-1', 'visitor-1', 'DSM1/ALP/aula.md', 'abc123', 'studying', now());
      DELETE FROM "user" WHERE id = 'visitor-1';
    `);

    const profiles = await database.query("SELECT id FROM study_profile");
    const progress = await database.query("SELECT id FROM study_progress");
    expect(profiles.rows).toEqual([]);

    await database.exec(`
      INSERT INTO "user" (id, name, email, email_verified, is_anonymous, created_at, updated_at)
      VALUES ('admin-1', 'Owner', 'owner@example.test', true, false, now(), now());
      INSERT INTO passkey (id, public_key, user_id, credential_id, counter, device_type, backed_up, created_at)
      VALUES ('admin-key', 'public', 'admin-1', 'admin-credential', 0, 'singleDevice', false, now());
    `);
    const adminProfiles = await database.query("SELECT id FROM study_profile WHERE id = 'admin-1'");
    expect(adminProfiles.rows).toEqual([]);
    expect(progress.rows).toEqual([]);
  });

  it("rejects duplicate material records per profile and invalid study status", async () => {
    await database.exec(`
      INSERT INTO "user" (id, name, email, email_verified, is_anonymous, created_at, updated_at)
      VALUES ('visitor-1', 'Visitante', 'opaque@anonymous.placeholder.invalid', false, true, now(), now());
      INSERT INTO passkey (id, public_key, user_id, credential_id, counter, device_type, backed_up, created_at)
      VALUES ('key-1', 'public', 'visitor-1', 'credential-1', 0, 'singleDevice', false, now());
      INSERT INTO favorite (id, profile_id, material_path, material_commit_sha, value, updated_at)
      VALUES ('favorite-1', 'visitor-1', 'DSM1/ALP/aula.md', 'abc123', true, now());
    `);

    await expect(database.exec(`
      INSERT INTO favorite (id, profile_id, material_path, material_commit_sha, value, updated_at)
      VALUES ('favorite-2', 'visitor-1', 'DSM1/ALP/aula.md', 'abc123', false, now());
    `)).rejects.toThrow();
    await expect(database.exec(`
      INSERT INTO study_progress (id, profile_id, material_path, material_commit_sha, status, updated_at)
      VALUES ('progress-1', 'visitor-1', 'DSM1/ALP/aula.md', 'abc123', 'invalid', now());
    `)).rejects.toThrow();
  });

  it("stores expiring challenges once and prevents replay", async () => {
    await database.exec(`
      INSERT INTO verification (id, identifier, value, expires_at, created_at, updated_at)
      VALUES ('challenge-1', 'signed-cookie-id', '{"type":"registration"}', now() + interval '5 minutes', now(), now());
    `);

    const first = await database.query(`
      DELETE FROM verification
      WHERE identifier = 'signed-cookie-id' AND expires_at > now()
      RETURNING value
    `);
    const replay = await database.query(`
      DELETE FROM verification
      WHERE identifier = 'signed-cookie-id' AND expires_at > now()
      RETURNING value
    `);
    expect(first.rows).toHaveLength(1);
    expect(replay.rows).toHaveLength(0);

    await database.exec(`
      INSERT INTO verification (id, identifier, value, expires_at, created_at, updated_at)
      VALUES ('challenge-2', 'expired-cookie-id', '{}', now() - interval '1 second', now(), now());
    `);
    const expired = await database.query(`
      DELETE FROM verification
      WHERE identifier = 'expired-cookie-id' AND expires_at > now()
      RETURNING value
    `);
    expect(expired.rows).toHaveLength(0);
  });
});
