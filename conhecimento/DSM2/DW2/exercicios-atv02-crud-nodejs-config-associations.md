---
disciplina: DSM2/DW2
titulo: associations
fonte: DSM2/DW2/exercicios/ATV02-CRUD-NODEJS/config/associations.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
//Importar tabelas que serao associadas
import Algoritmo from "../models/Algoritmo.js";
import Criador from "../models/Criador.js";

const associations = () => {
    Criador.hasMany(Algoritmo, {foreignKey: "criador_id"});
    Algoritmo.belongsTo(Criador, {
        foreignKey: "criador_id",
        as: "criador"
    });
}

export default associations;
```
