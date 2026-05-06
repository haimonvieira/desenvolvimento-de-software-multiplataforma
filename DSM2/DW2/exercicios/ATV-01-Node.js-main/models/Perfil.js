import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Perfil = connection.define('perfis', {
    codinome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    no_conectado:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Perfil;