import type { ProposedNotebookAction } from "../../integrations/ai/public-tutor-ai";
import type { StudyChange, StudySnapshot } from "../study/model";
import type { StudyWorkspace } from "../study/study-workspace";

/**
 * Turns an inert proposal into the concrete change a visitor asked to save.
 * Nothing else in the tutor path may build a `StudyChange`: a note or flashcard
 * only exists once the visitor explicitly confirms it.
 */
export function studyChangeFor(action: ProposedNotebookAction, input: Readonly<{ id: string; at: string }>): StudyChange {
  if (action.type === "flashcard") {
    return {
      type: "flashcard.save",
      flashcard: {
        id: input.id,
        material: action.source,
        front: action.front,
        back: action.back,
        updatedAt: input.at,
        deletedAt: null,
      },
    };
  }
  return {
    type: "note.save",
    note: {
      id: input.id,
      material: action.source,
      text: `${action.title}\n\n${action.body}`,
      updatedAt: input.at,
      deletedAt: null,
    },
  };
}

/**
 * The single seam that writes a tutor proposal to the visitor's notebook. It is
 * called only from the explicit "salvar no caderno" action, never by the
 * orchestrator and never as a side effect of a model response.
 */
export async function applyProposedNotebookAction(
  workspace: StudyWorkspace,
  action: ProposedNotebookAction,
  input: Readonly<{ id?: string; at?: string }> = {},
): Promise<StudySnapshot> {
  return workspace.apply(studyChangeFor(action, {
    id: input.id ?? crypto.randomUUID(),
    at: input.at ?? new Date().toISOString(),
  }));
}
