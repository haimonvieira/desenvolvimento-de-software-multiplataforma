---
disciplina: DSM3/DW3
titulo: CreateContent.module
fonte: DSM3/DW3/dw3-api-express-mongodb/aula-08-consumo-de-api-com-react/front-end-react/src/components/CreateContent/CreateContent.module.css
tipo: css
paginas: 0
extraido_em: 2026-10-24
---

/* Início conteúdo Cadastro */
.createContent {
  width: 35%;
  margin-top: 5rem;
  margin-bottom: 4rem;
  padding: 2rem;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 var(--primary-alpha);
  border: solid 1px var(--primary-color);
}
/* Fim conteúdo Cadastro */

/* RESPONSIVIDADE */
@media (max-width: 1200px) {
  .createContent {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .createContent {
    width: 85%;
  }
}

/* FIM RESPONSIVIDADE */
