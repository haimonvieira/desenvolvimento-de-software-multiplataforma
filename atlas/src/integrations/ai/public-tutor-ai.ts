import type { MaterialRef } from "../../modules/catalog/model";
import type { RetrievedExcerpt } from "../../modules/tutor/model";
import type { ReservedBudget } from "../../modules/tutor/usage-ledger";

/**
 * A tool the model may ask the orchestrator to run. The name is matched against
 * the orchestrator's allowlist (`TUTOR_TOOL_ALLOWLIST`); nothing in the prompt
 * can widen that list.
 */
export type TutorToolCall = Readonly<{ name: string; query: string }>;

/** The excerpts a tool returned this turn, fed back to the model. */
export type TutorToolResult = Readonly<{
  name: string;
  query: string;
  excerpts: readonly RetrievedExcerpt[];
}>;

/**
 * A notebook entry the model proposes. It is inert data: only an explicit
 * visitor action may turn it into a `StudyWorkspace.apply` call.
 */
export type ProposedNotebookAction =
  | Readonly<{ type: "note"; title: string; body: string; source: MaterialRef }>
  | Readonly<{ type: "flashcard"; front: string; back: string; source: MaterialRef }>;

/**
 * Everything the provider is allowed to see: the visitor's question, the
 * excerpts retrieved in this turn and the results of allowlisted tools. It
 * carries no permissions — the orchestrator owns the tool allowlist, the caps
 * and the notebook confirmations.
 */
export type TutorModelInput = Readonly<{
  question: string;
  excerpts: readonly RetrievedExcerpt[];
  toolResults: readonly TutorToolResult[];
  remainingToolCalls: number;
}>;

export type TutorModelOutput = Readonly<{
  answer: string;
  citations: readonly RetrievedExcerpt[];
  proposedNotebookActions: readonly ProposedNotebookAction[];
  toolCalls?: readonly TutorToolCall[];
}>;

/**
 * The provider seam. Task 14 ships only this interface, a deterministic fake and
 * an unbound stub; the concrete provider (SDK, model name, credential and
 * streaming policy) is bound in a follow-up step and must not be chosen here.
 */
export interface PublicTutorAi {
  answer(input: TutorModelInput, budget: ReservedBudget): Promise<TutorModelOutput>;
}

/**
 * How a provider call failed, per the provider spec §6. The distinction matters
 * to the caller: a `rate_limited` turn is a spent quota with a known reset, a
 * `timeout` is an unknown outcome whose reservation stays charged, and the rest
 * fail closed without refunding anything automatically.
 */
export type TutorProviderFailure =
  | Readonly<{ kind: "rate_limited"; retryAfterSeconds: number | null }>
  | Readonly<{ kind: "timeout" }>
  | Readonly<{ kind: "auth" }>
  | Readonly<{ kind: "invalid" }>
  | Readonly<{ kind: "unavailable" }>;

const FAILURE_MESSAGES: Readonly<Record<TutorProviderFailure["kind"], string>> = {
  rate_limited: "A cota do provedor de IA está esgotada.",
  timeout: "O tutor demorou demais para responder.",
  auth: "A credencial do provedor foi recusada.",
  invalid: "O provedor recusou a requisição.",
  unavailable: "O provedor de IA está indisponível.",
};

/**
 * A provider failure with a message that never contains the API key, the
 * provider's error body or any part of the visitor's question. Every adapter
 * must throw this shape so the route can apply one failure policy without
 * trusting provider text.
 */
export class TutorProviderError extends Error {
  readonly failure: TutorProviderFailure;

  constructor(failure: TutorProviderFailure) {
    super(FAILURE_MESSAGES[failure.kind]);
    this.name = "TutorProviderError";
    this.failure = failure;
  }
}

/**
 * Deterministic double for tests: replays the script in order, repeating the
 * last entry once the script is exhausted, and records every input it received.
 */
export function createFakePublicTutorAi(
  outputs: readonly TutorModelOutput[],
): PublicTutorAi & Readonly<{ calls: readonly TutorModelInput[] }> {
  if (outputs.length === 0) throw new Error("A fake tutor needs at least one output");
  const calls: TutorModelInput[] = [];
  return Object.freeze({
    calls,
    async answer(input: TutorModelInput): Promise<TutorModelOutput> {
      calls.push(input);
      return outputs[Math.min(calls.length - 1, outputs.length - 1)]!;
    },
  });
}
