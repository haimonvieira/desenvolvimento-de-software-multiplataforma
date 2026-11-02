// Endpoints (rotas) de Casos
import express from 'express';
const casoRoutes = express.Router();
// Importando o controller
import casoController from '../controllers/casoController.js';
// Importando middleware de autenticacao
import Auth from '../middleware/Auth.js';

// Endpoint (rota) para listar todos os casos
casoRoutes.get("/casos", Auth.Authorization, casoController.getAllCasos)

// Endpoint (rota) para cadastrar um caso
casoRoutes.post("/casos", Auth.Authorization, casoController.createCaso)

// Endpoint (rota) para consultar um caso único
casoRoutes.get("/casos/:id", Auth.Authorization, casoController.getOneCaso)

// Endpoint (rota) para alterar um caso
casoRoutes.put("/casos/:id", Auth.Authorization, casoController.updateCaso)

// Endpoint (rota) para excluir um caso
casoRoutes.delete("/casos/:id", Auth.Authorization, casoController.deleteCaso)

export default casoRoutes;
