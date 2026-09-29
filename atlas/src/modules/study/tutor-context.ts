import type { Material, MaterialRef } from "../catalog/model";
import type { StudySnapshot } from "./model";
import { TUTOR_CONTEXT_LIMIT } from "../tutor/study-tutor";
import { indexFormatFor } from "../tutor/model";

/**
 * How many indexable materials a page hands to the panel as candidates. The
 * panel then narrows them to what the visitor is actually studying and caps the
 * turn to `TUTOR_CONTEXT_LIMIT`; the candidate list is only a payload bound, not
 * a second context limit.
 */
export const TUTOR_CANDIDATE_LIMIT = 60;

/**
 * The materials the visitor is actually studying, in the order a turn should
 * prefer them: the material open right now, then materials with progress,
 * favorites, notes and flashcards, then the remaining candidates as a fallback
 * so a first-time visitor still has something to ask about.
 *
 * Every returned ref is one of `candidates`, so the page can only offer
 * materials the build-time index actually made retrievable, and the result is
 * never longer than `TUTOR_CONTEXT_LIMIT` — the same bound the turn route
 * validates against.
 */
export function selectTutorContext(
  candidates: readonly MaterialRef[],
  snapshot: Pick<StudySnapshot, "currentMaterial" | "progress" | "favorites" | "notes" | "flashcards"> | null,
  limit: number = TUTOR_CONTEXT_LIMIT,
): readonly MaterialRef[] {
  const available = new Set(candidates.map((ref) => `${ref.commitSha}\0${ref.path}`));
  const selected: MaterialRef[] = [];
  const add = (ref: MaterialRef | null | undefined) => {
    if (!ref || selected.length >= limit) return;
    const key = `${ref.commitSha}\0${ref.path}`;
    if (!available.has(key)) return;
    if (selected.some((chosen) => `${chosen.commitSha}\0${chosen.path}` === key)) return;
    selected.push(ref);
  };

  add(snapshot?.currentMaterial);
  for (const record of snapshot?.progress ?? []) {
    if (record.status !== "new") add(record.material);
  }
  for (const record of snapshot?.favorites ?? []) {
    if (record.value) add(record.material);
  }
  for (const record of snapshot?.notes ?? []) add(record.material);
  for (const record of snapshot?.flashcards ?? []) add(record.material);
  for (const ref of candidates) add(ref);

  return Object.freeze(selected);
}

/**
 * The candidate list the tutor page builds for one semester: only materials the
 * indexer can turn into retrievable text, in the catalog's stable order, capped
 * so the page payload stays bounded.
 */
export function tutorCandidates(materials: readonly Material[], limit: number = TUTOR_CANDIDATE_LIMIT): readonly MaterialRef[] {
  const refs: MaterialRef[] = [];
  for (const material of materials) {
    if (refs.length >= limit) break;
    if (indexFormatFor(material.extension) === null) continue;
    refs.push(material.ref);
  }
  return Object.freeze(refs);
}
