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
}>;
export function createAuth(config: AuthRuntimeConfig) {
  assertProductionAuthConfig(config);
  return createAuthForDatabase(config, createDatabase(config.databaseUrl));
}

export function createAuthForDatabase(config: AuthRuntimeConfig, database: DB) {
  assertProductionAuthConfig(config);

  return betterAuth({
    appName: "DSM Atlas",
    baseURL: config.baseUrl,
    secret: config.secret,
    trustedOrigins: [...config.trustedOrigins],
    database: drizzleAdapter(database, {
      provider: "pg",
      schema: authSchema,
      // Neon HTTP supports atomic batches but not interactive transactions.
      transaction: false,
    }),
    session: { freshAge: 5 * 60 },
    user: { deleteUser: { enabled: true } },
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
      }),
    ],
  });
}

function assertProductionAuthConfig(config: AuthRuntimeConfig) {
  if (new TextEncoder().encode(config.secret).byteLength < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 bytes");
  }
  if (new URL(config.baseUrl).protocol !== "https:") {
    throw new Error("BETTER_AUTH_URL must use HTTPS");
  }
  if (!config.rpId || config.rpId.includes(":") || config.rpId.includes("/")) {
    throw new Error("PASSKEY_RP_ID must be a hostname");
  }
  if (config.trustedOrigins.length === 0 || config.trustedOrigins.some((origin) => new URL(origin).protocol !== "https:")) {
    throw new Error("BETTER_AUTH_TRUSTED_ORIGINS must contain explicit HTTPS origins");
  }
}
