// Endpoints (rotas) do TMDB
import express from 'express';
const tmdbRoutes = express.Router();
// Importando o controller
import tmdbController from '../controllers/tmdbController.js';
// Importando middleware de autenticacao
import Auth from '../middleware/Auth.js';

// Endpoint (rota) para buscar produções no TMDB
tmdbRoutes.get("/tmdb/buscar", Auth.Authorization, tmdbController.buscarProducoes)

export default tmdbRoutes;
