//Serviços de games
// Aqui será inserido os métodos para ler, cadastrar, alterar e excluir games
import Game from "../models/Games.js";

class gameService{

    // Serviço para ler os jogos
    async getAll(){
        //Tentativa da promise
        try{
            const games = await Game.find();
            return games;

        }catch(error){

            console.log(error);

        }
    }

}

// Exporta e ja criando a instancia da classe
export default new gameService();