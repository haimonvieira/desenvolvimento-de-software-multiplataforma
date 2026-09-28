import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { buildCatalog, writeCatalog } from "../../../scripts/build-catalog";
import { createCatalogQuery } from "./catalog-query";
import type { CatalogData } from "./model";

const roots: string[] = [];
const commitSha = "0123456789abcdef";

async function fixture(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "dsm-atlas-catalog-"));
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

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("catalog builder", () => {
  it("catalogs only DSM1-DSM6 files and uses the first child as discipline", async () => {
    const root = await fixture({
      "DSM1/ALP/aula-01.md": "one",
      "DSM6/OPT/topic/note.txt": "two",
      "DSM7/NOPE/ignored.md": "no",
      "atlas/src/app/page.tsx": "no",
      "README.md": "no",
    });

    const sha = commitFixture(root);
    const catalog = await buildCatalog(root, sha);

    expect(catalog.materials.map(({ ref, semesterCode, disciplineCode }) => ({
      path: ref.path,
      semesterCode,
      disciplineCode,
    }))).toEqual([
      { path: "DSM1/ALP/aula-01.md", semesterCode: "DSM1", disciplineCode: "ALP" },
      { path: "DSM6/OPT/topic/note.txt", semesterCode: "DSM6", disciplineCode: "OPT" },
    ]);
  });

  it("reads blobs and sizes from the exact commit instead of the working tree", async () => {
    const root = await fixture({ "DSM1/ALP/aula.md": "committed" });
    const sha = commitFixture(root);
    await writeFile(join(root, "DSM1", "ALP", "aula.md"), "dirty working tree");
    await writeFile(join(root, "DSM1", "ALP", "untracked.md"), "untracked");

    const catalog = await buildCatalog(root, sha);

    expect(catalog.materials.map(({ ref, size }) => ({ path: ref.path, size }))).toEqual([
      { path: "DSM1/ALP/aula.md", size: 9 },
    ]);
  });

  it("catalogs only regular non-executable blobs from the committed tree", async () => {
    const root = await fixture({ "DSM1/ALP/aula.md": "lesson" });
    execFileSync("git", ["init", "--quiet"], { cwd: root });
    const linkBlob = execFileSync("git", ["hash-object", "-w", "--stdin"], {
      cwd: root,
      encoding: "utf8",
      input: ".env",
    }).trim();
    const executableBlob = execFileSync("git", ["hash-object", "-w", "--stdin"], {
      cwd: root,
      encoding: "utf8",
      input: "#!/bin/sh\n",
    }).trim();
    execFileSync("git", ["update-index", "--add", "--cacheinfo", `120000,${linkBlob},DSM1/ALP/private.md`], { cwd: root });
    execFileSync("git", ["update-index", "--add", "--cacheinfo", `100755,${executableBlob},DSM1/ALP/run.sh`], { cwd: root });
    execFileSync("git", ["add", "-f", "DSM1/ALP/aula.md"], { cwd: root });
    execFileSync("git", [
      "-c", "user.name=Atlas Test", "-c", "user.email=atlas@example.test",
      "commit", "--quiet", "-m", "mode fixture",
    ], { cwd: root });
    const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();

    const catalog = await buildCatalog(root, sha);

    expect(catalog.materials.map(({ ref }) => ref.path)).toEqual(["DSM1/ALP/aula.md"]);
  });

  it("excludes generated, cache, private, executable, and build artifacts", async () => {
    const root = await fixture({
      "DSM1/ALP/keep.md": "yes",
      "DSM1/ALP/node_modules/pkg/index.js": "no",
      "DSM1/ALP/.env": "no",
      "DSM1/ALP/.env.local": "no",
      "DSM1/ALP/__pycache__/code.pyc": "no",
      "DSM1/ALP/build/output.txt": "no",
      "DSM1/ALP/dist/output.js": "no",
      "DSM1/ALP/target/output.jar": "no",
      "DSM1/ALP/.cache/output.txt": "no",
      "DSM1/ALP/out/output.txt": "no",
      "DSM1/build/generated.txt": "no",
      "DSM1/ALP/generated/output.ts": "no",
      "DSM1/ALP/bin/output.txt": "no",
      "DSM1/ALP/nbproject/private/config.properties": "no",
      "DSM1/ALP/program.exe": "no",
      "DSM1/ALP/.idea/workspace.xml": "no",
      "DSM1/ALP/mvnw.cmd": "no",
      "DSM1/ALP/setup.bat": "no",
    });
    const sha = commitFixture(root);

    const catalog = await buildCatalog(root, sha);

    expect(catalog.materials.map((material) => material.ref.path)).toEqual([
      "DSM1/ALP/keep.md",
    ]);
    expect(catalog.disciplines.map((discipline) => discipline.code)).toEqual(["ALP"]);
  });

  it("normalizes paths, produces deterministic JSON, and falls back for unknown files", async () => {
    const root = await fixture({
      "DSM1/ALP/zeta.odd": "odd",
      "DSM1/ALP/alpha.md": "alpha",
    });
    const first = join(root, "first.json");
    const second = join(root, "second.json");
    const sha = commitFixture(root);
    await writeCatalog(root, first, sha);
    await writeCatalog(root, second, sha);
    const [firstJson, secondJson] = await Promise.all([
      readFile(first, "utf8"),
      readFile(second, "utf8"),
    ]);
    const catalog = JSON.parse(firstJson) as CatalogData;
    const unknown = catalog.materials.find(({ name }) => name === "zeta.odd");

    expect(secondJson).toBe(firstJson);
    expect(catalog.materials.map(({ ref }) => ref.path)).toEqual([
      "DSM1/ALP/alpha.md",
      "DSM1/ALP/zeta.odd",
    ]);
    expect(catalog.materials.every(({ ref }) => !ref.path.includes("\\"))).toBe(true);
    expect(unknown).toMatchObject({ kind: "other", previewKind: "none" });
  });

  it("writes only capped safe preview assets and excludes credential-like content", async () => {
    const root = await fixture({
      "DSM2/DW2/dw2-nodejs-express/exercicios-js/arrays-e-objetos/script.js": `${"a".repeat(210_000)}TAIL_SECRET`,
      "DSM1/ALP/unreviewed.js": "console.log('ordinary but unreviewed')",
      "DSM1/ALP/session.js": 'session({ secret: "senha-longa-para-sessao" })',
      "DSM1/ALP/senha.js": 'const senha = "abc"',
      "DSM1/ALP/private.js": "const privateKey = 'abc'",
      "DSM1/ALP/config.json": '{"password":"secret"}',
      "DSM1/ALP/.env": "TOKEN=real-secret",
    });
    const sha = commitFixture(root);
    const output = join(root, "generated/catalog.json");

    await writeCatalog(root, output, sha);

    const catalog = JSON.parse(await readFile(output, "utf8")) as CatalogData;
    const previewRoot = resolve(dirname(output), "../../public/material-previews");
    const approvedPath = "DSM2/DW2/dw2-nodejs-express/exercicios-js/arrays-e-objetos/script.js";
    expect((await readFile(join(previewRoot, `${approvedPath}.txt`))).byteLength).toBe(200_000);
    expect(catalog.materials.find((material) => material.ref.path === approvedPath)?.previewUrl).toBe(`/material-previews/${approvedPath}.txt`);
    for (const name of ["unreviewed.js", "session.js", "senha.js", "private.js", "config.json"]) {
      expect(catalog.materials.find((material) => material.name === name)?.previewUrl).toBeUndefined();
    }
    const previewFiles = await readdir(previewRoot, { recursive: true });
    expect(previewFiles.some((path) => /(?:unreviewed|session|senha|private|config)/i.test(path))).toBe(false);
    await expect(readFile(join(dirname(output), "material-text.json"))).rejects.toThrow();
  });

  it("contains no credential markers in generated preview assets", async () => {
    const previewRoot = resolve(import.meta.dirname, "../../../public/material-previews");
    const files = await readdir(previewRoot, { recursive: true });
    const content = (await Promise.all(files.filter((path) => path.endsWith(".txt")).map((path) => readFile(join(previewRoot, path), "utf8")))).join("\n");

    expect(content).not.toMatch(/(?:api[_-]?key|jwt[_-]?secret|mongodb(?:\+srv)?:\/\/|password\s*[:=]|private[_-]?key|secret\s*[:=]|senha\s*[:=]|token\s*[:=])/i);
  });

  it("keeps secret markers and monolithic preview data out of deployed bundles", async () => {
    const serverRoot = resolve(import.meta.dirname, "../../../dist/server");
    const files = (await readdir(serverRoot, { recursive: true })).filter((path) => /\.(?:js|json)$/.test(path));
    const output = await Promise.all(files.map((path) => readFile(join(serverRoot, path), "utf8")));
    const deployed = output.join("\n");

    expect(deployed).not.toContain("apigamessecret");
    expect(deployed).not.toContain("material-text.json");
    expect(Buffer.byteLength(deployed)).toBeLessThan(10 * 1024 * 1024);
  });


  it("keeps IDE metadata and executable scripts out of the real repository catalog", async () => {
    const repositoryRoot = resolve(import.meta.dirname, "../../../..");
    const sha = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repositoryRoot,
      encoding: "utf8",
    }).trim();

    const catalog = await buildCatalog(repositoryRoot, sha);

    expect(catalog.materials.some(({ ref }) =>
      /(^|\/)\.idea(\/|$)|\.(?:bat|cmd)$/i.test(ref.path),
    )).toBe(false);
  });
});
describe("CatalogQuery", () => {
  it("browses immutable generated data and resolves a material by path and commit", async () => {
    const root = await fixture({
      "DSM1/ALP/aula.md": "one",
      "DSM2/TPI/exercicio.java": "two",
    });
    const sha = commitFixture(root);
    const data = await buildCatalog(root, sha);
    const query = createCatalogQuery(data);

    const result = query.browse({ semester: "DSM1", discipline: "ALP" });

    expect(result).toHaveLength(1);
    expect(query.getMaterial(result[0].ref)).toEqual(result[0]);
    expect(query.getMaterial({ path: result[0].ref.path, commitSha: "other" })).toBeNull();
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result[0])).toBe(true);
  });

  it("searches accent-insensitively across names, paths, semester names, and discipline names", () => {
    const query = createCatalogQuery({
      commitSha,
      semesters: [{ code: "DSM1", name: "Primeiro Semestre" }],
      disciplines: [{ code: "ALP", name: "Algoritmos e Lógica", semesterCode: "DSM1" }],
      materials: [{
        ref: { path: "DSM1/ALP/introducao.md", commitSha },
        name: "Introdução.md",
        extension: ".md",
        size: 3,
        disciplineCode: "ALP",
        semesterCode: "DSM1",
        kind: "document",
        downloadUrl: "https://example.test/file",
        previewKind: "text",
      }],
    });

    expect(query.search("logica").items).toHaveLength(1);
    expect(query.search("primeiro").items).toHaveLength(1);
    expect(query.search("introducao").items).toHaveLength(1);
  });

  it("returns 30 search results per opaque base64url cursor", () => {
    const materials = Array.from({ length: 31 }, (_, index) => ({
      ref: { path: `DSM1/ALP/aula-${String(index).padStart(2, "0")}.md`, commitSha },
      name: `Aula ${index}`,
      extension: ".md",
      size: index,
      disciplineCode: "ALP",
      semesterCode: "DSM1",
      kind: "document" as const,
      downloadUrl: `https://example.test/${index}`,
      previewKind: "text" as const,
    }));
    const query = createCatalogQuery({
      commitSha,
      semesters: [{ code: "DSM1", name: "Primeiro Semestre" }],
      disciplines: [{ code: "ALP", name: "Algoritmos", semesterCode: "DSM1" }],
      materials,
    });

    const first = query.search("aula");
    const second = query.search("aula", first.nextCursor);

    expect(first.items).toHaveLength(30);
    expect(first.nextCursor).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(second.items).toHaveLength(1);
    expect(second.nextCursor).toBeUndefined();
  });
});
