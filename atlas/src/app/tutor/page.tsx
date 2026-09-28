import catalog from "../../generated/catalog.json";
import { createCatalogQuery } from "../../modules/catalog/catalog-query";
import type { CatalogData } from "../../modules/catalog/model";
import { TutorPanel } from "../../modules/study/tutor-panel";

const data = catalog as CatalogData;
const catalogQuery = createCatalogQuery(data);

type TutorPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

/**
 * The public tutor page. The context is the visitor's studied materials when
 * known, otherwise the published catalog: the orchestrator never retrieves
 * outside the refs named here, and the page itself holds no provider, key or
 * notebook write — those live in the route, the session state and the explicit
 * save action.
 */
export default async function TutorPage({ searchParams }: TutorPageProps) {
  const requested = await searchParams;
  const semesterValue = typeof requested?.semester === "string" ? requested.semester : undefined;
  const knownSemesters = data.semesters.map(({ code }) => code);
  const semester = knownSemesters.includes(semesterValue ?? "") ? semesterValue! : "DSM1";
  const context = catalogQuery.browse({ semester }).map((material) => material.ref);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame public-shell">
        <header className="topbar public-topbar">
          <a className="brand" href={`/?semester=${semester}&view=map`} aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
          <span className="public-context">Tutor · {semester}</span>
        </header>
        <main className="public-page" id="conteudo">
          <header className="public-heading">
            <h1>Tutor de estudo</h1>
            <p>Respostas citam os materiais em estudo. Nenhum provedor está vinculado ainda.</p>
          </header>
          <TutorPanel context={context} />
        </main>
      </div>
    </>
  );
}
