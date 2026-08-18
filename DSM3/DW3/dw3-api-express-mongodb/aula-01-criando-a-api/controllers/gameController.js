// O controller tratara as requisicoes do cliente
// Importando o service
import gameService from "../services/gameService.js";

// Funcao que ira tratar a requisicao par alistar os jogos
const getAllGames = async (req, res) => {

    try{
        const games = await gameService.getAll();
        res.status(200).json({games: games}) // Retornando os jogos para o front
    }catch(error){
        console.log(error);
        // Retornando json de resposta de erro
        res.status(500).json({error: "Ocorreu um erro ao listar os jogos. Erro interno no servidor."});
    }

}

// Exportando funções
export default {getAllGames};