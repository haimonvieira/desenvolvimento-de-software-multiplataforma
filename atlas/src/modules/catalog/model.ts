export type MaterialRef = Readonly<{ path: string; commitSha: string }>;

export type MaterialKind = "document" | "code" | "image" | "archive" | "other";
export type PreviewKind = "text" | "image" | "pdf" | "none";

export type Material = Readonly<{
  ref: MaterialRef;
  name: string;
  extension: string;
  size: number;
  disciplineCode: string;
  semesterCode: string;
  kind: MaterialKind;
  downloadUrl: string;
  previewKind: PreviewKind;
}>;

export type Semester = Readonly<{ code: string; name: string }>;
export type Discipline = Readonly<{
  code: string;
  name: string;
  semesterCode: string;
}>;

export type CatalogData = Readonly<{
  commitSha: string;
  semesters: readonly Semester[];
  disciplines: readonly Discipline[];
  materials: readonly Material[];
}>;

export type CatalogSelection = Readonly<{
  semester?: string;
  discipline?: string;
}>;

export type SearchPage = Readonly<{
  items: readonly Material[];
  nextCursor?: string;
}>;

export interface CatalogQuery {
  browse(selection: CatalogSelection): readonly Material[];
  search(query: string, cursor?: string): SearchPage;
  getMaterial(ref: MaterialRef): Material | null;
}
