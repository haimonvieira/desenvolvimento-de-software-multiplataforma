export interface AdminAuthorizer {
  requireAdmin(request: Request): Promise<{ adminId: string }>;
}

export type AdminSession = Readonly<{ userId: string; expiresAt: Date }>;
export type AdminIdentity = Readonly<{ adminId: string; githubUserId: string }>;
export type AuditEvent = Readonly<{
  action: "admin.bootstrap" | "admin.passkey.add" | "admin.batch.publish" | "admin.recovery";
  adminId: string;
}>;

export interface AdminDependencies {
  configuredOwnerGithubId: string;
  session(request: Request): Promise<AdminSession | null>;
  githubIdentity(request: Request, userId: string): Promise<{ userId: string } | null>;
  identity(): Promise<AdminIdentity | null>;
  createIdentity(identity: AdminIdentity): Promise<{ adminId: string; created: boolean }>;
  audit(event: AuditEvent): Promise<void>;
}

export class AdminAuthorizationError extends Error {
  readonly status = 403;

  constructor() {
    super("Forbidden");
  }
}
export interface AdminAuthorizationService extends AdminAuthorizer {
  bootstrap(request: Request): Promise<{ adminId: string; created: boolean }>;
  authorizePasskeyAddition(request: Request, purpose: "addition" | "recovery"): Promise<{ adminId: string }>;
  auditBatchPublication(request: Request): Promise<{ adminId: string }>;
}

export interface GitHubAuthClient {
  listUserAccounts(options: { headers: Headers }): Promise<readonly { id: string; userId: string; providerId: string; accountId: string }[]>;
  getAccessToken(options: { headers: Headers; body: { accountId: string } }): Promise<{ accessToken: string }>;
}

export function createGitHubIdentityVerifier(client: GitHubAuthClient, githubFetch: typeof fetch = fetch) {
  return async function githubIdentity(request: Request, userId: string) {
    const accounts = await client.listUserAccounts({ headers: request.headers });
    const github = accounts.find((account) => account.providerId === "github" && account.userId === userId);
    if (!github || !/^[1-9]\d*$/.test(github.accountId)) return null;
    const token = await client.getAccessToken({ headers: request.headers, body: { accountId: github.id } });
    const response = await githubFetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token.accessToken}`,
        "User-Agent": "dsm-atlas-admin",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!response.ok) return null;
    const profile = await response.json() as { id?: number };
    return Number.isSafeInteger(profile.id) && String(profile.id) === github.accountId ? { userId: github.accountId } : null;
  };
}


export function createAdminAuthorizer(dependencies: AdminDependencies): AdminAuthorizationService {
  const configuredOwner = /^[1-9]\d*$/.test(dependencies.configuredOwnerGithubId)
    ? dependencies.configuredOwnerGithubId
    : null;

  async function verifiedOwner(request: Request) {
    const session = await dependencies.session(request);
    if (!configuredOwner || !session || session.expiresAt.getTime() <= Date.now()) throw new AdminAuthorizationError();
    const github = await dependencies.githubIdentity(request, session.userId);
    if (github?.userId !== configuredOwner) throw new AdminAuthorizationError();
    return { adminId: session.userId, githubUserId: github.userId };
  }

  return {
    async requireAdmin(request: Request) {
      const owner = await verifiedOwner(request);
      const identity = await dependencies.identity();
      if (!identity || identity.adminId !== owner.adminId || identity.githubUserId !== owner.githubUserId) throw new AdminAuthorizationError();
      return { adminId: identity.adminId };
    },
    async bootstrap(request: Request) {
      const owner = await verifiedOwner(request);
      const existing = await dependencies.identity();
      if (existing && (existing.adminId !== owner.adminId || existing.githubUserId !== owner.githubUserId)) throw new AdminAuthorizationError();
      const result = existing ? { adminId: existing.adminId, created: false } : await dependencies.createIdentity(owner);
      if (result.created) await dependencies.audit({ action: "admin.bootstrap", adminId: result.adminId });
      return result;
    },
    async authorizePasskeyAddition(request: Request, purpose: "addition" | "recovery") {
      if (purpose === "addition") {
        const identity = await this.requireAdmin(request);
        await dependencies.audit({ action: "admin.passkey.add", adminId: identity.adminId });
        return identity;
      }
      const owner = await verifiedOwner(request);
      const identity = await dependencies.identity();
      if (!identity || identity.adminId !== owner.adminId || identity.githubUserId !== owner.githubUserId) throw new AdminAuthorizationError();
      await dependencies.audit({ action: "admin.recovery", adminId: identity.adminId });
      return { adminId: identity.adminId };
    },
    async auditBatchPublication(request: Request) {
      const identity = await this.requireAdmin(request);
      await dependencies.audit({ action: "admin.batch.publish", adminId: identity.adminId });
      return identity;
    },
  };
}

export function createAdminBootstrapHandler(authorizer: AdminAuthorizationService) {
  return async function POST(request: Request): Promise<Response> {
    try {
      const result = await authorizer.bootstrap(request);
      return Response.json({ adminId: result.adminId }, { status: result.created ? 201 : 200 });
    } catch (error) {
      if (error instanceof AdminAuthorizationError) return Response.json({ error: "Proibido" }, { status: 403 });
      return Response.json({ error: "Não foi possível autorizar a administração" }, { status: 500 });
    }
  };
}
