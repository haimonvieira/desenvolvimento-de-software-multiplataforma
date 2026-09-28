"use client";

import { useCallback, useState } from "react";

type FileStatus = Readonly<{
  destination: string;
  state: "pending" | "valid" | "invalid" | "uploading" | "uploaded" | "failed";
  detail?: string;
}>;

type BatchMeta = Readonly<{
  id: string;
  baseCommitSha: string;
  status: string;
  totalBytes: number;
  expiresAt: string;
}>;

export function BatchStagingPanel() {
  const [baseCommitSha, setBaseCommitSha] = useState("");
  const [batch, setBatch] = useState<BatchMeta | null>(null);
  const [files, setFiles] = useState<readonly FileStatus[]>([]);
  const [pending, setPending] = useState<readonly File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createBatch = useCallback(async () => {
    setError(null);
    const response = await fetch("/api/admin/batches", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        baseCommitSha,
        files: pending.map((file) => ({
          destination: file.name,
          mimeType: file.type,
          size: file.size,
        })),
      }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        rejections?: readonly { destination: string; reason: string }[];
      } | null;
      setFiles(
        pending.map((file) => ({
          destination: file.name,
          state: "invalid" as const,
          detail:
            body?.rejections?.find((rejection) => rejection.destination === file.name)?.reason ??
            "rejected",
        })),
      );
      setError("Batch rejected by validation");
      return;
    }
    const meta = (await response.json()) as BatchMeta;
    setBatch(meta);
    setFiles(
      pending.map((file) => ({ destination: file.name, state: "valid" as const })),
    );
  }, [baseCommitSha, pending]);

  const uploadSequentially = useCallback(async () => {
    if (!batch) return;
    setError(null);
    for (const file of pending) {
      setFiles((current) =>
        current.map((entry) =>
          entry.destination === file.name
            ? { ...entry, state: "uploading" as const }
            : entry,
        ),
      );
      const form = new FormData();
      form.set("destination", file.name);
      form.set("file", file);
      try {
        const response = await fetch(`/api/admin/batches/${batch.id}/blobs`, {
          method: "POST",
          body: form,
        });
        setFiles((current) =>
          current.map((entry) =>
            entry.destination === file.name
              ? {
                  ...entry,
                  state: response.ok ? ("uploaded" as const) : ("failed" as const),
                  detail: response.ok ? undefined : `http-${response.status}`,
                }
              : entry,
          ),
        );
        if (!response.ok) break;
      } catch {
        setFiles((current) =>
          current.map((entry) =>
            entry.destination === file.name
              ? { ...entry, state: "failed" as const, detail: "network" }
              : entry,
          ),
        );
        break;
      }
    }
  }, [batch, pending]);

  const reload = useCallback(async () => {
    if (!batch) return;
    const response = await fetch("/api/admin/batches");
    if (!response.ok) {
      setError("Reload failed");
      return;
    }
    const body = (await response.json()) as { batches: BatchMeta[] };
    const current = body.batches.find((entry) => entry.id === batch.id) ?? null;
    setBatch(current);
  }, [batch]);

  return (
    <section aria-label="Upload staging">
      <h2>Etapa de envio</h2>
      {error ? <p role="alert">{error}</p> : null}
      <label>
        Commit base
        <input
          value={baseCommitSha}
          onChange={(event) => setBaseCommitSha(event.target.value)}
          placeholder="40 hex chars"
        />
      </label>
      <label>
        Arquivos
        <input
          type="file"
          multiple
          onChange={(event) => setPending(Array.from(event.target.files ?? []))}
        />
      </label>
      <button type="button" onClick={createBatch}>
        Criar lote
      </button>
      <button type="button" onClick={uploadSequentially} disabled={!batch}>
        Enviar em sequência
      </button>
      <button type="button" onClick={reload} disabled={!batch}>
        Recarregar lote
      </button>
      <ul>
        {files.map((file) => (
          <li key={file.destination}>
            {file.destination} — {file.state}
            {file.detail ? ` (${file.detail})` : null}
            {file.state === "failed" ? " — selecione o arquivo novamente" : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
