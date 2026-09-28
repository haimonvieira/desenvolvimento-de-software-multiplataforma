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

export function BatchReviewPanel({ batchId }: { batchId: string }) {
  const [review, setReview] = useState<ReviewPayload | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [outcome, setOutcome] = useState<PublishPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReview = useCallback(async () => {
    setError(null);
    setOutcome(null);
    const response = await fetch(`/api/admin/batches/${batchId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ revisions: [] }),
    });
    if (!response.ok) {
      setError("Falha ao carregar a revisão do lote.");
      return;
    }
    const payload = (await response.json()) as ReviewPayload;
    setReview(payload);
    setConfirmation("");
  }, [batchId]);

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
    setOutcome(payload);
    if (response.status === 409 && payload.type === "conflict") {
      await loadReview();
    }
  }, [batchId, confirmation, review, loadReview]);

  return (
    <section aria-label="Revisão e publicação">
      <button type="button" onClick={loadReview}>
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
          <label>
            Confirmação ({review.confirmationPhrase})
            <input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={review.confirmationPhrase}
            />
          </label>
          <button type="button" onClick={publish} disabled={confirmation.length === 0}>
            Publicar lote
          </button>
        </>
      ) : null}
      {outcome?.type === "published" ? (
        <p role="status">
          Commit publicado; catálogo será atualizado após o deploy.{" "}
          <a href={outcome.commitUrl}>Ver commit {outcome.commitSha}</a>
        </p>
      ) : null}
      {outcome?.type === "conflict" ? (
        <p role="alert">
          O ramo avançou para {outcome.currentHead}. A revisão foi recarregada;
          confira os arquivos e confirme novamente.
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
