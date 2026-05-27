import express from 'express';
import Filme from "../model/Filme.js";

const router = express.Router();

// ROTA PARA LISTAR FILMES
router.get('/filmes', function(req, res){

    Filme.findAll().then(filme => {
        res.render('filmes', {
            filmes: filme
        })
    }).catch(error => {
        console.log("Erro ao obter Filme: " + error);
    })

})

// ROTA PARA CADASTRAR UM FILME
router.post('/filmes/cadastrar', function(req, res){

    const titulo = req.body.titulo;
    const genero = req.body.genero;
    const duracao = req.body.duracao;

    Filme.create({
        titulo: titulo,
        genero: genero,
        duracao: duracao
    }).then(() => {
        console.log("Filme cadastrado com sucesso");
        res.redirect('/filmes');
    }).catch(error => {
        console.log("Erro ao cadastrar Filme: " + error);
    })

})

// ROTA PARA EXCLUIR UM FILME
router.get('/filmes/excluir/:id', function(req, res){

    const id = req.params.id;

    Filme.destroy(
        {
            where:{
                id: id
            }
        }
    ).then(() => {
        console.log("Filme excluido.");
        res.redirect('/filmes');
    }).catch(error => {
        console.log("Erro ao excluir filme: " + error);
    })

})

export default router;
