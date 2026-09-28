import { expect, test } from "@playwright/test";

const widths = [390, 768, 1440] as const;

test("exposes the guided atlas through semantic landmarks", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Semestres" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: /Seu semestre é um mapa/ })).toBeVisible();
  await expect(page.getByText("Linha")).toBeVisible();
  await expect(page.getByText("Disciplina", { exact: true })).toBeVisible();
  await expect(page.getByText("Material", { exact: true })).toBeVisible();
  await expect(page.getByText("Onde você parou", { exact: true })).toBeVisible();
  await expect(page.getByText("DW3 · Web III", { exact: true })).toBeVisible();
  await expect(page.getByText("BDNR · Banco Não Relacional", { exact: true })).toBeVisible();
  await expect(page.getByText("TP2 · Técnica de Programação", { exact: true })).toBeVisible();
  await expect(page.locator(".line-label--gaps")).toHaveText("GAPS");
  await expect(page.locator(".line-label--ing")).toHaveText("ING1");
});

test("reveals a themed skip link and focus ring from the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await expect(skipLink).toHaveCSS("outline-style", "solid");
  await expect(skipLink).toHaveCSS("outline-color", "rgb(79, 102, 232)");
});

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
