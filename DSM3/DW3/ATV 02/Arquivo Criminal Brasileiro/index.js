// Importar o Express
import express from "express";
// Importar o Mongoose (conexão configurada para o Atlas)
import mongoose from "./config/db-connection.js";
// Importar o Swagger (infraestrutura da documentação)
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./config/swagger-config.js";

// Importar os Models (fornecidos pelo responsável do Banco)
import User from "./models/Users.js"
import Caso from "./models/Casos.js"

// Importar as rotas (endpoints)
import userRoutes from "./routes/userRoutes.js";
import casoRoutes from "./routes/casoRoutes.js";
import tmdbRoutes from "./routes/tmdbRoutes.js";

// Carregando Express
const app = express();

// Configurações do Express
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Carregando as rotas de usuários
app.use('/', userRoutes)
// Carregando as rotas de casos
app.use('/', casoRoutes)
// Carregando as rotas do TMDB
app.use('/', tmdbRoutes)

// Gerando a documentação Swagger e publicando em /api-docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Iniciando o servidor da API
const port = process.env.PORT || 4000;
app.listen(port, (error) => {
    if (error) {
        console.log("Ocorreu um erro ao iniciar a API!" + error);
    } else {
        console.log("API iniciada com sucesso na porta " + port);
    }
});
