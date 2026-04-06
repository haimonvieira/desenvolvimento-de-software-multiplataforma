// Responsavel por criar a tabela clientes no banco de dados
import Sequelize from 'sequelize'
import connection from '../config/sequelize-config.js';

// 'define()' cria uma tabela no BD
const Cliente = connection.define('clientes', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//O método 'sync()' sincroniza os dados com o banco
// 'force: false' -> não recria a tabela se já existir
Cliente.sync({force: false});
export default Cliente;