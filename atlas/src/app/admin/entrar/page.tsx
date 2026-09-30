import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { resolveAdminEntry } from "../../../modules/identity/admin-entry";
import { AdminSignIn } from "../../../modules/identity/admin-sign-in";
import { requiredRuntimeEnv, serverAdmin, serverAuth } from "../../../modules/identity/server-auth";

/**
 * The owner's front door. A visitor with no session sees the GitHub button; after
 * the OAuth callback lands here the session exists, so the bootstrap runs
 * server-side and the owner is redirected to /admin. A wrong GitHub account is
 * refused in place with an explanation instead of a silent success.
 */
export default async function AdminEntryPage() {
  const requestHeaders = await headers();
  const request = new Request(requiredRuntimeEnv("BETTER_AUTH_URL"), { headers: requestHeaders });
  const state = await resolveAdminEntry({
    async session() {
      const session = await serverAuth.api.getSession({ headers: requestHeaders, query: { disableCookieCache: true } });
      return session ? { userId: session.user.id } : null;
    },
    bootstrap: () => serverAdmin.bootstrap(request),
  });

  if (state.kind === "admin") redirect("/admin");

  return (
    <main>
      <AdminSignIn reason={state.reason} />
    </main>
  );
}
