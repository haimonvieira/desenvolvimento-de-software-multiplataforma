import { expect, test, type Page } from "@playwright/test";

async function firstMaterialHref(page: Page): Promise<string> {
  await page.goto("/?semester=DSM1&view=list");
  return (await page.locator("[data-material-link]").first().getAttribute("href"))!;
}

test("study controls expose persistent IndexedDB load failures", async ({ page }) => {
  const href = await firstMaterialHref(page);
  await page.addInitScript(() => {
    indexedDB.open = (() => { throw new Error("storage unavailable"); }) as typeof indexedDB.open;
  });
  await page.goto(href);

  await expect(page.getByRole("alert")).toHaveText("Não foi possível acessar seus dados de estudo. Tente novamente.");
  await expect(page.getByRole("button", { name: "Iniciar" })).toBeDisabled();
});

test("study controls expose mutation failures and prevent conflicting writes", async ({ page }) => {
  const href = await firstMaterialHref(page);
  await page.goto(href);
  await expect(page.getByRole("button", { name: "Iniciar" })).toBeEnabled();
  await page.evaluate(() => {
    indexedDB.open = (() => { throw new Error("write unavailable"); }) as typeof indexedDB.open;
  });
  await page.getByRole("button", { name: "Iniciar" }).click();

  await expect(page.getByRole("alert")).toHaveText("Não foi possível salvar sua alteração. Tente novamente.");
  await expect(page.getByRole("button", { name: "Iniciar" })).toBeEnabled();
});
