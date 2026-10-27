---
disciplina: DSM2/DW2
titulo: Algoritmo
fonte: DSM2/DW2/exercicios/ATV02-CRUD-NODEJS/models/Algoritmo.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Algoritmo = connection.define("algoritmos", {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tamanho_chave:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ano_criacao:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nivel_seguranca :{
        type: Sequelize.STRING,
        allowNull: false
    },
    criador_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

export default Algoritmo;
```
