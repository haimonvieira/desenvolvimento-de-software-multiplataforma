import { env } from "cloudflare:workers";

import catalog from "../../generated/catalog.json";
import { createCatalogQuery } from "../../modules/catalog/catalog-query";
import type { CatalogData } from "../../modules/catalog/model";
import { TutorPanel } from "../../modules/study/tutor-panel";
import { tutorCandidates } from "../../modules/study/tutor-context";

const data = catalog as CatalogData;
const catalogQuery = createCatalogQuery(data);

type TutorPageEnv = { TURNSTILE_SITE_KEY?: string };

type TutorPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

/**
 * The public tutor page. It offers the semester's indexable materials as
 * candidates; the panel narrows them to what the visitor is actually studying
 * and caps the turn to the turn route's `TUTOR_CONTEXT_LIMIT`, so the context
 * this page produces is always one the route accepts. The page itself holds no
 * provider, key or notebook write — those live in the route, the session state
 * and the explicit save action.
 */
export default async function TutorPage({ searchParams }: TutorPageProps) {
  const requested = await searchParams;
  const semesterValue = typeof requested?.semester === "string" ? requested.semester : undefined;
  const knownSemesters = data.semesters.map(({ code }) => code);
  const semester = knownSemesters.includes(semesterValue ?? "") ? semesterValue! : "DSM1";
  const candidates = tutorCandidates(catalogQuery.browse({ semester }));
  // The sitekey is public configuration, not a secret: the matching secret
  // (`TURNSTILE_SECRET_KEY`) is used only by the server-side siteverify call.
  const turnstileSiteKey = (env as TutorPageEnv).TURNSTILE_SITE_KEY ?? null;

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame public-shell">
        <header className="topbar public-topbar">
          <a className="brand" href={`/?semester=${semester}&view=map`} aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
          <span className="public-context">Tutor · {semester}</span>
        </header>
        <main className="public-page" id="conteudo" tabIndex={-1}>
          <header className="public-heading">
            <h1>Tutor de estudo</h1>
            <p>Respostas citam os materiais em estudo. O modo patrocinado usa a cota do portal; com sua chave, o uso é por sua conta.</p>
          </header>
          <TutorPanel candidates={candidates} turnstileSiteKey={turnstileSiteKey} />
        </main>
      </div>
    </>
  );
}
