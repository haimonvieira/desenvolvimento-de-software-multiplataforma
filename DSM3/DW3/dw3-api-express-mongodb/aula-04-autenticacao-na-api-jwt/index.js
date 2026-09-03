// Importar o Express
import express from "express";
// Importar o Mongoose
import mongoose from "mongoose"
// Importar o Model de Game
import Game from "./models/Games.js"
// Importar o Model de Usuário
import User from "./models/Users.js"
// Importar as rotas (endpoints)
import gameRoutes from './routes/gameRoutes.js'
import userRoutes from "./routes/userRoutes.js";

// Carregando Express
const app = express();

// Configurações do Express
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Carregando as rotas de games
app.use('/', gameRoutes)
// Carregando as rotas de usuários
app.use('/', userRoutes)

// Iniciando a conexão com o MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/apithegames_aninhado")

// Iniciando o servidor da API
const port = 4000;
app.listen(port, (error) => {
    if (error) {
        console.log("Ocorreu um erro ao iniciar a API!" + error);
    } else {
        console.log("API iniciada com sucesso na porta " + port);
    }
});