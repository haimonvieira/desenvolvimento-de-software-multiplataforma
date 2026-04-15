//Este arquiovi ra criar as associacoes entre as tabelas
//Importando os models

import Cliente from "../models/Cliente.js";
import Pedido from "../models/Pedido.js";

//Definindo as associacoes entre Models
const associations = () => {
    //Um cliente tem muitos pedidos
    Cliente.hasMany(Pedido, {foreignKey: "cliente_id"});
    //Um pedido possui um cliente
    Pedido.belongsTo(Cliente, {foreignKey: "cliente_id"});
};

export default associations;