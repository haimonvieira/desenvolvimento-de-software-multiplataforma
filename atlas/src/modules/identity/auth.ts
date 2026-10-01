import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter, type DB } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";

import { createDatabase } from "../../integrations/neon/db";
import { authSchema } from "../../integrations/neon/schema";

const pseudonymousUserOutput = {
  id: "pseudonymous-user-output",
  schema: {
    user: {
      fields: {
        name: { type: "string" as const, required: true, returned: false },
        email: { type: "string" as const, required: true, returned: false },
      },
    },
  },
};

export type VisitorSession = Readonly<{ user: Readonly<{ id: string }> }>;
export type VisitorIdentityState =
  | Readonly<{ kind: "local" }>
  | Readonly<{ kind: "profile"; profileId: string }>;

export interface VisitorIdentity {
  current(): Promise<VisitorIdentityState>;
  createPasskeyProfile(): Promise<{ profileId: string }>;
}

export interface VisitorAuthClient {
  getSession(): Promise<VisitorSession | null>;
  signInAnonymous(): Promise<VisitorSession>;
  addPasskey(): Promise<void>;
  hasPasskey(userId: string): Promise<boolean>;
}

export function createVisitorIdentity(client: VisitorAuthClient): VisitorIdentity {
  return {
    async current() {
      const session = await client.getSession();
      if (!session || !(await client.hasPasskey(session.user.id))) return { kind: "local" };
      return { kind: "profile", profileId: session.user.id };
    },
    async createPasskeyProfile() {
      const session = (await client.getSession()) ?? (await client.signInAnonymous());
      await client.addPasskey();
      return { profileId: session.user.id };
    },
  };
}

export type AuthRuntimeConfig = Readonly<{
  databaseUrl: string;
  secret: string;
  baseUrl: string;
  rpId: string;
  trustedOrigins: readonly string[];
  githubClientId?: string;
  githubClientSecret?: string;
  afterAdminPasskeyRegistration?: (request: Request, purpose: "addition" | "recovery") => Promise<void>;
}>;
export function createAuth(config: AuthRuntimeConfig) {
  assertProductionAuthConfig(config);
  return createAuthForDatabase(config, createDatabase(config.databaseUrl));
}

/**
 * GitHub returns an email only when the account's address is public, or when the
 * app is allowed to read the private one. A private address made owner sign-in
 * fail with `email_not_found` — the provider answered, the profile simply had no
 * email and `/user/emails` returned nothing usable.
 *
 * Nothing in this app reads a user's email: the owner is identified by the
 * numeric GitHub id (`ADMIN_GITHUB_USER_ID`) and visitors are anonymous. The
 * field is required by the auth library's user model, not by the product, so a
 * deterministic GitHub-style noreply address satisfies it without storing an
 * address we have no use for — and without depending on an app permission we
 * would only hold to satisfy a field nobody reads.
 */
export function githubNoreplyEmail(profile: Readonly<{ id?: number | string | null; login?: string | null }>): string {
  return `${profile.id ?? "0"}+${profile.login ?? "user"}@users.noreply.github.com`;
}

export function createAuthForDatabase(config: AuthRuntimeConfig, database: DB) {
  assertProductionAuthConfig(config);

  return betterAuth({
    appName: "DSM Atlas",
    baseURL: config.baseUrl,
    secret: config.secret,
    trustedOrigins: [...config.trustedOrigins],
    socialProviders: config.githubClientId && config.githubClientSecret ? {
      github: {
        clientId: config.githubClientId,
        clientSecret: config.githubClientSecret,
        mapProfileToUser: (profile) => ({
          email: profile.email ?? githubNoreplyEmail(profile),
        }),
      },
    } : undefined,
    database: drizzleAdapter(database, {
      provider: "pg",
      schema: authSchema,
      // Neon HTTP supports atomic batches but not interactive transactions.
      transaction: false,
    }),
    session: { freshAge: 5 * 60 },
    user: { deleteUser: { enabled: false } },
    rateLimit: { enabled: true, storage: "database" },
    advanced: {
      useSecureCookies: true,
      disableCSRFCheck: false,
      disableOriginCheck: false,
      trustedProxyHeaders: false,
      defaultCookieAttributes: { httpOnly: true, secure: true, sameSite: "lax" },
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
    plugins: [
      pseudonymousUserOutput,
      anonymous(),
      passkey({
        rpID: config.rpId,
        rpName: "DSM Atlas",
        origin: [...config.trustedOrigins],
        authenticatorSelection: {
          residentKey: "required",
          requireResidentKey: true,
          userVerification: "preferred",
        },
        registration: config.afterAdminPasskeyRegistration ? {
          afterVerification: async ({ ctx, context }) => {
            if (context !== "admin-add" && context !== "admin-recovery") return;
            if (!ctx.request) throw new Error("Passkey registration request is required");
            await config.afterAdminPasskeyRegistration!(ctx.request, context === "admin-recovery" ? "recovery" : "addition");
          },
        } : undefined,
      }),
    ],
  });
}

function assertProductionAuthConfig(config: AuthRuntimeConfig) {
  if (new TextEncoder().encode(config.secret).byteLength < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 bytes");
  }
  const baseUrl = new URL(config.baseUrl);
  // WebAuthn ceremonies work on http://localhost / 127.0.0.1 (browser treats loopback as
  // a secure context), so a loopback base URL cannot mean a misconfigured production deploy.
  const loopback = baseUrl.hostname === "localhost" || baseUrl.hostname === "127.0.0.1" || baseUrl.hostname === "[::1]";
  if (baseUrl.protocol !== "https:" && !loopback) {
    throw new Error("BETTER_AUTH_URL must use HTTPS");
  }
  if (!config.rpId || config.rpId.includes(":") || config.rpId.includes("/")) {
    throw new Error("PASSKEY_RP_ID must be a hostname");
  }
  if (config.trustedOrigins.length === 0 || config.trustedOrigins.some((origin) => {
    const url = new URL(origin);
    const originLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    return url.protocol !== "https:" && !originLoopback;
  })) {
    throw new Error("BETTER_AUTH_TRUSTED_ORIGINS must contain explicit HTTPS origins");
  }
}
