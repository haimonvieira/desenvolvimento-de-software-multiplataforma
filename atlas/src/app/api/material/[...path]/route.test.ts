import { describe, expect, it, vi } from "vitest";

import { createMaterialAssetHandler } from "./route";
import type { CatalogData, Material } from "../../../../modules/catalog/model";
import { GITHUB_USER_AGENT } from "../../../../integrations/github/github-material-source";

const COMMIT_SHA = "a".repeat(40);

const pdfMaterial: Material = {
  ref: { path: "DSM1/ALP/SLIDES/aula.pdf", commitSha: COMMIT_SHA },
  name: "aula.pdf",
  extension: ".pdf",
  size: 1234,
  disciplineCode: "ALP",
  semesterCode: "DSM1",
  kind: "document",
  downloadUrl: "/api/material/DSM1/ALP/SLIDES/aula.pdf?disposition=attachment",
  assetUrl: "/api/material/DSM1/ALP/SLIDES/aula.pdf?disposition=inline",
  previewKind: "pdf",
};

const accentedMaterial: Material = {
  ref: { path: "DSM1/ALP/LISTAS DE EXERCÍCIOS.pdf", commitSha: COMMIT_SHA },
  name: "LISTAS DE EXERCÍCIOS.pdf",
  extension: ".pdf",
  size: 2048,
  disciplineCode: "ALP",
  semesterCode: "DSM1",
  kind: "document",
  downloadUrl: "/api/material/DSM1/ALP/LISTAS%20DE%20EXERC%C3%8DCIOS.pdf?disposition=attachment",
  assetUrl: "/api/material/DSM1/ALP/LISTAS%20DE%20EXERC%C3%8DCIOS.pdf?disposition=inline",
  previewKind: "pdf",
};

const catalog: CatalogData = {
  commitSha: COMMIT_SHA,
  semesters: [],
  disciplines: [],
  materials: [pdfMaterial, accentedMaterial],
};

type FetchAsset = (url: string, init: { headers: Record<string, string> }) => Promise<Response>;

function handlerWith(fetchAsset: FetchAsset) {
  return createMaterialAssetHandler({
    catalog,
    repositoryUrl: "https://github.com/owner/repo",
    fetchAsset,
  });
}

function context(...path: string[]) {
  return { params: Promise.resolve({ path }) };
}

const pdfContext = context("DSM1", "ALP", "SLIDES", "aula.pdf");

describe("GET /api/material/[...path]", () => {
  it("retypes a PDF the CDN serves as octet-stream", async () => {
    const fetchAsset = vi.fn<FetchAsset>(async () =>
      new Response("bytes", { status: 200, headers: { "content-type": "application/octet-stream" } }),
    );

    const response = await handlerWith(fetchAsset)(
      new Request("https://atlas.example/api/material/DSM1/ALP/SLIDES/aula.pdf"),
      pdfContext,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("asks for attachment only when asked", async () => {
    const fetchAsset = vi.fn<FetchAsset>(async () => new Response("bytes", { status: 200 }));
    const handler = handlerWith(fetchAsset);

    const inline = await handler(new Request("https://atlas.example/api/material/DSM1/ALP/SLIDES/aula.pdf"), pdfContext);
    const attachment = await handler(
      new Request("https://atlas.example/api/material/DSM1/ALP/SLIDES/aula.pdf?disposition=attachment"),
      pdfContext,
    );

    expect(inline.headers.get("content-disposition")).toMatch(/^inline;/);
    expect(attachment.headers.get("content-disposition")).toMatch(/^attachment;/);
  });

  it("forwards a range request and keeps the 206", async () => {
    const fetchAsset = vi.fn<FetchAsset>(async (_url, init) => {
      expect(init.headers.range).toBe("bytes=0-99");
      expect(init.headers["user-agent"]).toBe(GITHUB_USER_AGENT);
      return new Response("partial", {
        status: 206,
        headers: { "content-range": "bytes 0-99/1234", "content-length": "100" },
      });
    });

    const response = await handlerWith(fetchAsset)(
      new Request("https://atlas.example/api/material/DSM1/ALP/SLIDES/aula.pdf", { headers: { range: "bytes=0-99" } }),
      pdfContext,
    );

    expect(response.status).toBe(206);
    expect(response.headers.get("content-range")).toBe("bytes 0-99/1234");
    expect(response.headers.get("content-length")).toBe("100");
    expect(response.headers.get("accept-ranges")).toBe("bytes");
  });

  it("refuses a path outside the catalog without calling upstream", async () => {
    const fetchAsset = vi.fn<FetchAsset>();

    const response = await handlerWith(fetchAsset)(
      new Request("https://atlas.example/api/material/DSM1/ALP/etc/passwd"),
      context("DSM1", "ALP", "etc", "passwd"),
    );

    expect(response.status).toBe(404);
    expect(fetchAsset).not.toHaveBeenCalled();
  });

  it("answers 502 without leaking the upstream body when the CDN fails", async () => {
    let cancelled = false;
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("internal upstream detail"));
      },
      cancel() {
        cancelled = true;
      },
    });
    const fetchAsset = vi.fn<FetchAsset>(async () => new Response(body, { status: 500 }));

    const response = await handlerWith(fetchAsset)(
      new Request("https://atlas.example/api/material/DSM1/ALP/SLIDES/aula.pdf"),
      pdfContext,
    );

    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("internal upstream detail");
    expect(cancelled).toBe(true);
  });

  it("percent-encodes a non-ascii filename in content-disposition", async () => {
    const fetchAsset = vi.fn<FetchAsset>(async () => new Response("bytes", { status: 200 }));

    const response = await handlerWith(fetchAsset)(
      new Request("https://atlas.example/api/material/DSM1/ALP/LISTAS%20DE%20EXERC%C3%8DCIOS.pdf"),
      context("DSM1", "ALP", "LISTAS%20DE%20EXERC%C3%8DCIOS.pdf"),
    );

    const disposition = response.headers.get("content-disposition") ?? "";
    expect(disposition).toContain("filename*=UTF-8''LISTAS%20DE%20EXERC%C3%8DCIOS.pdf");
    expect(disposition).toContain('filename="LISTAS DE EXERC_CIOS.pdf"');
  });
});
