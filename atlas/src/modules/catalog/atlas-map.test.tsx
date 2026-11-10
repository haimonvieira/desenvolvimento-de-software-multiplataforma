import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AtlasMap } from "./atlas-map";
import type { Material } from "./model";

const commitSha = "0".repeat(40);

function material(name: string, index: number): Material {
  return {
    ref: { path: `DSM3/DW3/${name}`, commitSha },
    name,
    extension: name.slice(name.lastIndexOf(".")),
    size: 1_024 + index,
    disciplineCode: "DW3",
    semesterCode: "DSM3",
    kind: "document",
    downloadUrl: `/api/material/DSM3/DW3/${name}?disposition=attachment`,
    assetUrl: `/api/material/DSM3/DW3/${name}?disposition=inline`,
    previewKind: "pdf",
  };
}

const discipline = { code: "DW3", name: "Desenvolvimento Web III", semesterCode: "DSM3", materialCount: 40 };

const materials: readonly Material[] = Array.from(
  { length: 40 },
  (_, index) => material(`Aula ${String(index + 1).padStart(2, "0")}.pdf`, index),
);

function stationLabels(html: string): string[] {
  return [...html.matchAll(/atlas-station-label"[^>]*>([^<]*)</g)].map((match) => match[1]);
}

describe("AtlasMap", () => {
  it("bounds a line's stations and keeps every material in the accessible index", () => {
    const html = renderToStaticMarkup(<AtlasMap disciplines={[discipline]} materials={materials} semester="DSM3" />);

    expect((html.match(/atlas-station-dot/g) ?? []).length).toBe(6);
    expect(stationLabels(html)).toEqual(["Aula 01.pdf", "Aula 02.pdf", "Aula 03.pdf", "Aula 04.pdf", "Aula 05.pdf", "Aula 06.pdf"]);
    // The line is a summary, not an amputation: all 40 materials keep a link.
    expect((html.match(/data-material-link/g) ?? []).length).toBe(materials.length);
    expect(html).toContain('aria-label="Ver os 34 materiais restantes de Desenvolvimento Web III"');
  });

  it("shows every material when a line fits", () => {
    const short = materials.slice(0, 3);
    const html = renderToStaticMarkup(<AtlasMap disciplines={[{ ...discipline, materialCount: 3 }]} materials={short} semester="DSM3" />);

    expect((html.match(/atlas-station-dot/g) ?? []).length).toBe(3);
    expect(html).not.toContain("atlas-index-panel");
  });

  it("marks the current material once, even when its line aggregates it", () => {
    const aggregated = materials.at(-1)!;
    const aggregatedHtml = renderToStaticMarkup(
      <AtlasMap currentMaterial={aggregated.ref} disciplines={[discipline]} materials={materials} semester="DSM3" />,
    );
    expect((aggregatedHtml.match(/Você está aqui/g) ?? []).length).toBe(1);

    const visible = materials[0];
    const visibleHtml = renderToStaticMarkup(
      <AtlasMap currentMaterial={visible.ref} disciplines={[discipline]} materials={materials} semester="DSM3" />,
    );
    expect((visibleHtml.match(/aria-current="location"/g) ?? []).length).toBe(1);
    expect((visibleHtml.match(/Você está aqui/g) ?? []).length).toBe(1);
  });
});
