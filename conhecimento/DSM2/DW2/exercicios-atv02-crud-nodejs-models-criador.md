---
disciplina: DSM2/DW2
titulo: Criador
fonte: DSM2/DW2/exercicios/ATV02-CRUD-NODEJS/models/Criador.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import Sequelize from "sequelize"
import connection from "../config/sequelize-config.js"

const Criador = connection.define("criadores", {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Criador;
```
