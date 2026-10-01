import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { authSchema } from "../../src/integrations/neon/schema";
import { createAuthForDatabase } from "../../src/modules/identity/auth";
import { ADMIN_SIGN_IN_CALLBACK_URL } from "../../src/modules/identity/admin-sign-in";

const migrationsFolder = fileURLToPath(new URL("../../drizzle/migrations", import.meta.url));
const productionOrigin = "https://dsm-atlas.haimonvieira.workers.dev";

let database: PGlite;

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
});

afterEach(async () => database.close());

describe("owner GitHub entry point against Better Auth", () => {
  it("returns the authorize URL whose redirect_uri is the URI registered on the GitHub App", async () => {
    const auth = createAuthForDatabase({
      databaseUrl: "unused",
      secret: "a".repeat(32),
      baseUrl: productionOrigin,
      rpId: "dsm-atlas.haimonvieira.workers.dev",
      trustedOrigins: [productionOrigin],
      githubClientId: "github-client-id",
      githubClientSecret: "github-client-secret",
    }, drizzle(database, { schema: authSchema }));

    const response = await auth.handler(new Request(`${productionOrigin}/api/auth/sign-in/social`, {
      method: "POST",
      headers: { origin: productionOrigin, "content-type": "application/json" },
      body: JSON.stringify({ provider: "github", callbackURL: ADMIN_SIGN_IN_CALLBACK_URL }),
    }));

    expect(response.status).toBe(200);
    const payload = await response.json() as { url?: string };
    const authorize = new URL(payload.url!);

    expect(`${authorize.origin}${authorize.pathname}`).toBe("https://github.com/login/oauth/authorize");
    expect(authorize.searchParams.get("redirect_uri")).toBe(`${productionOrigin}/api/auth/callback/github`);
    expect(authorize.searchParams.get("client_id")).toBe("github-client-id");
    // The callbackURL is only where the browser lands afterwards; it must not
    // leak into the OAuth redirect_uri the GitHub App validated.
    expect(authorize.searchParams.get("redirect_uri")).not.toContain(ADMIN_SIGN_IN_CALLBACK_URL);
  });

  it("gives a profile with no email a deterministic one, so sign-in cannot fail with email_not_found", async () => {
    // Reproduces the production failure: the provider answered, the profile had
    // no email because GitHub hides a private address, and the auth library
    // rejected the sign-in. Nothing here reads an email, so the field is only
    // satisfied — deterministically, so the same account always maps the same.
    const auth = createAuthForDatabase({
      databaseUrl: "unused",
      secret: "a".repeat(32),
      baseUrl: productionOrigin,
      rpId: "dsm-atlas.haimonvieira.workers.dev",
      trustedOrigins: [productionOrigin],
      githubClientId: "github-client-id",
      githubClientSecret: "github-client-secret",
    }, drizzle(database, { schema: authSchema }));

    const github = (auth.options.socialProviders as Record<string, { mapProfileToUser?: (profile: unknown) => unknown }>).github!;
    expect(typeof github.mapProfileToUser).toBe("function");

    expect(await github.mapProfileToUser!({ id: 12345, login: "haimon", email: null })).toEqual({
      name: "haimon",
      email: "12345+haimon@users.noreply.github.com",
    });
    expect(await github.mapProfileToUser!({ id: 12345, login: "haimon", email: "owner@example.test" })).toEqual({
      name: "haimon",
      email: "owner@example.test",
    });
    // The profile may also carry no public name. Our own plugin declares `name`
    // required, so an account without one would fail with
    // `MISSING_FIELD: name is required` right after the email fix let it
    // further. The login is always present and fills the gap.
    expect(await github.mapProfileToUser!({ id: 12345, login: "haimon", name: null, email: null })).toEqual({
      name: "haimon",
      email: "12345+haimon@users.noreply.github.com",
    });
    expect(await github.mapProfileToUser!({ id: 12345, login: "haimon", name: "Haimon Vieira", email: null })).toEqual({
      name: "Haimon Vieira",
      email: "12345+haimon@users.noreply.github.com",
    });
  });
});
