import type { Material } from "./model";

const TEXT_LIMIT = 200_000;
const ACTIVE_EXTENSIONS: Readonly<Record<string, true>> = { ".html": true, ".js": true, ".jsx": true, ".svg": true, ".tsx": true };

function githubUrl(material: Material): string {
  const encodedPath = material.ref.path.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/blob/${encodeURIComponent(material.ref.commitSha)}/${encodedPath}`;
}

function PreviewFallback({ material, reason = "Pré-visualização indisponível para este formato." }: Readonly<{ material: Material; reason?: string }>) {
  return (
    <section className="preview-fallback" aria-labelledby="preview-fallback-title">
      <h2 id="preview-fallback-title">{reason}</h2>
      <p>O arquivo pode ser baixado ou consultado no repositório no commit catalogado.</p>
      <div className="material-actions">
        <a className="primary-action" href={material.downloadUrl} download>Baixar arquivo</a>
        <a href={githubUrl(material)} rel="noreferrer" target="_blank">Ver no GitHub</a>
      </div>
    </section>
  );
}

export function MaterialPreview({ material, text }: Readonly<{ material: Material; text?: string }>) {
  if (material.previewKind === "image" && material.extension !== ".svg") {
    return (
      <figure className="native-preview">
        <img data-material-preview="image" src={material.downloadUrl} alt={`Pré-visualização de ${material.name}`} referrerPolicy="no-referrer" />
      </figure>
    );
  }

  if (material.previewKind === "pdf") {
    return (
      <section className="native-preview" aria-label={`Pré-visualização de ${material.name}`}>
        <object data-material-preview="pdf" data={material.downloadUrl} type="application/pdf">
          <PreviewFallback material={material} reason="Seu navegador não exibiu este PDF." />
        </object>
      </section>
    );
  }

  if (material.previewKind === "text") {
    const preview = text?.slice(0, TEXT_LIMIT);
    if (preview === undefined) return <PreviewFallback material={material} reason="Não foi possível carregar a pré-visualização em texto." />;
    return (
      <section className="text-preview" aria-labelledby="text-preview-title">
        <h2 id="text-preview-title">Conteúdo do arquivo</h2>
        {ACTIVE_EXTENSIONS[material.extension] ? <p>Exibido como texto inerte por segurança; o conteúdo não é executado.</p> : null}
        <pre data-material-preview="text"><code>{preview}</code></pre>
      </section>
    );
  }

  return <PreviewFallback material={material} />;
}
