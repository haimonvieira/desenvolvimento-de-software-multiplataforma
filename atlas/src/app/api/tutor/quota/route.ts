import { env } from "cloudflare:workers";

import { createSqlExecutor } from "../../../../integrations/neon/db";
import { createTutorQuotaHandler, createUsageLedger, deriveSubjectKey, readClientIp, type TutorQuotaHandler } from "../../../../modules/tutor/usage-ledger";

type TutorQuotaEnv = {
  DATABASE_URL?: string;
  TUTOR_SUBJECT_SECRET?: string;
};

const MINIMUM_SECRET_BYTES = 32;

function unconfigured(): Response {
  return Response.json({ error: "unconfigured" }, { status: 503 });
}

/**
 * The sponsored quota endpoint. The scope is fixed to `public` here: a caller
 * cannot ask for administrative budget, and administrative reservations only
 * exist behind `requireAdmin` in the administrative modules.
 */
function handler(): TutorQuotaHandler | null {
  const { DATABASE_URL: databaseUrl, TUTOR_SUBJECT_SECRET: secret } = env as TutorQuotaEnv;
  if (!databaseUrl || !secret || new TextEncoder().encode(secret).byteLength < MINIMUM_SECRET_BYTES) return null;
  return createTutorQuotaHandler({
    ledger: createUsageLedger({ query: createSqlExecutor(databaseUrl).query }),
    subjectKey: (request) =>
      deriveSubjectKey(secret, {
        clientIp: readClientIp(request),
        deviceToken: request.headers.get("x-device-token"),
      }),
  });
}

export async function GET(request: Request): Promise<Response> {
  return handler()?.GET(request) ?? unconfigured();
}

export async function POST(request: Request): Promise<Response> {
  return handler()?.POST(request) ?? unconfigured();
}

export { GET as get, POST as post };
