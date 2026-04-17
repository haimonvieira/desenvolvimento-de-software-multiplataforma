//Importando CommonJS (antiga)
//const express = require("express");

//Importando Express com ES6 Modules (nova)
import express from "express";

//Método do Express usado para criar rotas da aplicação
const router = express.Router();

//Importando o model de Cliente
import Cliente from '../models/Cliente.js';

// ROTA CLIENTES
router.get("/clientes", function(req, res){

    //Aqui iremos chamar o model 'Cliente', 
    // invocar o método findAll() para buscar todos os registros da tabela de 'clientes'
    Cliente.findAll().then(clientes => {
        res.render('clientes', {
            clientes: clientes
        })
    }).catch(error => {
        console.log("Ocorreu um erro ao buscar os clientes: " + error);
    });
    
});

//Rota de cadastro de clinetes (subrota /cadastrar)
router.post('/clientes/cadastrar', (req, res) => {

    //Criando as variaveis que irao aramazenar os dados vindo do formulario
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const endereco = req.body.endereco;

    //Enviado os dados para o banco
    //'create' cadastra dados
    Cliente.create({
        //coluna banco: variavel
        nome: nome,
        cpf: cpf,
        endereco: endereco
        //Se a promise for bem sucedida o usuario sera redirecionado para a pagina de clinetes atualizada
    }).then(() => {
        res.redirect("/clientes");
    }).catch(error => {
        console.log("Erro ao cadastrar o cliente: " + error);
    });

});

//Rota de exclusão de cliente
router.get('/clientes/excluir/:id', (req, res) => {
    //Capturando parametro da rota
    const id = req.params.id;
    //Enviando o id do cliente para apagar no banco de dados
    Cliente.destroy({

        where: {
            //banco: parametro
            id: id
        }

    }).then(() => {

        res.redirect('/clientes');

    }).catch(error => {

        console.log("Erro ao deletar cliente: " + error);

    })
});

//Rota de edição de cliente
router.get('/clientes/editar/:id', (req, res) => {
    const id = req.params.id;

    //Buscando cliente no banco
    Cliente.findByPk(id).then(cliente => {
        console.log(cliente);
        res.render('clienteEditar', {
            //Passando os dados do cliente para a pagina
            cliente: cliente
        });
    });
});

//Rota de alteracao de cliente
router.post('/clientes/alterar', (req, res) => {
    //Coletando os dados do formulario
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const endereco = req.body.endereco;
    const id = req.body.id;

    //Alterando o cliente no banco
    Cliente.update(
        {
            nome: nome,
            cpf: cpf,
            endereco: endereco
        },
        {
            where: {
                id: id
            }
        }
    ).then(() => {
        res.redirect('/clientes');
    }).catch((error) => {
        console.log("Erro ao atualizar cliente: " + error);
    })
    ;
});

//Exportando modulo para usar em outro arquivo
export default router;
