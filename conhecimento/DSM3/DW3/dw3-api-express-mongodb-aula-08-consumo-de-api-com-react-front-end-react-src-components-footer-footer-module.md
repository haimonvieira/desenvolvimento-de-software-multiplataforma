---
disciplina: DSM3/DW3
titulo: Footer.module
fonte: DSM3/DW3/dw3-api-express-mongodb/aula-08-consumo-de-api-com-react/front-end-react/src/components/Footer/Footer.module.css
tipo: css
paginas: 0
extraido_em: 2026-10-24
---

/* Início Footer */
.footerContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 8rem;
    font-family: "Poppins";
    font-size: 0.6rem;
    text-align: center;
    padding: 2rem;
    background-color: var(--third-color);
    color: var(--label-color);
  }

  .footerContent li {
    list-style: none;
  }

  .footerContent li:hover {
    color: var(--primary-color);
    cursor: pointer;
  }

  .footerContent .footerLeft .footerItems {
    display: flex;
    text-align: left;
  }

  .footerContent .footerLeft .footerItems li {
    padding: 0.8rem;
  }

  .footerContent .footerRight {
    font-size: 0.8rem;
    margin-right: 1rem;
  }
  /* Fim Footer */

  /* RESPONSIVIDADE */
@media (max-width: 1200px) {
    .footerContent .footerLeft {
        display: none;
      }

      .footerContent .footerRight {
        width: 100%;
      }
}

@media (max-width: 768px) {
    .footerContent .footerLeft {
        display: none;
      }

      .footerContent .footerRight {
        width: 100%;
      }
}
