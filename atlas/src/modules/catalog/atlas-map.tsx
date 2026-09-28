import { DisciplineLink, type CatalogDiscipline } from "./catalog-list";

const colors = ["route", "progress", "recent", "crossing", "language"] as const;

function routePath(index: number): string {
  const y = 72 + index * 70;
  const bend = index % 2 === 0 ? -24 : 24;
  return `M 52 ${y} C 245 ${y + bend}, 420 ${y - bend}, 668 ${y}`;
}

export function AtlasMap({ disciplines, semester }: Readonly<{ disciplines: readonly CatalogDiscipline[]; semester: string }>) {
  return (
    <section className="atlas-map" data-representation="map" aria-labelledby="atlas-map-title">
      <h2 className="sr-only" id="atlas-map-title">Mapa de disciplinas de {semester}</h2>
      <dl className="legend" aria-label="Legenda do mapa">
        <div><dt>Linha</dt><dd><span className="legend-route" aria-hidden="true" /> Disciplina</dd></div>
        <div><dt><span className="legend-node" aria-hidden="true" /></dt><dd>Material</dd></div>
        <div><dt><span className="legend-node legend-node--current" aria-hidden="true" /></dt><dd>Posição ilustrativa</dd></div>
      </dl>
      <p className="illustrative-note">Posição ilustrativa — seu progresso estará disponível em breve.</p>
      <svg className="atlas-geometry" aria-hidden="true" viewBox="0 0 720 420" preserveAspectRatio="none">
        {disciplines.map((discipline, index) => (
          <path className={`atlas-route atlas-route--${colors[index % colors.length]}`} d={routePath(index)} key={discipline.code} pathLength="1" />
        ))}
      </svg>
      <ul className="atlas-disciplines">
        {disciplines.map((discipline, index) => (
          <li className={`atlas-discipline atlas-discipline--${index + 1}`} key={discipline.code}>
            <span className={`atlas-station atlas-station--${colors[index % colors.length]}`} aria-hidden="true" />
            <DisciplineLink discipline={discipline} />
          </li>
        ))}
      </ul>
    </section>
  );
}
