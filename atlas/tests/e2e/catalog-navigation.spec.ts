import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

async function disciplineLinks(page: Page, representation: "map" | "list") {
  return page.locator(`[data-representation="${representation}"] [data-discipline-link]`).evaluateAll((links) =>
    links.map((link) => ({
      count: link.getAttribute("data-material-count"),
      href: link.getAttribute("href"),
      text: link.textContent?.replace(/\s+/g, " ").trim(),
    })),
  );
}

async function focusFirstDisciplineWithKeyboard(page: Page) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => document.activeElement?.hasAttribute("data-discipline-link"))) return;
  }
  throw new Error("No discipline link entered the keyboard tab order");
}

for (const viewport of viewports) {
  test(`${viewport.name}: preserves semester while map and list expose the same catalog`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?semester=DSM1&view=map");

    const dsm3 = page.getByRole("link", { name: /^DSM3/ });
    await dsm3.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\?semester=DSM3&view=map$/);

    const map = page.locator('[data-representation="map"]');
    await expect(map).toBeVisible();
    const mapLinks = await disciplineLinks(page, "map");
    expect(mapLinks.length).toBeGreaterThan(0);

    await page.getByRole("link", { name: "Lista", exact: true }).click();
    await expect(page).toHaveURL(/\?semester=DSM3&view=list$/);
    const list = page.locator('[data-representation="list"]');
    await expect(list).toBeVisible();
    expect(await disciplineLinks(page, "list")).toEqual(mapLinks);

    await page.goBack();
    await expect(page).toHaveURL(/\?semester=DSM3&view=map$/);
    await expect(map).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/\?semester=DSM3&view=list$/);
    await expect(list).toBeVisible();

    await page.locator("body").press("Home");
    await focusFirstDisciplineWithKeyboard(page);
    const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute("href"));
    expect(focusedHref).toMatch(/^\/disciplinas\/[A-Z0-9-]+\?semester=DSM3$/);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${focusedHref!.replace(/[?]/g, "\\?")}$`));
  });
}

test("invalid URL values render the latest semester and map fallback", async ({ page }) => {
  await page.goto("/?semester=UNKNOWN&view=grid");

  await expect(page.getByRole("link", { name: /^DSM3/ })).toHaveAttribute("aria-current", "page");
  await expect(page.locator('[data-representation="map"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "Mapa", exact: true })).toHaveAttribute("aria-current", "page");
});

test("the list remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/?semester=DSM3&view=list");

  const list = page.locator('[data-representation="list"]');
  await expect(list.getByRole("heading", { level: 2, name: "Disciplinas de DSM3" })).toBeVisible();
  const firstDiscipline = list.locator("[data-discipline-link]").first();
  await expect(firstDiscipline).toBeVisible();
  const href = await firstDiscipline.getAttribute("href");
  await firstDiscipline.click();
  await expect(page).toHaveURL(new RegExp(`${href!.replace(/[?]/g, "\\?")}$`));

  await context.close();
});

test("reduced motion draws no animated route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?semester=DSM3&view=map");

  await expect(page.locator(".atlas-route").first()).toHaveCSS("animation-name", "none");
  expect(await page.locator(".atlas-station").first().evaluate((station) => parseFloat(getComputedStyle(station).transitionDuration))).toBeLessThanOrEqual(0.001);
});
