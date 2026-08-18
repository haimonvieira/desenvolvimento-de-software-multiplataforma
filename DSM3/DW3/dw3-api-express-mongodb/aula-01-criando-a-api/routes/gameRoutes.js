// Endpoints de games
import express from "express";
import gameController from "../controllers/gameController.js";


const gameRoutes = express.Router();

gameRoutes.get("/games", gameController.getAllGames);

export default gameRoutes;