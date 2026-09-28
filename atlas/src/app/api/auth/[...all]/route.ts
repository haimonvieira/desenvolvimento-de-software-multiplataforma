import { env } from "cloudflare:workers";
import { toNextJsHandler } from "better-auth/next-js";

import { createAuth } from "../../../../modules/identity/auth";

type AuthEnv = {
  DATABASE_URL?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  PASSKEY_RP_ID?: string;
};

const runtimeEnv = env as AuthEnv;
const required = (name: keyof AuthEnv) => {
  const value = runtimeEnv[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const auth = createAuth({
  databaseUrl: required("DATABASE_URL"),
  secret: required("BETTER_AUTH_SECRET"),
  baseUrl: required("BETTER_AUTH_URL"),
  rpId: required("PASSKEY_RP_ID"),
  trustedOrigins: required("BETTER_AUTH_TRUSTED_ORIGINS")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});

export const { GET, POST } = toNextJsHandler(auth);
