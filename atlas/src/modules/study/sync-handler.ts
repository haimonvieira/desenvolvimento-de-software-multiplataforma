import type { RemoteStudyStore } from "./neon-study-store";
import { syncRequestSchema } from "./sync-schema";

export function createStudySyncHandler(dependencies: Readonly<{
  profileId(headers: Headers): Promise<string | null>;
  store(profileId: string): RemoteStudyStore;
}>) {
  return async function POST(request: Request): Promise<Response> {
    const profileId = await dependencies.profileId(request.headers);
    if (!profileId) return Response.json({ error: "Não autenticado" }, { status: 401 });
    const parsed = syncRequestSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: "Sincronização inválida" }, { status: 422 });
    try {
      return Response.json(await dependencies.store(profileId).sync(parsed.data));
    } catch (error) {
      if (error instanceof Error && error.message.includes("cursor mismatch")) return Response.json({ error: "Cursor inválido" }, { status: 409 });
      return Response.json({ error: "Não foi possível sincronizar" }, { status: 500 });
    }
  };
}
