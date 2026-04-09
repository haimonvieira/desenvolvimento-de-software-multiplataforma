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

    // const clientes = [
    //     {
    //         nome: "Ana Silva", cpf: "123.456.789-00", 
    //         endereco: "Rua das Flores, 123, Bairro Jardim Primavera, Cidade Felicidade, Estado do Sonho, CEP: 12345-678"
    //     },
    //     {
    //         nome: "Pedro Almeida", cpf: "987.654.321-00", 
    //         endereco: "Avenida Central, 456, Bairro Centro, Cidade Nova, Estado da Esperança, CEP: 98765-432"
    //     },
    //     {
    //         nome: "Marina Oliveira", cpf: "456.789.123-00", 
    //         endereco: "Travessa dos Sonhos, 789, Bairro Vista Linda, Cidade Sol Nascente, Estado da Harmonia, CEP: 54321-987"
    //     },
    //     {
    //         nome: "Rafael Santos", cpf: "321.654.987-00", 
    //         endereco: "Praça da Amizade, 321, Bairro Bela Vista, Cidade Alegria, Estado da Serenidade, CEP: 87654-321"
    //     }
    // ];

    // res.render("clientes", {
    //     clientes : clientes
    // });


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

})

export default router;
