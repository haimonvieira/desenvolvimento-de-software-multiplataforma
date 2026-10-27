---
disciplina: DSM2/DW2
titulo: Cliente
fonte: DSM2/DW2/simulado_pratico_dw2/models/Cliente.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Cliente = connection.define('clientes', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf:{
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

Cliente.sync({force: false});

export default Cliente;
```
