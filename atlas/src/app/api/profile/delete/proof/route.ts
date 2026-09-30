import { createSqlExecutor } from "../../../../../integrations/neon/db";
import { beginProfileDeletionCeremony } from "../../../../../modules/identity/profile-deletion-webauthn";
import { requiredRuntimeEnv, serverAuth } from "../../../../../modules/identity/server-auth";

export async function POST(request: Request): Promise<Response> {
  const session = await serverAuth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  const result = await beginProfileDeletionCeremony(
    createSqlExecutor(requiredRuntimeEnv("DATABASE_URL")), session.user.id, requiredRuntimeEnv("PASSKEY_RP_ID"),
  );
  return Response.json(result);
}
