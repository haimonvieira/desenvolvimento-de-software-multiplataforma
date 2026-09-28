/**
 * Safety ceilings, not product promises. These are fixed here so every entry
 * point shares one definition, and they are deliberately conservative: the
 * sponsored key must not be able to spend without a hard limit. Lowering them
 * operationally is allowed; raising them requires cost evidence.
 */
export type UsageScope = "public" | "admin";

export type UsagePolicy = Readonly<{
  enabled: boolean;
  requestsPerHour: number;
  requestsPerDay: number;
  globalTurnsPerDay: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxToolCalls: number;
  deadlineSeconds: number;
}>;

export const USAGE_POLICIES: Readonly<Record<UsageScope, UsagePolicy>> = {
  /** Sponsored public tutor: 5 turns/hour, 15/day, 300 sponsored turns/day globally. */
  public: {
    enabled: true,
    requestsPerHour: 5,
    requestsPerDay: 15,
    globalTurnsPerDay: 300,
    maxInputTokens: 4_000,
    maxOutputTokens: 1_000,
    maxToolCalls: 4,
    deadlineSeconds: 30,
  },
  /**
   * Administrative classification runs on a separate provider credential with
   * its own ledger and its own ceilings, so a public surge can never consume
   * administrative capacity (or the other way round).
   */
  admin: {
    enabled: true,
    requestsPerHour: 10,
    requestsPerDay: 60,
    globalTurnsPerDay: 100,
    maxInputTokens: 8_000,
    maxOutputTokens: 2_000,
    maxToolCalls: 8,
    deadlineSeconds: 60,
  },
};

export function policyFor(scope: UsageScope): UsagePolicy {
  return USAGE_POLICIES[scope];
}
