import { describe, expect, it } from "vitest";

import catalog from "../../generated/catalog.json";
import { createCatalogQuery } from "../catalog/catalog-query";
import type { CatalogData, MaterialRef } from "../catalog/model";
import { indexFormatFor } from "../tutor/model";
import { TUTOR_CONTEXT_LIMIT } from "../tutor/study-tutor";
import { selectTutorContext, tutorCandidates } from "./tutor-context";

const data = catalog as CatalogData;
const catalogQuery = createCatalogQuery(data);

const semesterMaterials = catalogQuery.browse({ semester: "DSM1" });
const candidates = tutorCandidates(semesterMaterials);

function ref(path: string, commitSha = "a".repeat(40)): MaterialRef {
  return { path, commitSha };
}

function snapshot(overrides: Partial<Parameters<typeof selectTutorContext>[1]> = {}) {
  return {
    currentMaterial: null,
    progress: [],
    favorites: [],
    notes: [],
    flashcards: [],
    ...overrides,
  };
}

describe("tutor candidates", () => {
  it("offers only materials the indexer can make retrievable", () => {
    expect(candidates.length).toBeGreaterThan(0);
    for (const candidate of candidates) {
      const material = semesterMaterials.find((entry) => entry.ref.path === candidate.path);
      expect(material).toBeDefined();
      expect(indexFormatFor(material!.extension)).not.toBeNull();
    }
    expect(candidates.some((candidate) => candidate.path.endsWith(".pdf"))).toBe(false);
  });

  it("caps the candidate list so the page payload stays bounded", () => {
    expect(candidates.length).toBeLessThanOrEqual(60);
    expect(tutorCandidates(semesterMaterials, 3)).toHaveLength(3);
  });
});

describe("tutor context selection", () => {
  it("never exceeds the turn route's context limit", () => {
    const selected = selectTutorContext(candidates, snapshot());
    expect(selected.length).toBe(TUTOR_CONTEXT_LIMIT);
    expect(selected.every((chosen) => candidates.some((candidate) => candidate.path === chosen.path))).toBe(true);
  });

  it("prefers the materials the visitor is actually studying", () => {
    const studying = candidates[5]!;
    const favorite = candidates[7]!;
    const selected = selectTutorContext(candidates, snapshot({
      currentMaterial: studying,
      progress: [{ id: "p1", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null, material: favorite, status: "studying" }],
    }));

    expect(selected[0]).toEqual(studying);
    expect(selected[1]).toEqual(favorite);
  });

  it("drops studied refs the page did not offer and fills from candidates", () => {
    const outside = ref("DSM9/NOPE/fora.md");
    const selected = selectTutorContext(candidates, snapshot({
      currentMaterial: outside,
      progress: [{ id: "p1", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null, material: outside, status: "done" }],
    }));

    expect(selected.some((chosen) => chosen.path === outside.path)).toBe(false);
    expect(selected).toHaveLength(TUTOR_CONTEXT_LIMIT);
  });

  it("ignores untouched progress entries and unfavorited records", () => {
    const untouched = candidates[9]!;
    const unfavorited = candidates[8]!;
    const selected = selectTutorContext(candidates, snapshot({
      progress: [{ id: "p1", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null, material: untouched, status: "new" }],
      favorites: [{ id: "f1", updatedAt: "2026-09-28T10:00:00.000Z", deletedAt: null, material: unfavorited, value: false }],
    }));

    expect(selected).toEqual(candidates.slice(0, TUTOR_CONTEXT_LIMIT));
  });

  it("returns nothing when the semester has no indexable material", () => {
    expect(selectTutorContext([], snapshot({ currentMaterial: ref("DSM1/ALP/introducao.md") }))).toEqual([]);
  });
});
