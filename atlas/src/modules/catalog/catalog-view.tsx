import type { Material, MaterialRef } from "./model";
import { AtlasMap } from "./atlas-map";
import { CatalogList, type CatalogDiscipline } from "./catalog-list";

export type CatalogViewMode = "map" | "list";

export function CatalogView({ currentMaterial, disciplines, materials, semester, view }: Readonly<{
  currentMaterial?: MaterialRef | null;
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
  view: CatalogViewMode;
}>) {
  return view === "list"
    ? <CatalogList currentMaterial={currentMaterial} disciplines={disciplines} materials={materials} semester={semester} />
    : <AtlasMap currentMaterial={currentMaterial} disciplines={disciplines} materials={materials} semester={semester} />;
}
