import Sequelize from "sequelize"
import connection from "../config/sequelize-config.js"

const Criador = connection.define("criadores", {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Criador;
