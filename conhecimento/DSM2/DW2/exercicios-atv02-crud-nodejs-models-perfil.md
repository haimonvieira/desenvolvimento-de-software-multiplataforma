---
disciplina: DSM2/DW2
titulo: Perfil
fonte: DSM2/DW2/exercicios/ATV02-CRUD-NODEJS/models/Perfil.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Perfil = connection.define('perfis', {
    codinome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    no_conectado:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Perfil;
```
