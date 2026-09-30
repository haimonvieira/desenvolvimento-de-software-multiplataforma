import type { MaterialRef } from "../../modules/catalog/model";
import type { RetrievedExcerpt } from "../../modules/tutor/model";
import type { ReservedBudget, TokenUsage } from "../../modules/tutor/usage-ledger";

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
 * The provider seam. Production binds the Groq adapters
 * (`createGroqPublicTutorAi` for sponsored turns, `createByokGroqPublicTutorAi`
 * for a visitor's own key); the deterministic fake is only for tests. The route
 * fails closed with `PROVIDER_UNBOUND` when no binding is supplied — it never
 * silently substitutes a provider.
 */
export interface PublicTutorAi {
  answer(input: TutorModelInput, budget: ReservedBudget): Promise<TutorModelOutput>;
  /**
   * Optional streaming variant: `onToken` receives readable answer text as it
   * becomes available, and `onStatus` receives the model's short status line
   * (the first field of the JSON document). `onCitations` receives the turn's
   * citation candidates mapped to the internal excerpt shape the moment the
   * `citations` field closes — before any answer text — so the caller can run
   * `validateCitations` and only then release the answer to the student. The
   * resolved output is exactly what `answer` returns, so a streamed turn and a
   * plain turn cannot disagree about what the model said. A double that omits
   * it simply never streams.
   */
  answerStream?(
    input: TutorModelInput,
    budget: ReservedBudget,
    onToken: (token: string) => void,
    onStatus?: (status: string) => void,
    onCitations?: (citations: readonly RetrievedExcerpt[]) => void,
  ): Promise<Readonly<{ output: TutorModelOutput; usage: TokenUsage }>>;
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
