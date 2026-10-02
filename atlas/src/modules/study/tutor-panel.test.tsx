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

function setInput(selector: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(selector);
  if (!input) throw new Error(`input not found: ${selector}`);
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  return act(async () => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();
  });
}

function setSelect(selector: string, value: string) {
  const select = container.querySelector<HTMLSelectElement>(selector);
  if (!select) throw new Error(`select not found: ${selector}`);
  return act(async () => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();
  });
}

function clickButton(label: string) {
  return act(async () => {
    button(label).click();
    await tick();
  });
}

function byokMode() {
  return act(async () => {
    const radio = container.querySelector<HTMLInputElement>('input[name="mode"][value="byok"]');
    if (!radio) throw new Error("byok radio not found");
    radio.click();
    await tick();
  });
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

describe("TutorPanel persona", () => {
  function personaRadio(value: "chat" | "agent") {
    return act(async () => {
      const radio = container.querySelector<HTMLInputElement>(`input[name="persona"][value="${value}"]`);
      if (!radio) throw new Error(`persona radio not found: ${value}`);
      radio.click();
      await tick();
    });
  }

  function lastTurnBody(calls: (RequestInit | undefined)[]) {
    const last = calls[calls.length - 1];
    return JSON.parse(String(last?.body)) as Record<string, unknown>;
  }

  it("defaults to chat and posts persona chat", async () => {
    const calls: (RequestInit | undefined)[] = [];
    stubFetch((init) => {
      calls.push(init);
      return new Response(
        JSON.stringify({ result: { answer: "oi", citations: [], proposedNotebookActions: [] } }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    expect(container.querySelector<HTMLInputElement>('input[name="persona"][value="chat"]')?.checked).toBe(true);
    await setQuestion("o que é lógica?");
    await submit();
    expect(lastTurnBody(calls)).toMatchObject({ persona: "chat" });
  });

  it("posts persona agent after switching, keeping the answer history", async () => {
    const calls: (RequestInit | undefined)[] = [];
    stubFetch((init) => {
      calls.push(init);
      return new Response(
        JSON.stringify({ result: { answer: "primeira", citations: [], proposedNotebookActions: [] } }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await setQuestion("primeira pergunta");
    await submit();
    expect(container.querySelector(".tutor-answer")?.textContent).toContain("primeira");

    await personaRadio("agent");
    expect(container.querySelector(".tutor-answer")?.textContent).toContain("primeira");

    await setQuestion("segunda pergunta");
    await submit();
    expect(lastTurnBody(calls)).toMatchObject({ persona: "agent" });
    expect(container.querySelector(".tutor-answer")?.textContent).toBeTruthy();

    await personaRadio("chat");
    await setQuestion("terceira pergunta");
    await submit();
    expect(lastTurnBody(calls)).toMatchObject({ persona: "chat" });
  });
});

describe("TutorPanel BYOK provider", () => {
  it("keeps the submit disabled until the probe approves", async () => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("/api/tutor/byok/models")) {
        return new Response(JSON.stringify({ models: ["m-1"] }), { status: 200 });
      }
      if (url === "/api/tutor/byok/probe") {
        return new Response(JSON.stringify({ ok: true, models: ["m-1"] }), { status: 200 });
      }
      throw new Error(`unexpected fetch: ${url}`);
    });
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await byokMode();
    await setQuestion("o que é lógica?");

    expect(button("Perguntar").disabled).toBe(true);
    expect(container.textContent).toContain("não é armazenada");

    await clickButton("Buscar modelos");
    await setSelect("#tutor-byok-model", "m-1");
    expect(button("Perguntar").disabled).toBe(true);

    await setInput("#tutor-byok-key", "sk-visitor");
    await clickButton("Testar conexão");

    expect(container.querySelector('[data-testid="tutor-probe-line"]')?.textContent).toContain("aprovado");
    expect(button("Perguntar").disabled).toBe(false);
  });

  it("renders the not-your-key copy for a 403, not the invalid-key copy", async () => {
    vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("/api/tutor/byok/models")) {
        return new Response(JSON.stringify({ models: ["m-1"] }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: false, reason: "model-not-subscribed" }), { status: 200 });
    });
    await render(<TutorPanel candidates={[material]} turnstileSiteKey={null} />);
    await byokMode();
    await clickButton("Buscar modelos");
    await setSelect("#tutor-byok-model", "m-1");
    await setInput("#tutor-byok-key", "sk-visitor");
    await clickButton("Testar conexão");

    const failure = container.querySelector('[data-testid="tutor-probe-failure"]')?.textContent ?? "";
    expect(container.querySelector('[data-testid="tutor-probe-line"]')?.textContent).toContain("reprovado");
    expect(failure).toContain("não está liberado na sua conta — não é a chave");
    expect(failure).not.toContain("Chave inválida ou revogada");
    expect(button("Perguntar").disabled).toBe(true);
  });
});
