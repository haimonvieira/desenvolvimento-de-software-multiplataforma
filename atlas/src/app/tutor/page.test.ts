import { describe, expect, it } from "vitest";
import type { ReactElement } from "react";

import TutorPage from "./page";
import { TutorPanel } from "../../modules/study/tutor-panel";
import { TUTOR_CONTEXT_LIMIT } from "../../modules/tutor/study-tutor";

type Element = ReactElement<{ children?: unknown; [key: string]: unknown }>;

/** Depth-first search for the first element whose type matches. */
function findElement(node: unknown, type: unknown): Element | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findElement(child, type);
      if (found) return found;
    }
    return null;
  }
  if (!node || typeof node !== "object") return null;
  const element = node as Element;
  if (element.type === type) return element;
  return findElement(element.props?.children, type);
}

describe("/tutor page", () => {
  it("renders the panel with the semester candidates and a null sitekey without one configured", async () => {
    // `cloudflare:workers` is aliased to an empty env in tests, which is exactly
    // the preview/unconfigured case: the page must still render and pass a null
    // sitekey so the panel states the first-use gate is closed.
    const page = await TutorPage({});

    const panel = findElement(page, TutorPanel);
    expect(panel).not.toBeNull();
    const props = panel!.props as { candidates: readonly unknown[]; turnstileSiteKey: string | null };
    expect(props.turnstileSiteKey).toBeNull();
    expect(props.candidates.length).toBeGreaterThan(0);
    expect(props.candidates.length).toBeLessThanOrEqual(TUTOR_CONTEXT_LIMIT + 50);
  });

  it("honours a known semester and falls back to DSM1 for an unknown one", async () => {
    const known = await TutorPage({ searchParams: Promise.resolve({ semester: "DSM2" }) });
    const unknown = await TutorPage({ searchParams: Promise.resolve({ semester: "DSM9" }) });

    const knownPanel = findElement(known, TutorPanel)!.props as { candidates: { path: string }[] };
    const unknownPanel = findElement(unknown, TutorPanel)!.props as { candidates: { path: string }[] };

    expect(knownPanel.candidates.every((ref) => ref.path.startsWith("DSM2/"))).toBe(true);
    expect(unknownPanel.candidates.every((ref) => ref.path.startsWith("DSM1/"))).toBe(true);
  });
});
