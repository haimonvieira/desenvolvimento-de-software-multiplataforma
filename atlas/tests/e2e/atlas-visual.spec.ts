import { expect, test } from "@playwright/test";

const widths = [390, 768, 1440] as const;

test("exposes the guided atlas through semantic landmarks", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Semestres" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: /Seu semestre é um mapa/ })).toBeVisible();

  const mapList = page.locator('[data-representation="map"] ul');
  await expect(mapList).toHaveCount(1);
  await expect(mapList.getByRole("listitem")).toHaveCount(5);
  await expect(mapList.getByRole("link")).toHaveText([
    /BDNRBanco de Dados Não Relacional\d+ materiais/,
    /DW3Desenvolvimento Web III\d+ materiais/,
    /GAPSGestão Ágil de Projetos de Software\d+ materiais/,
    /ING1Inglês I\d+ materiais/,
    /TP2Técnica de Programação II\d+ materiais/,
  ]);
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`keeps keyboard focus visible in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    const focusEvidence = await skipLink.evaluate((element) => {
      const style = getComputedStyle(element);
      const parseRgb = (value: string) => value.match(/\d+/g)!.slice(0, 3).map(Number);
      const luminance = (rgb: number[]) => rgb.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
      const outline = luminance(parseRgb(style.outlineColor));
      const background = luminance(parseRgb(style.backgroundColor));
      return {
        contrast: (Math.max(outline, background) + 0.05) / (Math.min(outline, background) + 0.05),
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth),
      };
    });

    expect(focusEvidence.outlineStyle).toBe("solid");
    expect(focusEvidence.outlineWidth).toBeGreaterThanOrEqual(3);
    expect(focusEvidence.contrast).toBeGreaterThanOrEqual(3);
  });
}

for (const width of widths) {
  test(`does not overflow horizontally at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const sizes = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
  });
}

test("keeps mobile map labels legible without scaling text", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator(".atlas-geometry")).toHaveCSS("scale", "none");
  const labelSizes = await page.locator(".legend, .illustrative-note, .discipline-link").evaluateAll((elements) => elements.map((element) => parseFloat(getComputedStyle(element).fontSize)));
  expect(Math.min(...labelSizes)).toBeGreaterThanOrEqual(8.64);

  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const widthsAtTextZoom = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  expect(widthsAtTextZoom.scroll).toBeLessThanOrEqual(widthsAtTextZoom.client);
});

test("removes animated displacement when reduced motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const movingElements = await page.locator("*").evaluateAll((elements) => elements.filter((element) => {
    const style = getComputedStyle(element);
    const hasMotion = style.animationName !== "none" || style.transitionDuration.split(",").some((value) => parseFloat(value) > 0.01);
    const canDisplace = style.transform !== "none" || style.translate !== "none";
    return hasMotion && canDisplace;
  }).length);

  expect(movingElements).toBe(0);
});
