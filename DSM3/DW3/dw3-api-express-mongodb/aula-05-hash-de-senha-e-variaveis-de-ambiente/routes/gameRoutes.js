// Endpoints (rotas) de Games
import express from 'express';
const gameRoutes = express.Router();
// Importando o controller
import gameController from '../controllers/gameController.js';
//Importando middleware de autenticacao
import Auth from '../middleware/Auth.js';

// Endpoint (rota) para listar todos os jogos
gameRoutes.get("/games", Auth.Authorization, gameController.getAllGames)

// Endpoint (rota) para cadastrar um jogo
gameRoutes.post("/games", Auth.Authorization, gameController.createGame)

// Endpoint (rota) para deletar um jogo
gameRoutes.delete("/games/:id", Auth.Authorization, gameController.deleteGame)

// Endpoint (rota) para alterar um jogo
gameRoutes.put("/games/:id", Auth.Authorization, gameController.updateGame)

// Endpoint (rota) para listar um jogo único
gameRoutes.get("/games/:id", Auth.Authorization, gameController.getOneGame)

export default gameRoutes;