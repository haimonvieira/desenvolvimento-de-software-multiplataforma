import catalog from "../../../generated/catalog.json";
import { StudyMaterialLink } from "../../../modules/study/study-material-link";
import { createCatalogQuery } from "../../../modules/catalog/catalog-query";
import type { CatalogData, Material } from "../../../modules/catalog/model";

const data = catalog as CatalogData;
const query = createCatalogQuery(data);

type PageProps = Readonly<{
  params: Promise<{ code: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

function groupName(material: Material): string {
  const relative = material.ref.path.split("/").slice(2, -1);
  return relative[0] || "Materiais gerais";
}

export default async function DisciplinePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const requested = await searchParams;
  const requestedSemester = typeof requested?.semester === "string" ? requested.semester : "";
  const discipline = data.disciplines.find((candidate) => candidate.code === code && candidate.semesterCode === requestedSemester);

  if (!discipline) {
    return (
      <main className="public-page public-empty" id="conteudo">
        <h1>Disciplina não encontrada</h1>
        <p>Confira o semestre e o código informados.</p>
        <a href="/">Voltar ao atlas</a>
      </main>
    );
  }

  const materials = query.browse({ semester: discipline.semesterCode, discipline: discipline.code });
  const groups = Map.groupBy(materials, groupName);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame public-shell">
        <header className="topbar public-topbar">
          <a className="brand" href={`/?semester=${discipline.semesterCode}&view=map`} aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
          <span className="public-context">{materials.length} materiais catalogados</span>
        </header>
        <main className="public-page" id="conteudo">
          <nav className="breadcrumbs" aria-label="Navegação estrutural">
            <a href={`/?semester=${discipline.semesterCode}&view=map`}>{discipline.semesterCode}</a><span>/</span><span aria-current="page">{discipline.code}</span>
          </nav>
          <header className="public-heading">
            <h1>{discipline.name}</h1>
            <p>{discipline.code} — navegue por pastas ou abra um material diretamente.</p>
          </header>
          <div className="material-groups">
            {[...groups].map(([name, entries]) => (
              <section className="material-group" key={name}>
                <header><h2>{name}</h2><span>{entries.length} {entries.length === 1 ? "arquivo" : "arquivos"}</span></header>
                <ul>
                  {entries.map((material) => (
                    <li key={material.ref.path}>
                      <span className="file-type">{material.extension.slice(1).toUpperCase() || "FILE"}</span>
                      <StudyMaterialLink material={material} />
                      <small>{material.ref.path.split("/").slice(2, -1).join(" / ") || "Raiz da disciplina"}</small>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
