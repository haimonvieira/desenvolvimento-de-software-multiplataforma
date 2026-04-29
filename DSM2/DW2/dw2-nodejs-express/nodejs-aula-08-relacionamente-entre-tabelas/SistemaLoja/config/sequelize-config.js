// Importando a ORM Sequelize
import Sequelize from "sequelize";

// Definindo os dados de conexão com o banco de dados

const connection = new Sequelize({
    // Tipo do banco
    dialect: 'mysql',
    // Endereço do banco
    host: 'localhost',
    // Nome de usuário do banco
    username: 'root',
    // Senha
    password: '',
    // Fuso horário
    timezone: "-03:00",
    // Nome do banco que será usado na aplicação
    database: 'loja_relacional'
});

// Exportando o módulo
export default connection;