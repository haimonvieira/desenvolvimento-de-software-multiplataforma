//Importando CommonJS (antiga)
//const express = require("express");

//Importando Express com ES6 Modules (nova)
import express from "express";

//Método do Express usado para criar rotas da aplicação
const router = express.Router();

//Importando Produto
import Produto from "../models/Produto.js";

// ROTA PRODUTOS
router.get("/produtos",function(req,res){
    const produtos = [
        {nome: "Celular Motorola E22", preco: 1200, categoria: "Eletroportáteis"},
        {nome: "Tablet Samsung", preco: 900, categoria: "Eletrônicos"},
        {nome: "Notebook Lenovo", preco: 3200, categoria: "Computadores"},
        {nome: "Fone Bluetooth", preco: 150, categoria: "Periféricos"}
    ]
    res.render("produtos", {
        produtos: produtos
    })

});

export default router;