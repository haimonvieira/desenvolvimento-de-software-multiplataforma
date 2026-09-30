"use client";

import { useEffect } from "react";
import { MaterialLink } from "../catalog/catalog-list";
import type { Material } from "../catalog/model";
import { useCurrentStudyMaterial } from "./use-current-study-material";

export function StudyDisciplineMaterials({ materials }: Readonly<{ materials: readonly Material[] }>) {
  const study = useCurrentStudyMaterial();
  useEffect(() => { void study.load(); }, [study.load]);
  const groups = Map.groupBy(materials, (material) => material.ref.path.split("/").slice(2, -1)[0] || "Materiais gerais");

  return (
    <>
      {study.error && <p className="study-load-error" role="status" aria-label="Estado de estudo">Não foi possível carregar seu progresso. <button type="button" disabled={study.pending} onClick={study.load}>Tentar novamente</button></p>}
      <div className="material-groups">
        {[...groups].map(([name, entries]) => (
          <section className="material-group" key={name}>
            <header><h2>{name}</h2><span>{entries.length} {entries.length === 1 ? "arquivo" : "arquivos"}</span></header>
            <ul>
              {entries.map((material) => {
                const current = study.currentMaterial?.path === material.ref.path && study.currentMaterial.commitSha === material.ref.commitSha;
                return (
                  <li key={material.ref.path}>
                    <span className="file-type">{material.extension.slice(1).toUpperCase() || "FILE"}</span>
                    <span className="study-material-link"><MaterialLink material={material} />{current && <span className="current-marker">Você está aqui</span>}</span>
                    <small>{material.ref.path.split("/").slice(2, -1).join(" / ") || "Raiz da disciplina"}</small>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
