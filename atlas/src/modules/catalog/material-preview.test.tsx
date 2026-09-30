import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MaterialPreview } from "./material-preview";
import type { Material } from "./model";

const origin = "https://atlas.example";

function material(overrides: Partial<Material>): Material {
  return {
    ref: { path: "DSM1/ALP/apostila.pdf", commitSha: "0".repeat(40) },
    name: "apostila.pdf",
    extension: ".pdf",
    size: 2_048,
    disciplineCode: "ALP",
    semesterCode: "DSM1",
    kind: "document",
    downloadUrl: "/api/material/DSM1/ALP/apostila.pdf?disposition=attachment",
    assetUrl: "/api/material/DSM1/ALP/apostila.pdf?disposition=inline",
    previewKind: "pdf",
    ...overrides,
  };
}

describe("MaterialPreview", () => {
  it("points the PDF viewer at our own origin, not at GitHub", async () => {
    const pdf = material({});
    const html = renderToStaticMarkup(await MaterialPreview({ material: pdf, origin }));

    expect(html).toContain('data-material-preview="pdf"');
    expect(html).toContain(`data="${pdf.assetUrl}"`);
    expect(html).not.toContain("raw.githubusercontent.com");
  });

  it("offers the download next to a preview that worked", async () => {
    const image = material({
      ref: { path: "DSM1/ALP/figura.png", commitSha: "0".repeat(40) },
      name: "figura.png",
      extension: ".png",
      kind: "image",
      previewKind: "image",
      downloadUrl: "/api/material/DSM1/ALP/figura.png?disposition=attachment",
      assetUrl: "/api/material/DSM1/ALP/figura.png?disposition=inline",
    });
    const html = renderToStaticMarkup(await MaterialPreview({ material: image, origin }));

    expect(html).toContain('data-material-preview="image"');
    expect(html).toContain(`src="${image.assetUrl}"`);
    expect(html).toContain(`href="${image.downloadUrl}"`);
    expect(html).toContain("Baixar arquivo");
  });

  it("opens the image at its own size", async () => {
    const image = material({
      ref: { path: "DSM1/ALP/figura.png", commitSha: "0".repeat(40) },
      name: "figura.png",
      extension: ".png",
      kind: "image",
      previewKind: "image",
      downloadUrl: "/api/material/DSM1/ALP/figura.png?disposition=attachment",
      assetUrl: "/api/material/DSM1/ALP/figura.png?disposition=inline",
    });
    const html = renderToStaticMarkup(await MaterialPreview({ material: image, origin }));

    expect(html).toContain("Abrir em tamanho real");
    expect(html).toContain(`href="${image.assetUrl}"`);
    expect(html).toContain('target="_blank"');
  });

  it("embeds office documents in the online viewer", async () => {
    const office = material({
      ref: { path: "DSM1/ALP/aula.pptx", commitSha: "0".repeat(40) },
      name: "aula.pptx",
      extension: ".pptx",
      previewKind: "office",
      downloadUrl: "/api/material/DSM1/ALP/aula.pptx?disposition=attachment",
      assetUrl: "/api/material/DSM1/ALP/aula.pptx?disposition=inline",
    });
    const html = renderToStaticMarkup(await MaterialPreview({ material: office, origin }));

    const expected = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(origin + office.assetUrl)}`;
    expect(html).toContain('data-material-preview="office"');
    expect(html).toContain(`src="${expected}"`);
  });

  it("says when the text preview was cut", async () => {
    const text = material({
      ref: { path: "DSM1/ALP/Lista.java", commitSha: "0".repeat(40) },
      name: "Lista.java",
      extension: ".java",
      kind: "code",
      previewKind: "text",
      previewUrl: "/material-previews/DSM1/ALP/Lista.java.txt",
      previewTruncated: true,
      downloadUrl: "/api/material/DSM1/ALP/Lista.java?disposition=attachment",
      assetUrl: "/api/material/DSM1/ALP/Lista.java?disposition=inline",
    });
    const html = renderToStaticMarkup(await MaterialPreview({ material: text, origin }));

    expect(html).toContain("excede o limite de pré-visualização");
    expect(html).toContain(`href="${text.downloadUrl}"`);
  });

  it("stays quiet about truncation when the preview is complete", async () => {
    const text = material({
      ref: { path: "DSM1/ALP/Lista.java", commitSha: "0".repeat(40) },
      name: "Lista.java",
      extension: ".java",
      kind: "code",
      previewKind: "text",
      previewUrl: "/material-previews/DSM1/ALP/Lista.java.txt",
      downloadUrl: "/api/material/DSM1/ALP/Lista.java?disposition=attachment",
      assetUrl: "/api/material/DSM1/ALP/Lista.java?disposition=inline",
    });
    const html = renderToStaticMarkup(await MaterialPreview({ material: text, origin }));

    expect(html).not.toContain("excede o limite de pré-visualização");
    expect(html).toContain("Lista.java");
  });

  it("falls back when there is no preview at all", async () => {
    const archive = material({
      ref: { path: "DSM1/ALP/Exemplos.zip", commitSha: "0".repeat(40) },
      name: "Exemplos.zip",
      extension: ".zip",
      kind: "archive",
      previewKind: "none",
      downloadUrl: "/api/material/DSM1/ALP/Exemplos.zip?disposition=attachment",
      assetUrl: "/api/material/DSM1/ALP/Exemplos.zip?disposition=inline",
    });
    const html = renderToStaticMarkup(await MaterialPreview({ material: archive, origin }));

    expect(html).toContain("Pré-visualização indisponível para este formato.");
    expect(html).toContain(`href="${archive.downloadUrl}"`);
    expect(html).toContain("Baixar arquivo");
    expect(html).toContain("Ver no GitHub");
  });
});
