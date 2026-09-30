import type { TokenUsage } from "../../modules/tutor/usage-ledger";

/**
 * How a provider call failed, per the provider spec §6. The distinction matters
 * to the caller: a `rate_limited` turn is a spent quota with a known reset, a
 * `timeout` is an unknown outcome whose reservation stays charged, and the rest
 * fail closed without refunding anything automatically.
 *
 * `unusable` is its own kind because it is the one failure that happens *after*
 * the provider answered: the spend is real and measured, so the ledger settles
 * it instead of holding the worst case. `invalid` means the provider rejected
 * our request, which is a different thing and carries no usage.
 *
 * This lives apart from any one adapter: every provider (public tutor, BYOK,
 * admin classifier) throws this shape so the caller applies one failure policy
 * without trusting provider text.
 */
export type TutorProviderFailure =
  | Readonly<{ kind: "rate_limited"; retryAfterSeconds: number | null }>
  | Readonly<{ kind: "timeout" }>
  | Readonly<{ kind: "auth" }>
  | Readonly<{ kind: "invalid" }>
  | Readonly<{ kind: "unusable" }>
  | Readonly<{ kind: "unavailable" }>;

export const FAILURE_MESSAGES: Readonly<Record<TutorProviderFailure["kind"], string>> = {
  rate_limited: "A cota do provedor de IA está esgotada.",
  timeout: "O tutor demorou demais para responder.",
  auth: "A credencial do provedor foi recusada.",
  invalid: "O provedor recusou a requisição.",
  unusable: "A resposta do tutor não pôde ser usada.",
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
  /**
   * The measured spend when the provider answered but the answer could not be
   * used. Present only for `unusable`; every other failure spends nothing we
   * can measure, so the caller must treat its outcome as unknown.
   */
  readonly usage?: TokenUsage;

  constructor(failure: TutorProviderFailure, usage?: TokenUsage) {
    super(FAILURE_MESSAGES[failure.kind]);
    this.name = "TutorProviderError";
    this.failure = failure;
    this.usage = usage;
  }
}
