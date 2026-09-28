import { describe, expect, it } from "vitest";

import type { ProposedNotebookAction } from "../../integrations/ai/public-tutor-ai";
import type { MaterialRef } from "../catalog/model";
import type { StudyChange, StudySnapshot } from "../study/model";
import type { StudyWorkspace } from "../study/study-workspace";
import { applyProposedNotebookAction, studyChangeFor } from "./notebook";

const material: MaterialRef = { path: "DSM1/ALP/introducao.md", commitSha: "a".repeat(40) };

const emptySnapshot: StudySnapshot = {
  progress: [], favorites: [], notes: [], flashcards: [], outbox: [], conflicts: [], currentMaterial: null,
};

function workspaceRecording() {
  const applied: StudyChange[] = [];
  const workspace: StudyWorkspace = {
    async load() { return emptySnapshot; },
    async apply(change) { applied.push(change); return emptySnapshot; },
  };
  return { applied, workspace };
}

describe("notebook proposals", () => {
  it("maps a proposed flashcard to an explicit StudyChange", () => {
    const action: ProposedNotebookAction = { type: "flashcard", front: "Pergunta?", back: "Resposta.", source: material };

    expect(studyChangeFor(action, { id: "id-1", at: "2026-09-28T00:00:00.000Z" })).toEqual({
      type: "flashcard.save",
      flashcard: { id: "id-1", material, front: "Pergunta?", back: "Resposta.", updatedAt: "2026-09-28T00:00:00.000Z", deletedAt: null },
    });
  });

  it("maps a proposed note to an explicit StudyChange", () => {
    const action: ProposedNotebookAction = { type: "note", title: "Título", body: "Corpo", source: material };

    expect(studyChangeFor(action, { id: "id-2", at: "2026-09-28T00:00:00.000Z" })).toEqual({
      type: "note.save",
      note: { id: "id-2", material, text: "Título\n\nCorpo", updatedAt: "2026-09-28T00:00:00.000Z", deletedAt: null },
    });
  });

  it("applies only when the visitor explicitly asks to save a proposal", async () => {
    const { applied, workspace } = workspaceRecording();

    await applyProposedNotebookAction(workspace, { type: "note", title: "T", body: "B", source: material }, { id: "id-3", at: "2026-09-28T00:00:00.000Z" });

    expect(applied).toEqual([studyChangeFor({ type: "note", title: "T", body: "B", source: material }, { id: "id-3", at: "2026-09-28T00:00:00.000Z" })]);
  });
});
