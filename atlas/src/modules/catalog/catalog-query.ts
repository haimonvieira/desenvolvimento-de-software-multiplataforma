import type {
  CatalogData,
  CatalogQuery,
  CatalogSelection,
  Discipline,
  Material,
  MaterialRef,
  SearchPage,
  Semester,
} from "./model";

const PAGE_SIZE = 30;

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function freezeMaterial(material: Material): Material {
  return Object.freeze({ ...material, ref: Object.freeze({ ...material.ref }) });
}

function decodeCursor(cursor?: string): number {
  if (!cursor || !/^[A-Za-z0-9_-]+$/.test(cursor)) return 0;
  try {
    const base64 = cursor.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(cursor.length / 4) * 4, "=");
    const decoded = atob(base64);
    return /^\d+$/.test(decoded) ? Number(decoded) : 0;
  } catch {
    return 0;
  }
}

export function createCatalogQuery(source: CatalogData): CatalogQuery {
  const materials = Object.freeze(source.materials.map(freezeMaterial));
  const semesters = new Map<string, Semester>(source.semesters.map((semester) => [semester.code, semester]));
  const disciplines = new Map<string, Discipline>(source.disciplines.map((discipline) => [
    `${discipline.semesterCode}/${discipline.code}`,
    discipline,
  ]));
  const byRef = new Map(materials.map((material) => [
    `${material.ref.commitSha}\0${material.ref.path}`,
    material,
  ]));

  return Object.freeze({
    browse(selection: CatalogSelection): readonly Material[] {
      return Object.freeze(materials.filter((material) =>
        (!selection.semester || material.semesterCode === selection.semester)
        && (!selection.discipline || material.disciplineCode === selection.discipline),
      ));
    },

    search(query: string, cursor?: string): SearchPage {
      const needle = normalize(query);
      const matches = materials.filter((material) => {
        const semesterName = semesters.get(material.semesterCode)?.name ?? "";
        const disciplineName = disciplines.get(`${material.semesterCode}/${material.disciplineCode}`)?.name ?? "";
        return normalize(`${material.name} ${material.ref.path} ${semesterName} ${disciplineName}`).includes(needle);
      });
      const offset = decodeCursor(cursor);
      const items = Object.freeze(matches.slice(offset, offset + PAGE_SIZE));
      const nextOffset = offset + items.length;
      return Object.freeze({
        items,
        ...(nextOffset < matches.length
          ? { nextCursor: btoa(String(nextOffset)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") }
          : {}),
      });
    },

    getMaterial(ref: MaterialRef): Material | null {
      return byRef.get(`${ref.commitSha}\0${ref.path}`) ?? null;
    },
  });
}
