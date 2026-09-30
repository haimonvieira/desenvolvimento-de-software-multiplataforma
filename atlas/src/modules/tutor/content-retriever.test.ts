import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  buildContentIndex,
  extractChunks,
  indexFormatFor,
  writeContentIndex,
  type ContentIndexBuild,
} from "../../../scripts/build-content-index";
import { createContentRetriever } from "./content-retriever";
import type { MaterialIndex, RetrievedExcerpt } from "./model";
import { materialHash, validateCitations } from "./model";

const roots: string[] = [];

async function fixture(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "dsm-atlas-index-"));
  roots.push(root);
  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      const destination = join(root, ...path.split("/"));
      await mkdir(join(destination, ".."), { recursive: true });
      await writeFile(destination, contents);
    }),
  );
  return root;
}

function commitFixture(root: string): string {
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  execFileSync("git", ["add", "-f", "."], { cwd: root });
  execFileSync("git", [
    "-c", "user.name=Atlas Test", "-c", "user.email=atlas@example.test",
    "commit", "--quiet", "-m", "fixture",
  ], { cwd: root });
  return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
}

function assetFetcher(build: ContentIndexBuild) {
  const byUrl = new Map(
    build.assets.map((asset) => [`/_index/${build.manifest.commitSha}/${asset.file}`, asset.index]),
  );
  const requested: string[] = [];
  return {
    requested,
    fetchAsset: async (url: string) => {
      requested.push(url);
      return byUrl.get(url) ?? null;
    },
  };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("content extraction", () => {
  it("chunks Markdown at headings with stable 1-based line locators", () => {
    const markdown = [
      "# Título",
      "",
      "primeiro parágrafo",
      "",
      "## Seção",
      "",
      "conteúdo da seção",
    ].join("\n");

    const chunks = extractChunks("DSM1/ALP/aula.md", markdown);

    expect(chunks.map((chunk) => chunk.locator)).toEqual([
      { type: "lines", start: 1, end: 3 },
      { type: "lines", start: 5, end: 7 },
    ]);
    expect(chunks.map((chunk) => chunk.text)).toEqual([
      "# Título\n\nprimeiro parágrafo",
      "## Seção\n\nconteúdo da seção",
    ]);
    expect(chunks.every((chunk) => chunk.hash.length > 0)).toBe(true);
  });

  it("chunks SQL by statement and source code by declaration", () => {
    const sql = [
      "CREATE TABLE alunos (",
      "  id INT",
      ");",
      "",
      "INSERT INTO alunos VALUES (1);",
      "",
      "SELECT * FROM alunos;",
    ].join("\n");
    const python = [
      "def soma(a, b):",
      "    return a + b",
      "",
      "",
      "class Aluno:",
      "    def __init__(self, nome):",
      "        self.nome = nome",
    ].join("\n");

    expect(extractChunks("DSM1/MBD/script.sql", sql).map((chunk) => chunk.locator.start)).toEqual([1, 5, 7]);
    expect(extractChunks("DSM1/ALP/programa.py", python).map((chunk) => chunk.locator.start)).toEqual([1, 5, 6]);
  });

  it("bounds long plain text into overlapping windows", () => {
    const text = Array.from({ length: 50 }, (_, index) => `linha ${index + 1}`).join("\n");

    const chunks = extractChunks("DSM1/ALP/notas.txt", text);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].locator).toEqual({ type: "lines", start: 1, end: 40 });
    expect(chunks[1].locator).toEqual({ type: "lines", start: 36, end: 50 });
    expect(chunks[1].text.startsWith("linha 36")).toBe(true);
  });

  it("derives chunk hashes deterministically from locator and text", () => {
    const text = "# A\n\ncorpo\n";
    const first = extractChunks("DSM1/ALP/a.md", text);
    const second = extractChunks("DSM1/ALP/a.md", text);

    expect(second).toEqual(first);
    expect(extractChunks("DSM1/ALP/a.md", "# A\n\noutro corpo\n")[0].hash).not.toBe(first[0].hash);
  });

  it("classifies only plain text, Markdown, SQL and source code as indexable", () => {
    expect(indexFormatFor(".md")).toBe("markdown");
    expect(indexFormatFor(".txt")).toBe("text");
    expect(indexFormatFor(".sql")).toBe("sql");
    expect(indexFormatFor(".py")).toBe("code");
    expect(indexFormatFor(".pdf")).toBeNull();
    expect(indexFormatFor(".docx")).toBeNull();
    expect(indexFormatFor(".png")).toBeNull();
  });
});

describe("content index build", () => {
  it("writes per-material assets keyed by commit sha plus a compact manifest", async () => {
    const root = await fixture({
      "DSM1/ALP/aula.md": "# Aula\n\nconteúdo\n",
      "DSM2/DW2/exercicio.js": "function somar(a, b) {\n  return a + b;\n}\n",
    });
    const sha = commitFixture(root);
    const build = await buildContentIndex(root, sha);

    expect(build.manifest.commitSha).toBe(sha);
    expect(build.manifest.indexedMaterials).toBe(2);
    expect(build.manifest.indexedChunks).toBe(2);
    expect(build.manifest.skippedMaterials).toBe(0);
    expect(build.assets.map((asset) => asset.file).sort()).toEqual([
      `${materialHash({ path: "DSM2/DW2/exercicio.js", commitSha: sha })}.json`,
      `${materialHash({ path: "DSM1/ALP/aula.md", commitSha: sha })}.json`,
    ].sort());
    expect(build.assets.every((asset) => asset.index.material.commitSha === sha)).toBe(true);
  });

  it("is byte-for-byte deterministic across builds", async () => {
    const root = await fixture({
      "DSM1/ALP/aula.md": "# Aula\n\nconteúdo\n",
      "DSM1/MBD/script.sql": "CREATE TABLE t (id INT);\n",
      "DSM2/TPI/Programa.java": "class Programa {\n  void run() {}\n}\n",
    });
    const sha = commitFixture(root);
    const first = join(root, "out-one");
    const second = join(root, "out-two");

    await writeContentIndex(root, first, sha);
    await writeContentIndex(root, second, sha);

    const readTree = async (base: string): Promise<Record<string, string>> => {
      const files = (await readdir(join(base, sha), { recursive: true })).filter((path) => path.endsWith(".json"));
      const entries = await Promise.all(files.map(async (path) => [
        path,
        await readFile(join(base, sha, path), "utf8"),
      ] as const));
      return Object.fromEntries(entries);
    };

    expect(await readTree(second)).toEqual(await readTree(first));
  });

  it("leaves exactly one commit tree in the output root across builds at different commits", async () => {
    const root = await fixture({ "DSM1/ALP/aula.md": "# Aula\n\nconteúdo\n" });
    const firstSha = commitFixture(root);
    await writeFile(join(root, "DSM1", "ALP", "extra.md"), "# Extra\n\nmais conteúdo\n");
    execFileSync("git", ["add", "-f", "."], { cwd: root });
    execFileSync("git", [
      "-c", "user.name=Atlas Test", "-c", "user.email=atlas@example.test",
      "commit", "--quiet", "-m", "second",
    ], { cwd: root });
    const secondSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
    const out = join(root, "index-out");

    await writeContentIndex(root, out, firstSha);
    await writeContentIndex(root, out, secondSha);

    expect(await readdir(out)).toEqual([secondSha]);
    const files = (await readdir(join(out, secondSha), { recursive: true })).filter((path) => path.endsWith(".json"));
    expect(files).toHaveLength(3);
  });

  it("skips secret-marked files and leaves binary formats metadata-only", async () => {
    const root = await fixture({
      "DSM1/ALP/limpo.md": "# Limpo\n\nconteúdo\n",
      "DSM1/ALP/config.js": 'const token = "abc123";\n',
      "DSM1/ALP/senha.sql": "SELECT * FROM users WHERE senha = 'x';\n",
      "DSM1/ALP/lista.pdf": "%PDF-1.4 binary\n",
      "DSM1/ALP/foto.png": "not really an image\n",
    });
    const sha = commitFixture(root);
    const build = await buildContentIndex(root, sha);
    const paths = build.assets.map((asset) => asset.index.material.path);

    expect(paths).toEqual(["DSM1/ALP/limpo.md"]);
    expect(build.manifest.skippedMaterials).toBe(2);
    expect(build.manifest.indexedMaterials).toBe(1);
  });

  it("keeps generated index assets out of version control", () => {
    const atlasRoot = resolve(import.meta.dirname, "../../..");

    execFileSync("git", ["check-ignore", "--quiet", "public/_index/deadbeef/manifest.json"], { cwd: atlasRoot });
  });

  it("indexes no credential-marked content from the real repository", async () => {
    const repositoryRoot = resolve(import.meta.dirname, "../../../..");
    const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, encoding: "utf8" }).trim();
    const marker = /(?:api[_-]?key|authorization\s*[:=]|client[_-]?secret|jwt[_-]?secret|mongodb(?:\+srv)?:\/\/|password\s*[:=]|private[_-]?key|secret\s*[:=]|senha\s*[:=]|token\s*[:=])/i;

    const build = await buildContentIndex(repositoryRoot, sha);

    expect(build.assets.length).toBeGreaterThan(0);
    const offending = build.assets.flatMap((asset) =>
      asset.index.chunks.filter((chunk) => marker.test(chunk.text)).map((chunk) => `${asset.index.material.path}:${chunk.locator.start}`),
    );
    expect(offending).toEqual([]);
  });
});

describe("ContentRetriever", () => {
  async function twoMaterials() {
    const root = await fixture({
      "DSM1/ALP/arrays.md": "# Vetores\n\nUm vetor armazena vários valores em uma única variável.\n",
      "DSM2/TPI/lacos.md": "# Laços\n\nUm laço repete instruções enquanto a condição for verdadeira.\n",
    });
    const sha = commitFixture(root);
    const build = await buildContentIndex(root, sha);
    const fetcher = assetFetcher(build);
    const retriever = createContentRetriever({ fetchAsset: fetcher.fetchAsset });
    return { sha, build, fetcher, retriever };
  }

  it("retrieves only inside the selected material context", async () => {
    const { sha, retriever, fetcher } = await twoMaterials();
    const context = [{ path: "DSM1/ALP/arrays.md", commitSha: sha }];

    const results = await retriever.retrieve(context, "laço vetor", 10);

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.material.path === "DSM1/ALP/arrays.md")).toBe(true);
    expect(fetcher.requested).toEqual([`/_index/${sha}/${materialHash(context[0])}.json`]);
  });

  it("ranks accent-insensitively", async () => {
    const { sha, retriever } = await twoMaterials();
    const context = [
      { path: "DSM1/ALP/arrays.md", commitSha: sha },
      { path: "DSM2/TPI/lacos.md", commitSha: sha },
    ];

    const accented = await retriever.retrieve(context, "lacos", 10);
    const plain = await retriever.retrieve(context, "laços", 10);

    expect(accented[0].material.path).toBe("DSM2/TPI/lacos.md");
    expect(plain[0].material.path).toBe("DSM2/TPI/lacos.md");
    expect(accented.map((result) => result.text)).toEqual(plain.map((result) => result.text));
  });

  it("propagates the exact commit sha into requests and results", async () => {
    const { sha, retriever } = await twoMaterials();

    const results = await retriever.retrieve([{ path: "DSM1/ALP/arrays.md", commitSha: sha }], "vetor", 5);

    expect(results.every((result) => result.material.commitSha === sha)).toBe(true);
    expect(results.every((result) => result.locator.type === "lines")).toBe(true);
  });

  it("ignores assets that do not match the requested material", async () => {
    const foreign: MaterialIndex = {
      material: { path: "DSM1/ALP/outro.md", commitSha: "other" },
      format: "markdown",
      chunks: [{ locator: { type: "lines", start: 1, end: 1 }, hash: "x", text: "vetor vetor" }],
    };
    const retriever = createContentRetriever({ fetchAsset: async () => foreign });

    const results = await retriever.retrieve([{ path: "DSM1/ALP/arrays.md", commitSha: "abc" }], "vetor", 5);

    expect(results).toEqual([]);
  });

  it("returns nothing for an empty query or non-positive limit and honours the limit", async () => {
    const { sha, retriever } = await twoMaterials();
    const context = [{ path: "DSM1/ALP/arrays.md", commitSha: sha }];

    expect(await retriever.retrieve(context, "   ", 5)).toEqual([]);
    expect(await retriever.retrieve(context, "vetor", 0)).toEqual([]);

    const results = await retriever.retrieve(context, "vetor valores variável", 1);
    expect(results).toHaveLength(1);
    expect(Object.isFrozen(results)).toBe(true);
  });
});

describe("citation validation", () => {
  const excerpt: RetrievedExcerpt = {
    material: { path: "DSM1/ALP/arrays.md", commitSha: "abc" },
    locator: { type: "lines", start: 1, end: 3 },
    text: "# Vetores\n\nUm vetor armazena valores.",
    score: 2,
  };

  it("accepts only citations that match a retrieved excerpt", () => {
    const valid: RetrievedExcerpt = { ...excerpt, text: "Um vetor armazena valores." };
    const wrongLocator: RetrievedExcerpt = { ...excerpt, locator: { type: "lines", start: 9, end: 10 } };
    const wrongText: RetrievedExcerpt = { ...excerpt, text: "Texto inventado pelo modelo." };
    const otherMaterial: RetrievedExcerpt = { ...excerpt, material: { path: "DSM2/TPI/outro.md", commitSha: "abc" } };

    const accepted = validateCitations([valid, wrongLocator, wrongText, otherMaterial], [excerpt]);

    expect(accepted.supported).toBe(true);
    expect(accepted.citations).toEqual([excerpt]);
  });

  it("marks the answer unsupported when every citation is invalid", () => {
    const invented: RetrievedExcerpt = { ...excerpt, text: "Nada a ver." };

    const decision = validateCitations([invented], [excerpt]);

    expect(decision.supported).toBe(false);
    expect(decision.citations).toEqual([]);
    expect(validateCitations([], [excerpt]).supported).toBe(false);
  });
});
