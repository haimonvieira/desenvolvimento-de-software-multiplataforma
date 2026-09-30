import { expect, test } from "@playwright/test";

test("tutor page renders the question contract and reports the unbound provider", async ({ page, request }) => {
  await page.goto("/tutor");

  await expect(page.getByRole("heading", { name: "Tutor de estudo", level: 1 })).toBeVisible();
  await expect(page.getByLabel("Pergunta")).toBeVisible();
  await expect(page.getByRole("button", { name: "Perguntar" })).toBeVisible();
  await expect(page.getByLabel("Patrocinado")).toBeChecked();
  await expect(page.getByLabel("Minha chave (BYOK)")).not.toBeChecked();

  // The preview has no Turnstile sitekey, so the widget cannot render and the
  // panel must say the first-use gate is closed rather than offer a text field
  // no visitor could ever satisfy.
  await expect(page.getByText("A verificação de primeiro uso está fechada")).toBeVisible();
  await expect(page.getByLabel("Verificação (primeiro uso)")).toHaveCount(0);

  await page.getByLabel("Minha chave (BYOK)").check();
  await expect(page.getByLabel("Sua chave de API")).toBeVisible();
  await expect(page.getByText("Sua chave trafega só no cabeçalho")).toBeVisible();

  const turn = await request.post("/api/tutor/turn", {
    data: { question: "o que é lógica?", context: [{ path: "DSM1/ALP/introducao.md", commitSha: "abc" }] },
  });
  expect(turn.status()).toBe(503);
  expect(await turn.json()).toEqual({
    error: { code: "UNCONFIGURED", message: "Tutor indisponível." },
  });
});
