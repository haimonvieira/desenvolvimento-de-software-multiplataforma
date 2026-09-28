import type { Discipline } from "./model";

export type CatalogDiscipline = Discipline & Readonly<{ materialCount: number }>;

export function DisciplineLink({ discipline }: Readonly<{ discipline: CatalogDiscipline }>) {
  return (
    <a
      className="discipline-link"
      data-discipline-link
      data-material-count={discipline.materialCount}
      href={`/disciplinas/${encodeURIComponent(discipline.code)}?semester=${encodeURIComponent(discipline.semesterCode)}`}
    >
      <span className="discipline-code">{discipline.code}</span>
      <span className="discipline-name">{discipline.name}</span>
      <span className="discipline-count">{discipline.materialCount} {discipline.materialCount === 1 ? "material" : "materiais"}</span>
    </a>
  );
}

export function CatalogList({ disciplines, semester }: Readonly<{ disciplines: readonly CatalogDiscipline[]; semester: string }>) {
  return (
    <section className="catalog-list" data-representation="list" aria-labelledby="catalog-list-title">
      <header className="catalog-list-header">
        <h2 id="catalog-list-title">Disciplinas de {semester}</h2>
        <p>{disciplines.length} {disciplines.length === 1 ? "disciplina" : "disciplinas"}</p>
      </header>
      <ul>
        {disciplines.map((discipline) => (
          <li key={discipline.code}><DisciplineLink discipline={discipline} /></li>
        ))}
      </ul>
    </section>
  );
}
