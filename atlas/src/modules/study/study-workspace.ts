import type { StudyChange, StudySnapshot } from "./model";

export interface StudyWorkspace {
  load(): Promise<StudySnapshot>;
  apply(change: StudyChange): Promise<StudySnapshot>;
}
