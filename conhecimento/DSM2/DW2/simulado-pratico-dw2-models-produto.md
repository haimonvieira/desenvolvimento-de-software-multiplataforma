---
disciplina: DSM2/DW2
titulo: Produto
fonte: DSM2/DW2/simulado_pratico_dw2/models/Produto.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import Sequelize from "sequelize";
import connection from "../config/sequelize-config";

const Produto = connection.define('produtos', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    preco:{
        type: Sequelize.FLOAT,
        allowNull: false
    },
    categoria:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

Produto.sync({force: false});

export default Produto;
```
