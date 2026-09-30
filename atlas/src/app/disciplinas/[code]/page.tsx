import Link from "next/link";

import catalog from "../../../generated/catalog.json";
import { StudyDisciplineMaterials } from "../../../modules/study/study-discipline-materials";
import { createCatalogQuery } from "../../../modules/catalog/catalog-query";
import type { CatalogData } from "../../../modules/catalog/model";

const data = catalog as CatalogData;
const query = createCatalogQuery(data);

type PageProps = Readonly<{
  params: Promise<{ code: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;


export default async function DisciplinePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const requested = await searchParams;
  const requestedSemester = typeof requested?.semester === "string" ? requested.semester : "";
  const discipline = data.disciplines.find((candidate) => candidate.code === code && candidate.semesterCode === requestedSemester);

  if (!discipline) {
    return (
      <main className="public-page public-empty" id="conteudo" tabIndex={-1}>
        <h1>Disciplina não encontrada</h1>
        <p>Confira o semestre e o código informados.</p>
        <Link href="/">Voltar ao atlas</Link>
      </main>
    );
  }

  const materials = query.browse({ semester: discipline.semesterCode, discipline: discipline.code });

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame public-shell">
        <header className="topbar public-topbar">
          <a className="brand" href={`/?semester=${discipline.semesterCode}&view=map`} aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
          <span className="public-context">{materials.length} materiais catalogados</span>
        </header>
        <main className="public-page" id="conteudo" tabIndex={-1}>
          <nav className="breadcrumbs" aria-label="Navegação estrutural">
            <a href={`/?semester=${discipline.semesterCode}&view=map`}>{discipline.semesterCode}</a><span>/</span><span aria-current="page">{discipline.code}</span>
          </nav>
          <header className="public-heading">
            <h1>{discipline.name}</h1>
            <p>{discipline.code} — navegue por pastas ou abra um material diretamente.</p>
          </header>
          <StudyDisciplineMaterials materials={materials} />
        </main>
      </div>
    </>
  );
}
