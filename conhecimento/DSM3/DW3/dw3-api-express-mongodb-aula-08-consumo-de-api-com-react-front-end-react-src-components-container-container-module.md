---
disciplina: DSM3/DW3
titulo: Container.module
fonte: DSM3/DW3/dw3-api-express-mongodb/aula-08-consumo-de-api-com-react/front-end-react/src/components/Container/Container.module.css
tipo: css
paginas: 0
extraido_em: 2026-10-24
---

.containerCover {
  background-image: url("/images/bg.png");
  background-size: cover;
  background-attachment: fixed;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-alpha);
  min-height: 100vh;
}

/* RESPONSIVIDADE */
@media (max-width: 1200px) {
  .containerCover {
    background-attachment: scroll;
  }
}

@media (max-width: 768px) {
  .containerCover {
    background-attachment: scroll;
  }
}
