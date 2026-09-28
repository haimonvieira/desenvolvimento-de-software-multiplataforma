import { expect, test } from "@playwright/test";

test("admin reviews a batch, publishes atomically and survives a conflict", async ({
  page,
}) => {
  await page.route("**/admin", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: `<!doctype html><html><body><main><h1>Administração</h1>
        <section aria-label="Revisão e publicação">
          <button type="button" id="review">Revisar lote</button>
          <div id="out"></div>
          <script>
            const out = document.getElementById("out");
            document.getElementById("review").addEventListener("click", async () => {
              const review = await (await fetch("/api/admin/batches/batch-1", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ revisions: [] }),
              })).json();
              out.innerHTML = review.files.map((f) =>
                "<p>" + f.destination + (f.collidesWithHead ? " · substitui versão atual" : "") + "</p>"
              ).join("") +
                '<label>Confirmação (' + review.confirmationPhrase + ')' +
                '<input aria-label="Confirmação" id="confirm" /></label>' +
                '<button type="button" id="publish">Publicar lote</button><div id="result"></div>';
              document.getElementById("publish").addEventListener("click", async () => {
                const payload = await (await fetch("/api/admin/batches/batch-1/publish", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    baseCommitSha: review.baseCommitSha,
                    confirmation: document.getElementById("confirm").value,
                  }),
                })).json();
                const result = document.getElementById("result");
                if (payload.type === "published") {
                  result.innerHTML = '<p role="status">Commit publicado; catálogo será atualizado após o deploy. ' +
                    '<a href="' + payload.commitUrl + '">Ver commit ' + payload.commitSha + "</a></p>";
                } else if (payload.type === "conflict") {
                  result.innerHTML = '<p role="alert">O ramo avançou para ' + payload.currentHead +
                    ". A revisão foi recarregada; confira os arquivos e confirme novamente.</p>";
                }
              });
            });
          </script>
        </main></body></html>`,
    });
  });

  await page.route("**/api/admin/batches/batch-1", async (route) => {
    const body = route.request().postDataJSON() as {
      revisions?: unknown;
    } | null;
    expect(body).toEqual({ revisions: [] });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        batchId: "batch-1",
        baseCommitSha: "base-sha",
        branch: "main",
        fileCount: 2,
        files: [
          {
            destination: "DSM1/ALP/novo-a.pdf",
            size: 1024,
            mimeType: "application/pdf",
            collidesWithHead: false,
          },
          {
            destination: "DSM1/ALP/novo-b.pdf",
            size: 2048,
            mimeType: "application/pdf",
            collidesWithHead: true,
          },
        ],
        errors: [],
        confirmationPhrase: "PUBLICAR 2 ARQUIVOS EM main",
      }),
    });
  });

  let publishes = 0;
  await page.route("**/api/admin/batches/batch-1/publish", async (route) => {
    publishes += 1;
    if (publishes === 1) {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ type: "conflict", currentHead: "new-head" }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        type: "published",
        commitSha: "commit-sha",
        commitUrl: "https://github.example/commit/commit-sha",
      }),
    });
  });

  await page.goto("/admin");
  await page.getByRole("button", { name: "Revisar lote" }).click();

  await expect(page.getByText("DSM1/ALP/novo-a.pdf").first()).toBeVisible();
  await expect(page.getByText(/novo-b\.pdf/)).toBeVisible();
  await expect(page.getByText(/substitui vers/).first()).toBeVisible();

  await page.locator("#confirm").fill("PUBLICAR 2 ARQUIVOS EM main");
  await page.getByRole("button", { name: "Publicar lote" }).click();

  await expect(page.getByRole("alert")).toContainText("new-head");

  await page.locator("#confirm").fill("PUBLICAR 2 ARQUIVOS EM main");
  await page.getByRole("button", { name: "Publicar lote" }).click();

  const success = page.getByRole("status");
  await expect(success).toContainText("Commit publicado;");
  await expect(success).toContainText(/atualizado ap/);
  await expect(success.getByRole("link")).toHaveAttribute(
    "href",
    "https://github.example/commit/commit-sha",
  );
  await expect(success).not.toContainText(/imediat/i);
});
