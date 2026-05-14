import express from "express";

const router = express.Router();
// Importando os Models
import Pedido from "../models/Pedido.js";
import Cliente from "../models/Cliente.js";


//Importando middleware de autenticação
import Auth from "../middlewares/Auth.js";


// ROTA PEDIDOS
router.get("/pedidos", Auth, function (req, res) {
  // Fazendo o INNER JOIN para trazer as informações do 
  // Cliente junto com as informações do Pedido

  //Realizando ambas as consultas em paralelo
  Promise.all([
    Pedido.findAll({
    include: [
      {
        model: Cliente, // Inclui o modelo Cliente relacionado
        required: true, // Garante que somente pedidos com clientes relacionados sejam retornados
      },
    ],
  }),
  //Busca todos os clientes
  Cliente.findAll(),

  ]).then(([pedidos, clientes]) =>{
    res.render("pedidos",{
      // Passando a lista de pedidos e clientes para a página
      pedidos : pedidos,
      clientes: clientes
    })
  }).catch(error =>{
    console.log(`Ocorreu um erro ao listar os pedidos e clientes. ${error}`)
  });
});

router.post("/pedidos/cadastrar", Auth, function(req, res) {

  const numeroPedido = req.body.numero;
  const valorPedido = req.body.valor;
  const idCliente = req.body.clienteId;

  Pedido.create({
    numero: numeroPedido,
    valor: valorPedido,
    cliente_id: idCliente
  }).then(() => {
    res.redirect("/pedidos");
  }).catch((error) => {
    console.log("Erro ao inserir dados na tabela Pedidos: " + error);
  })

});

router.get("/pedidos/excluir/:id", Auth, (req, res) => {

  const id = req.params.id;

  Pedido.destroy({
    where: {
      id: id
    }
  }).then(() => {
    res.redirect("/pedidos");
  }).catch((error) =>{
    console.log(error);
  })

});

export default router;