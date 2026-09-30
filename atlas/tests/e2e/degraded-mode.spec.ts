import { expect, test } from "@playwright/test";

const materialPath = (path: string) => path.split("/").map(encodeURIComponent).join("/");
const archive = "DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/Exemplos/Exemplos.zip";

// The preview Worker runs with no DATABASE_URL, GitHub App or AI credential —
// the "GitHub/Neon/AI unavailable" deployment. The public study surface must
// keep working from the generated snapshot while every infrastructure-dependent
// feature reports itself unavailable instead of failing the page.
test("the public catalogue and search serve without GitHub, Neon or AI", async ({ page, request }) => {
  await page.goto("/?semester=DSM1&view=list");
  await expect(page.locator('[data-representation="list"] [data-material-link]').first()).toBeVisible();

  const search = await request.get("/api/search?q=logica");
  expect(search.ok()).toBe(true);
  expect((await search.json()).data.length).toBeGreaterThan(0);
});

test("a format without preview offers metadata, download and the GitHub source", async ({ page }) => {
  await page.goto(`/materiais/${materialPath(archive)}?semester=DSM1`);

  await expect(page.getByText("Pré-visualização indisponível para este formato.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Baixar arquivo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver no GitHub" })).toBeVisible();
});
