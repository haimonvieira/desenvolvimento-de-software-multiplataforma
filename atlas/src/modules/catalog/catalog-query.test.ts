import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
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
