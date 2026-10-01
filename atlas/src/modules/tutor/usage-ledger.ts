import { TutorProviderError } from "../../integrations/ai/provider-failure";
import { policyFor, type UsagePolicy, type UsageScope } from "./usage-policy";

export type BudgetDecision =
  | { type: "reserved"; reservationId: string; maxInputTokens: number; maxOutputTokens: number; maxToolCalls: number }
  | { type: "denied"; reason: "minute" | "daily" | "provider" | "global" | "disabled"; resetsAt: string };

/** What the provider adapter is allowed to spend on one turn. */
export type ReservedBudget = Readonly<{
  reservationId: string;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxToolCalls: number;
  deadlineSeconds: number;
}>;

export type TokenUsage = Readonly<{ inputTokens: number; outputTokens: number }>;
export type ReservationOutcome = "settled" | "unknown";

export type QuotaSnapshot = Readonly<{
  scope: UsageScope;
  /** Whether the scope may spend at all; a disabled scope reports its limits. */
  enabled: boolean;
  requestsThisHour: number;
  requestsPerHour: number;
  requestsToday: number;
  requestsPerDay: number;
  /**
   * The named provider's own day pool, summed across subjects. Optional because
   * it is additive: a ledger double that predates the provider dimension still
   * satisfies the snapshot.
   */
  providerTurnsToday?: number;
  providerTurnsPerDay?: number;
  globalTurnsToday: number;
  globalTurnsPerDay: number;
  globalTokensToday: number;
  globalTokensPerDay: number;
  resetsAt: string;
}>;

export type SqlExecutor = Readonly<{
  query(text: string, params: readonly unknown[]): Promise<readonly Record<string, unknown>[]>;
}>;

/**
 * The provider a turn charges when the caller names none: today's single
 * provider. The provider dimension is additive, so a caller that predates it
 * keeps the exact behavior it had. Routing later selects a provider per turn;
 * this default is not that selection.
 */
export const DEFAULT_PROVIDER = "groq";

export interface UsageLedger {
  policy(scope: UsageScope): UsagePolicy;
  /**
   * The caller that knows a provider's quota supplies its day ceiling here;
   * 0 or absent disables the check, like every other ceiling. The ledger stays
   * policy-free about which provider has how much.
   */
  reserve(input: Readonly<{ scope: UsageScope; subjectKey: string; provider?: string; providerTurnsPerDay?: number }>): Promise<BudgetDecision>;
  reconcile(input: Readonly<{ reservationId: string; outcome: ReservationOutcome; usage?: TokenUsage }>): Promise<void>;
  expireStaleReservations(): Promise<number>;
  readQuota(input: Readonly<{ scope: UsageScope; subjectKey: string; provider?: string; providerTurnsPerDay?: number }>): Promise<QuotaSnapshot>;
  hasSponsoredHistory(input: Readonly<{ scope: UsageScope; subjectKey: string }>): Promise<boolean>;
}

export type UsageLedgerDependencies = Readonly<{
  query: SqlExecutor["query"];
  now?: () => Date;
  newReservationId?: () => string;
  /** Operational overrides; the defaults in usage-policy.ts are the ceiling. */
  policies?: Readonly<Partial<Record<UsageScope, UsagePolicy>>>;
}>;

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "string") return JSON.parse(value) as Record<string, unknown>;
  if (value && typeof value === "object") return value as Record<string, unknown>;
  return {};
}

function parseDecision(value: unknown): BudgetDecision {
  const raw = asRecord(value);
  if (raw.type === "reserved") {
    return {
      type: "reserved",
      reservationId: String(raw.reservationId),
      maxInputTokens: Number(raw.maxInputTokens),
      maxOutputTokens: Number(raw.maxOutputTokens),
      maxToolCalls: Number(raw.maxToolCalls),
    };
  }
  if (raw.type === "denied" && (raw.reason === "minute" || raw.reason === "daily" || raw.reason === "provider" || raw.reason === "global" || raw.reason === "disabled")) {
    return { type: "denied", reason: raw.reason, resetsAt: String(raw.resetsAt) };
  }
  throw new Error("Invalid budget decision");
}

export function createUsageLedger(dependencies: UsageLedgerDependencies): UsageLedger {
  const { query } = dependencies;
  const now = dependencies.now ?? (() => new Date());
  const newReservationId = dependencies.newReservationId ?? (() => crypto.randomUUID());
  const policy = (scope: UsageScope): UsagePolicy => dependencies.policies?.[scope] ?? policyFor(scope);

  return {
    policy,

    async reserve({ scope, subjectKey, provider = DEFAULT_PROVIDER, providerTurnsPerDay = 0 }) {
      const rows = await query("SELECT reserve_ai_budget($1, $2, $3, $4, $5::integer, $6::jsonb, $7::timestamptz) AS decision", [
        scope,
        provider,
        subjectKey,
        newReservationId(),
        providerTurnsPerDay,
        JSON.stringify(policy(scope)),
        now().toISOString(),
      ]);
      if (!rows[0]?.decision) throw new Error("Budget reservation returned no decision");
      return parseDecision(rows[0].decision);
    },

    async reconcile({ reservationId, outcome, usage }) {
      const rows = await query("SELECT reconcile_ai_reservation($1, $2, $3, $4, $5::timestamptz) AS result", [
        reservationId,
        outcome,
        usage?.inputTokens ?? 0,
        usage?.outputTokens ?? 0,
        now().toISOString(),
      ]);
      if (!rows[0]?.result) throw new Error("Usage reconciliation returned no result");
    },

    async expireStaleReservations() {
      const rows = await query("SELECT expire_ai_reservations($1::timestamptz) AS expired", [now().toISOString()]);
      return Number(rows[0]?.expired ?? 0);
    },

    async readQuota({ scope, subjectKey, provider = DEFAULT_PROVIDER, providerTurnsPerDay = 0 }) {
      const rows = await query("SELECT read_ai_quota($1, $2, $3, $4::integer, $5::jsonb, $6::timestamptz) AS quota", [
        scope,
        provider,
        subjectKey,
        providerTurnsPerDay,
        JSON.stringify(policy(scope)),
        now().toISOString(),
      ]);
      const raw = asRecord(rows[0]?.quota);
      return {
        scope,
        enabled: policy(scope).enabled,
        requestsThisHour: Number(raw.requestsThisHour ?? 0),
        requestsPerHour: Number(raw.requestsPerHour ?? 0),
        requestsToday: Number(raw.requestsToday ?? 0),
        requestsPerDay: Number(raw.requestsPerDay ?? 0),
        providerTurnsToday: Number(raw.providerTurnsToday ?? 0),
        providerTurnsPerDay: Number(raw.providerTurnsPerDay ?? 0),
        globalTurnsToday: Number(raw.globalTurnsToday ?? 0),
        globalTurnsPerDay: Number(raw.globalTurnsPerDay ?? 0),
        globalTokensToday: Number(raw.globalTokensToday ?? 0),
        globalTokensPerDay: Number(raw.globalTokensPerDay ?? 0),
        resetsAt: String(raw.resetsAt ?? ""),
      };
    },

    async hasSponsoredHistory({ scope, subjectKey }) {
      const rows = await query("SELECT 1 AS found FROM ai_reservation WHERE scope = $1 AND subject_key = $2 LIMIT 1", [scope, subjectKey]);
      return rows.length > 0;
    },
  };
}

export type SponsoredTurnResult<T> = Readonly<{ output: T; usage?: TokenUsage }>;

/**
 * The one seam that decides whether inference may happen at all. A denied
 * decision returns before `turn` is reached, so no provider call and no spend
 * can occur; an unknown outcome stays charged until the reservation expires.
 */
export async function runSponsoredTurn<T>(
  ledger: UsageLedger,
  input: Readonly<{ scope: UsageScope; subjectKey: string }>,
  turn: (budget: ReservedBudget) => Promise<SponsoredTurnResult<T>>,
): Promise<Readonly<{ decision: BudgetDecision; output?: T }>> {
  // Release reservations that expired before asking for more budget. A timeout
  // leaves its worst-case tokens charged until something releases them, and this
  // is the only moment where that matters: the ceiling is evaluated below.
  // A failure here must never deny a turn — the worst case is leaking one more
  // request, while propagating would take the tutor down.
  await ledger.expireStaleReservations().catch(() => undefined);

  const decision = await ledger.reserve(input);
  if (decision.type === "denied") return { decision };

  const budget: ReservedBudget = {
    reservationId: decision.reservationId,
    maxInputTokens: decision.maxInputTokens,
    maxOutputTokens: decision.maxOutputTokens,
    maxToolCalls: decision.maxToolCalls,
    deadlineSeconds: ledger.policy(input.scope).deadlineSeconds,
  };

  try {
    const result = await turn(budget);
    await ledger.reconcile({ reservationId: decision.reservationId, outcome: "settled", usage: result.usage });
    return { decision, output: result.output };
  } catch (error) {
    // A timeout is an unknown outcome: the reservation stays charged until it
    // expires, so a retry cannot spend twice for the same slot. An error that
    // carries measured usage is not unknown — the provider answered and we know
    // what it cost — so the reservation settles at that amount instead of
    // holding the worst case. Reconciliation itself is idempotent on the DB
    // side, but this failed path deliberately performs the one and only
    // reconcile: the outcome is chosen here, not overwritten later.
    const measured = error instanceof TutorProviderError ? error.usage : undefined;
    await ledger
      .reconcile(measured
        ? { reservationId: decision.reservationId, outcome: "settled", usage: measured }
        : { reservationId: decision.reservationId, outcome: "unknown" })
      .catch(() => undefined);
    throw error;
  }
}

export type SubjectKeyInput = Readonly<{
  clientIp?: string | null;
  deviceToken?: string | null;
  profileId?: string | null;
}>;

const DEVICE_TOKEN_PREFIX = "v1";
const IDENTIFIER = /^[A-Za-z0-9_-]{1,128}$/;

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(secret: string, material: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(material)));
}

/** Mints the first-party device token whose signature makes the key unforgeable. */
export async function signDeviceToken(secret: string, deviceId: string): Promise<string> {
  if (!secret) throw new Error("A device-token secret is required");
  if (!IDENTIFIER.test(deviceId)) throw new Error("Invalid device id");
  const payload = `${DEVICE_TOKEN_PREFIX}.${deviceId}`;
  return `${payload}.${toBase64Url(await sign(secret, payload))}`;
}

async function verifiedDeviceId(secret: string, token: string | null | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== DEVICE_TOKEN_PREFIX || !IDENTIFIER.test(parts[1])) return null;
  const provided = fromBase64Url(parts[2]);
  if (!provided) return null;
  const expected = await sign(secret, `${DEVICE_TOKEN_PREFIX}.${parts[1]}`);
  if (provided.length !== expected.length) return null;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= provided[index] ^ expected[index];
  return difference === 0 ? parts[1] : null;
}

/** Only Cloudflare's own header is trusted; forwarded headers are client-controlled. */
export function readClientIp(request: Request): string | null {
  const value = request.headers.get("cf-connecting-ip")?.trim();
  return value ? value : null;
}

/**
 * Reduces an address to the network it comes from (/24 for IPv4, /64 for IPv6)
 * so a single host cannot mint unlimited quota, while a whole campus still
 * shares one bucket instead of leaking every individual address into storage.
 */
function clientIpPrefix(value: string | null | undefined): string | null {
  const address = value?.trim();
  if (!address) return null;

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(address);
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number);
    if (octets.some((octet) => octet > 255)) return null;
    return `v4:${octets[0]}.${octets[1]}.${octets[2]}`;
  }

  const [head, tail, extra] = address.split("::");
  if (!address.includes(":") || extra !== undefined) return null;
  const headGroups = head === "" ? [] : head.split(":");
  const tailGroups = tail === undefined || tail === "" ? [] : tail.split(":");
  const groups = [...headGroups, ...tailGroups];
  if (groups.some((group) => !/^[0-9a-fA-F]{1,4}$/.test(group))) return null;
  const expanded = tail === undefined
    ? (groups.length === 8 ? groups : null)
    : (8 - groups.length >= 1 ? [...headGroups, ...Array.from({ length: 8 - groups.length }, () => "0"), ...tailGroups] : null);
  if (!expanded) return null;
  return `v6:${expanded.slice(0, 4).map((group) => group.toLowerCase()).join(":")}`;
}

/**
 * Derives the anonymous quota subject from the network, a signed first-party
 * device token and (when the caller has one) the authenticated profile. Only a
 * keyed hash is stored, so the raw address never reaches the ledger, and an
 * unsigned device token cannot rotate the subject into a fresh bucket.
 */
export async function deriveSubjectKey(secret: string, input: SubjectKeyInput): Promise<string> {
  if (!secret) throw new Error("A subject-key secret is required");
  const material = [
    "atlas-subject-v1",
    clientIpPrefix(input.clientIp) ?? "-",
    (await verifiedDeviceId(secret, input.deviceToken)) ?? "-",
    input.profileId && IDENTIFIER.test(input.profileId) ? input.profileId : "-",
  ].join("|");
  return `v1:${toHex(await sign(secret, material))}`;
}

export type TutorQuotaDependencies = Readonly<{
  ledger: UsageLedger;
  subjectKey(request: Request): Promise<string>;
  /**
   * Gates the first sponsored turn (and suspicious resets) with Turnstile. The
   * gate is a network call owned by the tutor route; until one is wired the
   * first turn fails closed rather than granting unverified sponsored spend.
   */
  firstUseGate?(input: Readonly<{ request: Request; turnstileToken: string | null }>): Promise<boolean>;
}>;

export type TutorQuotaHandler = Readonly<{
  GET(request: Request): Promise<Response>;
  POST(request: Request): Promise<Response>;
}>;

export function createTutorQuotaHandler(dependencies: TutorQuotaDependencies): TutorQuotaHandler {
  async function subjectFor(request: Request): Promise<Readonly<{ scope: UsageScope; subjectKey: string }>> {
    return { scope: "public", subjectKey: await dependencies.subjectKey(request) };
  }

  return {
    async GET(request: Request): Promise<Response> {
      try {
        return Response.json({ quota: await dependencies.ledger.readQuota(await subjectFor(request)) });
      } catch {
        return Response.json({ error: "Não foi possível ler a cota" }, { status: 500 });
      }
    },

    /**
     * A read-only quota check. It reports the same snapshot as GET; POST exists
     * only because the abuse gate needs a body to carry the Turnstile token.
     *
     * It deliberately does **not** reserve. Reserving here would spend a global
     * daily turn and mint sponsored history without ever calling the provider,
     * and — with sponsored concurrency 1 — would hold the single scope-wide slot
     * for up to 30 seconds, denying every real turn in the meantime. The
     * reservation belongs to the turn route, which is the only caller that then
     * invokes the provider.
     */
    async POST(request: Request): Promise<Response> {
      try {
        const subject = await subjectFor(request);
        const body = (await request.json().catch(() => null)) as { turnstileToken?: unknown } | null;
        const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken : null;

        // The gate runs here so a visitor can verify before asking, but a
        // successful check writes nothing: without a reservation there is no
        // sponsored history, so the turn route still enforces the gate itself.
        if (dependencies.ledger.policy(subject.scope).enabled && !(await dependencies.ledger.hasSponsoredHistory(subject))) {
          const verified = dependencies.firstUseGate ? await dependencies.firstUseGate({ request, turnstileToken }) : false;
          // No gate configured means sponsored turns stay closed: the abuse
          // protection is a requirement, not an optional extra, and an
          // unverified first turn must not be able to spend.
          if (!verified) return Response.json({ error: "Verificação necessária" }, { status: 403 });
        }

        return Response.json({ quota: await dependencies.ledger.readQuota(subject) });
      } catch {
        return Response.json({ error: "Não foi possível ler a cota" }, { status: 500 });
      }
    },
  };
}
