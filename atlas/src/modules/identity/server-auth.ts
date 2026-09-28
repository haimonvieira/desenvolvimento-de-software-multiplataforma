import { env } from "cloudflare:workers";
import { createAuth } from "./auth";

type AuthEnv = {
  DATABASE_URL?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  PASSKEY_RP_ID?: string;
};

const runtimeEnv = env as AuthEnv;
export function requiredRuntimeEnv(name: keyof AuthEnv): string {
  const value = runtimeEnv[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const serverAuth = createAuth({
  databaseUrl: requiredRuntimeEnv("DATABASE_URL"),
  secret: requiredRuntimeEnv("BETTER_AUTH_SECRET"),
  baseUrl: requiredRuntimeEnv("BETTER_AUTH_URL"),
  rpId: requiredRuntimeEnv("PASSKEY_RP_ID"),
  trustedOrigins: requiredRuntimeEnv("BETTER_AUTH_TRUSTED_ORIGINS").split(",").map((origin) => origin.trim()).filter(Boolean),
});
