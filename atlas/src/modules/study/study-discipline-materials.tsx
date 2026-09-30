"use client";

import { useEffect, type CSSProperties } from "react";
import { MaterialLink } from "../catalog/catalog-list";
import { buildMaterialTree, type MaterialFolder } from "../catalog/material-tree";
import type { Material, MaterialRef } from "../catalog/model";
import { useCurrentStudyMaterial } from "./use-current-study-material";

type FolderEntry = Readonly<{ key: string; folder: MaterialFolder }>;

function flattenFolders(folder: MaterialFolder, parentKey = ""): readonly FolderEntry[] {
  const entries: FolderEntry[] = [];
  for (const child of folder.folders) {
    const key = parentKey ? `${parentKey}/${child.name}` : child.name;
    entries.push({ key, folder: child }, ...flattenFolders(child, key));
  }
  return entries;
}

function MaterialFolderSection({ entry, currentMaterial }: Readonly<{ entry: FolderEntry; currentMaterial: MaterialRef | null }>) {
  const { folder } = entry;
  const files = folder.materials.length === 1 ? "1 arquivo" : `${folder.materials.length} arquivos`;
  return (
    <section className="material-group" style={{ "--depth": folder.depth } as CSSProperties} aria-label={`${folder.name}, ${files}`}>
      <header><h2>{folder.name}</h2><span>{files}</span></header>
      <ul>
        {folder.materials.map((material) => {
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
    </section>
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
      <div className="material-groups">
        {tree.materials.length > 0 && <MaterialFolderSection entry={{ key: rootFiles.name, folder: rootFiles }} currentMaterial={study.currentMaterial} />}
        {flattenFolders(tree).map((entry) => <MaterialFolderSection key={entry.key} entry={entry} currentMaterial={study.currentMaterial} />)}
      </div>
    </>
  );
}
