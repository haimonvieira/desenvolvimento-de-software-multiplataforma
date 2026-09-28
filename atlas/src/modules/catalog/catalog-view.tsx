import { AtlasMap } from "./atlas-map";
import { CatalogList, type CatalogDiscipline } from "./catalog-list";

export type CatalogViewMode = "map" | "list";

export function CatalogView({ disciplines, semester, view }: Readonly<{
  disciplines: readonly CatalogDiscipline[];
  semester: string;
  view: CatalogViewMode;
}>) {
  return view === "list"
    ? <CatalogList disciplines={disciplines} semester={semester} />
    : <AtlasMap disciplines={disciplines} semester={semester} />;
}
