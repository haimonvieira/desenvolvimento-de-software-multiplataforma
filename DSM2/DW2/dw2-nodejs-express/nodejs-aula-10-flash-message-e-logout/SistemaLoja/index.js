// Importando o Express
// const express = require("express")

import express from "express";
import flash from "express-flash";

// Importando o Controller de Cliente(onde estão as rotas)
import ClienteController from "./controllers/ClienteController.js";
import ProdutoController from "./controllers/ProdutoController.js";
import PedidoController from "./controllers/PedidoController.js";
import UsuarioController from "./controllers/UsuarioController.js"

//Importando Express-Session (gerador de sessoes do express)
import session from "express-session";

// Importando o arquivo de conexão com o banco
import connection from "./config/sequelize-config.js";

// Importando os Models
import Cliente from "./models/Cliente.js";
import Pedido from "./models/Pedido.js";
import Usuario from "./models/Usuario.js";

// Importando as Associações
import associations from "./config/associations.js";

//Importanto middleware de autenticação
import Auth from "./middlewares/Auth.js";

// Realizar a conexão com o banco de dados
connection.authenticate().then(()=>{
  console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch(error => {
  console.log(`Ocorreu um erro ao se conectar ao banco. ${error}`);
});

// Criando o banco de dados (somente se ainda não existir)
connection.query("create database if not exists loja_relacional;")
.then(()=>{
  console.log("O banco de dados foi criado");
}).catch((error)=>{
  console.log(`Ocorreu um erro ao criar o banco de dados. Erro: ${error}`);
});

// Invocando a função que cria as associações
associations();

// Sincronizando os Models de Cliente e Pedido
// Tranformando as funções em PROMESSAS
Promise.all(
  [
  Cliente.sync({ force: false }),
  Pedido.sync({ force: false }),
  Usuario.sync({force: false})
  ]
).then(()=>{
  console.log("Entidades criadas e relacionadas com sucesso!")
}).catch(error => {
  console.log("Ocorreu um erro ao sincronizar os Models."+error)
});


// Iniciando o Express
const app = express();
// Configurando o express-flash
app.use(flash());
// Define o EJS como Renderizador de páginas
app.set("view engine", "ejs");
// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static("public"));
// Configurando o express para aceitar dados vindo de formulários
app.use(express.urlencoded({extended: false}))

//Configurando a sessão de usuario
app.use(session({
  secret: "senha-longa-para-sessao",
  cookie: {
    maxAge: 360000 // 30s de sessao
  },
  saveUninitialized: false, //Não salva sessões vazias
  resave: false //Evita que re-salve sessões
}))

// Ativando o uso das ROTAS
app.use("/", ClienteController);
app.use("/", ProdutoController);
app.use("/", PedidoController);
app.use("/", UsuarioController);

// ROTA PRINCIPAL
app.get("/", Auth, function (req, res) {
  res.render("index", {
    //Coletando a flash message
    messages: req.flash()
  });
});


// INICIA O SERVIDOR NA PORTA 8080
const port = 8080;
app.listen(port, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro!");
  } else {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`);
  }
});
