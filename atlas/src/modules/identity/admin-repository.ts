import type { AdminIdentity, AuditEvent } from "./admin-authorizer";

export interface AdminDatabase {
  query(sql: string, params: readonly unknown[]): Promise<readonly Record<string, unknown>[]>;
}

export interface AdminRepository {
  identity(): Promise<AdminIdentity | null>;
  createIdentity(identity: AdminIdentity): Promise<{ adminId: string; created: boolean }>;
  audit(event: AuditEvent): Promise<void>;
}

export function createAdminRepository(database: AdminDatabase): AdminRepository {
  return {
    async identity() {
      const [identity] = await database.query("SELECT admin_id, github_user_id FROM admin_identity LIMIT 1", []);
      return identity ? { adminId: String(identity.admin_id), githubUserId: String(identity.github_user_id) } : null;
    },
    async createIdentity(identity) {
      const rows = await database.query(
        "INSERT INTO admin_identity (admin_id, github_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING admin_id",
        [identity.adminId, identity.githubUserId],
      );
      if (rows[0]) return { adminId: String(rows[0].admin_id), created: true };
      const existing = await this.identity();
      if (!existing || existing.adminId !== identity.adminId || existing.githubUserId !== identity.githubUserId) throw new Error("Admin identity is immutable");
      return { adminId: existing.adminId, created: false };
    },
    async audit(event) {
      await database.query("INSERT INTO admin_audit_event (admin_id, action) VALUES ($1, $2)", [event.adminId, event.action]);
    },
  };
}
