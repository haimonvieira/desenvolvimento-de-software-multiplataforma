import type { ReservedBudget } from "../../modules/tutor/usage-ledger";

/**
 * Worst-case characters per token, used to bound a prompt without a tokenizer.
 * Code and identifiers tokenize near three characters per token; Portuguese
 * prose and JSON tokenize higher, so three is the pessimistic floor: a prompt
 * under `maxInputTokens * CHARS_PER_TOKEN_FLOOR` characters cannot exceed the
 * reserved input token budget.
 */
export const CHARS_PER_TOKEN_FLOOR = 3;

/** Marks text that was dropped to fit the reserved budget instead of sending it. */
export const TRUNCATION_MARKER = " […truncado pelo orçamento]";

export function promptCharBudget(budget: ReservedBudget): number {
  return budget.maxInputTokens * CHARS_PER_TOKEN_FLOOR;
}
