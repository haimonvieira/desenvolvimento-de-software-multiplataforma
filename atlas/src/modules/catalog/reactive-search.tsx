"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Reactive search feedback: the server already renders results for `?q=`,
 * but the form only commits on submit. Typing into a bare form therefore
 * gives no response until Enter, which reads as breakage on the catalog's
 * most-used control. This wrapper updates the same URL as the user types
 * (debounced, no scroll jump) and keeps the form working unchanged for
 * no-JS and Enter submissions. It also owns the "/" accelerator that
 * focuses the input from anywhere on the page.
 */
export function ReactiveSearch({ initialQuery, semester, view }: Readonly<{ initialQuery: string; semester: string; view: string }>) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const trimmed = value.trim();
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      params.set("semester", semester);
      params.set("view", view);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [value, semester, view, router]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <form
      className="search"
      role="search"
      action="/"
      method="get"
      onSubmit={(event) => {
        // Commit immediately on Enter; the debounce would otherwise race the submit.
        event.preventDefault();
        const trimmed = value.trim();
        const params = new URLSearchParams();
        if (trimmed) params.set("q", trimmed);
        params.set("semester", semester);
        params.set("view", view);
        router.replace(`/?${params.toString()}`, { scroll: false });
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
      <label className="sr-only" htmlFor="catalog-search">Buscar no catálogo</label>
      <input
        id="catalog-search"
        ref={inputRef}
        name="q"
        type="search"
        minLength={1}
        maxLength={120}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Busque por disciplina, aula ou arquivo (/ para focar)"
      />
      <input name="semester" type="hidden" value={semester} />
      <input name="view" type="hidden" value={view} />
    </form>
  );
}
