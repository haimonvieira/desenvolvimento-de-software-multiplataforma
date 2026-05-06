import express from 'express';
import AlgoritmosController from './controllers/AlgoritmosController.js';
import HistoriaController from './controllers/HistoriaController.js';
import PerfilController from './controllers/PerfilController.js';

//Conexao com banco
import connection from './config/sequelize-config.js';

//models
import Perfil from './models/Perfil.js';
import Algoritmo from './models/Algoritmo.js';
import Criador from './models/Criador.js';

//Associacao
import associations from './config/associations.js';

//Conexao com banco
connection.authenticate().then(() => {
    console.log("Conectado ao banco.");
}).catch(error => {
    console.log("Erro ao conectar: " + error);
});


//Criando banco de dados se nao existir
connection.query("create database if not exists criptografia;")
.then(() => {
    console.log("Banco criado");
}).catch((error) => {
    console.log("Erro ao criar banco: " + error);
});

associations();

//Sincronizar os models e transformar em Promises

Promise.all(
    [
        Perfil.sync({force: false}),
        Criador.sync({force: false}),
        Algoritmo.sync({force: false}),
    ]
).then(() => {
    console.log("Entidades criadas");
}).catch(error => {
    console.log("Erro ao sincronizar models: " + error);
});

//iniciando express
const app = express();
//EJS como renderizador
app.set("view engine", "ejs");
//Define uso da pasta 'public' para arquivos estaticos
app.use(express.static('public'));
//Configurando express para aceitar dados de formularios
app.use(express.urlencoded({extended: true}));


//Ativando rotas
app.use('/', AlgoritmosController);
app.use('/', HistoriaController);
app.use('/', PerfilController);


app.get("/", (req, res) => {
    res.render("index");
});


const port = 8080;
app.listen(port, (erro) => {

    if(erro){
        console.log("Erro: " + erro);
    }else{
        console.log(`Servidor iniciado com sucesso no 
            endereço: http://localhost:${port}`);
    }

});