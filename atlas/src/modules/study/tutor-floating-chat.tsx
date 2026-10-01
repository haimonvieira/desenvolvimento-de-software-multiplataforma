"use client";

import { useState } from "react";
import { TutorPanel } from "./tutor-panel";
import type { MaterialRef } from "../catalog/model";

/**
 * The tutor as a floating sheet, available from every public page. The FAB is
 * the tutor's single footprint when closed — one control, fixed corner, on the
 * catalog's own paper. Opening mounts the existing TutorPanel inside an
 * anchored sheet (52% of the viewport, not a full-screen takeover), so the
 * catalog stays visible and navigable above it. The full /tutor page remains
 * the destination for a roomier session; this is the always-at-hand version.
 *
 * `candidates` and `turnstileSiteKey` come from the host page's server render,
 * exactly as the /tutor page passes them — the panel builds the same context
 * either way.
 */
export function TutorFloatingChat({ candidates, turnstileSiteKey }: Readonly<{
  candidates: readonly MaterialRef[];
  turnstileSiteKey: string | null;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div className="tutor-sheet" role="dialog" aria-label="Tutor de estudo">
          <header className="tutor-sheet-head">
            <span className="tutor-sheet-title">Tutor de estudo</span>
            <button type="button" className="tutor-sheet-close" aria-label="Fechar tutor" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="tutor-sheet-body">
            <TutorPanel candidates={candidates} turnstileSiteKey={turnstileSiteKey} />
          </div>
        </div>
      ) : (
        <button type="button" className="tutor-fab" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" /></svg>
          Perguntar ao tutor
        </button>
      )}
    </>
  );
}
