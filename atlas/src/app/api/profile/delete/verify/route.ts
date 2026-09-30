import { createSqlExecutor } from "../../../../../integrations/neon/db";
import { requiredRuntimeEnv, serverAuth } from "../../../../../modules/identity/server-auth";
import { verifyProfileDeletionCeremony } from "../../../../../modules/identity/profile-deletion-webauthn";

export async function POST(request: Request): Promise<Response> {
  const session = await serverAuth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json().catch(() => null) as { response?: unknown } | null;
  if (!body?.response || typeof body.response !== "object") return Response.json({ error: "Resposta inválida" }, { status: 422 });
  const verified = await verifyProfileDeletionCeremony(createSqlExecutor(requiredRuntimeEnv("DATABASE_URL")), {
    profileId: session.user.id,
    rpId: requiredRuntimeEnv("PASSKEY_RP_ID"),
    origin: new URL(requiredRuntimeEnv("BETTER_AUTH_URL")).origin,
    response: body.response as never,
  });
  return verified ? Response.json({ verified: true }) : Response.json({ error: "Passkey inválida" }, { status: 403 });
}
