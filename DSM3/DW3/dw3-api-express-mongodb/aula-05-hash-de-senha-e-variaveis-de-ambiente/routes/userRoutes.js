// userRoutes.js
import express from 'express';
const userRoutes = express.Router();
// Importando o controller
import userController from '../controllers/userController.js';

// Endpoint para CADASTRAR um usuário
userRoutes.post("/user", userController.createUser);

// Endpoint para LOGAR um usuário
userRoutes.post("/login", userController.loginUser);


export default userRoutes;