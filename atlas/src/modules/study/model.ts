import type { MaterialRef } from "../catalog/model";

export type StudyRecord = Readonly<{
  id: string;
  updatedAt: string;
  deletedAt: string | null;
}>;

export type Progress = StudyRecord & Readonly<{
  material: MaterialRef;
  status: "new" | "studying" | "done";
}>;

export type Favorite = StudyRecord & Readonly<{
  material: MaterialRef;
  value: boolean;
}>;

export type Note = StudyRecord & Readonly<{
  material: MaterialRef;
  text: string;
}>;

export type Flashcard = StudyRecord & Readonly<{
  material: MaterialRef;
  front: string;
  back: string;
}>;

export type StudyChange =
  | { type: "progress.set"; material: MaterialRef; status: Progress["status"]; at: string }
  | { type: "favorite.set"; material: MaterialRef; value: boolean; at: string }
  | { type: "note.save"; note: Note }
  | { type: "flashcard.save"; flashcard: Flashcard }
  | { type: "item.delete"; entity: "note" | "flashcard"; id: string; at: string };

export type OutboxEntry = StudyRecord & Readonly<{ change: StudyChange }>;
export type NoteConflict = Readonly<{
  id: string;
  noteId: string;
  versions: readonly [Note, Note];
}>;


export type StudySnapshot = Readonly<{
  progress: readonly Progress[];
  favorites: readonly Favorite[];
  notes: readonly Note[];
  flashcards: readonly Flashcard[];
  outbox: readonly OutboxEntry[];
  conflicts: readonly NoteConflict[];
  currentMaterial: MaterialRef | null;
}>;
