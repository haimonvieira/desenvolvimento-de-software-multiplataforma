import express from "express";

const router = express.Router();

import Produto from '../models/Produto.js';
// ROTA PRODUTOS
router.get("/produtos", function (req, res) {
  Produto.findAll().then((produtos) =>{
    res.render("produtos", {
      produtos: produtos
    });
  }).catch(error=>{
    console.log("Ocorreu um erro ao buscar os produtos."+ error)
  })
});

router.post("/produtos/cadastrar", (req, res)=>{
  const nome = req.body.nome;
  const preco = req.body.preco;
  const categoria = req.body.categoria;

  Produto.create({
    nome : nome,
    preco : preco,
    categoria : categoria
  }).then(()=>{
    res.redirect("/produtos")
  }).catch(error=>{
    console.log("Ocorreu um erro ao cadastrar o cliente."+ error)
  })
})

router.get("/produtos/excluir/:id", (req,res)=>{
  const id = req.params.id

  Produto.destroy({
    where : {
      id : id
    }
  }).then(()=>{
      res.redirect("/produtos")
    }).catch(error =>{
      console.log("Ocorreu um erro ao excluir o cliente. "+ error)
    })
})

export default router;