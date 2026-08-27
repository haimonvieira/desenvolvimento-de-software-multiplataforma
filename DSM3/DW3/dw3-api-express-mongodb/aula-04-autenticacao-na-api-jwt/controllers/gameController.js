// O controller tratara as requisicoes do cliente
// Importando o service
import gameService from "../services/gameService.js";
import { ObjectId } from "mongodb";

// Funcao que ira tratar a requisicao par alistar os jogos
const getAllGames = async (req, res) => {

    try{
        const games = await gameService.getAll();
        res.status(200).json({games: games}) // Retornando os jogos para o front
    }catch(error){
        console.log(error);
        // Retornando json de resposta de erro
        res.status(500).json({error: "Erro interno no servidor"});
    }

}

//Função para tratar a requisição de cadastrar os jogos
const createGame = async (req, res) => {

    try{
        //Coletando dados enviados da requisicao/formulario e gravando em variaveis
        const {title, year, price, descriptions} = req.body
        //Enviando dados para o 'service' cadastrar
        await gameService.create(title, year, price, descriptions);
        res.status(201).json({message: "Jogo cadastrado com sucesso"}) // Cod. 201 (create)

    }catch(error){
        console.log(error);
        res.status(500).json({error: "Erro interno no servidor"});
    }
}

// Função que trata a requisicao para excluir um jogo
const deleteGame = async (req, res) => {

    try{
        
        const id = req.params.id //Pegando id pelo endpoint

        //Validação do ObjectId
        if(ObjectId.isValid(id)){
            
            await gameService.delete(id)
            res.sendStatus(204) // Enviando codigo 204 sem mensagem

        }else{

            res.status(400).json({error: "Requisição mal formada"}) // Bad Request

        }


    }catch(error){

        console.log(error)
        res.status(500).json({error: "Erro interno no servidor"})

    }

}

const updateGame = async (req, res) => {

    try{

        const id = req.params.id

        if(ObjectId.isValid(id)){
            
            const {title, year, price, descriptions} = req.body

            await gameService.update(id, title, year, price, descriptions)
            res.status(200).json({message: "Jogo atualizado com sucesso"})

        }else{

            res.status(400).json({error: "Requisição mal formada."})

        }    

    }catch(error){
        console.log(error)
        res.status(500).json({error: "Erro interno no servidor"})
    }

}

const getOneGame = async (req, res) => {

    try{

        const id = req.params.id
        if(ObjectId.isValid(id)){

            const game = await gameService.getOne(id)

            // Verificando se houve retorno na busca
            if(!game){
                res.status(404).json({error: "Jogo não encontrado"}) // 404 - Not Found
            }else{
                res.status(200).json({game})
            }

        }else{

            req.status(400).json({error: "id informado inválido"})

        }


    }catch(error){
        console.log(error)
        res.status(500).json({error: "Erro interno no servidor"})
    }

}

// Exportando funções
export default {getAllGames, createGame, deleteGame, updateGame, getOneGame};