import { forbidden } from "next/navigation";

import { AdminAuthorizationError } from "../../modules/identity/admin-authorizer";
import { BatchReviewPanel } from "../../modules/publication/batch-review-panel";
import { BatchStagingPanel } from "../../modules/publication/batch-staging-panel";
import { requireAdminPage } from "../../modules/identity/server-admin";

export default async function AdminPage() {
  try {
    await requireAdminPage();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) forbidden();
    throw error;
  }
  return <main><h1>Administração</h1><BatchStagingPanel /><BatchReviewPanel batchId="batch-1" /></main>;
}
