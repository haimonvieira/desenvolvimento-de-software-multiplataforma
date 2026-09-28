import { AdminAuthorizationError } from "../../modules/identity/admin-authorizer";
import { requireAdminPage } from "../../modules/identity/server-admin";

export default async function AdminPage() {
  try {
    await requireAdminPage();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) return <main><h1>403 — Proibido</h1></main>;
    throw error;
  }
  return <main><h1>Administração</h1></main>;
}
