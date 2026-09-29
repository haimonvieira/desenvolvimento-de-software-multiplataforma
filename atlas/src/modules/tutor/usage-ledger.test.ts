import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GET as quotaRouteGet } from "../../app/api/tutor/quota/route";
import { USAGE_POLICIES, policyFor, type UsagePolicy } from "./usage-policy";
import {
  createTutorQuotaHandler,
  createUsageLedger,
  deriveSubjectKey,
  readClientIp,
  runSponsoredTurn,
  signDeviceToken,
  type BudgetDecision,
  type ReservedBudget,
  type SqlExecutor,
  type UsageLedger,
} from "./usage-ledger";

const migrationsFolder = fileURLToPath(new URL("../../../drizzle/migrations", import.meta.url));

const SECRET = "usage-ledger-test-secret-0123456789";

let database: PGlite;
let executor: SqlExecutor;
let queries: string[];

beforeEach(async () => {
  database = new PGlite();
  await migrate(drizzle(database), { migrationsFolder });
  executor = {
    async query(text, params) {
      const result = await database.query<Record<string, unknown>>(text, [...params]);
      return result.rows;
    },
  };
  queries = [];
});

afterEach(async () => {
  await database.close();
});

function countingExecutor(): SqlExecutor {
  return {
    async query(text, params) {
      queries.push(text);
      return executor.query(text, params);
    },
  };
}

function clockAt(iso: string) {
  const state = { value: new Date(iso) };
  return {
    state,
    now: () => state.value,
    advance(seconds: number) {
      state.value = new Date(state.value.getTime() + seconds * 1_000);
    },
  };
}

function ledgerWith(
  clock: { now(): Date },
  policies?: Readonly<Partial<Record<"public" | "admin", UsagePolicy>>>,
  query: SqlExecutor = executor,
): UsageLedger {
  return createUsageLedger({ query: query.query.bind(query), now: clock.now, policies });
}

async function windowRows(scope: string, subjectKey: string, kind: string) {
  return executor.query(
    `SELECT requests, reserved_input_tokens, reserved_output_tokens, input_tokens, output_tokens FROM ai_usage_window WHERE scope = $1 AND subject_key = $2 AND window_kind = $3`,
    [scope, subjectKey, kind],
  );
}

async function reservationRow(id: string) {
  const rows = await executor.query(`SELECT status, actual_input_tokens, actual_output_tokens FROM ai_reservation WHERE id = $1`, [id]);
  return rows[0];
}

describe("sponsored usage policy", () => {
  it("fixes the conservative initial ceilings in code", () => {
    expect(policyFor("public")).toEqual({
      enabled: true,
      requestsPerHour: 5,
      requestsPerDay: 15,
      globalTurnsPerDay: 30,
      globalTokensPerDay: 150_000,
      maxConcurrentTurns: 1,
      maxInputTokens: 4_000,
      maxOutputTokens: 1_000,
      maxToolCalls: 4,
      deadlineSeconds: 30,
    });
  });

  it("keeps administrative limits separate from sponsored limits", () => {
    expect(USAGE_POLICIES.admin).not.toEqual(USAGE_POLICIES.public);
    expect(policyFor("admin").globalTurnsPerDay).not.toBe(policyFor("public").globalTurnsPerDay);
    expect(policyFor("admin").maxInputTokens).not.toBe(policyFor("public").maxInputTokens);
  });
});

describe("atomic budget reservation", () => {
  it("reserves a turn and returns the worst-case token ceilings", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const decision = await ledgerWith(clock).reserve({ scope: "public", subjectKey: "device-a" });

    expect(decision).toMatchObject({
      type: "reserved",
      maxInputTokens: 4_000,
      maxOutputTokens: 1_000,
      maxToolCalls: 4,
    });
    expect((decision as Extract<BudgetDecision, { type: "reserved" }>).reservationId).toBeTruthy();
    expect((await windowRows("public", "device-a", "hour"))[0]).toMatchObject({ requests: 1, reserved_input_tokens: 4_000, reserved_output_tokens: 1_000 });
    expect((await windowRows("public", "device-a", "day"))[0]).toMatchObject({ requests: 1 });
    expect((await windowRows("public", "*", "global"))[0]).toMatchObject({ requests: 1 });
  });

  it("denies the sixth hourly turn with the reset time of the short window", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    for (let turn = 0; turn < 5; turn += 1) {
      const decision = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
      expect(decision.type).toBe("reserved");
      // Each turn settles before the next starts: with sponsored concurrency 1
      // only overlapping turns are denied, sequential ones proceed.
      await ledger.reconcile({
        reservationId: (decision as Extract<BudgetDecision, { type: "reserved" }>).reservationId,
        outcome: "settled",
        usage: { inputTokens: 100, outputTokens: 20 },
      });
    }

    const denied = await ledger.reserve({ scope: "public", subjectKey: "device-a" });

    expect(denied).toEqual({ type: "denied", reason: "minute", resetsAt: "2026-09-28T11:00:00.000Z" });
    // Five slots spent; settled turns released their worst-case hold and
    // recorded 100 in / 20 out each.
    expect((await windowRows("public", "device-a", "hour"))[0]).toMatchObject({ requests: 5, reserved_input_tokens: 0, input_tokens: 500, output_tokens: 100 });
  });

  it("denies the turn after the daily ceiling is reached", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, { public: { ...policyFor("public"), requestsPerHour: 100, requestsPerDay: 2 } });
    for (let turn = 0; turn < 2; turn += 1) {
      const decision = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
      expect(decision.type).toBe("reserved");
      await ledger.reconcile({
        reservationId: (decision as Extract<BudgetDecision, { type: "reserved" }>).reservationId,
        outcome: "settled",
        usage: { inputTokens: 100, outputTokens: 20 },
      });
    }

    expect(await ledger.reserve({ scope: "public", subjectKey: "device-a" })).toEqual({
      type: "denied",
      reason: "daily",
      resetsAt: "2026-09-29T00:00:00.000Z",
    });
  });

  it("fails closed on the global sponsored budget for every subject", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, { public: { ...policyFor("public"), globalTurnsPerDay: 1 } });
    const first = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    expect(first.type).toBe("reserved");
    await ledger.reconcile({
      reservationId: (first as Extract<BudgetDecision, { type: "reserved" }>).reservationId,
      outcome: "settled",
      usage: { inputTokens: 100, outputTokens: 20 },
    });

    expect(await ledger.reserve({ scope: "public", subjectKey: "device-b" })).toEqual({
      type: "denied",
      reason: "global",
      resetsAt: "2026-09-29T00:00:00.000Z",
    });
    expect((await windowRows("public", "device-b", "day"))).toHaveLength(0);
    expect((await windowRows("public", "*", "global"))[0]).toMatchObject({ requests: 1 });
  });

  it("denies every request when the scope is disabled", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, { public: { ...policyFor("public"), enabled: false } });

    expect(await ledger.reserve({ scope: "public", subjectKey: "device-a" })).toEqual({
      type: "denied",
      reason: "disabled",
      resetsAt: "2026-09-29T00:00:00.000Z",
    });
  });

  it("denies the turn that would push the global day past the token ceiling", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    // Two 5.000-token turns fit in a 12.000-token ceiling; the third does not.
    const ledger = ledgerWith(clock, {
      public: { ...policyFor("public"), requestsPerHour: 100, requestsPerDay: 100, globalTurnsPerDay: 100, globalTokensPerDay: 12_000, maxConcurrentTurns: 0 },
    });
    expect((await ledger.reserve({ scope: "public", subjectKey: "device-a" })).type).toBe("reserved");
    expect((await ledger.reserve({ scope: "public", subjectKey: "device-b" })).type).toBe("reserved");

    expect(await ledger.reserve({ scope: "public", subjectKey: "device-c" })).toEqual({
      type: "denied",
      reason: "global",
      resetsAt: "2026-09-29T00:00:00.000Z",
    });
    expect((await windowRows("public", "device-c", "day"))).toHaveLength(0);
    expect(await ledger.readQuota({ scope: "public", subjectKey: "device-a" })).toMatchObject({
      globalTurnsToday: 2,
      globalTokensToday: 10_000,
      globalTokensPerDay: 12_000,
    });
  });

  it("frees token headroom when a turn settles under its worst case", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, {
      public: { ...policyFor("public"), requestsPerHour: 100, requestsPerDay: 100, globalTurnsPerDay: 100, globalTokensPerDay: 6_000, maxConcurrentTurns: 0 },
    });
    const first = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    const reservationId = (first as Extract<BudgetDecision, { type: "reserved" }>).reservationId;
    await ledger.reconcile({ reservationId, outcome: "settled", usage: { inputTokens: 120, outputTokens: 40 } });

    // 160 actual + 5.000 reserved fits in 6.000; without reconciliation the
    // second turn would have been denied.
    expect((await ledger.reserve({ scope: "public", subjectKey: "device-b" })).type).toBe("reserved");
    expect(await ledger.readQuota({ scope: "public", subjectKey: "device-b" })).toMatchObject({ globalTokensToday: 5_160 });
  });

  it("denies a second live turn while sponsored concurrency is 1", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, {
      public: { ...policyFor("public"), requestsPerHour: 100, requestsPerDay: 100, globalTurnsPerDay: 100, maxConcurrentTurns: 1 },
    });
    expect((await ledger.reserve({ scope: "public", subjectKey: "device-a" })).type).toBe("reserved");

    const denied = await ledger.reserve({ scope: "public", subjectKey: "device-b" });
    expect(denied.type).toBe("denied");
    expect((denied as Extract<BudgetDecision, { type: "denied" }>).reason).toBe("global");
    expect((await windowRows("public", "device-b", "day"))).toHaveLength(0);
  });

  it("admits the next turn once the live one settles", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, {
      public: { ...policyFor("public"), requestsPerHour: 100, requestsPerDay: 100, globalTurnsPerDay: 100, maxConcurrentTurns: 1 },
    });
    const first = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    await ledger.reconcile({
      reservationId: (first as Extract<BudgetDecision, { type: "reserved" }>).reservationId,
      outcome: "settled",
      usage: { inputTokens: 100, outputTokens: 20 },
    });

    expect((await ledger.reserve({ scope: "public", subjectKey: "device-b" })).type).toBe("reserved");
  });

  it("lets exactly one of eight concurrent final-slot requests win", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, { public: { ...policyFor("public"), maxConcurrentTurns: 0 } }, countingExecutor());
    for (let turn = 0; turn < 4; turn += 1) {
      await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    }
    const before = queries.length;

    const decisions = await Promise.all(
      Array.from({ length: 8 }, () => ledger.reserve({ scope: "public", subjectKey: "device-a" })),
    );

    const winners = decisions.filter((decision) => decision.type === "reserved");
    expect(winners).toHaveLength(1);
    expect(decisions.filter((decision) => decision.type === "denied")).toHaveLength(7);
    // The whole reserve step is one statement; there is no read-then-write
    // window a competing request could interleave with.
    expect(queries.length - before).toBe(8);
    expect((await windowRows("public", "device-a", "hour"))[0]).toMatchObject({ requests: 5 });
    expect(new Set(winners.map((winner) => (winner as Extract<BudgetDecision, { type: "reserved" }>).reservationId)).size).toBe(1);
    // Exactly five reservations exist: the four that opened the window plus the
    // single winner. The seven losers left no row and moved no counter.
    expect(
      await executor.query(`SELECT count(*)::int AS total FROM ai_reservation WHERE scope = 'public' AND subject_key = 'device-a'`, []),
    ).toEqual([{ total: 5 }]);
  });

  it("surfaces an unexpected reservation failure instead of reporting a denial", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = createUsageLedger({
      query: executor.query.bind(executor),
      now: clock.now,
      newReservationId: () => "duplicate-id",
      policies: { public: { ...policyFor("public"), maxConcurrentTurns: 0 } },
    });
    await ledger.reserve({ scope: "public", subjectKey: "device-a" });

    // A duplicate primary key is a bug, not an exhausted quota: it must not be
    // swallowed into a `denied` decision that silently drops real traffic.
    await expect(ledger.reserve({ scope: "public", subjectKey: "device-a" })).rejects.toThrow(/duplicate key|unique/i);
  });

  it("keeps public and admin reservations in separate ledgers and limits", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, {
      public: { ...policyFor("public"), requestsPerHour: 1 },
      admin: { ...policyFor("admin"), maxConcurrentTurns: 0 },
    });
    const first = await ledger.reserve({ scope: "public", subjectKey: "same-subject" });
    expect(first.type).toBe("reserved");
    await ledger.reconcile({
      reservationId: (first as Extract<BudgetDecision, { type: "reserved" }>).reservationId,
      outcome: "settled",
      usage: { inputTokens: 100, outputTokens: 20 },
    });

    expect((await ledger.reserve({ scope: "public", subjectKey: "same-subject" })).type).toBe("denied");
    expect((await ledger.reserve({ scope: "admin", subjectKey: "same-subject" })).type).toBe("reserved");

    expect(await ledger.readQuota({ scope: "public", subjectKey: "same-subject" })).toMatchObject({ requestsThisHour: 1, requestsPerHour: 1 });
    expect(await ledger.readQuota({ scope: "admin", subjectKey: "same-subject" })).toMatchObject({ requestsThisHour: 1, requestsPerHour: policyFor("admin").requestsPerHour });
    expect((await windowRows("admin", "*", "global"))[0]).toMatchObject({ requests: 1 });
  });
});

describe("usage reconciliation", () => {
  it("releases the reserved ceiling and records the actual tokens", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    const decision = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    const reservationId = (decision as Extract<BudgetDecision, { type: "reserved" }>).reservationId;

    await ledger.reconcile({ reservationId, outcome: "settled", usage: { inputTokens: 120, outputTokens: 40 } });

    expect(await windowRows("public", "device-a", "hour")).toEqual([
      expect.objectContaining({ reserved_input_tokens: 0, reserved_output_tokens: 0, input_tokens: 120, output_tokens: 40 }),
    ]);
    expect(await windowRows("public", "*", "global")).toEqual([
      expect.objectContaining({ reserved_input_tokens: 0, input_tokens: 120, output_tokens: 40 }),
    ]);
    expect(await reservationRow(reservationId)).toMatchObject({ status: "settled", actual_input_tokens: 120, actual_output_tokens: 40 });
  });

  it("reconciles a reservation only once", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    const decision = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    const reservationId = (decision as Extract<BudgetDecision, { type: "reserved" }>).reservationId;

    await ledger.reconcile({ reservationId, outcome: "settled", usage: { inputTokens: 120, outputTokens: 40 } });
    await ledger.reconcile({ reservationId, outcome: "settled", usage: { inputTokens: 9_999, outputTokens: 9_999 } });

    expect(await windowRows("public", "device-a", "hour")).toEqual([
      expect.objectContaining({ input_tokens: 120, output_tokens: 40 }),
    ]);
  });

  it("keeps a timeout charged as unknown until the reservation expires", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    const decision = await ledger.reserve({ scope: "public", subjectKey: "device-a" });
    const reservationId = (decision as Extract<BudgetDecision, { type: "reserved" }>).reservationId;

    await ledger.reconcile({ reservationId, outcome: "unknown" });

    expect(await reservationRow(reservationId)).toMatchObject({ status: "unknown" });
    expect(await windowRows("public", "device-a", "hour")).toEqual([
      expect.objectContaining({ reserved_input_tokens: 4_000, reserved_output_tokens: 1_000, input_tokens: 0 }),
    ]);
    expect(await ledger.expireStaleReservations()).toBe(0);

    clock.advance(31);

    expect(await ledger.expireStaleReservations()).toBe(1);
    expect(await windowRows("public", "device-a", "hour")).toEqual([
      // The request slot stays spent; only the unresolved token hold is released.
      expect.objectContaining({ requests: 1, reserved_input_tokens: 0, reserved_output_tokens: 0 }),
    ]);
    expect(await reservationRow(reservationId)).toMatchObject({ status: "expired" });
  });

  it("expires a reservation that was never reconciled and keeps the slot spent", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    await ledger.reserve({ scope: "public", subjectKey: "device-a" });

    clock.advance(31);
    expect(await ledger.expireStaleReservations()).toBe(1);

    expect(await ledger.readQuota({ scope: "public", subjectKey: "device-a" })).toMatchObject({ requestsThisHour: 1, requestsToday: 1 });
    expect(await windowRows("public", "device-a", "hour")).toEqual([
      expect.objectContaining({ reserved_input_tokens: 0 }),
    ]);
  });
});

describe("anonymous subject keys", () => {
  it("reads the validated Cloudflare client address only from the connecting-ip header", () => {
    expect(readClientIp(new Request("https://atlas.example", { headers: { "cf-connecting-ip": "203.0.113.42" } }))).toBe("203.0.113.42");
    expect(readClientIp(new Request("https://atlas.example", { headers: { "x-forwarded-for": "203.0.113.42" } }))).toBeNull();
    expect(readClientIp(new Request("https://atlas.example", { headers: { "cf-connecting-ip": "  " } }))).toBeNull();
  });

  it("stores a keyed hash that never contains the raw address", async () => {
    const key = await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42", profileId: "profile-1" });

    expect(key).toMatch(/^v1:[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113");
    expect(await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42", profileId: "profile-1" })).toBe(key);
  });

  it("prefixes the address so a rotating host inside one network shares a bucket", async () => {
    const first = await deriveSubjectKey(SECRET, { clientIp: "198.51.100.7" });
    const sameNetwork = await deriveSubjectKey(SECRET, { clientIp: "198.51.100.200" });
    const otherNetwork = await deriveSubjectKey(SECRET, { clientIp: "198.51.101.7" });

    expect(sameNetwork).toBe(first);
    expect(otherNetwork).not.toBe(first);
  });

  it("ignores forged device tokens and malformed addresses", async () => {
    const signed = await signDeviceToken(SECRET, "device-1");
    const honest = await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42", deviceToken: signed });

    expect(honest).not.toBe(await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42" }));
    expect(await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42", deviceToken: `v1.${"A".repeat(8)}.${"B".repeat(43)}` })).toBe(
      await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42" }),
    );
    expect(await deriveSubjectKey(SECRET, { clientIp: "not-an-address", deviceToken: signed })).toBe(
      await deriveSubjectKey(SECRET, { deviceToken: signed }),
    );
    expect(await deriveSubjectKey(`${SECRET}-other`, { clientIp: "203.0.113.42" })).not.toBe(
      await deriveSubjectKey(SECRET, { clientIp: "203.0.113.42" }),
    );
  });

  it("gives the same key to requests that carry no identifying material at all", async () => {
    expect(await deriveSubjectKey(SECRET, {})).toBe(await deriveSubjectKey(SECRET, { clientIp: null, deviceToken: null, profileId: null }));
  });
});

describe("sponsored turn adapter seam", () => {
  function seamLedger(clock: { now(): Date }) {
    return ledgerWith(clock, { public: { ...policyFor("public"), maxConcurrentTurns: 0 } });
  }

  it("never invokes the provider when the budget is denied", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, { public: { ...policyFor("public"), globalTurnsPerDay: 0, maxConcurrentTurns: 0 } });
    const invocations: ReservedBudget[] = [];

    const outcome = await runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-a" }, async (budget) => {
      invocations.push(budget);
      return { output: "nunca" };
    });

    expect(invocations).toHaveLength(0);
    expect(outcome.decision).toEqual({ type: "denied", reason: "global", resetsAt: "2026-09-29T00:00:00.000Z" });
    expect(outcome.output).toBeUndefined();
  });

  it("hands the reserved budget to the provider and reconciles the reported usage", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = seamLedger(clock);
    const invocations: ReservedBudget[] = [];

    const outcome = await runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-a" }, async (budget) => {
      invocations.push(budget);
      return { output: "resposta", usage: { inputTokens: 80, outputTokens: 20 } };
    });

    expect(invocations).toHaveLength(1);
    expect(invocations[0]).toMatchObject({ maxInputTokens: 4_000, maxOutputTokens: 1_000, maxToolCalls: 4, deadlineSeconds: 30 });
    expect(outcome.output).toBe("resposta");
    expect(await reservationRow(invocations[0].reservationId)).toMatchObject({ status: "settled", actual_input_tokens: 80 });
  });

  it("records a provider timeout as unknown instead of releasing the budget", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = seamLedger(clock);
    let reservationId = "";

    await expect(
      runSponsoredTurn(ledger, { scope: "public", subjectKey: "device-a" }, async (budget) => {
        reservationId = budget.reservationId;
        throw new Error("deadline exceeded");
      }),
    ).rejects.toThrow("deadline exceeded");

    expect(await reservationRow(reservationId)).toMatchObject({ status: "unknown" });
    expect(await windowRows("public", "device-a", "hour")).toEqual([
      expect.objectContaining({ reserved_input_tokens: 4_000 }),
    ]);
  });
});

describe("sponsored quota endpoint", () => {
  function handlerWith(ledger: UsageLedger, gate?: (input: { request: Request; turnstileToken: string | null }) => Promise<boolean>) {
    return createTutorQuotaHandler({
      ledger,
      subjectKey: async (request) => (request.headers.get("x-device-token") ?? "unkeyed"),
      firstUseGate: gate,
    });
  }

  it("reports the remaining sponsored quota", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    await ledger.reserve({ scope: "public", subjectKey: "unkeyed" });

    const response = await handlerWith(ledger).GET(new Request("https://atlas.example/api/tutor/quota"));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      quota: { scope: "public", requestsThisHour: 1, requestsPerHour: 5, requestsToday: 1, requestsPerDay: 15, globalTurnsToday: 1, globalTurnsPerDay: 30, globalTokensToday: 5_000, globalTokensPerDay: 150_000 },
    });
  });

  it("answers a denied reservation with 429 and the decision", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock, { public: { ...policyFor("public"), enabled: false } });

    const response = await handlerWith(ledger).POST(new Request("https://atlas.example/api/tutor/quota", { method: "POST", body: "{}" }));

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ decision: { type: "denied", reason: "disabled", resetsAt: "2026-09-29T00:00:00.000Z" } });
  });

  it("fails closed on the first sponsored turn until the abuse gate verifies it", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    const requests: (string | null)[] = [];

    const ungated = await handlerWith(ledger).POST(new Request("https://atlas.example/api/tutor/quota", { method: "POST", body: JSON.stringify({ turnstileToken: "token" }) }));
    expect(ungated.status).toBe(403);
    expect(await ungated.json()).toEqual({ error: "Verificação necessária" });
    expect((await windowRows("public", "unkeyed", "hour"))).toHaveLength(0);

    const gated = handlerWith(ledger, async ({ turnstileToken }) => {
      requests.push(turnstileToken);
      return turnstileToken === "token";
    });
    const first = await gated.POST(new Request("https://atlas.example/api/tutor/quota", { method: "POST", body: JSON.stringify({ turnstileToken: "token" }) }));
    expect(first.status).toBe(200);
    expect((await first.json()).decision.type).toBe("reserved");
    const firstDecision = ((await ledger.readQuota({ scope: "public", subjectKey: "unkeyed" }))) as { requestsToday: number };
    expect(firstDecision.requestsToday).toBe(1);

    // The first turn settles before the second starts: concurrency 1 only
    // denies overlapping turns, and returning subjects skip the gate anyway.
    const reservations = await executor.query(`SELECT id FROM ai_reservation WHERE scope = 'public' ORDER BY created_at LIMIT 1`, []);
    await ledger.reconcile({ reservationId: String(reservations[0]?.id ?? ""), outcome: "settled", usage: { inputTokens: 100, outputTokens: 20 } });

    const second = await gated.POST(new Request("https://atlas.example/api/tutor/quota", { method: "POST", body: "{}" }));
    expect(second.status).toBe(200);
    expect(requests).toEqual(["token"]);
  });

  it("ignores a client-selected scope", async () => {
    const clock = clockAt("2026-09-28T10:15:00.000Z");
    const ledger = ledgerWith(clock);
    const gated = handlerWith(ledger, async () => true);

    const response = await gated.POST(
      new Request("https://atlas.example/api/tutor/quota", { method: "POST", body: JSON.stringify({ scope: "admin" }) }),
    );

    expect(response.status).toBe(200);
    expect((await response.json()).decision.type).toBe("reserved");
    expect((await windowRows("admin", "unkeyed", "hour"))).toHaveLength(0);
    expect((await windowRows("admin", "*", "global"))).toHaveLength(0);
  });

  it("reports unconfigured instead of granting sponsored budget without credentials", async () => {
    const response = await quotaRouteGet(new Request("https://atlas.example/api/tutor/quota"));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "unconfigured" });
  });
});
