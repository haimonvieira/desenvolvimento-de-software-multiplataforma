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
  /** Maximum sponsored turns per day across the whole portal (org-level). */
  globalTurnsPerDay: number;
  /** Maximum sponsored tokens per day across the whole portal (org-level). */
  globalTokensPerDay: number;
  /**
   * Maximum sponsored turns in flight at once. 1: two 5.000-token turns would
   * exceed Groq's 8.000 TPM organization ceiling.
   */
  maxConcurrentTurns: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxToolCalls: number;
  deadlineSeconds: number;
}>;

export const USAGE_POLICIES: Readonly<Record<UsageScope, UsagePolicy>> = {
  /**
   * Sponsored public tutor: 5 turns/hour, 15/day per visitor; 30 turns/day and
   * 150.000 tokens/day globally with 1 turn in flight. The global ceilings fit
   * Groq's organization-level free tier (200.000 TPD, 8.000 TPM) with a 25%
   * counting margin — see the provider spec §2.1.
   */
  public: {
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
    globalTokensPerDay: 500_000,
    maxConcurrentTurns: 2,
    maxInputTokens: 8_000,
    maxOutputTokens: 2_000,
    maxToolCalls: 8,
    deadlineSeconds: 60,
  },
};

export function policyFor(scope: UsageScope): UsagePolicy {
  return USAGE_POLICIES[scope];
}
