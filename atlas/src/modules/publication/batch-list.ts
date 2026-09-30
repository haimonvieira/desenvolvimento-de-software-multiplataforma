import { AdminAuthorizationError } from "../identity/admin-authorizer";

export type BatchListQuery = (
  text: string,
  params: readonly unknown[],
) => Promise<readonly Record<string, unknown>[]>;

export type BatchListDependencies = Readonly<{
  requireAdmin: (request: Request) => Promise<{ adminId: string }>;
  query: BatchListQuery;
}>;

/**
 * Lists the requesting admin's own batches. It never returns another admin's
 * batch and never leaves the draft/publication workflow to this surface.
 */
export function createBatchListHandler(
  dependencies: BatchListDependencies,
): (request: Request) => Promise<Response> {
  return async function handleListBatches(request: Request): Promise<Response> {
    let adminId: string;
    try {
      ({ adminId } = await dependencies.requireAdmin(request));
    } catch (error) {
      if (error instanceof AdminAuthorizationError) {
        return Response.json({ error: "Proibido" }, { status: 403 });
      }
      throw error;
    }
    const rows = await dependencies.query(
      `SELECT id, base_commit_sha, status, total_bytes, expires_at
         FROM upload_batch WHERE owner_admin_id = $1
        ORDER BY created_at DESC LIMIT 20`,
      [adminId],
    );
    return Response.json({ batches: rows });
  };
}
