// Endpoints de games
import express from "express";
import gameController from "../controllers/gameController.js";

const gameRoutes = express.Router();

//listar os jogos
gameRoutes.get("/games", gameController.getAllGames);
//endpoint para cadastra o jogo
gameRoutes.post("/games", gameController.createGame)
gameRoutes.delete('/games/:id', gameController.deleteGame)
gameRoutes.put("/games/:id", gameController.updateGame)

export default gameRoutes;