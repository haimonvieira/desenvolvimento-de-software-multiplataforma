import catalog from "../generated/catalog.json";
import { createCatalogQuery } from "../modules/catalog/catalog-query";
import { type CatalogViewMode } from "../modules/catalog/catalog-view";
import { StudyCatalogView } from "../modules/study/study-catalog-view";
import type { CatalogData } from "../modules/catalog/model";

const data = catalog as CatalogData;
const catalogQuery = createCatalogQuery(data);
const knownSemesters = data.semesters.map(({ code }) => code);
const latestSemester = knownSemesters.at(-1) ?? "DSM1";

type HomeProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function Home({ searchParams }: HomeProps) {
  const requested = await searchParams;
  const semesterValue = typeof requested?.semester === "string" ? requested.semester : undefined;
  const viewValue = typeof requested?.view === "string" ? requested.view : undefined;
  const searchValue = typeof requested?.q === "string" ? requested.q.trim() : "";
  const semester = knownSemesters.includes(semesterValue ?? "") ? semesterValue! : latestSemester;
  const view: CatalogViewMode = viewValue === "list" ? "list" : "map";
  const materials = catalogQuery.browse({ semester });
  const searchResults = searchValue.length > 0 && searchValue.length <= 120 ? catalogQuery.search(searchValue) : undefined;
  const counts: Record<string, number> = {};
  for (const material of materials) counts[material.disciplineCode] = (counts[material.disciplineCode] ?? 0) + 1;
  const disciplines = data.disciplines
    .filter((discipline) => discipline.semesterCode === semester)
    .map((discipline) => ({ ...discipline, materialCount: counts[discipline.code] ?? 0 }));

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame">
        <header className="topbar">
          <a className="brand" href={`/?semester=${semester}&view=${view}`} aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
          <form className="search" role="search" action="/" method="get">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
            <label className="sr-only" htmlFor="catalog-search">Buscar no catálogo</label>
            <input id="catalog-search" name="q" type="search" minLength={1} maxLength={120} defaultValue={searchValue} placeholder="Busque por disciplina, aula ou arquivo" />
            <input name="semester" type="hidden" value={semester} />
            <input name="view" type="hidden" value={view} />
          </form>
          <button className="add-material" type="button"><span className="plus-icon" aria-hidden="true" /><span className="add-label">Adicionar materiais</span></button>
        </header>

        <nav className="semesters" aria-label="Semestres">
          {data.semesters.map(({ code }) => (
            <a className={code === semester ? "active" : undefined} href={`/?semester=${code}&view=${view}`} aria-current={code === semester ? "page" : undefined} key={code}>
              {code}{code === latestSemester ? <span> · Atual</span> : null}
            </a>
          ))}
          {["DSM4", "DSM5", "DSM6"].filter((code) => !knownSemesters.includes(code)).map((code) => <span className="future" key={code}>{code}</span>)}
        </nav>

        <main id="conteudo">
          <section className="page-heading" aria-labelledby="atlas-title">
            <h1 id="atlas-title">Seu semestre é um mapa. <span>Cada ponto leva a um material.</span></h1>
            <nav className="view-toggle" aria-label="Visualização do catálogo">
              <a aria-current={view === "map" ? "page" : undefined} href={`/?semester=${semester}&view=map`}>Mapa</a>
              <a aria-current={view === "list" ? "page" : undefined} href={`/?semester=${semester}&view=list`}>Lista</a>
            </nav>
          </section>
          {searchResults ? (
            <section className="search-results" aria-labelledby="search-results-title">
              <header><h2 id="search-results-title">Resultados para “{searchValue}”</h2><span>{searchResults.items.length}{searchResults.nextCursor ? "+" : ""} encontrados</span></header>
              {searchResults.items.length ? (
                <ul>
                  {searchResults.items.map((material) => {
                    const href = `/materiais/${material.ref.path.split("/").map(encodeURIComponent).join("/")}?semester=${encodeURIComponent(material.semesterCode)}`;
                    return <li key={material.ref.path}><a data-search-result href={href}><strong>{material.name}</strong><small>{material.semesterCode} / {material.disciplineCode} / {material.ref.path.split("/").slice(2, -1).join(" / ")}</small></a></li>;
                  })}
                </ul>
              ) : <p>Nenhum material encontrado. Tente outro termo.</p>}
            </section>
          ) : null}

          <section className="workspace" aria-label={`Catálogo do semestre ${semester}`}>
            <StudyCatalogView disciplines={disciplines} materials={materials} semester={semester} view={view} />
            <aside className="discipline-detail" aria-labelledby="discipline-title">
              <header className="detail-header"><span>{semester} / CATÁLOGO</span><span>{disciplines.length} disciplinas</span></header>
              <h2 id="discipline-title">Explore por<br />disciplina</h2>
              <p className="discipline-meta">Escolha uma linha do mapa ou um item da lista para acessar todos os materiais catalogados.</p>
              {disciplines[0] ? (
                <a className="resume" href={`/disciplinas/${encodeURIComponent(disciplines[0].code)}?semester=${semester}`}>
                  <span>Abrir {disciplines[0].code}</span><svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
                </a>
              ) : <p>Nenhum material catalogado neste semestre.</p>}
              <h3>Dados do catálogo</h3>
              <dl className="catalog-summary">
                <div><dt>Disciplinas</dt><dd>{disciplines.length}</dd></div>
                <div><dt>Materiais</dt><dd>{materials.length}</dd></div>
              </dl>
            </aside>
          </section>
        </main>
      </div>
    </>
  );
}
