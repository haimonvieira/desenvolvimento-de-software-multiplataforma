"use client";

import { useEffect, useState } from "react";

export function TextPreview({ active, name, url }: Readonly<{ active: boolean; name: string; url: string }>) {
  const [text, setText] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => response.ok ? response.text() : Promise.reject(new Error("preview unavailable")))
      .then(setText)
      .catch(() => setText(undefined));
    return () => controller.abort();
  }, [url]);

  if (text === undefined) return <p role="status">Carregando pré-visualização segura de {name}…</p>;

  return (
    <section className="text-preview" aria-labelledby="text-preview-title">
      <h2 id="text-preview-title">Conteúdo do arquivo</h2>
      {active ? <p>Exibido como texto inerte por segurança; o conteúdo não é executado.</p> : null}
      <pre data-material-preview="text"><code>{text}</code></pre>
    </section>
  );
}
