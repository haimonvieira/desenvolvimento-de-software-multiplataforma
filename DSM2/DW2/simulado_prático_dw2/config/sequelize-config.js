import Sequelize from "sequelize";

const connection = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  // DESCOMENTAR ESSA LINHA APÓS A PRIMEIRA EXECUÇÃO
  database: "filmes",
  timezone: "-03:00",
});

export default connection;
