import { expect, test } from "@playwright/test";

test("tutor page renders the question contract and reports the unbound provider", async ({ page, request }) => {
  await page.goto("/tutor");

  await expect(page.getByRole("heading", { name: "Tutor de estudo" })).toBeVisible();
  await expect(page.getByLabel("Pergunta")).toBeVisible();
  await expect(page.getByRole("button", { name: "Perguntar" })).toBeVisible();
  await expect(page.getByLabel("Patrocinado")).toBeChecked();
  await expect(page.getByLabel("Minha chave (BYOK)")).not.toBeChecked();

  await page.getByLabel("Minha chave (BYOK)").check();
  await expect(page.getByLabel("Sua chave de API")).toBeVisible();

  const turn = await request.post("/api/tutor/turn", {
    data: { question: "o que é lógica?", context: [{ path: "DSM1/ALP/introducao.md", commitSha: "abc" }] },
  });
  expect(turn.status()).toBe(503);
  expect(await turn.json()).toEqual({
    error: { code: "UNCONFIGURED", message: "Tutor indisponível." },
  });
});
