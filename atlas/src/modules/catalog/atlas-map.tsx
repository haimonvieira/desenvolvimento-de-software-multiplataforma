import { DisciplineLink, MaterialLink, type CatalogDiscipline } from "./catalog-list";
import type { Material, MaterialRef } from "./model";

const colors = ["route", "progress", "recent", "crossing", "language"] as const;

function percent(index: number, count: number): string {
  return `${((index + 0.5) / count) * 100}%`;
}

function routePath(index: number, count: number): string {
  const y = 10 + index * (80 / Math.max(1, count - 1));
  const bend = index % 2 ? 2 : -2;
  return `M 45 ${y} C 240 ${y + bend}, 470 ${y - bend}, 675 ${y}`;
}

export function AtlasMap({ currentMaterial, disciplines, materials, semester }: Readonly<{
  currentMaterial?: MaterialRef | null;
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
}>) {
  return (
    <section className="atlas-map" data-representation="map" aria-labelledby="atlas-map-title" style={{ "--discipline-count": disciplines.length } as React.CSSProperties}>
      <h2 className="sr-only" id="atlas-map-title">Mapa de disciplinas de {semester}</h2>
      <dl className="legend" aria-label="Legenda do mapa">
        <div><dt>Linha</dt><dd><span className="legend-route" aria-hidden="true" /> Disciplina</dd></div>
        <div><dt><span className="legend-node" aria-hidden="true" /></dt><dd>Material</dd></div>
        <div><dt><span className="legend-node legend-node--current" aria-hidden="true" /></dt><dd>Você está aqui</dd></div>
      </dl>
      <svg className="atlas-geometry" aria-hidden="true" viewBox="0 0 720 100" preserveAspectRatio="none">
        {disciplines.map((discipline, index) => (
          <path className={`atlas-route atlas-route--${colors[index % colors.length]}`} d={routePath(index, disciplines.length)} key={discipline.code} pathLength="1" />
        ))}
      </svg>
      <ul className="atlas-disciplines">
        {disciplines.map((discipline) => <li className="atlas-discipline" key={discipline.code}><DisciplineLink discipline={discipline} /></li>)}
      </ul>
      <div className="atlas-material-routes">
        {disciplines.map((discipline) => {
          const disciplineMaterials = materials.filter((material) => material.disciplineCode === discipline.code);
          return (
            <ul className="atlas-materials" aria-label={`Materiais de ${discipline.name}`} key={discipline.code}>
              {disciplineMaterials.map((material, index) => (
                <li key={material.ref.path} style={{ left: percent(index, disciplineMaterials.length) }}>
                  <MaterialLink className={`atlas-station${sameRef(material.ref, currentMaterial) ? " atlas-station--current" : ""}`} material={material} />
                  {sameRef(material.ref, currentMaterial) && <span className="current-marker current-marker--map">Você está aqui</span>}
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </section>
  );
}

function sameRef(left: MaterialRef, right?: MaterialRef | null): boolean {
  return left.path === right?.path && left.commitSha === right.commitSha;
}
