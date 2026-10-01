import type {
  ProposedNotebookAction,
  PublicTutorAi,
  TutorModelInput,
  TutorModelOutput,
  TutorToolResult,
} from "../../integrations/ai/public-tutor-ai";
import type { MaterialRef } from "../catalog/model";
import { validateCitations, type ContentRetriever, type RetrievedExcerpt } from "./model";
import { policyFor } from "./usage-policy";
import {
  runSponsoredTurn,
  type ReservedBudget,
  type SponsoredTurnResult,
  type TokenUsage,
  type UsageLedger,
} from "./usage-ledger";

/**
 * The tools the orchestrator will actually run. This list lives here, in code,
 * never in the prompt: a model asking for anything else is ignored, so prompt
 * text cannot grant itself new capabilities.
 */
export const TUTOR_TOOL_ALLOWLIST: readonly string[] = Object.freeze(["retrieve"]);

const ALLOWED_TOOLS: Readonly<Record<string, true>> = Object.freeze(
  Object.fromEntries(TUTOR_TOOL_ALLOWLIST.map((name) => [name, true])) as Record<string, true>,
);

/** The only answer the tutor gives when nothing it retrieved supports the claim. */
export const UNSUPPORTED_ANSWER = "Não encontrei isso nos materiais.";

/**
 * The one bound on how many materials a turn may carry. The turn route's schema
 * and the tutor page both use it, so the page can never post a context the route
 * rejects — the previous mismatch (every DSM1 material versus a cap of 10) made
 * the tutor unusable from its own page.
 */
export const TUTOR_CONTEXT_LIMIT = 10;

const DEFAULT_RETRIEVAL_LIMIT = 6;

export type TutorTurnMode =
  | Readonly<{ type: "sponsored"; subjectKey: string }>
  | Readonly<{ type: "byok" }>;

export type TutorTurnRequest = Readonly<{
  question: string;
  /** The materials the visitor is studying; retrieval never leaves this set. */
  context: readonly MaterialRef[];
  mode: TutorTurnMode;
}>;

export type TutorTurnResult = Readonly<{
  answer: string;
  citations: readonly RetrievedExcerpt[];
  proposedNotebookActions: readonly ProposedNotebookAction[];
}>;

export type TutorTurnOutcome =
  | Readonly<{ type: "answered"; result: TutorTurnResult }>
  | Readonly<{ type: "denied"; reason: TutorDenialReason; resetsAt: string }>;

export interface StudyTutor {
  answerTurn(request: TutorTurnRequest): Promise<TutorTurnOutcome>;
  /**
   * Streaming variant of `answerTurn`. It reserves budget before the first
   * provider call, so a denied turn yields `denied` before any `answer` event —
   * the caller can answer it with the ordinary JSON instead of opening a stream.
   * The final `result` event carries exactly the output `answerTurn` would.
   */
  answerTurnStream(request: TutorTurnRequest): AsyncGenerator<TutorStreamEvent>;
}

export type TutorDenialReason = "minute" | "daily" | "provider" | "global" | "disabled";

export type TutorStreamEvent =
  | Readonly<{ type: "denied"; reason: TutorDenialReason; resetsAt: string }>
  | Readonly<{ type: "status"; status: string }>
  | Readonly<{ type: "answer"; delta: string }>
  | Readonly<{ type: "result"; result: TutorTurnResult }>;

/**
 * The streaming channels a turn exposes to its caller. `onVerdict` carries the
 * citations verdict once the provider closes the citations field; the caller
 * must not release answer text before it is `true`.
 */
type TutorStreamHooks = Readonly<{
  onStreamStart(): void;
  onStatus(status: string): void;
  onAnswer(delta: string): void;
  onVerdict(supported: boolean): void;
}>;

export type StudyTutorDependencies = Readonly<{
  retriever: ContentRetriever;
  ai: PublicTutorAi;
  /** Required for sponsored turns; omitted for BYOK, which spends the visitor's own key. */
  ledger?: UsageLedger;
  retrievalLimit?: number;
}>;

function buildInput(
  request: TutorTurnRequest,
  excerpts: readonly RetrievedExcerpt[],
  toolResults: readonly TutorToolResult[],
  remainingToolCalls: number,
): TutorModelInput {
  return Object.freeze({
    question: request.question,
    excerpts: Object.freeze([...excerpts]),
    toolResults: Object.freeze([...toolResults]),
    remainingToolCalls,
  });
}

/**
 * Keeps only proposals whose source material was actually retrieved this turn,
 * then pairs the answer with the validated citations. An answer with no
 * surviving citation is replaced by the explicit unsupported message — the
 * tutor never guesses.
 */
function finalize(output: TutorModelOutput, excerpts: readonly RetrievedExcerpt[]): TutorTurnResult {
  const check = validateCitations(output.citations, excerpts);
  if (!check.supported) {
    return Object.freeze({ answer: UNSUPPORTED_ANSWER, citations: Object.freeze([]), proposedNotebookActions: Object.freeze([]) });
  }
  // Same rule as the citations: the model's `source.commitSha` is not
  // trustworthy, so the path decides whether an excerpt in this turn backs the
  // proposal, and the material is stamped from that excerpt — the sha that
  // reaches the notebook is ours, not the model's guess.
  const proposals = output.proposedNotebookActions.flatMap((proposal) => {
    const source = excerpts.find((excerpt) => excerpt.material.path === proposal.source.path);
    return source ? [Object.freeze({ ...proposal, source: source.material })] : [];
  });
  return Object.freeze({
    answer: output.answer,
    citations: check.citations,
    proposedNotebookActions: Object.freeze(proposals),
  });
}

function byokBudget(): ReservedBudget {
  const policy = policyFor("public");
  return Object.freeze({
    reservationId: "byok",
    maxInputTokens: policy.maxInputTokens,
    maxOutputTokens: policy.maxOutputTokens,
    maxToolCalls: policy.maxToolCalls,
    deadlineSeconds: policy.deadlineSeconds,
  });
}

/**
 * The code-controlled agent loop. The orchestrator — not the model — decides
 * what may run: retrieval happens first, every tool call is filtered through
 * the allowlist and counted against the reserved cap, and the loop ends as soon
 * as the model stops asking for tools or the cap is reached.
 */
export function createStudyTutor(dependencies: StudyTutorDependencies): StudyTutor {
  const retrievalLimit = dependencies.retrievalLimit ?? DEFAULT_RETRIEVAL_LIMIT;
  const { retriever, ai } = dependencies;

  async function runTurn(
    request: TutorTurnRequest,
    budget: ReservedBudget,
    hooks?: TutorStreamHooks,
  ): Promise<SponsoredTurnResult<TutorTurnResult>> {
    const excerpts: RetrievedExcerpt[] = [...await retriever.retrieve(request.context, request.question, retrievalLimit)];
    const toolResults: TutorToolResult[] = [];
    let used = 0;
    let usage: TokenUsage | undefined;
    // A streaming turn reads readable status/answer text from the provider as it
    // arrives; anything without `answerStream` (the deterministic double, a
    // BYOK adapter that does not stream) falls back to the one-shot call, which
    // yields the same validated output. The provider hands over the citations
    // candidates the moment that field closes, so the verdict is decided here,
    // against the excerpts retrieved this turn, before any answer text is
    // released downstream.
    const ask = async (input: TutorModelInput): Promise<TutorModelOutput> => {
      if (!hooks || !ai.answerStream) return ai.answer(input, budget);
      hooks.onStreamStart();
      const streamed = await ai.answerStream(
        input,
        budget,
        hooks.onAnswer,
        hooks.onStatus,
        (citations) => hooks.onVerdict(validateCitations(citations, excerpts).supported),
      );
      usage = streamed.usage;
      return streamed.output;
    };
    let output = await ask(buildInput(request, excerpts, toolResults, budget.maxToolCalls - used));

    for (;;) {
      const room = budget.maxToolCalls - used;
      const allowed = (output.toolCalls ?? []).filter((call) => ALLOWED_TOOLS[call.name] === true);
      if (allowed.length === 0 || room <= 0) break;
      for (const call of allowed.slice(0, room)) {
        const found = await retriever.retrieve(request.context, call.query, retrievalLimit);
        excerpts.push(...found);
        toolResults.push(Object.freeze({ name: call.name, query: call.query, excerpts: found }));
        used += 1;
      }
      output = await ask(buildInput(request, excerpts, toolResults, budget.maxToolCalls - used));
    }

    return { output: finalize(output, excerpts), usage };
  }

  /**
   * Drives `runTurn` while forwarding the provider's readable text to the
   * consumer. The reservation runs inside `runSponsoredTurn` before its first
   * provider call, so a denied turn reaches the `denied` yield with no `answer`
   * event and no spend.
   */
  async function* answerTurnStream(request: TutorTurnRequest): AsyncGenerator<TutorStreamEvent> {
    const pending: string[] = [];
    // Answer text the model wrote before the `citations` field closed. It is
    // held here and never emitted until the citations are validated: showing it
    // and then retracting it is exactly the contradiction the document's key
    // order removes. If the document ends without a positive verdict the held
    // text is dropped and the turn ends with the ordinary result — the
    // unsupported answer when no citation survived — so the student saw no
    // answer text, a normal end of turn, never a retraction of something
    // already read.
    const held: string[] = [];
    let answerReleased = false;
    let wake: (() => void) | null = null;
    let finished = false;
    // The model writes `status` before `citations` and `answer`, so the
    // accumulated status is complete by the time the first answer delta is
    // released. It is held back and emitted once, immediately before the answer
    // deltas — a partial status is worse than none. Absent status stays empty
    // and yields nothing.
    let statusText = "";
    let statusEmitted = false;
    // Set once the citations field has closed, so the status can be shown while
    // the answer is still being validated instead of waiting for the first
    // answer delta.
    let verdictSeen = false;
    const hooks: TutorStreamHooks = {
      onStreamStart() {
        // Each provider stream gets its own verdict: the previous stream's
        // released gate must not let this one's answer text through early.
        answerReleased = false;
        held.length = 0;
      },
      onStatus(status) {
        statusText += status;
        wake?.();
      },
      onAnswer(delta) {
        if (answerReleased) pending.push(delta);
        else held.push(delta);
        wake?.();
      },
      onVerdict(supported) {
        verdictSeen = true;
        if (supported && !answerReleased) {
          answerReleased = true;
          pending.push(...held);
          held.length = 0;
        }
        wake?.();
      },
    };

    let denied: Readonly<{ reason: TutorDenialReason; resetsAt: string }> | null = null;
    let result: TutorTurnResult | null = null;
    const run = (async () => {
      if (request.mode.type === "byok") {
        result = (await runTurn(request, byokBudget(), hooks)).output;
        return;
      }
      const ledger = dependencies.ledger;
      if (!ledger) throw new Error("A usage ledger is required for sponsored turns");
      const outcome = await runSponsoredTurn(
        ledger,
        { scope: "public", subjectKey: request.mode.subjectKey },
        (budget) => runTurn(request, budget, hooks),
      );
      if (outcome.decision.type === "denied") {
        denied = { reason: outcome.decision.reason, resetsAt: outcome.decision.resetsAt };
        return;
      }
      if (!outcome.output) throw new Error("A reserved turn produced no output");
      result = outcome.output;
    })();
    // `finished` flips on both settle paths so the consumer stops waiting.
    const settled = run.finally(() => {
      finished = true;
      wake?.();
    });

    for (;;) {
      if (!statusEmitted && (pending.length > 0 || verdictSeen || finished)) {
        statusEmitted = true;
        if (statusText) yield { type: "status", status: statusText };
      }
      while (pending.length > 0) yield { type: "answer", delta: pending.shift()! };
      if (finished) break;
      await new Promise<void>((resolve) => {
        wake = resolve;
        if (pending.length > 0 || verdictSeen || finished) resolve();
      });
    }
    await settled;
    // `denied` and `result` are assigned inside the async closure above; TS
    // narrows them from their null initializers, so assert the union back.
    const denial = denied as Readonly<{ reason: TutorDenialReason; resetsAt: string }> | null;
    if (denial) {
      yield { type: "denied", reason: denial.reason, resetsAt: denial.resetsAt };
      return;
    }
    yield { type: "result", result: result! };
  }

  return Object.freeze({
    async answerTurn(request: TutorTurnRequest): Promise<TutorTurnOutcome> {
      if (request.mode.type === "byok") {
        const { output } = await runTurn(request, byokBudget());
        return { type: "answered", result: output };
      }

      const ledger = dependencies.ledger;
      if (!ledger) throw new Error("A usage ledger is required for sponsored turns");
      const outcome = await runSponsoredTurn(
        ledger,
        { scope: "public", subjectKey: request.mode.subjectKey },
        (budget) => runTurn(request, budget),
      );
      if (outcome.decision.type === "denied") {
        return { type: "denied", reason: outcome.decision.reason, resetsAt: outcome.decision.resetsAt };
      }
      if (!outcome.output) throw new Error("A reserved turn produced no output");
      return { type: "answered", result: outcome.output };
    },
    answerTurnStream,
  });
}
