import { createNeonStudyStore } from "../../../../modules/study/neon-study-store";
import { requiredRuntimeEnv, serverAuth } from "../../../../modules/identity/server-auth";
import { syncRequestSchema } from "../../../../modules/study/sync-schema";

export async function POST(request: Request): Promise<Response> {
  const session = await serverAuth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const parsed = syncRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Sincronização inválida" }, { status: 422 });

  try {
    const result = await createNeonStudyStore(requiredRuntimeEnv("DATABASE_URL"), session.user.id).sync(parsed.data);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Não foi possível sincronizar" }, { status: 500 });
  }
}
