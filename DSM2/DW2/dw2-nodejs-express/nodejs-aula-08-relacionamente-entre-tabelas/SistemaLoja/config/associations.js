// Este arquivo irá criar as associações entre as tabelas
// Importando os models

import Cliente from "../models/Cliente.js";
import Pedido from "../models/Pedido.js";

// Definindo as associações entre as Models
const associations = () =>{
    // Um cliente possui muitos pedidos
    Cliente.hasMany(Pedido,{foreignKey: "cliente_id"});
    // Um pedido possui um cliente
    Pedido.belongsTo(Cliente, {foreignKey: "cliente_id"});
};

export default associations;