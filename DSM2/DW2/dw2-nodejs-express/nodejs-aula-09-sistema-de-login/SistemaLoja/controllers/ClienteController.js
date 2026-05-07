// const express = require("express")

// Importando o Express com ES6 Modules (nova)
import express from "express";

// Método do Express usado para criar as rotas da aplicação
const router = express.Router();

// Importando o Model de Cliente
import Cliente from "../models/Cliente.js";

//Importando middleware de autenticação
import Auth from "../middlewares/Auth.js";

// ROTA CLIENTES
router.get("/clientes", Auth, function (req, res) {
  // Aqui iremos chamar o model "Cliente", invocar o método findAll() para buscar todos os registros da tabela de cliente
  Cliente.findAll().then((clientes) => {
    res.render("clientes", {
      clientes: clientes,
    });
  }).catch(error=>{
    console.log("Ocorreu um erro ao buscar os clientes."+ error)
  })
});

// Rota de cadastro de clientes (subrota/cadastrar)
router.post("/clientes/cadastrar", Auth, (req,res) => {
  // CRIANDO AS VARIÁVEIS QUE IRÃO ARMAZENAR OS DADOS VINDOS DO FORMULÁRIO
  const nome = req.body.nome;
  const cpf = req.body.cpf;
  const endereco = req.body.endereco;
  // Enviando os dados para o banco
  // O método create cadastra informações no BD
  Cliente.create({
    // coluna // variável
    nome : nome,
    cpf : cpf,
    endereco : endereco
  }).then(()=>{
    res.redirect("/clientes")
    // Falha na promessa
  }).catch(error =>{
    console.log("Ocorreu um erro ao cadastrar o cliente: "+ error)
  });
})

// ROTA DE EXCLUSÃO
router.get("/clientes/excluir/:id", Auth, (req,res)=>{
  // Capturado o parâmetro da rota
  const id = req.params.id
  // Eviando o ID do cliente para apagar do banco de dados
  Cliente.destroy({
    where : {
// Banco // Parâmetro recebido
      id : id
    }
  // SUCESSO
  }).then(()=>{
    res.redirect("/clientes")
  // FALHA
  }).catch(error =>{
    console.log("Ocorreu um erro ao excluir o cliente"+ error)
  })
})

// ROTA DE EDIÇÃO DE CLIENTE
router.get("/clientes/editar/:id", Auth, (req,res) => {
  const id = req.params.id
  // Buscando o cliente no banco
  Cliente.findByPk(id).then(cliente =>{
    res.render("clienteEditar",{
      // Passando os dados do cliente para a página
      cliente: cliente,
    });
  });
});

// ROTA DE ALTERAÇÂO DE CLIENTE
router.post("/clientes/alterar", Auth, (req,res)=>{
  // Coletando os dados do formulário
  const nome = req.body.nome;
  const cpf = req.body.nome;
  const endereco = req.body.endereco;
  const id = req.body.id;

  // Alterando o Cliente no banco
  Cliente.update(
    {
      nome: nome,
      cpf: cpf,
      endereco: endereco,
    },
    {where: {id: id}}
  ).then(()=>{
    res.redirect("/clientes")
  })
})

// Exportando o módulo para usá-lo em outro arquivo
export default router;
