import { createSqlExecutor } from "../../../../../integrations/neon/db";
import { createProfileDeletionService } from "../../../../../modules/identity/profile-deletion";
import { requiredRuntimeEnv, serverAuth } from "../../../../../modules/identity/server-auth";

export async function POST(request: Request): Promise<Response> {
  const session = await serverAuth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  const token = await createProfileDeletionService(createSqlExecutor(requiredRuntimeEnv("DATABASE_URL"))).begin(session.user.id);
  return Response.json({ proof: token });
}
