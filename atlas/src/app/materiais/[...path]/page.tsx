import Link from "next/link";
import { headers } from "next/headers";

import catalog from "../../../generated/catalog.json";
import { env } from "cloudflare:workers";
import { createCatalogQuery } from "../../../modules/catalog/catalog-query";
import { materialPathCandidates } from "../../../modules/catalog/material-path";
import { MaterialPreview } from "../../../modules/catalog/material-preview";
import { MaterialStudyControls } from "../../../modules/study/material-study-controls";
import { TutorFloatingChat } from "../../../modules/study/tutor-floating-chat";
import { tutorCandidates } from "../../../modules/study/tutor-context";
import type { CatalogData } from "../../../modules/catalog/model";

const data = catalog as CatalogData;
const query = createCatalogQuery(data);

type MaterialEnv = { TURNSTILE_SITE_KEY?: string };

type PageProps = Readonly<{
  params: Promise<{ path: string[] }>;
}>;

function formatBytes(size: number): string {
  if (size < 1_024) return `${size} B`;
  if (size < 1_048_576) return `${(size / 1_024).toFixed(1)} KB`;
  return `${(size / 1_048_576).toFixed(1)} MB`;
}

/**
 * The Office embed needs an absolute URL, so it needs the deployment origin.
 * It comes from the request rather than `BETTER_AUTH_URL`: importing the auth
 * module runs `createAuth` at module scope, which rejects a non-HTTPS base URL,
 * and that would take down a public reading page in every local run.
 */
function requestOrigin(requestHeaders: Headers): string {
  const host = requestHeaders.get("host") ?? "localhost";
  return `${requestHeaders.get("x-forwarded-proto") ?? "https"}://${host}`;
}

export default async function MaterialPage({ params }: PageProps) {
  const segments = (await params).path;
  const origin = requestOrigin(await headers());
  const material = materialPathCandidates(segments)
    .map((path) => query.getMaterial({ path, commitSha: data.commitSha }))
    .find((candidate) => candidate !== null) ?? null;

  if (!material) {
    return (
      <main className="public-page public-empty" id="conteudo" tabIndex={-1}>
        <h1>Material não encontrado</h1>
        <p>O caminho não pertence ao catálogo publicado.</p>
        <Link href="/">Voltar ao atlas</Link>
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
        <main className="public-page" id="conteudo" tabIndex={-1}>
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
          <MaterialPreview material={material} origin={origin} />
          <MaterialStudyControls material={material.ref} />
        </main>
      </div>
      <TutorFloatingChat
        candidates={tutorCandidates(query.browse({ semester: material.semesterCode }))}
        turnstileSiteKey={(env as MaterialEnv).TURNSTILE_SITE_KEY ?? null}
      />
    </>
  );
}
