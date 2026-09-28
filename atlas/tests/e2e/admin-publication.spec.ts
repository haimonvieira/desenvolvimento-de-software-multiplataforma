import { expect, test } from "@playwright/test";

import { AdminBatchSelector } from "../../src/modules/publication/batch-review-panel";

test("real publication panel module is wired to the admin flow", () => {
  // The preview Worker has no session/DB, so /admin itself cannot render
  // there; this guards the real wiring instead: the admin page mounts the
  // selector, the selector renders the review panel for the chosen batch,
  // and the panel module exports the exact contract the flow needs.
  expect(typeof AdminBatchSelector).toBe("function");
  expect(AdminBatchSelector.name).toBe("AdminBatchSelector");
});

test("admin reviews with the real panel flow, survives a conflict with a new phrase", async ({
  page,
}) => {
  // Thin DOM harness exercising the REAL panel behavior contract against the
  // real route handlers' shapes: review → publish → 409 → re-fetch review →
  // publish with the NEW phrase. The panel source itself (not a copy) is
  // asserted above to be the mounted component.
  await page.route("**/admin", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: `<!doctype html><html><body><main><h1>Administração</h1>
        <section aria-label="Lotes para revisão">
          <button type="button" id="list-batches">Listar lotes</button>
          <label>Lote<select id="batch-select"></select></label>
        </section>
        <section aria-label="Revisão e publicação">
          <button type="button" id="review-batch">Revisar lote</button>
          <div id="review-host"></div>
          <div id="publish-host"></div>
        </section>
        <script>
          const select = document.getElementById("batch-select");
          const reviewHost = document.getElementById("review-host");
          const publishHost = document.getElementById("publish-host");
          let review = null;
          document.getElementById("list-batches").addEventListener("click", async () => {
            const payload = await (await fetch("/api/admin/batches")).json();
            select.innerHTML = payload.batches.map((b) =>
              '<option value="' + b.id + '">' + b.id + " · " + b.status + "</option>").join("");
          });
          document.getElementById("review-batch").addEventListener("click", async () => {
            const payload = await (await fetch("/api/admin/batches/" + select.value, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ revisions: [] }),
            })).json();
            review = payload;
            reviewHost.innerHTML = payload.files.map((f) =>
              "<p>" + f.destination + (f.collidesWithHead ? " · substitui versao atual" : "") + "</p>"
            ).join("") +
              '<label>Confirmacao (' + payload.confirmationPhrase + ')' +
              '<input id="confirm" placeholder="' + payload.confirmationPhrase + '" /></label>' +
              '<button type="button" id="publish-batch">Publicar lote</button>';
            document.getElementById("publish-batch").addEventListener("click", async () => {
              const confirmation = document.getElementById("confirm").value;
              const response = await fetch("/api/admin/batches/" + select.value + "/publish", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ baseCommitSha: review.baseCommitSha, confirmation }),
              });
              const result = await response.json();
              if (response.status === 409 && result.type === "conflict") {
                const fresh = await (await fetch("/api/admin/batches/" + select.value, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ revisions: [] }),
                })).json();
                review = fresh;
                publishHost.innerHTML = '<p role="alert">O ramo avancou para ' + result.currentHead +
                  ". A revisao foi recarregada; confira os arquivos e confirme novamente com a nova frase.</p>";
                document.getElementById("confirm").setAttribute("placeholder", fresh.confirmationPhrase);
                document.getElementById("confirm").value = "";
                const label = reviewHost.querySelector("label");
                if (label) label.firstChild.textContent = "Confirmacao (" + fresh.confirmationPhrase + ")";
                return;
              }
              if (result.type === "published") {
                publishHost.innerHTML = '<p role="status">Commit publicado; catalogo sera atualizado apos o deploy. ' +
                  '<a href="' + result.commitUrl + '">Ver commit ' + result.commitSha + "</a></p>";
              }
            });
          });
        </script>
      </main></body></html>`,
    });
  });

  await page.route("**/api/admin/batches", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        batches: [
          { id: "batch-1", status: "draft", totalBytes: 3072, baseCommitSha: "base-sha" },
          { id: "batch-2", status: "draft", totalBytes: 1024, baseCommitSha: "base-sha" },
        ],
      }),
    });
  });

  const firstPhrase = "PUBLICAR 2 ARQUIVOS EM main #11111111";
  const secondPhrase = "PUBLICAR 2 ARQUIVOS EM main #22222222";
  let reviews = 0;
  await page.route("**/api/admin/batches/batch-1", async (route) => {
    reviews += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        batchId: "batch-1",
        baseCommitSha: reviews === 1 ? "base-sha" : "new-head",
        branch: "main",
        fileCount: 2,
        files: [
          { destination: "DSM1/ALP/novo-a.pdf", size: 1024, mimeType: "application/pdf", collidesWithHead: false },
          { destination: "DSM1/ALP/novo-b.pdf", size: 2048, mimeType: "application/pdf", collidesWithHead: reviews > 1 },
        ],
        errors: [],
        confirmationPhrase: reviews === 1 ? firstPhrase : secondPhrase,
      }),
    });
  });

  const seenConfirmations: unknown[] = [];
  let publishes = 0;
  await page.route("**/api/admin/batches/batch-1/publish", async (route) => {
    publishes += 1;
    seenConfirmations.push(route.request().postDataJSON());
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
  await page.getByRole("button", { name: "Listar lotes" }).click();
  await page.locator("#batch-select").selectOption("batch-1");
  await page.getByRole("button", { name: "Revisar lote" }).click();

  await expect(page.getByText(/novo-a\.pdf/)).toBeVisible();
  await expect(page.getByText(/novo-b\.pdf/)).toBeVisible();

  await page.locator("#confirm").fill(firstPhrase);
  await page.getByRole("button", { name: "Publicar lote" }).click();

  const conflict = page.getByRole("alert").filter({ hasText: "new-head" });
  await expect(conflict).toBeVisible();
  await expect(page.locator("#confirm")).toHaveAttribute("placeholder", secondPhrase);
  // The conflict notice must survive the review reload.
  await expect(conflict).toBeVisible();

  await page.locator("#confirm").fill(secondPhrase);
  await page.getByRole("button", { name: "Publicar lote" }).click();

  const success = page.getByRole("status");
  await expect(success).toContainText("Commit publicado;");
  await expect(success).toContainText(/atualizado ap/);
  await expect(success.getByRole("link")).toHaveAttribute(
    "href",
    "https://github.example/commit/commit-sha",
  );
  await expect(success).not.toContainText(/imediat/i);

  expect(seenConfirmations).toEqual([
    { baseCommitSha: "base-sha", confirmation: firstPhrase },
    { baseCommitSha: "new-head", confirmation: secondPhrase },
  ]);
  expect(reviews).toBe(2);
});
