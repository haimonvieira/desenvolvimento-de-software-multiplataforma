import type { Material } from "./model";
import { AtlasMap } from "./atlas-map";
import { CatalogList, type CatalogDiscipline } from "./catalog-list";

export type CatalogViewMode = "map" | "list";

export function CatalogView({ disciplines, materials, semester, view }: Readonly<{
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
  view: CatalogViewMode;
}>) {
  return view === "list"
    ? <CatalogList disciplines={disciplines} materials={materials} semester={semester} />
    : <AtlasMap disciplines={disciplines} materials={materials} semester={semester} />;
}
