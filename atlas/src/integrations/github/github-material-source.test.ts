import { describe, expect, it, vi } from "vitest";

import {
  createGitHubMaterialSource,
  type GitHubTransport,
} from "./github-material-source";

function transport(responses: Record<string, unknown>): GitHubTransport {
  return async (path) => {
    void path;
    return { status: 200, json: async () => responses[path] ?? {} };
  };
}

describe("github material source adapter", () => {
  it("creates blobs as base64 and returns the SHA", async () => {
    const seen: string[] = [];
    const source = createGitHubMaterialSource(
      async (_path, init) => {
        if (init.body) seen.push(init.body);
        return { status: 201, json: async () => ({ sha: "abc123" }) };
      },
      async () => "test-token",
      "owner/repo",
    );
    const sha = await source.createBlob(new Uint8Array([72, 105]));
    expect(sha).toBe("abc123");
    expect(seen[0]).toContain("base64");
  });

  it("reads blobs and trees through the transport seam", async () => {
    const fetch = vi.fn();
    void fetch;
    const source = createGitHubMaterialSource(
      transport({
        "/repos/owner/repo/commits/HEAD": { sha: "head-sha" },
        "/repos/owner/repo/git/trees/head-sha?recursive=1": { tree: [] },
      }),
      async () => "test-token",
      "owner/repo",
    );
    await expect(source.readHead()).resolves.toBe("head-sha");
    await expect(source.readTree("head-sha")).resolves.toEqual([]);
  });

  it("never calls fetch directly", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(
      async (path, init) => {
        calls.push(`${init.method} ${path}`);
        return { status: 201, json: async () => ({ sha: "x" }) };
      },
      async () => "test-token",
      "owner/repo",
    );
    await source.createBlob(new Uint8Array([1]));
    expect(calls).toEqual(["POST /repos/owner/repo/git/blobs"]);
  });
});
