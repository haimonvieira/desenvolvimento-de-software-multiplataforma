import { headers } from "next/headers";

import { requiredRuntimeEnv, serverAdmin } from "./server-auth";

export { serverAdmin };

export async function requireAdminPage() {
  const requestHeaders = await headers();
  return serverAdmin.requireAdmin(new Request(requiredRuntimeEnv("BETTER_AUTH_URL"), { headers: requestHeaders }));
}
