import type { Material } from "./model";
import { TextPreview } from "./text-preview";

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

export async function MaterialPreview({ material }: Readonly<{ material: Material }>) {
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
    return material.previewUrl
      ? <TextPreview active={Boolean(ACTIVE_EXTENSIONS[material.extension])} name={material.name} url={material.previewUrl} />
      : <PreviewFallback material={material} reason="Pré-visualização bloqueada por segurança ou indisponível." />;
  }

  return <PreviewFallback material={material} />;
}
