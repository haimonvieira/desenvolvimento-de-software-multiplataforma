const BEARER = /^Bearer\s+(\S.*)$/i;

/** A visitor's own OpenAI-compatible endpoint. The key stays out of this: it
 * travels in the `Authorization` header and never in the body. */
export type ByokProvider = Readonly<{ baseUrl: string; model: string }>;

/** Numeric IPv4 (and the hex/octal/integer spellings the URL parser normalises
 * to dotted decimal) plus the bracketed IPv6 literal. */
const IP_LITERAL = /^[\d.]+$/;
/** Path segments a provider's API root is allowed to use (`/v1`, `/openai/v1`). */
const SAFE_SEGMENT = /^[A-Za-z0-9._~-]+$/;
/** A path names an API root only when it ends at the version segment. */
const VERSION_SEGMENT = /^v\d+[a-z]*\d*$/i;

/**
 * Accepts a visitor-supplied provider base URL only if it is safe to fetch, and
 * returns it normalised, or null to refuse. This is a server-side request
 * forgery gate: the Worker would otherwise fetch whatever the descriptor names.
 *
 * Rejected, before any request is made:
 * - anything that is not an absolute `https://` URL;
 * - an IP-literal host (v4 in any spelling, or a bracketed v6 literal), so the
 *   descriptor cannot reach the metadata service or a loopback address;
 * - `localhost`, `*.local`, `*.internal`, and any dotless host, so it cannot
 *   reach the internal network by name;
 * - embedded credentials (`user:pass@host`) and a query or fragment, which are
 *   the ways a base URL can name a different target than it appears to;
 * - a path deeper than the API root: the path may be the root (`/v1`,
 *   `/openai/v1`) but must end at the version segment, so the appended
 *   `/chat/completions` cannot land past the endpoint the visitor meant.
 *
 * DNS rebinding is out of scope: the hostname check trusts resolution, and a
 * Worker cannot pin the resolved address before connecting. The cheap check is
 * still worth having — it closes the whole static SSRF surface (literals,
 * loopback and internal names) for the cost of a regex, and the rebinding case
 * requires the attacker to control DNS for a name that already passed.
 */
export function resolveByokBaseUrl(raw: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  if (parsed.username !== "" || parsed.password !== "") return null;
  if (parsed.search !== "" || parsed.hash !== "") return null;

  const host = parsed.hostname;
  if (host.startsWith("[")) return null;
  if (IP_LITERAL.test(host)) return null;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (!host.includes(".")) return null;

  const segments = parsed.pathname.split("/").filter((segment) => segment !== "");
  if (!segments.every((segment) => SAFE_SEGMENT.test(segment))) return null;
  if (segments.length > 0 && !VERSION_SEGMENT.test(segments[segments.length - 1]!)) return null;

  return `${parsed.origin}${segments.length > 0 ? `/${segments.join("/")}` : ""}`;
}

/**
 * Reads a visitor-supplied BYOK key from the `Authorization` header only. The
 * request body is never consulted, so a key cannot be smuggled into a field
 * that a body-logging layer might capture. The value lives in a local variable
 * for the duration of one request; it is never stored, cached or synchronised.
 *
 * There is deliberately no redaction helper here: nothing in the BYOK path logs
 * or echoes provider text, and every failure the adapter raises is a
 * `TutorProviderError` whose message is a fixed constant, so the key has no
 * route into an error body to redact in the first place.
 */
export function readByokKey(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const key = BEARER.exec(header.trim())?.[1]?.trim();
  return key ? key : null;
}
