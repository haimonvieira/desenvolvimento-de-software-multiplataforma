const materials = [
  { type: "PDF", title: "Lista de exercícios MongoDB", meta: "Exercício · 24 set." },
  { type: "JS", title: "Carga de dados MongoDB", meta: "Código · concluído" },
  { type: "ZIP", title: "Aula de Wagner", meta: "Arquivo · novo" },
] as const;

const stations = ["n1", "n2", "n3", "n4", "n5 current", "n6", "n7", "n8", "n9", "n10"];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DSM Atlas, início"><span className="brand-mark" aria-hidden="true" /><span>DSM ATLAS</span></a>
        <form className="search" role="search">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
          <label className="sr-only" htmlFor="catalog-search">Buscar no catálogo</label>
          <input id="catalog-search" type="search" placeholder="Busque por disciplina, aula ou arquivo" />
        </form>
        <button className="add-material" type="button"><span className="plus-icon" aria-hidden="true" /><span className="add-label">Adicionar materiais</span></button>
      </header>

      <nav className="semesters" aria-label="Semestres">
        <a href="#dsm1">DSM1</a><a href="#dsm2">DSM2</a>
        <a className="active" href="#dsm3" aria-current="page">DSM3 <span>· Atual</span></a>
        <span className="future">DSM4</span><span className="future">DSM5</span><span className="future">DSM6</span>
      </nav>

      <main id="conteudo">
        <section className="page-heading" aria-labelledby="atlas-title">
          <h1 id="atlas-title">Seu semestre é um mapa. <span>Cada ponto leva a um material.</span></h1>
          <div className="view-toggle" aria-label="Visualização do catálogo"><button type="button" aria-pressed="true">Mapa</button><button type="button" aria-pressed="false">Lista</button></div>
        </section>

        <section className="workspace" aria-label="Mapa do semestre DSM3">
          <div className="map-panel">
            <dl className="legend" aria-label="Legenda do mapa">
              <div><dt>Linha</dt><dd><span className="legend-route" aria-hidden="true" /> Disciplina</dd></div>
              <div><dt><span className="legend-node" aria-hidden="true" /></dt><dd>Material</dd></div>
              <div><dt><span className="legend-node legend-node--current" aria-hidden="true" /></dt><dd>Onde você parou</dd></div>
            </dl>
            <div className="map-art" aria-hidden="true">
              <span className="route route--dw" /><span className="route route--bd" /><span className="route route--tp" /><span className="route route--gaps" /><span className="route route--ing" />
              {stations.map((station) => <span className={`station station--${station.replace(" current", "")} ${station.includes("current") ? "station--current" : ""}`} key={station} />)}
              <span className="line-label line-label--dw">DW3 · Web III</span><span className="line-label line-label--bd">BDNR · Banco Não Relacional</span>
              <span className="line-label line-label--tp">TP2 · Técnica de Programação</span><span className="line-label line-label--gaps">GAPS</span><span className="line-label line-label--ing">ING1</span>
              <span className="checkpoint checkpoint--api">API Express</span><span className="checkpoint checkpoint--mongo">Agregações MongoDB</span><span className="checkpoint checkpoint--tk">Tkinter</span>
              <span className="you-are-here">Você está aqui</span>
            </div>
            <ul className="map-list sr-only" aria-label="Disciplinas e materiais do mapa">
              <li>DW3 · Web III: API Express</li><li>BDNR · Banco Não Relacional: Agregações MongoDB, posição atual</li>
              <li>TP2 · Técnica de Programação: Tkinter</li><li>GAPS</li><li>ING1</li>
            </ul>
          </div>

          <aside className="discipline-detail" aria-labelledby="discipline-title">
            <header className="detail-header"><span>BDNR / DSM3</span><span className="progress">Exemplo · 68% concluído</span></header>
            <h2 id="discipline-title">Banco de Dados<br />Não Relacional</h2>
            <p className="discipline-meta">Exemplo visual · 12 materiais · 4 exercícios</p>
            <a className="resume" href="#agregacoes"><span>Continuar: agregações</span><svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5" /></svg></a>
            <h3>Materiais recentes</h3>
            <ul className="materials">
              {materials.map((material) => (
                <li key={material.title}>
                  <span className="file-type">{material.type}</span><span><strong>{material.title}</strong><small>{material.meta}</small></span>
                  <button type="button" aria-label={`Favoritar ${material.title}`}><svg aria-hidden="true" className="star-icon" viewBox="0 0 24 24" fill="none"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg></button>
                </li>
              ))}
            </ul>
            <footer className="detail-footer">
              <a href="#materiais">Ver todos os 12 materiais</a>
              <a href="#baixar">Baixar <svg aria-hidden="true" className="icon icon--down" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5" /></svg></a>
            </footer>
          </aside>
        </section>
      </main>
      </div>
    </>
  );
}
