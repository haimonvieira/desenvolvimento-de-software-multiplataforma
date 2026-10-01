"use client";

import { useEffect, type CSSProperties } from "react";
import { MaterialLink } from "../catalog/catalog-list";
import { buildMaterialTree, type MaterialFolder } from "../catalog/material-tree";
import type { Material, MaterialRef } from "../catalog/model";
import { useCurrentStudyMaterial } from "./use-current-study-material";

/** Recursive descendant count — files plus everything inside subfolders. */
function folderItemCount(folder: MaterialFolder): number {
  let count = folder.materials.length;
  for (const child of folder.folders) count += folderItemCount(child);
  return count;
}

function folderLabel(folder: MaterialFolder): string {
  const files = folder.materials.length;
  const subfolders = folder.folders.length;
  if (files === 0 && subfolders > 0) return subfolders === 1 ? "1 pasta" : `${subfolders} pastas`;
  const filePart = files === 1 ? "1 arquivo" : `${files} arquivos`;
  return subfolders > 0 ? `${filePart}, ${subfolders === 1 ? "1 pasta" : `${subfolders} pastas`}` : filePart;
}

function MaterialFileList({ materials, currentMaterial }: Readonly<{ materials: readonly Material[]; currentMaterial: MaterialRef | null }>) {
  return (
    <ul>
      {materials.map((material) => {
        const current = currentMaterial?.path === material.ref.path && currentMaterial.commitSha === material.ref.commitSha;
        return (
          <li key={material.ref.path}>
            <span className="file-type">{material.extension.slice(1).toUpperCase() || "FILE"}</span>
            <span className="study-material-link"><MaterialLink material={material} />{current && <span className="current-marker">Você está aqui</span>}</span>
            <small>{material.ref.path.split("/").slice(2, -1).join(" / ") || "Raiz da disciplina"}</small>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * One folder, rendered as a real subtree: files in a flat list, subfolders as
 * nested groups inside the same section. The old flat map turned every
 * descendant into a top-level sibling, so opening "ATV 02" revealed nothing —
 * its children lived below it as separate sections.
 */
function MaterialFolderGroup({ folder, currentMaterial }: Readonly<{ folder: MaterialFolder; currentMaterial: MaterialRef | null }>) {
  const holdsCurrent = currentMaterial !== null && folder.materials.some((material) => material.ref.path === currentMaterial.path && material.ref.commitSha === currentMaterial.commitSha);
  const collapsible = folderItemCount(folder) > 12 && !holdsCurrent;
  const style = { "--depth": folder.depth } as CSSProperties;
  const label = folderLabel(folder);
  const header = <header><h2>{folder.name}</h2><span>{label}</span></header>;
  const body = (
    <>
      {folder.materials.length > 0 && <MaterialFileList materials={folder.materials} currentMaterial={currentMaterial} />}
      {folder.folders.map((child) => <MaterialFolderGroup key={child.name} folder={child} currentMaterial={currentMaterial} />)}
    </>
  );
  if (!collapsible) {
    return (
      <section className="material-group" style={style} aria-label={`${folder.name}, ${label}`}>
        {header}
        {body}
      </section>
    );
  }
  return (
    <details className="material-group" style={style} aria-label={`${folder.name}, ${label}`}>
      <summary>{header}</summary>
      {body}
    </details>
  );
}

export function StudyDisciplineMaterials({ materials }: Readonly<{ materials: readonly Material[] }>) {
  const study = useCurrentStudyMaterial();
  useEffect(() => { void study.load(); }, [study.load]);
  const tree = buildMaterialTree(materials);
  const rootFiles: MaterialFolder = { ...tree, name: "Materiais gerais", folders: [] };

  return (
    <>
      {study.error && <p className="study-load-error" role="status" aria-label="Estado de estudo">Não foi possível carregar seu progresso. <button type="button" disabled={study.pending} onClick={study.load}>Tentar novamente</button></p>}
      {materials.length === 0 ? (
        <section className="material-groups" aria-label="Disciplina sem materiais">
          <div className="discipline-empty">
            <h2>Linha ainda sem estações</h2>
            <p>Nenhum material publicado para esta disciplina. Volte após o próximo upload.</p>
          </div>
        </section>
      ) : (
        <div className="material-groups">
          {tree.materials.length > 0 && <MaterialFolderGroup folder={rootFiles} currentMaterial={study.currentMaterial} />}
          {tree.folders.map((child) => <MaterialFolderGroup key={child.name} folder={child} currentMaterial={study.currentMaterial} />)}
        </div>
      )}
    </>
  );
}
