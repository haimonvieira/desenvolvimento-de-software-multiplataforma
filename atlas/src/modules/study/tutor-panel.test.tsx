// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MaterialRef } from "../catalog/model";
import { TutorPanel } from "./tutor-panel";

const actEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;

const material: MaterialRef = Object.freeze({ path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) });
const citation = Object.freeze({
  material,
  locator: Object.freeze({ type: "lines" as const, start: 1, end: 2 }),
  text: "linha um\nlinha dois",
  score: 1,
});

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** A stream the test drives event by event, so intermediate renders are observable. */
function manualStream() {
  const encoder = new TextEncoder();
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({ start: (c) => { controller = c; } });
  return {
    response: new Response(body, { headers: { "content-type": "text/event-stream; charset=utf-8" } }),
    send: (event: string, data: unknown) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)),
    close: () => controller.close(),
    fail: (error: unknown) => controller.error(error),
  };
}

function stubFetch(responder: (init?: RequestInit) => Promise<Response> | Response) {
  vi.stubGlobal("fetch", async (_input: RequestInfo | URL, init?: RequestInit) => responder(init));
}

async function render(element: Parameters<Root["render"]>[0]) {
  await act(async () => { root.render(element); });
}

async function setQuestion(value: string) {
  const textarea = container.querySelector<HTMLTextAreaElement>("textarea");
  if (!textarea) throw new Error("question textarea not found");
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  await act(async () => {
    setter?.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
  });
}

async function submit() {
  const form = container.querySelector("form");
  if (!form) throw new Error("form not found");
  await act(async () => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await tick();
  });
}

function button(label: string): HTMLButtonElement {
  const found = [...container.querySelectorAll("button")].find((candidate) => candidate.textContent?.includes(label));
  if (!found) throw new Error(`button not found: ${label}`);
  return found as HTMLButtonElement;
}

function announcer(): string {
  return container.querySelector(".sr-only[role='status']")?.textContent ?? "";
}

describe("TutorPanel streaming", () => {
  it("renders the status, then the growing answer, then the citations", async () => {
    const stream = manualStream();
    stubFetch(() => stream.response);
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await setQuestion("o que é lógica?");
    await submit();

    // Nothing but the fixed line until the model's own status arrives.
    expect(container.querySelector('[data-testid="tutor-status-band"]')?.textContent).toContain("Consultando os materiais da conversa…");

    await act(async () => { stream.send("status", { status: "Lendo os materiais da conversa" }); await tick(); });
    expect(container.querySelector('[data-testid="tutor-status-band"]')?.textContent).toContain("Lendo os materiais da conversa");

    await act(async () => { stream.send("answer", { delta: "A lógica " }); await tick(); });
    expect(container.querySelector(".tutor-answer")?.textContent).toContain("A lógica");
    expect(container.textContent).toContain("RECEBENDO");
    expect(container.textContent).toContain("Citações e ações chegam no fim do turno");
    expect(announcer()).toBe("A resposta começou a ser escrita.");

    await act(async () => {
      stream.send("answer", { delta: "estuda o raciocínio." });
      stream.send("done", { result: { answer: "A lógica estuda o raciocínio.", citations: [citation], proposedNotebookActions: [] } });
      stream.close();
      await tick();
    });

    const cited = container.querySelector('[aria-label="Trechos citados"]');
    expect(cited?.textContent).toContain("linha um");
    expect(container.textContent).not.toContain("RECEBENDO");
    expect(announcer()).toBe("Resposta concluída.");
  });

  it("keeps the partial text and offers retry when the stream breaks", async () => {
    const stream = manualStream();
    stubFetch(() => stream.response);
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await setQuestion("o que é lógica?");
    await submit();

    await act(async () => { stream.send("answer", { delta: "A lógica estuda" }); await tick(); });
    await act(async () => {
      stream.send("error", { error: { code: "TUTOR_TURN_FAILED", message: "Falha no provedor." } });
      await tick();
    });

    expect(container.querySelector(".tutor-answer")?.textContent).toContain("A lógica estuda");
    expect(container.textContent).toContain("interrompida");
    expect(container.querySelector(".tutor-break")?.textContent).toContain("Falha no provedor.");
    expect(button("Tentar de novo")).toBeTruthy();
    expect(announcer()).toBe("Resposta interrompida.");
  });

  it("keeps the partial text when the visitor cancels", async () => {
    const stream = manualStream();
    stubFetch((init) => {
      init?.signal?.addEventListener("abort", () => stream.fail(new DOMException("Aborted", "AbortError")));
      return stream.response;
    });
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await setQuestion("o que é lógica?");
    await submit();

    await act(async () => { stream.send("answer", { delta: "A lógica estuda" }); await tick(); });
    await act(async () => { button("Cancelar esta resposta").click(); await tick(); });

    expect(container.querySelector(".tutor-answer")?.textContent).toContain("A lógica estuda");
    expect(container.textContent).toContain("interrompida");
    expect(container.querySelector(".tutor-answer-note")?.textContent).toContain("Resposta cancelada.");
    expect(container.querySelector(".tutor-break")).toBeNull();
    expect(button("Tentar de novo")).toBeTruthy();
  });

  it("renders a non-stream JSON response through the ordinary path", async () => {
    stubFetch(() => new Response(
      JSON.stringify({ result: { answer: "A lógica estuda o raciocínio.", citations: [citation], proposedNotebookActions: [] } }),
      { status: 200, headers: { "content-type": "application/json" } },
    ));
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await setQuestion("o que é lógica?");
    await submit();

    expect(container.querySelector(".tutor-answer")?.textContent).toContain("A lógica estuda o raciocínio.");
    expect(container.querySelector('[aria-label="Trechos citados"]')?.textContent).toContain("linha um");
    expect(container.querySelector('[data-testid="tutor-status-band"]')).toBeNull();
  });

  it("shows the quota-exhausted state on a 429", async () => {
    stubFetch(() => new Response(
      JSON.stringify({ error: { code: "QUOTA_DENIED", message: "Sua cota de estudo patrocinado terminou." } }),
      { status: 429, headers: { "content-type": "application/json" } },
    ));
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await setQuestion("o que é lógica?");
    await submit();

    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Sua cota de estudo patrocinado terminou.");
  });

  it("blocks sending when there are no materials", async () => {
    stubFetch(() => { throw new Error("must not fetch"); });
    await render(<TutorPanel candidates={[]} turnstileSiteKey={null} />);

    expect(container.textContent).toContain("Sem materiais no contexto, a resposta não teria base.");
    expect(button("Perguntar").disabled).toBe(true);
    await setQuestion("o que é lógica?");
    await submit();
    expect(container.querySelector('[data-testid="tutor-status-band"]')).toBeNull();
  });
});
