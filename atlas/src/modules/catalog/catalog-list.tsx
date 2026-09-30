import type { Discipline, Material, MaterialRef } from "./model";

export type CatalogDiscipline = Discipline & Readonly<{ materialCount: number }>;

function materialHref(material: Material): string {
  const path = material.ref.path.split("/").map(encodeURIComponent).join("/");
  return `/materiais/${path}?semester=${encodeURIComponent(material.semesterCode)}`;
}

export function MaterialLink({ className, material, title }: Readonly<{ className?: string; material: Material; title?: string }>) {
  return <a className={className} data-material-link href={materialHref(material)} title={title}>{material.name}</a>;
}

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

export function CatalogList({ currentMaterial, disciplines, materials, semester }: Readonly<{
  currentMaterial?: MaterialRef | null;
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
}>) {
  return (
    <section className="catalog-list" data-representation="list" aria-labelledby="catalog-list-title">
      <header className="catalog-list-header">
        <h2 id="catalog-list-title">Disciplinas de {semester}</h2>
        <p>{disciplines.length} {disciplines.length === 1 ? "disciplina" : "disciplinas"}</p>
      </header>
      <ul className="catalog-disciplines-list">
        {disciplines.map((discipline) => (
          <li key={discipline.code}>
            <DisciplineLink discipline={discipline} />
            <ul className="catalog-materials" aria-label={`Materiais de ${discipline.name}`}>
              {materials.filter((material) => material.disciplineCode === discipline.code).map((material) => (
                <li key={material.ref.path}><MaterialLink material={material} />{sameRef(material.ref, currentMaterial) && <span className="current-marker">Você está aqui</span>}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function sameRef(left: MaterialRef, right?: MaterialRef | null): boolean {
  return left.path === right?.path && left.commitSha === right.commitSha;
}
