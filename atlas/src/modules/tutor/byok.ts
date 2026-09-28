const BEARER = /^Bearer\s+(\S.*)$/i;

/**
 * Reads a visitor-supplied BYOK key from the `Authorization` header only. The
 * request body is never consulted, so a key cannot be smuggled into a field
 * that a body-logging layer might capture. The value lives in a local variable
 * for the duration of one request; it is never stored, cached or synchronised.
 */
export function readByokKey(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const key = BEARER.exec(header.trim())?.[1]?.trim();
  return key ? key : null;
}

/** Removes a key from any string before it could reach a log or an error body. */
export function redactSecret(value: string, secret: string | null): string {
  if (!secret) return value;
  return value.split(secret).join("[redigido]");
}
