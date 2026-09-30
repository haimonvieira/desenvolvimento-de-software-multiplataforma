import { createSqlExecutor } from "../../../../integrations/neon/db";
import { createProfileDeletionService } from "../../../../modules/identity/profile-deletion";
import { requiredRuntimeEnv, serverAuth } from "../../../../modules/identity/server-auth";

export async function POST(request: Request): Promise<Response> {
  const session = await serverAuth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json().catch(() => null) as { proof?: unknown } | null;
  if (typeof body?.proof !== "string") return Response.json({ error: "Prova de passkey obrigatória" }, { status: 422 });
  const deleted = await createProfileDeletionService(createSqlExecutor(requiredRuntimeEnv("DATABASE_URL"))).consumeAndDelete(session.user.id, body.proof);
  return deleted ? Response.json({ success: true }) : Response.json({ error: "Prova inválida ou expirada" }, { status: 403 });
}
