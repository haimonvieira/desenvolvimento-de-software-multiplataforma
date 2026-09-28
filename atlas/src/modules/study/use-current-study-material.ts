"use client";

import { useCallback, useMemo, useState } from "react";
import type { MaterialRef } from "../catalog/model";
import { createIndexedDbStudyWorkspace } from "./indexed-db-study-store";

export function useCurrentStudyMaterial() {
  const workspace = useMemo(() => createIndexedDbStudyWorkspace(), []);
  const [currentMaterial, setCurrentMaterial] = useState<MaterialRef | null>(null);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const load = useCallback(async () => {
    setPending(true);
    setError(false);
    try {
      setCurrentMaterial((await workspace.load()).currentMaterial);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }, [workspace]);

  return { currentMaterial, error, pending, load };
}
