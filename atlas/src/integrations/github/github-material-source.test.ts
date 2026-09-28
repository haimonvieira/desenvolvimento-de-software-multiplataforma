import { describe, expect, it } from "vitest";

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
      "owner/repo",
    );
    const sha = await source.createBlob(new Uint8Array([72, 105]));
    expect(sha).toBe("abc123");
    expect(seen[0]).toContain("base64");
  });

  it("reads blobs and trees through the transport seam", async () => {
    const source = createGitHubMaterialSource(
      transport({
        "/repos/owner/repo/commits/HEAD": { sha: "head-sha" },
        "/repos/owner/repo/git/commits/head-sha": { tree: { sha: "tree-sha" } },
        "/repos/owner/repo/git/trees/tree-sha?recursive=1": { tree: [] },
      }),
      "owner/repo",
    );
    await expect(source.readHead()).resolves.toBe("head-sha");
    await expect(source.readTree("head-sha")).resolves.toEqual([]);
  });

  it("addresses the blob endpoint by blob SHA, never by commit SHA", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(async (path, init) => {
      calls.push(`${init.method} ${path}`);
      return {
        status: 200,
        json: async () => ({ content: "SGk=", encoding: "base64" }),
      };
    }, "owner/repo");
    const bytes = await source.readBlob("deadbeef");
    expect(bytes).toEqual(new Uint8Array([72, 105]));
    expect(calls).toEqual(["GET /repos/owner/repo/git/blobs/deadbeef"]);
  });

  it("resolves commit to tree before hitting the trees endpoint", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(async (path, init) => {
      calls.push(`${init.method} ${path}`);
      if (path === "/repos/owner/repo/git/commits/commit-sha") {
        return { status: 200, json: async () => ({ tree: { sha: "tree-sha" } }) };
      }
      return { status: 200, json: async () => ({ tree: [] }) };
    }, "owner/repo");
    await source.readTree("commit-sha");
    expect(calls).toEqual([
      "GET /repos/owner/repo/git/commits/commit-sha",
      "GET /repos/owner/repo/git/trees/tree-sha?recursive=1",
    ]);
  });

  it("never calls fetch directly", async () => {
    const calls: string[] = [];
    const source = createGitHubMaterialSource(async (path, init) => {
      calls.push(`${init.method} ${path}`);
      return { status: 201, json: async () => ({ sha: "x" }) };
    }, "owner/repo");
    await source.createBlob(new Uint8Array([1]));
    expect(calls).toEqual(["POST /repos/owner/repo/git/blobs"]);
  });
});
