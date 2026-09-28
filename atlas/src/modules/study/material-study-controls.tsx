"use client";

import { useEffect, useState } from "react";
import type { MaterialRef } from "../catalog/model";
import { createIndexedDbStudyWorkspace } from "./indexed-db-study-store";
import type { Favorite, Flashcard, Note, Progress, StudySnapshot } from "./model";

const emptySnapshot: StudySnapshot = { progress: [], favorites: [], notes: [], flashcards: [], outbox: [], currentMaterial: null };

export function MaterialStudyControls({ material }: Readonly<{ material: MaterialRef }>) {
  const workspace = createIndexedDbStudyWorkspace();
  const [snapshot, setSnapshot] = useState(emptySnapshot);
  const [ready, setReady] = useState(false);
  const materialId = `${material.commitSha}:${material.path}`;
  const progress = snapshot.progress.find((entry) => entry.id === materialId);
  const favorite = snapshot.favorites.find((entry) => entry.id === materialId)?.value ?? false;
  const notes = snapshot.notes.filter((entry) => !entry.deletedAt && sameMaterial(entry, material));
  const flashcards = snapshot.flashcards.filter((entry) => !entry.deletedAt && sameMaterial(entry, material));

  useEffect(() => {
    let current = true;
    createIndexedDbStudyWorkspace().load().then((loaded) => {
      if (current) {
        setSnapshot(loaded);
        setReady(true);
      }
    });
    return () => { current = false; };
  }, []);

  async function setProgress(status: Progress["status"]) {
    setSnapshot(await workspace.apply({ type: "progress.set", material, status, at: new Date().toISOString() }));
  }

  async function saveNote(formData: FormData) {
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;
    const at = new Date().toISOString();
    const note: Note = { id: crypto.randomUUID(), material, text, updatedAt: at, deletedAt: null };
    setSnapshot(await workspace.apply({ type: "note.save", note }));
  }

  async function saveFlashcard(formData: FormData) {
    const front = String(formData.get("front") ?? "").trim();
    const back = String(formData.get("back") ?? "").trim();
    if (!front || !back) return;
    const at = new Date().toISOString();
    const flashcard: Flashcard = { id: crypto.randomUUID(), material, front, back, updatedAt: at, deletedAt: null };
    setSnapshot(await workspace.apply({ type: "flashcard.save", flashcard }));
  }

  return (
    <section className="study-controls" aria-labelledby="study-controls-title" aria-busy={!ready}>
      <header>
        <div><p className="study-eyebrow">Estudo local</p><h2 id="study-controls-title">Seu progresso neste material</h2></div>
        <span className="study-status" role="status">{progress?.status === "done" ? "Concluído" : progress?.status === "studying" ? "Em estudo" : "Não iniciado"}</span>
      </header>
      <div className="study-actions">
        <button type="button" onClick={() => setProgress("studying")}>Iniciar</button>
        <button type="button" onClick={() => setProgress("done")}>Concluir</button>
        <button type="button" aria-pressed={favorite} onClick={async () => setSnapshot(await workspace.apply({ type: "favorite.set", material, value: !favorite, at: new Date().toISOString() }))}>
          {favorite ? "★ Favorito" : "☆ Favoritar"}
        </button>
      </div>
      <div className="study-editors">
        <form action={saveNote}>
          <label htmlFor="study-note">Nota</label>
          <textarea id="study-note" name="text" required placeholder="Registre uma observação" />
          <button type="submit">Salvar nota</button>
        </form>
        <form action={saveFlashcard}>
          <label htmlFor="flashcard-front">Flashcard</label>
          <input id="flashcard-front" name="front" required placeholder="Pergunta" />
          <label className="sr-only" htmlFor="flashcard-back">Resposta</label>
          <textarea id="flashcard-back" name="back" required placeholder="Resposta" />
          <button type="submit">Salvar flashcard</button>
        </form>
      </div>
      {(notes.length > 0 || flashcards.length > 0) && (
        <div className="study-saved" aria-live="polite">
          {notes.map((note) => <article key={note.id}><strong>Nota</strong><p>{note.text}</p><button type="button" onClick={async () => setSnapshot(await workspace.apply({ type: "item.delete", entity: "note", id: note.id, at: new Date().toISOString() }))}>Excluir nota</button></article>)}
          {flashcards.map((card) => <article key={card.id}><strong>{card.front}</strong><p>{card.back}</p><button type="button" onClick={async () => setSnapshot(await workspace.apply({ type: "item.delete", entity: "flashcard", id: card.id, at: new Date().toISOString() }))}>Excluir flashcard</button></article>)}
        </div>
      )}
    </section>
  );
}

function sameMaterial(entry: Note | Flashcard | Favorite | Progress, material: MaterialRef): boolean {
  return entry.material.path === material.path && entry.material.commitSha === material.commitSha;
}
