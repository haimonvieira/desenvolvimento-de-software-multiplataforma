"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { MaterialRef } from "../catalog/model";
import type { ProposedNotebookAction } from "../../integrations/ai/public-tutor-ai";
import type { RetrievedExcerpt } from "../tutor/model";
import { TUTOR_CONTEXT_LIMIT } from "../tutor/study-tutor";
import { applyProposedNotebookAction } from "../tutor/notebook";
import { selectTutorContext } from "./tutor-context";
import { createIndexedDbStudyWorkspace } from "./indexed-db-study-store";
import { TurnstileWidget } from "./turnstile-widget";

type TurnResult = Readonly<{
  answer: string;
  citations: readonly RetrievedExcerpt[];
  proposedNotebookActions: readonly ProposedNotebookAction[];
}>;

type TurnState =
  | Readonly<{ type: "idle" }>
  /** The request is in flight and no event has arrived yet. */
  | Readonly<{ type: "pending" }>
  | Readonly<{ type: "streaming"; status: string; answer: string }>
  | Readonly<{
      type: "answered";
      answer: string;
      citations: readonly RetrievedExcerpt[];
      proposals: readonly ProposedNotebookAction[];
    }>
  /** A break — network, abort or mid-stream error — with whatever was already read kept. */
  | Readonly<{ type: "interrupted"; answer: string; message: string; cancelled: boolean }>
  | Readonly<{ type: "denied"; message: string }>
  | Readonly<{ type: "failed"; message: string }>;

type ApiBody = Readonly<{
  question: string;
  context: readonly MaterialRef[];
  mode: "sponsored" | "byok";
  turnstileToken?: string;
}>;

/** The status band's fixed line when the model never writes one. */
const STATUS_FALLBACK = "Consultando os materiais da conversa…";
/** While the answer streams, so no one expects citations before the turn ends. */
const PRE_NOTICE = "Citações e ações chegam no fim do turno";

function proposalLabel(proposal: ProposedNotebookAction): string {
  return proposal.type === "flashcard" ? `Flashcard: ${proposal.front}` : `Nota: ${proposal.title}`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** One SSE block (`event:` + `data:` lines) as the turn route emits it. */
function parseSseBlock(block: string): Readonly<{ event: string; data: unknown }> | null {
  let event = "message";
  const data: string[] = [];
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }
  if (data.length === 0) return null;
  try {
    return { event, data: JSON.parse(data.join("\n")) };
  } catch {
    return null;
  }
}

/**
 * The visitor-facing tutor. The page hands it every indexable material of the
 * semester as candidates; the panel narrows them to what the visitor is actually
 * studying (open material, progress, favorites, notes, flashcards) and caps the
 * turn to `TUTOR_CONTEXT_LIMIT`, the same bound the turn route validates. Every
 * turn posts the question, that context and the key (BYOK only, from memory) to
 * `/api/tutor/turn`; the response is an answer with citations plus inert
 * proposals. Saving a proposal is a separate explicit `StudyWorkspace.apply`
 * call made here, never by the model — and a BYOK key is kept in a state
 * variable for the session only, so it is never persisted, logged or
 * synchronised.
 *
 * The turn is requested as Server-Sent Events (`Accept: text/event-stream`): the
 * status line, the answer as it grows, and finally the result all render as they
 * arrive. A response that is not `text/event-stream` — an older deployment, a
 * proxy, a client that did not ask — is parsed as the ordinary JSON result, so
 * the panel degrades to today's behaviour instead of breaking.
 *
 * `turnstileSiteKey` is the public sitekey; when it is absent the widget cannot
 * render and the panel says the first-use gate is closed instead of offering an
 * input the visitor could never satisfy.
 */
export function TutorPanel({ candidates, turnstileSiteKey }: Readonly<{
  candidates: readonly MaterialRef[];
  turnstileSiteKey: string | null;
}>) {
  const workspace = useMemo(() => createIndexedDbStudyWorkspace(), []);
  const [context, setContext] = useState<readonly MaterialRef[]>(() => selectTutorContext(candidates, null));
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<"sponsored" | "byok">("sponsored");
  const [byokKey, setByokKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [state, setState] = useState<TurnState>({ type: "idle" });
  const [announcement, setAnnouncement] = useState("");
  const [notice, setNotice] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  // The answer read so far, kept in a ref so a break can restore it without
  // depending on which render the failure lands in.
  const partialRef = useRef("");

  useEffect(() => {
    let active = true;
    workspace.load()
      .then((snapshot) => {
        if (active) setContext(selectTutorContext(candidates, snapshot));
      })
      .catch(() => {
        // A study store that cannot be read must not block the tutor: the
        // fallback context (the first candidates) is already in place.
      });
    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, [candidates, workspace]);

  const inFlight = state.type === "pending" || state.type === "streaming";

  /** Renders the ordinary JSON payload — the path a non-streaming response takes. */
  async function readJsonTurn(response: Response): Promise<void> {
    const payload = (await response.json().catch(() => null)) as {
      result?: TurnResult;
      error?: { message?: string };
    } | null;
    if (response.status === 429) {
      setState({ type: "denied", message: payload?.error?.message ?? "Sua cota de estudo patrocinado terminou." });
      return;
    }
    if (!response.ok || !payload?.result) {
      setState({ type: "failed", message: payload?.error?.message ?? "Não foi possível responder agora." });
      return;
    }
    setState({
      type: "answered",
      answer: payload.result.answer,
      citations: payload.result.citations,
      proposals: payload.result.proposedNotebookActions,
    });
  }

  /** Renders the event stream as it arrives: status, growing answer, then result. */
  async function readStreamedTurn(response: Response): Promise<void> {
    if (!response.body) {
      setState({ type: "failed", message: "Não foi possível responder agora." });
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let status = "";
    let started = false;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = parseSseBlock(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf("\n\n");
        if (!block) continue;
        if (block.event === "status") {
          status = asText(asRecord(block.data)["status"]);
          setState({ type: "streaming", status, answer: partialRef.current });
        } else if (block.event === "answer") {
          partialRef.current += asText(asRecord(block.data)["delta"]);
          if (!started) {
            started = true;
            // The only mid-turn announcement: that the answer began. The text
            // itself is outside the live flow and never read word by word.
            setAnnouncement("A resposta começou a ser escrita.");
          }
          setState({ type: "streaming", status, answer: partialRef.current });
        } else if (block.event === "done") {
          const result = asRecord(asRecord(block.data)["result"]);
          setAnnouncement("Resposta concluída.");
          setState({
            type: "answered",
            answer: asText(result["answer"]),
            citations: Array.isArray(result["citations"]) ? (result["citations"] as RetrievedExcerpt[]) : [],
            proposals: Array.isArray(result["proposedNotebookActions"])
              ? (result["proposedNotebookActions"] as ProposedNotebookAction[])
              : [],
          });
          return;
        } else if (block.event === "error") {
          const message = asText(asRecord(asRecord(block.data)["error"])["message"]) || "Não foi possível responder agora.";
          setAnnouncement("Resposta interrompida.");
          setState({ type: "interrupted", answer: partialRef.current, message, cancelled: false });
          return;
        }
      }
    }
    // The stream closed without a result: keep what was read, offer a retry.
    setAnnouncement("Resposta interrompida.");
    setState({
      type: "interrupted",
      answer: partialRef.current,
      message: "A conexão terminou antes do fim da resposta.",
      cancelled: false,
    });
  }

  async function sendTurn(): Promise<void> {
    const trimmed = question.trim();
    if (!trimmed || inFlight || context.length === 0) return;
    setNotice("");
    setAnnouncement("");
    partialRef.current = "";
    setState({ type: "pending" });
    const controller = new AbortController();
    abortRef.current = controller;
    const body: ApiBody = {
      question: trimmed,
      context,
      mode,
      ...(mode === "sponsored" && turnstileToken.trim() ? { turnstileToken: turnstileToken.trim() } : {}),
    };
    try {
      const response = await fetch("/api/tutor/turn", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "text/event-stream",
          ...(mode === "byok" && byokKey ? { authorization: `Bearer ${byokKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/event-stream")) {
        await readJsonTurn(response);
        return;
      }
      await readStreamedTurn(response);
    } catch {
      if (controller.signal.aborted) {
        setAnnouncement("Resposta interrompida.");
        setState({ type: "interrupted", answer: partialRef.current, message: "Resposta cancelada.", cancelled: true });
      } else {
        setAnnouncement("Resposta interrompida.");
        setState({ type: "interrupted", answer: partialRef.current, message: "Não foi possível responder agora.", cancelled: false });
      }
    } finally {
      abortRef.current = null;
    }
  }

  function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendTurn();
  }

  function cancel() {
    abortRef.current?.abort();
  }

  async function saveProposal(proposal: ProposedNotebookAction) {
    setNotice("");
    try {
      await applyProposedNotebookAction(workspace, proposal);
      setNotice("Salvo no seu caderno.");
    } catch {
      setNotice("Não foi possível salvar. Tente novamente.");
    }
  }

  const answerText =
    state.type === "streaming" || state.type === "interrupted" || state.type === "answered" ? state.answer : "";

  return (
    <section className="tutor-panel" aria-label="Painel do tutor de estudo" aria-busy={inFlight}>
      <p className="tutor-hint">Pergunte sobre os materiais em estudo. As respostas citam os trechos usados.</p>
      <p className="tutor-hint" data-testid="tutor-context">
        {context.length === 0
          ? "Sem materiais no contexto, a resposta não teria base. Abra um material para começar."
          : `Materiais no contexto: ${context.length} de no máximo ${TUTOR_CONTEXT_LIMIT}.`}
      </p>
      <form onSubmit={ask}>
        <label htmlFor="tutor-question">Pergunta</label>
        <textarea
          id="tutor-question"
          name="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={inFlight}
          required
          maxLength={500}
          placeholder="O que você quer entender?"
        />
        <fieldset>
          <legend>Modo</legend>
          <label>
            <input
              type="radio"
              name="mode"
              value="sponsored"
              checked={mode === "sponsored"}
              onChange={() => setMode("sponsored")}
            />
            Patrocinado
          </label>
          <label>
            <input type="radio" name="mode" value="byok" checked={mode === "byok"} onChange={() => setMode("byok")} />
            Minha chave (BYOK)
          </label>
        </fieldset>
        {mode === "sponsored" && <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} />}
        {mode === "byok" && (
          <>
            <label htmlFor="tutor-byok-key">Sua chave de API</label>
            <input
              id="tutor-byok-key"
              name="byokKey"
              type="password"
              autoComplete="off"
              value={byokKey}
              onChange={(event) => setByokKey(event.target.value)}
              placeholder="Mantida só nesta sessão, nunca salva"
            />
            <p className="tutor-hint">Sua chave trafega só no cabeçalho desta requisição, pelo proxy do portal. Não é salva nem registrada.</p>
          </>
        )}
        <button type="submit" disabled={inFlight || question.trim().length === 0 || context.length === 0}>Perguntar</button>
      </form>
      {inFlight && (
        <div className="tutor-status-band" data-testid="tutor-status-band">
          <span className="tutor-pulse" aria-hidden="true" />
          <span className="tutor-status-text">
            {state.type === "streaming" && state.status ? state.status : STATUS_FALLBACK}
          </span>
        </div>
      )}
      <p className="sr-only" role="status">{announcement}</p>
      {(state.type === "streaming" || state.type === "interrupted" || state.type === "answered") && (
        <div className="tutor-answer-region" aria-busy={state.type === "streaming"}>
          <p className="tutor-answer-label">
            Resposta
            {state.type === "streaming" && <span className="tutor-seal tutor-seal--route">RECEBENDO</span>}
            {state.type === "interrupted" && <span className="tutor-seal tutor-seal--ink">interrompida</span>}
          </p>
          {(state.type === "streaming" || state.type === "interrupted" || state.type === "answered") && (
            <p className="tutor-answer">
              {answerText}
              {state.type === "streaming" && <span className="tutor-caret" aria-hidden="true" />}
            </p>
          )}
          {state.type === "streaming" && <p className="tutor-hint tutor-answer-pre">{PRE_NOTICE}</p>}
          {state.type === "interrupted" &&
            (state.cancelled ? (
              <p className="tutor-answer-note">{state.message}</p>
            ) : (
              <p role="alert" className="tutor-break">{state.message}</p>
            ))}
          {state.type === "answered" && state.citations.length > 0 && (
            <ol aria-label="Trechos citados">
              {state.citations.map((citation, index) => (
                <li key={`${citation.material.path}:${index}`}>
                  <cite>{citation.material.path}</cite>
                  <blockquote>{citation.text}</blockquote>
                </li>
              ))}
            </ol>
          )}
          {state.type === "answered" && state.proposals.length > 0 && (
            <ul aria-label="Ações propostas para o caderno">
              {state.proposals.map((proposal, index) => (
                <li key={`${proposal.type}:${index}`}>
                  <span>{proposalLabel(proposal)}</span>
                  <button type="button" onClick={() => saveProposal(proposal)}>Salvar no caderno</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {state.type === "interrupted" && (
        <p className="tutor-actions">
          <button type="button" onClick={() => void sendTurn()}>Tentar de novo</button>
        </p>
      )}
      {inFlight && (
        <p className="tutor-actions">
          <button type="button" className="tutor-cancel" onClick={cancel}>Cancelar esta resposta</button>
        </p>
      )}
      {state.type === "denied" && <p role="alert">{state.message}</p>}
      {state.type === "failed" && (
        <>
          <p role="alert">{state.message}</p>
          <p className="tutor-actions">
            <button type="button" onClick={() => void sendTurn()}>Tentar de novo</button>
          </p>
        </>
      )}
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
