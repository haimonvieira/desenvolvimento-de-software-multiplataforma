"use client";

import { useEffect, useState } from "react";
import { MaterialLink } from "../catalog/catalog-list";
import type { Material } from "../catalog/model";
import { createIndexedDbStudyWorkspace } from "./indexed-db-study-store";

export function StudyMaterialLink({ material }: Readonly<{ material: Material }>) {
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    createIndexedDbStudyWorkspace().load().then(({ currentMaterial }) => {
      setCurrent(currentMaterial?.path === material.ref.path && currentMaterial.commitSha === material.ref.commitSha);
    });
  }, [material.ref.commitSha, material.ref.path]);

  return <span className="study-material-link"><MaterialLink material={material} />{current && <span className="current-marker">Você está aqui</span>}</span>;
}
