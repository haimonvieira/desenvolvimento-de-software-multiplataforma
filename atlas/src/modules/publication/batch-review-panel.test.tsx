// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminBatchSelector, BatchReviewPanel } from "./batch-review-panel";

const actEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;

type RecordedCall = Readonly<{ url: string; method: string; body: unknown }>;

type JsonResponse = Readonly<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

function jsonResponse(status: number, body: unknown): JsonResponse {
  return { ok: status < 400, status, json: async () => body };
}

let container: HTMLDivElement;
let root: Root;
let calls: RecordedCall[];

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  calls = [];
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

function stubFetch(responder: (url: string, method: string) => JsonResponse) {
  vi.stubGlobal(
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit): Promise<JsonResponse> => {
      const url = typeof input === "string" ? input : String(input);
      const method = init?.method ?? "GET";
      calls.push({
        url,
        method,
        body: typeof init?.body === "string" ? JSON.parse(init.body) : null,
      });
      return responder(url, method);
    },
  );
}

async function render(element: Parameters<Root["render"]>[0]) {
  await act(async () => {
    root.render(element);
  });
}

function button(label: string): HTMLButtonElement {
  const found = [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent?.includes(label),
  );
  if (!found) throw new Error(`button not found: ${label}`);
  return found as HTMLButtonElement;
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.click();
    await Promise.resolve();
  });
}

async function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  await act(async () => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await Promise.resolve();
  });
}

async function setSelectValue(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    "value",
  )?.set;
  await act(async () => {
    setter?.call(select, value);
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await Promise.resolve();
  });
}

function confirmationInput(): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>("input[placeholder]");
  if (!input) throw new Error("confirmation input not found");
  return input;
}

function alertsWith(text: string): readonly Element[] {
  return [...container.querySelectorAll('[role="alert"]')].filter((alert) =>
    alert.textContent?.includes(text),
  );
}

const FIRST_PHRASE = "PUBLICAR 2 ARQUIVOS EM main #11111111";
const SECOND_PHRASE = "PUBLICAR 2 ARQUIVOS EM main #22222222";

function reviewPayload(reviewNumber: number, renamed: boolean) {
  const refreshed = reviewNumber > 1;
  return {
    batchId: "batch-1",
    baseCommitSha: refreshed ? "new-head" : "base-sha",
    branch: "main",
    fileCount: 2,
    files: [
      {
        destination: renamed ? "DSM1/ALP/apostila.pdf" : "DSM1/ALP/novo-a.pdf",
        size: 1024,
        mimeType: "application/pdf",
        collidesWithHead: false,
      },
      {
        destination: "DSM1/ALP/novo-b.pdf",
        size: 2048,
        mimeType: "application/pdf",
        collidesWithHead: refreshed,
      },
    ],
    errors: [],
    confirmationPhrase: refreshed ? SECOND_PHRASE : FIRST_PHRASE,
  };
}

describe("BatchReviewPanel", () => {
  it("re-fetches the review on conflict and requires the new confirmation phrase", async () => {
    let reviews = 0;
    let publishes = 0;
    stubFetch((url, method) => {
      if (url.endsWith("/api/admin/batches/batch-1") && method === "POST") {
        reviews += 1;
        return jsonResponse(200, reviewPayload(reviews, false));
      }
      if (url.endsWith("/api/admin/batches/batch-1/publish")) {
        publishes += 1;
        return publishes === 1
          ? jsonResponse(409, { type: "conflict", currentHead: "new-head" })
          : jsonResponse(200, {
              type: "published",
              commitSha: "commit-sha",
              commitUrl: "https://github.example/commit/commit-sha",
            });
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    });

    await render(<BatchReviewPanel batchId="batch-1" />);
    expect(container.textContent).not.toContain("novo-a.pdf");

    await click(button("Revisar lote"));
    expect(container.textContent).toContain("DSM1/ALP/novo-a.pdf");
    expect(container.textContent).not.toContain("substitui versão atual");
    expect(confirmationInput().placeholder).toBe(FIRST_PHRASE);
    expect(reviews).toBe(1);

    await setInputValue(confirmationInput(), FIRST_PHRASE);
    await click(button("Publicar lote"));

    expect(publishes).toBe(1);
    expect(calls.at(-2)?.body).toEqual({
      baseCommitSha: "base-sha",
      confirmation: FIRST_PHRASE,
    });
    expect(reviews).toBe(2);
    expect(alertsWith("new-head")).toHaveLength(1);
    expect(container.textContent).toContain("substitui versão atual");
    expect(container.textContent).toContain("confirme novamente com a nova frase");
    expect(confirmationInput().placeholder).toBe(SECOND_PHRASE);
    expect(confirmationInput().value).toBe("");
    expect(button("Publicar lote").disabled).toBe(true);

    await setInputValue(confirmationInput(), SECOND_PHRASE);
    await click(button("Publicar lote"));

    expect(publishes).toBe(2);
    expect(calls.at(-1)?.body).toEqual({
      baseCommitSha: "new-head",
      confirmation: SECOND_PHRASE,
    });
    const status = container.querySelector('[role="status"]');
    expect(status?.textContent).toContain(
      "Commit publicado; catálogo será atualizado após o deploy",
    );
    expect(status?.textContent).not.toMatch(/imediat/i);
    expect(status?.querySelector("a")?.getAttribute("href")).toBe(
      "https://github.example/commit/commit-sha",
    );
    expect(alertsWith("new-head")).toHaveLength(0);
  });

  it("sends queued destination revisions with the review request", async () => {
    let reviews = 0;
    stubFetch((url, method) => {
      if (url.endsWith("/api/admin/batches/batch-1") && method === "POST") {
        reviews += 1;
        return jsonResponse(200, reviewPayload(reviews, reviews > 1));
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    });

    await render(<BatchReviewPanel batchId="batch-1" />);
    await click(button("Revisar lote"));

    const [origin, target] = [
      ...container.querySelectorAll<HTMLInputElement>("input:not([placeholder])"),
    ];
    await setInputValue(origin, "DSM1/ALP/rascunho.pdf");
    await setInputValue(target, "DSM1/ALP/apostila.pdf");
    await click(button("Aplicar renomeação"));

    expect(reviews).toBe(2);
    expect(calls.at(-1)?.body).toEqual({
      revisions: [
        { destination: "DSM1/ALP/rascunho.pdf", newDestination: "DSM1/ALP/apostila.pdf" },
      ],
    });
    expect(container.textContent).toContain("DSM1/ALP/apostila.pdf");
  });

  it("surfaces rejections from the publish API", async () => {
    stubFetch((url, method) => {
      if (url.endsWith("/api/admin/batches/batch-1") && method === "POST") {
        return jsonResponse(200, reviewPayload(1, false));
      }
      if (url.endsWith("/api/admin/batches/batch-1/publish")) {
        return jsonResponse(400, {
          type: "rejected",
          errors: [{ destination: "", reason: "confirmation-mismatch" }],
        });
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    });

    await render(<BatchReviewPanel batchId="batch-1" />);
    await click(button("Revisar lote"));
    await setInputValue(confirmationInput(), "wrong");
    await click(button("Publicar lote"));

    expect(container.textContent).toContain("confirmation-mismatch");
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it("reports a failed review request without rendering files", async () => {
    stubFetch((url, method) => {
      if (url.endsWith("/api/admin/batches/batch-1") && method === "POST") {
        return jsonResponse(403, { error: "Proibido" });
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    });

    await render(<BatchReviewPanel batchId="batch-1" />);
    await click(button("Revisar lote"));

    expect(alertsWith("Falha ao carregar a revisão do lote")).toHaveLength(1);
    expect(container.querySelector("select")).toBeNull();
  });
});

describe("AdminBatchSelector", () => {
  it("lists draft batches and reviews the selected batch", async () => {
    stubFetch((url, method) => {
      if (url.endsWith("/api/admin/batches") && method === "GET") {
        return jsonResponse(200, {
          batches: [
            { id: "batch-1", status: "draft", totalBytes: 3072, baseCommitSha: "base-sha" },
            { id: "batch-2", status: "draft", totalBytes: 1024, baseCommitSha: "base-sha" },
          ],
        });
      }
      if (url.endsWith("/api/admin/batches/batch-2") && method === "POST") {
        return jsonResponse(200, {
          batchId: "batch-2",
          baseCommitSha: "base-sha",
          branch: "main",
          fileCount: 1,
          files: [
            {
              destination: "DSM3/BDNR/novo-c.pdf",
              size: 1024,
              mimeType: "application/pdf",
              collidesWithHead: false,
            },
          ],
          errors: [],
          confirmationPhrase: "PUBLICAR 1 ARQUIVOS EM main #33333333",
        });
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    });

    await render(<AdminBatchSelector />);
    expect(container.querySelector("select")).toBeNull();

    await click(button("Listar lotes"));
    const select = container.querySelector<HTMLSelectElement>("select");
    expect(select).not.toBeNull();
    expect([...(select as HTMLSelectElement).options].map((option) => option.value)).toEqual([
      "batch-1",
      "batch-2",
    ]);
    expect(button("Revisar lote")).toBeTruthy();

    await setSelectValue(select as HTMLSelectElement, "batch-2");
    await click(button("Revisar lote"));

    expect(calls.at(-1)?.url).toContain("/api/admin/batches/batch-2");
    expect(container.textContent).toContain("DSM3/BDNR/novo-c.pdf");
  });

  it("reports a failed batch listing", async () => {
    stubFetch((url, method) => {
      if (url.endsWith("/api/admin/batches") && method === "GET") {
        return jsonResponse(503, { error: "unconfigured" });
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    });

    await render(<AdminBatchSelector />);
    await click(button("Listar lotes"));

    expect(alertsWith("Falha ao listar os lotes")).toHaveLength(1);
  });
});
