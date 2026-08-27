// Importando as bibliotecas
import express from "express";
import mongoose from "mongoose";

// Importando models
import Game from "./models/Games.js";
import User from "./models/Users.js"

// Importando as rotas
import gameRoutes from "./routes/gameRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Carregando express
const app = express();

//Configurações do express
app.use(express.urlencoded({extended: false}))
app.use(express.json()) // permitindo usar .json

// Rota principal da API
// Carregando as rotas no express
app.use("/", gameRoutes);
app.use("/", userRoutes)

// Iniciando a conexao com MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/apithegames_aninhado");

// Iniciando servidor da API
const port = 4000;
app.listen(port, (error) => {
    if(error){
        console.log("Erro ao iniciar o servidor da API: " + error)
    }else{
        console.log("API iniciada com sucesso na porta: http://localhost:" + port)
    }
})