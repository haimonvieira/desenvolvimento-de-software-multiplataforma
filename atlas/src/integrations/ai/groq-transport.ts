import { TutorProviderError } from "./provider-failure";

/**
 * The shared Groq HTTP transport: the request, the status mapping and the
 * timeout. It carries no policy of its own — the model id, the response format,
 * the fallback rule and the timeout value all stay in the adapter that owns
 * them, and the base URL is a parameter so the public and admin credentials can
 * point at the same endpoint without sharing a constant's home.
 */
export type GroqFetch = (url: string, init: RequestInit) => Promise<Response>;

/**
 * Maps a Groq failure onto the shared `TutorProviderError` (provider spec §6).
 * Always fail closed: no automatic quota refund, and the message never carries
 * the key or the provider body.
 */
export async function throwForGroqStatus(response: Response): Promise<never> {
  // The body is consumed (so the socket can be reused) and then discarded:
  // provider error payloads never reach the visitor and never reach logs.
  await response.body?.cancel().catch(() => undefined);
  const retryAfter = response.headers.get("retry-after");
  const seconds = retryAfter !== null && retryAfter.trim() !== "" ? Number(retryAfter.trim()) : Number.NaN;
  if (response.status === 429) {
    // 429 is never retried: the visitor is told the quota is exhausted and when
    // it resets, using `retry-after` when the provider sent it.
    throw new TutorProviderError({
      kind: "rate_limited",
      retryAfterSeconds: Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : null,
    });
  }
  if (response.status === 401 || response.status === 403) throw new TutorProviderError({ kind: "auth" });
  if (response.status === 400 || response.status === 422) throw new TutorProviderError({ kind: "invalid" });
  throw new TutorProviderError({ kind: "unavailable" });
}

/**
 * One POST to `${baseUrl}/chat/completions` with the timeout applied as an
 * abort. Abort (our timeout) and any transport failure are unknown outcomes:
 * the caller reconciles the reservation as `unknown`, never as a refund.
 */
export async function postGroqChatCompletions(options: {
  baseUrl: string;
  apiKey: string;
  body: Record<string, unknown>;
  fetchImpl: GroqFetch;
  timeoutMs: number;
}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    return await options.fetchImpl(`${options.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${options.apiKey}` },
      body: JSON.stringify(options.body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new TutorProviderError({ kind: "timeout" });
    throw new TutorProviderError({ kind: "unavailable" });
  } finally {
    clearTimeout(timer);
  }
}
