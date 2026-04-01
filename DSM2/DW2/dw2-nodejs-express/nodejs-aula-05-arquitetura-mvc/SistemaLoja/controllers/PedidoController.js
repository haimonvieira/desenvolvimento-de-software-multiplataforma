//Importando CommonJS (antiga)
//const express = require("express");

//Importando Express com ES6 Modules (nova)
import express from "express";

//Método do Express usado para criar rotas da aplicação
const router = express.Router();

// ROTA PEDIDOS
router.get("/pedidos", function(req,res){
    const pedidos = [
        {numero: "983721931", valor: 1200},
        {numero: "983721932", valor: 900},
        {numero: "983721933", valor: 3200},
        {numero: "983721934", valor: 150}
    ]
    res.render("pedidos", {
        pedidos: pedidos
    })
})

export default router;