import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { materialPathCandidates, materialPathFromSegments } from "../../src/modules/catalog/material-path";

const materialPath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

const pdf = "DSM1/ALP/LISTAS DE EXERCÍCIOS/Lista 01 - Pseudocódigo.docx.pdf";
const image = "DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/BARRA_STATUS_VISUALG3.PNG";
const source = "DSM2/DW2/dw2-nodejs-express/exercicios-js/arrays-e-objetos/script.js";
const unsafeHtml = "DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/telaprin.html";
const archive = "DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/Exemplos/Exemplos.zip";

async function open(path: string, page: Page) {
  await page.goto(`/materiais/${materialPath(path)}?semester=${path.slice(0, 4)}`);
}

test("discipline groups real materials and preserves semester breadcrumbs", async ({ page }) => {
  await page.goto("/disciplinas/ALP?semester=DSM1");

  await expect(page.getByRole("heading", { level: 1, name: /Algoritmos e Lógica/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação estrutural" })).toContainText("DSM1");
  await expect(page.getByRole("heading", { level: 2, name: "LISTAS DE EXERCÍCIOS" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lista 01 - Pseudocódigo.docx.pdf" })).toBeVisible();
});

test("search handles accents, pagination, stable validation errors, and keyboard navigation", async ({ page, request }) => {
  const accentless = await request.get("/api/search?q=logica");
  expect(accentless.ok()).toBe(true);
  expect((await accentless.json()).data.length).toBeGreaterThan(0);

  const pageOne = await request.get("/api/search?q=index");
  const firstPayload = await pageOne.json();
  expect(firstPayload.data).toHaveLength(30);
  expect(firstPayload.nextCursor).toMatch(/^[A-Za-z0-9_-]+$/);
  const pageTwo = await request.get(`/api/search?q=index&cursor=${firstPayload.nextCursor}`);
  expect((await pageTwo.json()).data.length).toBeGreaterThan(0);

  for (const search of ["", "&cursor=***"]) {
    const response = await request.get(`/api/search?q=${search}`);
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: {
      code: "INVALID_SEARCH_PARAMETERS",
      message: "Informe uma busca de 1 a 120 caracteres.",
    } });
  }

  await page.goto("/?q=logica");
  const field = page.getByRole("searchbox", { name: "Buscar no catálogo" });
  await field.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/\?q=logica/);
  const first = page.locator("[data-search-result]").first();
  await expect(first).toBeVisible();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/materiais\//);
});

test("previews real PDF and raster image with native passive elements", async ({ page }) => {
  await open(pdf, page);
  const pdfPreview = page.locator("object[data-material-preview='pdf']");
  await expect(pdfPreview).toBeVisible();
  // Our own route, inline disposition: GitHub's endpoint answers
  // application/octet-stream with nosniff and the browser downloads instead.
  await expect(pdfPreview).toHaveAttribute("data", /^\/api\/material\/.*\?disposition=inline$/);

  await open(image, page);
  const imagePreview = page.locator("img[data-material-preview='image']");
  await expect(imagePreview).toBeVisible();
  await expect(imagePreview).toHaveAttribute("src", /^\/api\/material\/.*\?disposition=inline$/);
});

test("renders source and repository HTML as escaped inert text", async ({ page }) => {
  for (const path of [source, unsafeHtml]) {
    await open(path, page);
    await expect(page.locator("pre[data-material-preview='text']")).toBeVisible();
    await expect(page.locator("iframe, script[data-repository-content]")).toHaveCount(0);
  }
});

test("unsupported ZIP explains fallback and links exact-commit download and GitHub source", async ({ page }) => {
  await open(archive, page);

  await expect(page.getByText("Pré-visualização indisponível para este formato.")).toBeVisible();
  const download = page.getByRole("link", { name: "Baixar arquivo" });
  await expect(download).toHaveAttribute("href", /^\/api\/material\/.*Exemplos\.zip\?disposition=attachment$/);
  await expect(page.getByRole("link", { name: "Ver no GitHub" })).toHaveAttribute("href", /\/blob\/[0-9a-f]{40}\/.*Exemplos\.zip$/);
});

test("invalid and non-catalog material paths fail safely", async ({ page }) => {
  await page.goto("/materiais/DSM1/ALP/inexistente.pdf?semester=DSM1");
  await expect(page.getByRole("heading", { name: "Material não encontrado" })).toBeVisible();
  expect((await page.locator("iframe, object, embed, script[data-repository-content]").count())).toBe(0);
});

test("literal percent and malformed route segments remain literal", () => {
  expect(materialPathFromSegments(["DSM1", "ALP", "percent%file.txt"])).toBe("DSM1/ALP/percent%file.txt");
  expect(materialPathCandidates(["DSM1", "ALP", "broken%ZZ.txt"])).toEqual(["DSM1/ALP/broken%ZZ.txt"]);
  expect(materialPathCandidates(["DSM1", "ALP", "percent%2525file.txt"])).toEqual([
    "DSM1/ALP/percent%2525file.txt",
    "DSM1/ALP/percent%25file.txt",
  ]);
});

test("material and search surfaces fit mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?q=index");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await open(archive, page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
