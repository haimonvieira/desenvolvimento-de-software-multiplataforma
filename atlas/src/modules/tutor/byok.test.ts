import { describe, expect, it } from "vitest";

import { readByokKey, redactSecret } from "./byok";

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

  it("strips the key from any string before it could be logged", () => {
    expect(redactSecret(`falha ao usar ${KEY} no provedor`, KEY)).toBe("falha ao usar [redigido] no provedor");
    expect(redactSecret("mensagem sem segredo", KEY)).toBe("mensagem sem segredo");
    expect(redactSecret(`falha ${KEY}`, null)).toBe(`falha ${KEY}`);
  });
});
