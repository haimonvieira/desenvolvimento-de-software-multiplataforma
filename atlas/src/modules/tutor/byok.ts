const BEARER = /^Bearer\s+(\S.*)$/i;

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
