import { OFFICE_PREVIEW_EXTENSIONS } from "./material-asset";
import type { Material } from "./model";
import { TextPreview } from "./text-preview";

const ACTIVE_EXTENSIONS: Readonly<Record<string, true>> = { ".html": true, ".js": true, ".jsx": true, ".svg": true, ".tsx": true };

const OFFICE_VIEWER = "https://view.officeapps.live.com/op/embed.aspx?src=";
const FALLBACK_REASON = "Pré-visualização indisponível para este formato.";

function githubUrl(material: Material): string {
  const encodedPath = material.ref.path.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/blob/${encodeURIComponent(material.ref.commitSha)}/${encodedPath}`;
}

/**
 * Office Online fetches the document itself, so it needs an absolute URL —
 * the caller supplies the deployment origin (BETTER_AUTH_URL).
 */
function officeEmbedUrl(origin: string, assetUrl: string): string {
  return `${OFFICE_VIEWER}${encodeURIComponent(origin + assetUrl)}`;
}

function MaterialActions({ material }: Readonly<{ material: Material }>) {
  return (
    <div className="material-actions">
      <a className="primary-action" href={material.downloadUrl} download>Baixar arquivo</a>
      <a href={githubUrl(material)} rel="noreferrer" target="_blank">Ver no GitHub</a>
    </div>
  );
}

/** The fallback copy without actions, so a branch can place it where it fits. */
function FallbackCopy({ reason }: Readonly<{ reason: string }>) {
  return (
    <>
      <h2 id="preview-fallback-title">{reason}</h2>
      <p>O arquivo pode ser baixado ou consultado no repositório no commit catalogado.</p>
    </>
  );
}

export function MaterialPreview({ material, origin }: Readonly<{ material: Material; origin: string }>) {
  const label = `Pré-visualização de ${material.name}`;

  if (material.previewKind === "image" && material.extension !== ".svg") {
    return (
      <section className="native-preview" aria-label={label}>
        <img data-material-preview="image" src={material.assetUrl} alt={label} referrerPolicy="no-referrer" />
        <a className="image-open" href={material.assetUrl} rel="noreferrer" target="_blank">Abrir em tamanho real</a>
        <MaterialActions material={material} />
      </section>
    );
  }

  if (material.previewKind === "pdf") {
    return (
      <section className="native-preview" aria-label={label}>
        <object data-material-preview="pdf" data={material.assetUrl} type="application/pdf">
          <div className="preview-fallback"><FallbackCopy reason="Seu navegador não exibiu este PDF." /></div>
        </object>
        <MaterialActions material={material} />
      </section>
    );
  }

  if (material.previewKind === "office" && OFFICE_PREVIEW_EXTENSIONS[material.extension]) {
    return (
      <section className="native-preview" aria-label={label}>
        <iframe data-material-preview="office" src={officeEmbedUrl(origin, material.assetUrl)} title={label}>
          <div className="preview-fallback"><FallbackCopy reason="O visualizador do Office não carregou este documento." /></div>
        </iframe>
        <MaterialActions material={material} />
      </section>
    );
  }

  if (material.previewKind === "text" && material.previewUrl) {
    return (
      <>
        {material.previewTruncated ? (
          <p className="preview-truncated">O arquivo excede o limite de pré-visualização; o conteúdo abaixo está cortado. Baixe o arquivo para ver o conteúdo completo.</p>
        ) : null}
        <TextPreview active={Boolean(ACTIVE_EXTENSIONS[material.extension])} name={material.name} url={material.previewUrl} />
        <MaterialActions material={material} />
      </>
    );
  }

  return (
    <section className="preview-fallback" aria-labelledby="preview-fallback-title">
      <FallbackCopy reason={material.previewKind === "text" ? "Pré-visualização bloqueada por segurança ou indisponível." : FALLBACK_REASON} />
      <MaterialActions material={material} />
    </section>
  );
}
