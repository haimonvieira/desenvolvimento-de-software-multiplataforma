//Importar tabelas que serao associadas
import Algoritmo from "../models/Algoritmo.js";
import Criador from "../models/Criador.js";

const associations = () => {
    Criador.hasMany(Algoritmo, {foreignKey: "criador_id"});
    Algoritmo.belongsTo(Criador, {
        foreignKey: "criador_id",
        as: "criador"
    });
}

export default associations;