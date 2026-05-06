import express from 'express';
const router = express.Router();
import Algoritmo from '../models/Algoritmo.js';
import Criador from '../models/Criador.js';

router.get('/algoritmos', function (req, res) {

    Algoritmo.findAll().then((algoritmos) => {
        res.render('algoritmos', {
            algoritmos
        })
    })
});

router.get('/algoritmos/gerenciar', (req, res) => {


    Promise.all([
        Algoritmo.findAll({
            include:[
                {
                    model: Criador,
                    as: "criador",
                    required: true
                }
            ]
        }),
        Criador.findAll()
    ]).then(([algoritmos, criadores]) => {
        // console.log(JSON.stringify(algoritmos, null, 2));
        res.render('algoritmosGerenciar', {
            algoritmos,
            criadores
        })
    }).catch(erro => {
        console.log("Erro ao listar algoritmos e criadores: " + erro);
    })

    // Algoritmo.findAll().then((algoritmos) => {
    //     res.render('algoritmosGerenciar', {
    //         algoritmos
    //     })
    // }).catch(erro => {
    //     console.log("Erro ao buscar algoritmos: " + erro);
    // })

});


router.post('/algoritmos/cadastrar', (req, res) => {

    const nome = req.body.nome;
    const tipo = req.body.tipo;
    const tamanhoChave = req.body.tamanhoChave;
    const nivelSeguranca = req.body.nivelSeguranca;
    const anoCriacao = req.body.anoCriacao;
    const criadorId = req.body.criadorId;

    Algoritmo.create({
        nome: nome,
        tipo: tipo,
        tamanho_chave: tamanhoChave,
        nivel_seguranca: nivelSeguranca,
        ano_criacao: anoCriacao,
        criador_id: criadorId
    }).then(() => {
        res.redirect("/algoritmos/gerenciar");
    }).catch(erro => {
        console.log("Erro ao cadastrar algoritmo: " + erro);
    })

});


router.get('/algoritmos/excluir/:id', (req, res) => {

    const id = req.params.id;

    Algoritmo.destroy({
        where:{
            id: id
        }
    }).then(() => {
        res.redirect('/algoritmos/gerenciar');
    }).catch(erro => {
        console.log("Erro ao excluir algoritmo: " + erro);
    })

});

router.get('/algoritmos/editar/:id', (req, res) => {

    const id = req.params.id;

    Promise.all([
        Algoritmo.findByPk(id, {
            include:[
                {
                    model: Criador,
                    as: "criador",
                    required: true
                }
            ]
        }),
        Criador.findAll()
    ]).then(([algoritmo, criadores]) => {
        res.render('algoritmoEditar', {
            algoritmo,
            criadores
        })
    }).catch(erro => {
        console.log("Erro ao listar algoritmos e criadores: " + erro);
    })

});

router.post('/algoritmos/alterar', (req, res) => {

    const nome = req.body.nome;
    const tipo = req.body.tipo;
    const tamanhoChave = req.body.tamanhoChave;
    const nivelSeguranca = req.body.nivelSeguranca;
    const anoCriacao = req.body.anoCriacao;
    const id = req.body.id;

    Algoritmo.update(
        {
           nome: nome,
            tipo: tipo,
            tamanho_chave: tamanhoChave,
            nivel_seguranca: nivelSeguranca,
            ano_criacao: anoCriacao
        },
        {
            where: {
                id: id
            }
        }
    ).then(() => {
        res.redirect('/algoritmos/gerenciar');
    }).catch(erro => {
        console.log("Erro ao atualizar algoritmo: " + erro);
    })

})


export default router;