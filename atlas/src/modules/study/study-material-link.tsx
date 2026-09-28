"use client";

import { useEffect } from "react";
import { MaterialLink } from "../catalog/catalog-list";
import type { Material } from "../catalog/model";
import { useCurrentStudyMaterial } from "./use-current-study-material";

export function StudyMaterialLink({ material }: Readonly<{ material: Material }>) {
  const study = useCurrentStudyMaterial();
  useEffect(() => { void study.load(); }, [study.load]);
  const current = study.currentMaterial?.path === material.ref.path && study.currentMaterial.commitSha === material.ref.commitSha;

  return (
    <span className="study-material-link">
      <MaterialLink material={material} />
      {current && <span className="current-marker">Você está aqui</span>}
      {study.error && <span className="study-load-error" role="status" aria-label="Estado de estudo">Não foi possível carregar seu progresso. <button type="button" disabled={study.pending} onClick={study.load}>Tentar novamente</button></span>}
    </span>
  );
}
