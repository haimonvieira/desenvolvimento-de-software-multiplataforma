// Importando o Express
//const express = require("express")
import express from 'express';
//Importando o Controller
import ClienteController from './controllers/ClienteController.js';
import PedidoController from './controllers/PedidoController.js';
import ProdutoController from './controllers/ProdutoController.js';
//Importando arquivo de conexão com o banco de dados
import connection from './config/sequelize-config.js';
//Importando Models
import Cliente from './models/Cliente.js';
import Pedido from './models/Pedido.js';
//Importando as associações
import associations from './config/association.js';


//Realizando a conexão com o banco de dados
connection.authenticate()
.then(() => {
    console.log("Conexão com o banco de dados realizado com sucesso!");
})
.catch((error) =>{
    console.log(`Ocorreu um erro ao se conectar ao banco. ${error}`);
});

//Criando o banco de dados (somente se ainda não existir)
connection.query("create database if not exists loja_relacional;")
.then(() => {
    console.log("O banco de dados foi criado");
}).catch((error) => {
    console.log(`Ocorreu um erro ao criar o banco de dados. Erro: ${error}`);
});

//Invocando a função que cria as associacoes
associations();

//Sincronizar os models de Cliente e Pedido
//Transformando as funcoes em promessas
Promise.all([
    Cliente.sync({force: true}),
    Pedido.sync({force: true})
]).then(() => {
    console.log("Entidades criadas e relacionadas com sucesso!");
}).catch((error) => {
    console.log("Erro ao criar e relacionar entidades: " + error);
});

// Iniciando o Express 
const app = express();
// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs');
// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'));
//Configurando o express para aceitar dados vindo de formularios
app.use(express.urlencoded({extended: false}))

//Ativando o uso das rotas
app.use('/', ClienteController);
app.use('/', PedidoController);
app.use('/', ProdutoController);

// ROTA PRINCIPAL
app.get("/",function(req,res){
    res.render("index")
});


// INICIA O SERVIDOR NA PORTA 8080
const port = 8080
app.listen(port, function(erro){
    if(erro) {
        console.log("Ocorreu um erro!")

    }else{
        console.log(`Servidor iniciado com sucesso em http://localhost:${port}`)
    }
});