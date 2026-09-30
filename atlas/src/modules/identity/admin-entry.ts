import { AdminAuthorizationError } from "./admin-authorizer";

export type AdminEntryState =
  | Readonly<{ kind: "admin" }>
  | Readonly<{ kind: "sign-in"; reason: "unauthenticated" | "not-owner" }>;

export interface AdminEntryDependencies {
  session(): Promise<{ userId: string } | null>;
  bootstrap(): Promise<{ adminId: string; created: boolean }>;
}

/**
 * Resolves what the owner entry point should show. Only a session that already
 * carries the linked GitHub identity reaches the bootstrap, and only the
 * configured owner passes it; every other session is refused with a reason the
 * page can explain. Revisiting as an already-bootstrapped owner stays idempotent
 * because `bootstrap` returns `created: false` instead of inserting a second row.
 */
export async function resolveAdminEntry(dependencies: AdminEntryDependencies): Promise<AdminEntryState> {
  if (!(await dependencies.session())) return { kind: "sign-in", reason: "unauthenticated" };
  try {
    await dependencies.bootstrap();
    return { kind: "admin" };
  } catch (error) {
    if (error instanceof AdminAuthorizationError) return { kind: "sign-in", reason: "not-owner" };
    throw error;
  }
}
