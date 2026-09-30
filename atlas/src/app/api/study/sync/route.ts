import { createNeonStudyStore } from "../../../../modules/study/neon-study-store";
import { requiredRuntimeEnv, serverAuth } from "../../../../modules/identity/server-auth";
import { createStudySyncHandler } from "../../../../modules/study/sync-handler";

export const POST = createStudySyncHandler({
  async profileId(headers) {
    return (await serverAuth.api.getSession({ headers }))?.user.id ?? null;
  },
  store(profileId) {
    return createNeonStudyStore(requiredRuntimeEnv("DATABASE_URL"), profileId);
  },
});
