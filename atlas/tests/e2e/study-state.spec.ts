import { expect, test, type Page } from "@playwright/test";

async function firstMaterialHref(page: Page): Promise<string> {
  await page.goto("/?semester=DSM1&view=list");
  return (await page.locator("[data-material-link]").first().getAttribute("href"))!;
}

test("study controls recover from an IndexedDB load failure", async ({ page }) => {
  const href = await firstMaterialHref(page);
  await page.addInitScript(() => {
    const open = indexedDB.open.bind(indexedDB);
    let fail = true;
    indexedDB.open = ((...args: Parameters<IDBFactory["open"]>) => {
      if (fail) { fail = false; throw new Error("storage unavailable"); }
      return open(...args);
    }) as IDBFactory["open"];
  });
  await page.goto(href);

  await expect(page.getByRole("alert")).toContainText("Não foi possível acessar seus dados de estudo.");
  await expect(page.getByRole("button", { name: "Iniciar" })).toBeDisabled();
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Iniciar" })).toBeEnabled();
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

test("failed note and flashcard mutations keep drafts, successful retry clears them", async ({ page }) => {
  const href = await firstMaterialHref(page);
  await page.goto(href);
  await page.getByLabel("Nota").fill("rascunho da nota");
  await page.getByLabel("Flashcard").fill("pergunta pendente");
  await page.getByLabel("Resposta").fill("resposta pendente");
  await page.evaluate(() => {
    const open = indexedDB.open.bind(indexedDB);
    let failures = 2;
    indexedDB.open = ((...args: Parameters<IDBFactory["open"]>) => {
      if (failures-- > 0) throw new Error("write unavailable");
      return open(...args);
    }) as IDBFactory["open"];
  });

  await page.getByRole("button", { name: "Salvar nota" }).click();
  await expect(page.getByLabel("Nota")).toHaveValue("rascunho da nota");
  await page.getByRole("button", { name: "Salvar flashcard" }).click();
  await expect(page.getByLabel("Flashcard")).toHaveValue("pergunta pendente");
  await expect(page.getByLabel("Resposta")).toHaveValue("resposta pendente");

  await page.getByRole("button", { name: "Salvar nota" }).click();
  await expect(page.getByLabel("Nota")).toHaveValue("");
  await page.getByRole("button", { name: "Salvar flashcard" }).click();
  await expect(page.getByLabel("Flashcard")).toHaveValue("");
  await expect(page.getByLabel("Resposta")).toHaveValue("");
});

test("catalog and discipline markers expose retryable load errors", async ({ page }) => {
  await page.addInitScript(() => {
    const open = indexedDB.open.bind(indexedDB);
    let failures = 1;
    indexedDB.open = ((...args: Parameters<IDBFactory["open"]>) => {
      if (failures-- > 0) throw new Error("storage unavailable");
      return open(...args);
    }) as IDBFactory["open"];
  });
  await page.goto("/?semester=DSM1&view=list");
  await expect(page.getByRole("status", { name: "Estado de estudo" })).toContainText("Não foi possível carregar seu progresso");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("status", { name: "Estado de estudo" })).toHaveCount(0);

  await page.goto("/disciplinas/ALP?semester=DSM1");
  await expect(page.getByRole("status", { name: "Estado de estudo" }).first()).toContainText("Não foi possível carregar seu progresso");
  await page.getByRole("button", { name: "Tentar novamente" }).first().click();
  await expect(page.getByRole("status", { name: "Estado de estudo" })).toHaveCount(0);
});
