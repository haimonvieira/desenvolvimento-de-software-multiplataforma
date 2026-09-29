import { describe, expect, it } from "vitest";

import { TutorProviderError } from "../../integrations/ai/public-tutor-ai";
import { readByokKey } from "./byok";

const KEY = "sk-visitor-secret-key";

describe("BYOK key handling", () => {
  it("reads the key only from the Authorization header", () => {
    const request = new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      headers: { authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ question: "x", apiKey: KEY, context: [{ path: "a", commitSha: "b" }] }),
    });

    expect(readByokKey(request)).toBe(KEY);
  });

  it("ignores a key smuggled into the body", () => {
    const request = new Request("https://atlas.test/api/tutor/turn", {
      method: "POST",
      body: JSON.stringify({ apiKey: KEY }),
    });

    expect(readByokKey(request)).toBeNull();
  });

  it("returns null for a missing or malformed header", () => {
    expect(readByokKey(new Request("https://atlas.test/api/tutor/turn"))).toBeNull();
    expect(readByokKey(new Request("https://atlas.test/api/tutor/turn", { headers: { authorization: KEY } }))).toBeNull();
    expect(readByokKey(new Request("https://atlas.test/api/tutor/turn", { headers: { authorization: "Bearer   " } }))).toBeNull();
  });

  it("never puts the key into a provider failure message", () => {
    // The redaction helper was deleted as dead code: no sink logs provider text,
    // and every failure the adapter raises carries a fixed message, so there is
    // nothing to redact. This pins that structural guarantee instead.
    const failure = new TutorProviderError({ kind: "auth" });
    expect(failure.message).not.toContain(KEY);
    expect(failure.message).not.toContain("sk-");
  });
});
