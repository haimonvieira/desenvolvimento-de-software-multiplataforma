import express from "express";

const router = express.Router();
import Cliente from "../models/Cliente.js";

router.get("/clientes", (req, res) => {
  Cliente.findAll()
    .then((clientes) => {
      res.render("clientes", {
        clientes: clientes,
      });
    })
    .catch((error) => {
      console.log("Erro ao obter clientes: " + error);
    });
});

router.post("/clientes/cadastrar", (req, res) => {
  const nome = req.body.nome;
  const cpf = req.body.cpf;
  const endereco = req.body.endereco;

  Cliente.create({
    nome: nome,
    cpf: cpf,
    endereco: endereco,
  })
    .then(() => {
      console.log("Cliente cadastrado");
      res.redirect("/clientes");
    })
    .catch((error) => {
      console.log("Erro ao cadastrar cliente: " + error);
    });
});

router.get("/clientes/excluir/:id", (req, res) => {
  const id = req.params.id;

  Cliente.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      console.log("Cliente excluido");
      res.redirect("/clientes");
    })
    .catch((error) => {
      console.log("Erro ao excluir cliente: " + error);
    });
});

router.get("/clientes/editar/:id", (req, res) => {
  const id = req.params.id;

  Cliente.findByPk(id).then((cliente) => {
    res.render("clienteEditar", {
      cliente: cliente,
    });
  });
});

router.post("/clientes/alterar", (req, res) => {
  const id = req.body.id;
  const nome = req.body.nome;
  const cpf = req.body.cpf;
  const endereco = req.body.endereco;

  Cliente.update(
    {
      nome: nome,
      cpf: cpf,
      endereco: endereco,
    },
    {
      where: {
        id: id,
      },
    },
  ).then(() => {
      console.log("Cliente alterado");
      res.redirect('/clientes');
    })
    .catch((error) => {
      console.log("Erro ao atualizar cliente: " + error);
    });
});

export default router;
