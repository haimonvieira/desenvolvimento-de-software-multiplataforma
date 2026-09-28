"use client";

import { useEffect, useState } from "react";
import type { CatalogDiscipline } from "../catalog/catalog-list";
import { CatalogView, type CatalogViewMode } from "../catalog/catalog-view";
import type { Material, MaterialRef } from "../catalog/model";
import { createIndexedDbStudyWorkspace } from "./indexed-db-study-store";

export function StudyCatalogView(props: Readonly<{
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
  view: CatalogViewMode;
}>) {
  const [currentMaterial, setCurrentMaterial] = useState<MaterialRef | null>(null);

  useEffect(() => {
    createIndexedDbStudyWorkspace().load().then(({ currentMaterial: current }) => setCurrentMaterial(current)).catch(() => setCurrentMaterial(null));
  }, []);

  return <CatalogView {...props} currentMaterial={currentMaterial} />;
}
