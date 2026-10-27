---
disciplina: DSM2/DW2
titulo: index
fonte: DSM2/DW2/simulado_pratico_dw2/index.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import express from "express";
import connection from './config/sequelize-config.js';
import ClienteController from './controllers/ClienteControler.js';


connection.authenticate().then(() => {
    console.log("Auntenficado");
}).catch(error => {
    console.log("Erro ao autenticar: " + error);
})

connection.query("create database if not exists lojateste;").then(() => {
    console.log("Banco de dados criado");
}).catch(error => {
    console.log("Erro ao criar banco de dados: " + error);
})

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index');
})

app.use('/', ClienteController);

app.listen(8080, error => {
    if(error){
        console.log(error);
    }else{
        console.log("Servidor iniciado em http://localhost:8080");
    }
})
```
