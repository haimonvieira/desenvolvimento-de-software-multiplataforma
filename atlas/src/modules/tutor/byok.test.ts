import { describe, expect, it } from "vitest";

import { readByokKey, resolveByokBaseUrl } from "./byok";

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
});

describe("BYOK provider base URL", () => {
  it("normalises an accepted API root", () => {
    expect(resolveByokBaseUrl("https://api.groq.com/openai/v1")).toBe("https://api.groq.com/openai/v1");
    expect(resolveByokBaseUrl("https://api.groq.com/openai/v1/")).toBe("https://api.groq.com/openai/v1");
    expect(resolveByokBaseUrl("https://API.Example.COM/v1")).toBe("https://api.example.com/v1");
    expect(resolveByokBaseUrl("https://api.example.com")).toBe("https://api.example.com");
  });

  it("refuses anything that is not an absolute https URL", () => {
    expect(resolveByokBaseUrl("http://api.example.com/v1")).toBeNull();
    expect(resolveByokBaseUrl("api.example.com/v1")).toBeNull();
    expect(resolveByokBaseUrl("ftp://api.example.com/v1")).toBeNull();
    expect(resolveByokBaseUrl("not a url")).toBeNull();
  });

  it("refuses every IP-literal host shape", () => {
    expect(resolveByokBaseUrl("https://127.0.0.1/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://10.0.0.5/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://169.254.169.254/latest/meta-data")).toBeNull();
    expect(resolveByokBaseUrl("https://2130706433/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://[::1]/v1")).toBeNull();
  });

  it("refuses loopback and internal names, and any dotless host", () => {
    expect(resolveByokBaseUrl("https://localhost/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://box.local/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://foo.internal/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://intranet/v1")).toBeNull();
  });

  it("refuses embedded credentials, a query, a fragment and a path past the API root", () => {
    expect(resolveByokBaseUrl("https://user:pass@api.example.com/v1")).toBeNull();
    expect(resolveByokBaseUrl("https://api.example.com/v1?next=https://evil.example")).toBeNull();
    expect(resolveByokBaseUrl("https://api.example.com/v1#@evil.example")).toBeNull();
    expect(resolveByokBaseUrl("https://api.example.com/v1/chat/completions")).toBeNull();
  });
});
