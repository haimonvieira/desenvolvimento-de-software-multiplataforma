"use client";

import { useCallback, useState } from "react";

type ReviewedFile = Readonly<{
  destination: string;
  size: number;
  mimeType: string;
  collidesWithHead: boolean;
}>;

type ReviewPayload = Readonly<{
  batchId: string;
  baseCommitSha: string;
  branch: string;
  fileCount: number;
  files: readonly ReviewedFile[];
  errors: ReadonlyArray<{ destination: string; reason: string }>;
  confirmationPhrase: string;
}>;

type PublishPayload =
  | { type: "published"; commitSha: string; commitUrl: string }
  | { type: "conflict"; currentHead: string }
  | { type: "rejected"; errors: ReadonlyArray<{ destination: string; reason: string }> };

type BatchSummary = Readonly<{
  id: string;
  status: string;
  totalBytes: number;
  baseCommitSha: string;
}>;

type SuggestionConfidence = Readonly<Record<"semester" | "discipline" | "path" | "title" | "kind", number>>;

type ClassificationSuggestion = Readonly<{
  blobSha: string;
  destination: string;
  semesterCode: string | null;
  disciplineCode: string | null;
  relativePath: string | null;
  title: string;
  kind: string;
  confidence: SuggestionConfidence;
  warning?: string;
}>;

type ClassifyPayload = Readonly<{
  batchId: string;
  suggestions: readonly ClassificationSuggestion[];
}>;

function confidenceLabel(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function BatchReviewPanel({ batchId }: { batchId: string }) {
  const [review, setReview] = useState<ReviewPayload | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [outcome, setOutcome] = useState<PublishPayload | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<ReadonlyArray<{ destination: string; newDestination: string }>>([]);
  const [revisionFrom, setRevisionFrom] = useState("");
  const [revisionTo, setRevisionTo] = useState("");
  const [suggestions, setSuggestions] = useState<readonly ClassificationSuggestion[]>([]);
  const [classifyError, setClassifyError] = useState<string | null>(null);
  const [classifyBusy, setClassifyBusy] = useState(false);

  const loadReview = useCallback(
    async (pendingRevisions: ReadonlyArray<{ destination: string; newDestination: string }> = []) => {
      setError(null);
      const response = await fetch(`/api/admin/batches/${batchId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ revisions: pendingRevisions }),
      });
      if (!response.ok) {
        setError("Falha ao carregar a revisão do lote.");
        return;
      }
      const payload = (await response.json()) as ReviewPayload;
      setReview(payload);
      setConfirmation("");
      if (pendingRevisions.length === 0) setRevisions([]);
    },
    [batchId],
  );

  const publish = useCallback(async () => {
    if (!review) return;
    setError(null);
    const response = await fetch(`/api/admin/batches/${batchId}/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        baseCommitSha: review.baseCommitSha,
        confirmation,
      }),
    });
    const payload = (await response.json()) as PublishPayload;
    if (response.status === 409 && payload.type === "conflict") {
      // Reload first so the conflict notice survives: loadReview no longer
      // clears outcome/conflict state.
      await loadReview();
      setConflict(payload.currentHead);
      setOutcome(null);
      return;
    }
    setConflict(null);
    setOutcome(payload);
  }, [batchId, confirmation, review, loadReview]);

  const queueRevision = useCallback(() => {
    if (!revisionFrom.trim() || !revisionTo.trim()) return;
    const next = [...revisions, { destination: revisionFrom.trim(), newDestination: revisionTo.trim() }];
    setRevisions(next);
    setRevisionFrom("");
    setRevisionTo("");
    void loadReview(next);
  }, [revisionFrom, revisionTo, revisions, loadReview]);

  // Suggestions are advisory only: they render next to the manual review and
  // are applied through the same destination-revision path, never by
  // confirming or publishing the batch.
  const suggestClassification = useCallback(async () => {
    setClassifyError(null);
    setClassifyBusy(true);
    try {
      const response = await fetch(`/api/admin/batches/${batchId}/classify`, { method: "POST" });
      if (!response.ok) {
        setClassifyError("Falha ao sugerir a classificação.");
        return;
      }
      const payload = (await response.json()) as ClassifyPayload;
      setSuggestions(payload.suggestions);
    } finally {
      setClassifyBusy(false);
    }
  }, [batchId]);

  const applySuggestion = useCallback(
    (destination: string, newDestination: string) => {
      const next = [...revisions, { destination, newDestination }];
      setRevisions(next);
      void loadReview(next);
    },
    [revisions, loadReview],
  );

  return (
    <section aria-label="Revisão e publicação">
      <button type="button" onClick={() => void loadReview()}>
        Revisar lote
      </button>
      {error ? <p role="alert">{error}</p> : null}
      {review ? (
        <>
          <p>
            Base: <code>{review.baseCommitSha}</code> · Ramo {review.branch} ·{" "}
            {review.fileCount} arquivo(s)
          </p>
          <ul>
            {review.files.map((file) => (
              <li key={file.destination}>
                {file.destination} · {file.size} bytes
                {file.collidesWithHead ? " · substitui versão atual" : ""}
              </li>
            ))}
          </ul>
          {review.errors.length > 0 ? (
            <ul>
              {review.errors.map((entry, index) => (
                <li key={`${entry.destination}-${index}`}>
                  {entry.destination}: {entry.reason}
                </li>
              ))}
            </ul>
          ) : null}
          <fieldset>
            <legend>Renomear destino revisado</legend>
            <label>
              Origem
              <input value={revisionFrom} onChange={(event) => setRevisionFrom(event.target.value)} />
            </label>
            <label>
              Novo destino
              <input value={revisionTo} onChange={(event) => setRevisionTo(event.target.value)} />
            </label>
            <button type="button" onClick={queueRevision}>
              Aplicar renomeação
            </button>
          </fieldset>
          <label>
            Confirmação ({review.confirmationPhrase})
            <input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={review.confirmationPhrase}
            />
          </label>
          <button type="button" onClick={() => void publish()} disabled={confirmation.length === 0}>
            Publicar lote
          </button>
          <fieldset>
            <legend>Sugestões de classificação</legend>
            <button type="button" onClick={() => void suggestClassification()} disabled={classifyBusy}>
              Sugerir classificação
            </button>
            {classifyError ? <p role="alert">{classifyError}</p> : null}
            {suggestions.length > 0 ? (
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion.blobSha || suggestion.destination}>
                    <p>
                      <strong>{suggestion.title}</strong> · {suggestion.destination} · {suggestion.kind}
                    </p>
                    <p>
                      Semestre {suggestion.semesterCode ?? "—"} ({confidenceLabel(suggestion.confidence.semester)}) ·
                      Disciplina {suggestion.disciplineCode ?? "—"} ({confidenceLabel(suggestion.confidence.discipline)}) ·
                      Destino {suggestion.relativePath ?? "—"} ({confidenceLabel(suggestion.confidence.path)}) ·
                      Título ({confidenceLabel(suggestion.confidence.title)}) ·
                      Tipo ({confidenceLabel(suggestion.confidence.kind)})
                    </p>
                    {suggestion.warning ? <p>{suggestion.warning}</p> : null}
                    <button
                      type="button"
                      disabled={suggestion.relativePath === null}
                      onClick={() => {
                        if (suggestion.relativePath !== null) applySuggestion(suggestion.destination, suggestion.relativePath);
                      }}
                    >
                      Usar destino sugerido
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </fieldset>
        </>
      ) : null}
      {conflict ? (
        <p role="alert">
          O ramo avançou para {conflict}. A revisão foi recarregada; confira os
          arquivos e confirme novamente com a nova frase.
        </p>
      ) : null}
      {outcome?.type === "published" ? (
        <p role="status">
          Commit publicado; catálogo será atualizado após o deploy.{" "}
          <a href={outcome.commitUrl}>Ver commit {outcome.commitSha}</a>
        </p>
      ) : null}
      {outcome?.type === "rejected" ? (
        <ul>
          {outcome.errors.map((entry, index) => (
            <li key={`${entry.destination}-${index}`}>
              {entry.destination}: {entry.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function AdminBatchSelector() {
  const [batches, setBatches] = useState<readonly BatchSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const response = await fetch("/api/admin/batches");
    if (!response.ok) {
      setError("Falha ao listar os lotes.");
      return;
    }
    const payload = (await response.json()) as { batches: readonly BatchSummary[] };
    setBatches(payload.batches);
    if (payload.batches.length > 0 && selected === null) {
      setSelected(payload.batches[0]?.id ?? null);
    }
  }, [selected]);

  return (
    <section aria-label="Lotes para revisão">
      <button type="button" onClick={() => void load()}>
        Listar lotes
      </button>
      {error ? <p role="alert">{error}</p> : null}
      {batches.length > 0 ? (
        <label>
          Lote
          <select
            value={selected ?? ""}
            onChange={(event) => setSelected(event.target.value)}
          >
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.id} · {batch.status}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {selected ? <BatchReviewPanel key={selected} batchId={selected} /> : null}
    </section>
  );
}
