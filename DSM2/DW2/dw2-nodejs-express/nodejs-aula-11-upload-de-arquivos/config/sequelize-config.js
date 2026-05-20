import Sequelize from "sequelize";

//Criando conexao com o banco de dados
const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    //Comentar a linha na primeira execucao
    database: 'galeria',
    timezone: "-03:00"
});

export default connection;