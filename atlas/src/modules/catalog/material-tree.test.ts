import { describe, expect, it } from "vitest";

import { buildMaterialTree } from "./material-tree";
import type { Material } from "./model";

function material(path: string): Material {
  const name = path.split("/").pop()!;
  return {
    ref: { path, commitSha: "0123456789abcdef" },
    name,
    extension: name.slice(name.lastIndexOf(".")),
    size: 1,
    disciplineCode: path.split("/")[1]!,
    semesterCode: path.split("/")[0]!,
    kind: "document",
    downloadUrl: `/api/material/${path}?disposition=attachment`,
    assetUrl: `/api/material/${path}?disposition=inline`,
    previewKind: "none",
  };
}

describe("buildMaterialTree", () => {
  it("keeps every level instead of collapsing to the first folder", () => {
    const tree = buildMaterialTree([
      material("DSM1/ALP/SLIDES/aula.pdf"),
      material("DSM1/ALP/SLIDES/IMAGENS/fig.png"),
      material("DSM1/ALP/raiz.md"),
    ]);

    expect(tree.depth).toBe(0);
    expect(tree.folders.map((folder) => folder.name)).toEqual(["SLIDES"]);
    expect(tree.materials.map((entry) => entry.name)).toEqual(["raiz.md"]);

    const slides = tree.folders[0]!;
    expect(slides.depth).toBe(1);
    expect(slides.materials.map((entry) => entry.name)).toEqual(["aula.pdf"]);
    expect(slides.folders[0]!.name).toBe("IMAGENS");
    expect(slides.folders[0]!.depth).toBe(2);
    expect(slides.folders[0]!.materials.map((entry) => entry.name)).toEqual(["fig.png"]);
  });

  it("places a file directly in the discipline in the root node at depth 0", () => {
    const tree = buildMaterialTree([material("DSM1/ALP/plano.md")]);

    expect(tree.depth).toBe(0);
    expect(tree.materials.map((entry) => entry.name)).toEqual(["plano.md"]);
    expect(tree.folders).toEqual([]);
  });

  it("survives the deepest path in the catalog without collapsing", () => {
    const segments = ["DSM1", "ALP", ...Array.from({ length: 11 }, (_, index) => `NIVEL${index}`), "fim.pdf"];
    const tree = buildMaterialTree([material(segments.join("/"))]);

    let node = tree;
    for (let depth = 1; depth <= 11; depth += 1) {
      expect(node.folders).toHaveLength(1);
      node = node.folders[0]!;
      expect(node.depth).toBe(depth);
    }
    expect(node.materials.map((entry) => entry.name)).toEqual(["fim.pdf"]);
  });

  it("preserves the incoming file and folder order", () => {
    const tree = buildMaterialTree([
      material("DSM1/ALP/B/zeta.pdf"),
      material("DSM1/ALP/A/primeiro.pdf"),
      material("DSM1/ALP/A/segundo.pdf"),
      material("DSM1/ALP/raiz.md"),
    ]);

    expect(tree.folders.map((folder) => folder.name)).toEqual(["B", "A"]);
    expect(tree.folders[1]!.materials.map((entry) => entry.name)).toEqual(["primeiro.pdf", "segundo.pdf"]);
  });
});
