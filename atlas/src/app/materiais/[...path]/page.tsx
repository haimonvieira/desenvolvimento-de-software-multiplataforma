import catalog from "../../../generated/catalog.json";
import { createCatalogQuery } from "../../../modules/catalog/catalog-query";
import { materialPathCandidates } from "../../../modules/catalog/material-path";
import { MaterialPreview } from "../../../modules/catalog/material-preview";
import type { CatalogData } from "../../../modules/catalog/model";

const data = catalog as CatalogData;
const query = createCatalogQuery(data);

type PageProps = Readonly<{
  params: Promise<{ path: string[] }>;
}>;

function formatBytes(size: number): string {
  if (size < 1_024) return `${size} B`;
  if (size < 1_048_576) return `${(size / 1_024).toFixed(1)} KB`;
  return `${(size / 1_048_576).toFixed(1)} MB`;
}

export default async function MaterialPage({ params }: PageProps) {
  const segments = (await params).path;
  const material = materialPathCandidates(segments)
    .map((path) => query.getMaterial({ path, commitSha: data.commitSha }))
    .find((candidate) => candidate !== null) ?? null;

  if (!material) {
    return (
      <main className="public-page public-empty" id="conteudo">
        <h1>Material não encontrado</h1>
        <p>O caminho não pertence ao catálogo publicado.</p>
        <a href="/">Voltar ao atlas</a>
      </main>
    );
  }

  const discipline = data.disciplines.find((candidate) => candidate.code === material.disciplineCode && candidate.semesterCode === material.semesterCode);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame public-shell">
        <header className="topbar public-topbar">
          <a className="brand" href={`/?semester=${material.semesterCode}&view=map`} aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
          <span className="public-context">Commit {material.ref.commitSha.slice(0, 7)}</span>
        </header>
        <main className="public-page" id="conteudo">
          <nav className="breadcrumbs" aria-label="Navegação estrutural">
            <a href={`/?semester=${material.semesterCode}&view=map`}>{material.semesterCode}</a><span>/</span>
            <a href={`/disciplinas/${encodeURIComponent(material.disciplineCode)}?semester=${encodeURIComponent(material.semesterCode)}`}>{material.disciplineCode}</a><span>/</span>
            <span aria-current="page">{material.name}</span>
          </nav>
          <header className="material-heading">
            <div>
              <h1>{material.name}</h1>
              <p>{discipline?.name ?? material.disciplineCode}</p>
            </div>
            <dl>
              <div><dt>Formato</dt><dd>{material.extension.slice(1).toUpperCase() || "Arquivo"}</dd></div>
              <div><dt>Tamanho</dt><dd>{formatBytes(material.size)}</dd></div>
            </dl>
          </header>
          <MaterialPreview material={material} />
        </main>
      </div>
    </>
  );
}
