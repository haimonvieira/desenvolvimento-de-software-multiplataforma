---
disciplina: DSM2/DW2
titulo: sequelize config
fonte: DSM2/DW2/simulado_pratico_dw2/config/sequelize-config.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import Sequelize from "sequelize";

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    timezone: '-03:00',
    database: 'lojateste'
})

export default connection;
```
