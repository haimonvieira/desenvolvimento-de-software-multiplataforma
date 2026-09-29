import { env } from "cloudflare:workers";

import { readClientIp } from "../../modules/tutor/usage-ledger";

export const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileFetch = (url: string, init: RequestInit) => Promise<Response>;

export type TurnstileGateOptions = Readonly<{
  secret: string;
  fetchImpl?: TurnstileFetch;
}>;

type SiteverifyResponse = Readonly<{
  success?: unknown;
  "error-codes"?: unknown;
}>;

/**
 * Verifies a Turnstile token against Cloudflare's siteverify endpoint.
 * Fail-closed: any transport error, non-200, unparseable body or explicit
 * failure returns false. The secret travels only in this server-side request
 * body; the token is single-use with a 5-minute validity, enforced by
 * Cloudflare (`timeout-or-duplicate` on replay).
 * Source: developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export function createTurnstileGate(options: TurnstileGateOptions): (
  input: Readonly<{ request: Request; turnstileToken: string | null }>,
) => Promise<boolean> {
  const { secret } = options;
  const fetchImpl = options.fetchImpl ?? ((url, init) => fetch(url, init));
  return async function firstUseGate({ request, turnstileToken }) {
    if (!secret || !turnstileToken) return false;
    try {
      const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret,
          response: turnstileToken,
          remoteip: readClientIp(request),
        }),
      });
      if (!response.ok) return false;
      const payload = (await response.json().catch(() => null)) as SiteverifyResponse | null;
      return payload?.success === true;
    } catch {
      return false;
    }
  };
}

type TurnstileEnv = {
  TURNSTILE_SECRET_KEY?: string;
};

export function turnstileGateFromEnv(): ((input: Readonly<{ request: Request; turnstileToken: string | null }>) => Promise<boolean>) | undefined {
  const { TURNSTILE_SECRET_KEY: secret } = env as TurnstileEnv;
  return secret ? createTurnstileGate({ secret }) : undefined;
}
