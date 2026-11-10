"use client";

import { useState } from "react";

import { DisciplineLink, MaterialLink, materialHref, type CatalogDiscipline } from "./catalog-list";
import type { Material, MaterialRef } from "./model";

const colors = ["route", "progress", "recent", "crossing", "language"] as const;

/** A line shows a handful of named stops; the rest live in its open index. */
const MAX_TRACK_STATIONS = 6;

/**
 * One line's visible stations and the materials its index keeps. The split is
 * what makes a 282-material discipline a readable route instead of 282 dots
 * on top of each other; every material is still a link in the DOM.
 */
function splitTrack(materials: readonly Material[]): Readonly<{
  stations: readonly Material[];
  rest: readonly Material[];
}> {
  if (materials.length <= MAX_TRACK_STATIONS) return { stations: materials, rest: [] };
  const stations: Material[] = [];
  const seen = new Set<string>();
  for (const material of materials) {
    if (stations.length === MAX_TRACK_STATIONS) break;
    if (seen.has(material.name)) continue;
    seen.add(material.name);
    stations.push(material);
  }
  const picked = new Set(stations.map((material) => material.ref.path));
  return { stations, rest: materials.filter((material) => !picked.has(material.ref.path)) };
}

function routePath(index: number, count: number): string {
  // The line passes through its stations' row, not a fixed 10–90% band.
  const y = ((index + 0.5) / Math.max(1, count)) * 100;
  const bend = index % 2 ? 2 : -2;
  return `M 45 ${y} C 240 ${y + bend}, 470 ${y - bend}, 675 ${y}`;
}

export function AtlasMap({ currentMaterial, disciplines, materials, semester }: Readonly<{
  currentMaterial?: MaterialRef | null;
  disciplines: readonly CatalogDiscipline[];
  materials: readonly Material[];
  semester: string;
}>) {
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const currentName = currentMaterial
    ? materials.find((material) => sameRef(material.ref, currentMaterial))?.name
    : undefined;

  return (
    <section className="atlas-map" data-representation="map" aria-labelledby="atlas-map-title" style={{ "--discipline-count": disciplines.length } as React.CSSProperties}>
      <h2 className="sr-only" id="atlas-map-title">Mapa de disciplinas de {semester}</h2>
      <div className="atlas-map-header">
        <dl className="legend" aria-label="Legenda do mapa">
          <div><dt>Linha — disciplina</dt><dd><span className="legend-route" aria-hidden="true" /></dd></div>
          <div><dt>Estação — material</dt><dd><span className="legend-node" aria-hidden="true" /></dd></div>
          <div><dt>Estação cheia — você está aqui</dt><dd><span className="legend-node legend-node--current" aria-hidden="true" /></dd></div>
          <div><dt>Agrupamento — demais materiais</dt><dd><span className="legend-cluster" aria-hidden="true" /></dd></div>
        </dl>
        <p className="atlas-readout" data-testid="map-readout">
          <span className="atlas-readout-kicker">{activeStation ? "Estação em foco" : currentName ? "Sua posição" : "Estações"}</span>
          {activeStation ? (
            <span className="atlas-readout-name">{activeStation}</span>
          ) : currentName ? (
            <><span className="current-marker">Você está aqui</span><span className="atlas-readout-name">{currentName}</span></>
          ) : (
            <span className="atlas-readout-name">Passe o mouse ou use Tab nas estações.</span>
          )}
        </p>
      </div>
      <div className="atlas-field">
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
            const { stations, rest } = splitTrack(disciplineMaterials);
            return (
              <ul className="atlas-materials" aria-label={`Materiais de ${discipline.name}`} key={discipline.code}>
                {stations.map((material) => {
                  const current = sameRef(material.ref, currentMaterial);
                  return (
                    <li key={material.ref.path}>
                      <a
                        className={`atlas-station${current ? " atlas-station--current" : ""}`}
                        data-material-link
                        href={materialHref(material)}
                        title={material.name}
                        aria-current={current ? "location" : undefined}
                        aria-label={material.name}
                        onPointerEnter={() => setActiveStation(material.name)}
                        onPointerLeave={() => setActiveStation(null)}
                        onFocus={() => setActiveStation(material.name)}
                        onBlur={() => setActiveStation(null)}
                      >
                        <span className="atlas-station-dot" aria-hidden="true" />
                        <span className="atlas-station-label" aria-hidden="true">{material.name}</span>
                      </a>
                    </li>
                  );
                })}
                {rest.length > 0 && (
                  <li className="atlas-index-slot">
                    <details className="atlas-index">
                      <summary aria-label={`Ver os ${rest.length} materiais restantes de ${discipline.name}`}>
                        <span className="atlas-index-mark" aria-hidden="true" />
                        <span className="atlas-index-count">{rest.length}</span>
                        <span className="sr-only"> materiais restantes</span>
                      </summary>
                      <div className="atlas-index-panel">
                        <p className="atlas-index-title">
                          <span>{discipline.name}</span>
                          <span>{rest.length} materiais</span>
                        </p>
                        <ul aria-label={`Todos os materiais de ${discipline.name}`}>
                          {rest.map((material) => (
                            <li key={material.ref.path}>
                              <MaterialLink material={material} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </li>
                )}
              </ul>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function sameRef(left: MaterialRef, right?: MaterialRef | null): boolean {
  return left.path === right?.path && left.commitSha === right?.commitSha;
}
