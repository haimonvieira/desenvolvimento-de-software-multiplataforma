"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { MaterialRef } from "../catalog/model";
import type { ProposedNotebookAction } from "../../integrations/ai/public-tutor-ai";
import type { RetrievedExcerpt } from "../tutor/model";
import { applyProposedNotebookAction } from "../tutor/notebook";
import { createIndexedDbStudyWorkspace } from "./indexed-db-study-store";

type TurnState =
  | Readonly<{ type: "idle" }>
  | Readonly<{ type: "pending" }>
  | Readonly<{
      type: "answered";
      answer: string;
      citations: readonly RetrievedExcerpt[];
      proposals: readonly ProposedNotebookAction[];
    }>
  | Readonly<{ type: "denied"; message: string }>
  | Readonly<{ type: "failed"; message: string }>;

type ApiBody = Readonly<{
  question: string;
  context: readonly MaterialRef[];
  mode: "sponsored" | "byok";
}>;

function proposalLabel(proposal: ProposedNotebookAction): string {
  return proposal.type === "flashcard" ? `Flashcard: ${proposal.front}` : `Nota: ${proposal.title}`;
}

/**
 * The visitor-facing tutor. Every turn posts the question, the studied
 * materials and the key (BYOK only, from memory) to `/api/tutor/turn`; the
 * response is an answer with citations plus inert proposals. Saving a proposal
 * is a separate explicit `StudyWorkspace.apply` call made here, never by the
 * model — and a BYOK key is kept in a state variable for the session only, so
 * it is never persisted, logged or synchronised.
 */
export function TutorPanel({ context }: Readonly<{ context: readonly MaterialRef[] }>) {
  const workspace = useMemo(() => createIndexedDbStudyWorkspace(), []);
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<"sponsored" | "byok">("sponsored");
  const [byokKey, setByokKey] = useState("");
  const [state, setState] = useState<TurnState>({ type: "idle" });
  const [notice, setNotice] = useState("");

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || state.type === "pending") return;
    setNotice("");
    setState({ type: "pending" });
    const body: ApiBody = { question: trimmed, context, mode };
    try {
      const response = await fetch("/api/tutor/turn", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(mode === "byok" && byokKey ? { authorization: `Bearer ${byokKey}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const payload = (await response.json().catch(() => null)) as {
        result?: { answer: string; citations: readonly RetrievedExcerpt[]; proposedNotebookActions: readonly ProposedNotebookAction[] };
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
    } catch {
      setState({ type: "failed", message: "Não foi possível responder agora." });
    }
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

  return (
    <section className="tutor-panel" aria-labelledby="tutor-title" aria-busy={state.type === "pending"}>
      <h2 id="tutor-title">Tutor de estudo</h2>
      <p className="tutor-hint">Pergunte sobre os materiais em estudo. As respostas citam os trechos usados.</p>
      <form onSubmit={ask}>
        <label htmlFor="tutor-question">Pergunta</label>
        <textarea
          id="tutor-question"
          name="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={state.type === "pending"}
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
          </>
        )}
        <button type="submit" disabled={state.type === "pending" || question.trim().length === 0}>Perguntar</button>
      </form>
      {state.type === "pending" && <p role="status">Buscando nos materiais…</p>}
      {state.type === "denied" && <p role="alert">{state.message}</p>}
      {state.type === "failed" && <p role="alert">{state.message}</p>}
      {state.type === "answered" && (
        <div>
          <p>{state.answer}</p>
          {state.citations.length > 0 && (
            <ol aria-label="Trechos citados">
              {state.citations.map((citation, index) => (
                <li key={`${citation.material.path}:${index}`}>
                  <cite>{citation.material.path}</cite>
                  <blockquote>{citation.text}</blockquote>
                </li>
              ))}
            </ol>
          )}
          {state.proposals.length > 0 && (
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
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
