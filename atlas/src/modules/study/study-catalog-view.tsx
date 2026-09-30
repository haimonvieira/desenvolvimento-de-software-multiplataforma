"use client";

import { useEffect } from "react";
import type { CatalogDiscipline } from "../catalog/catalog-list";
import { CatalogView, type CatalogViewMode } from "../catalog/catalog-view";
import type { Material } from "../catalog/model";
import { useCurrentStudyMaterial } from "./use-current-study-material";

export function StudyCatalogView(props: Readonly<{
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
  view: CatalogViewMode;
}>) {
  const study = useCurrentStudyMaterial();
  useEffect(() => { void study.load(); }, [study.load]);

  return (
    <>
      {study.error && <p className="study-load-error" role="status" aria-label="Estado de estudo">Não foi possível carregar seu progresso. <button type="button" disabled={study.pending} onClick={study.load}>Tentar novamente</button></p>}
      <CatalogView {...props} currentMaterial={study.currentMaterial} />
    </>
  );
}
