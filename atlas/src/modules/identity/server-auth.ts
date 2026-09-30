import { env } from "cloudflare:workers";

import { createSqlExecutor } from "../../integrations/neon/db";
import { createAdminAuthorizer, createGitHubIdentityVerifier } from "./admin-authorizer";
import { createAdminRepository } from "./admin-repository";
import { createAuth } from "./auth";

type AuthEnv = {
  DATABASE_URL?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  PASSKEY_RP_ID?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  ADMIN_GITHUB_USER_ID?: string;
};

const runtimeEnv = env as AuthEnv;
export function requiredRuntimeEnv(name: keyof AuthEnv): string {
  const value = runtimeEnv[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const repository = createAdminRepository(createSqlExecutor(requiredRuntimeEnv("DATABASE_URL")));

export const serverAuth = createAuth({
  databaseUrl: requiredRuntimeEnv("DATABASE_URL"),
  secret: requiredRuntimeEnv("BETTER_AUTH_SECRET"),
  baseUrl: requiredRuntimeEnv("BETTER_AUTH_URL"),
  rpId: requiredRuntimeEnv("PASSKEY_RP_ID"),
  trustedOrigins: requiredRuntimeEnv("BETTER_AUTH_TRUSTED_ORIGINS").split(",").map((origin) => origin.trim()).filter(Boolean),
  githubClientId: requiredRuntimeEnv("GITHUB_CLIENT_ID"),
  githubClientSecret: requiredRuntimeEnv("GITHUB_CLIENT_SECRET"),
  afterAdminPasskeyRegistration: async (request, purpose) => {
    await serverAdmin.authorizePasskeyAddition(request, purpose);
  },
});

export const serverAdmin = createAdminAuthorizer({
  configuredOwnerGithubId: requiredRuntimeEnv("ADMIN_GITHUB_USER_ID"),
  async session(request) {
    const session = await serverAuth.api.getSession({ headers: request.headers, query: { disableCookieCache: true } });
    return session ? { userId: session.user.id, expiresAt: session.session.expiresAt } : null;
  },
  githubIdentity: createGitHubIdentityVerifier(serverAuth.api),
  identity: repository.identity,
  createIdentity: repository.createIdentity,
  audit: repository.audit,
});
