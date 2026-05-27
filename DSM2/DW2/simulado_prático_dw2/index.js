import express from "express";
import connection from "./config/sequelize-config.js";
import FilmeController from "./controller/FilmeController.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// app.use("/", FilmesController);

connection.authenticate().then(() => {
    console.log("Conexão com o banco de dados feita com sucesso!");
  }).catch((error) => {
    console.log(error);
  });

connection.query(`CREATE DATABASE IF NOT EXISTS filmes;`).then(() => {
    console.log("O banco de dados está criado.")
}).catch(error => {
    console.log(error)
})

app.use('/', FilmeController);

app.get('/', (req, res) => {
  res.send("<a href='/filmes'><h3>Ir para a página de Filmes</h3></a>")
})

const port = 8080;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`);
  }
});
