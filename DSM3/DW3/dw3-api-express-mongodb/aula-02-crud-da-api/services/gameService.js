//NAO PRINTA CODIGO DE STATUS, APENAS O ERRO

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

    // Método para cadastrar jogos
    async create(title, year, platform, price){

        try{

            //Enviando os dados a serem cadastrados para o Model
            const newGame = new Game({
                //title: title,
                // Mesmo campo que quero inserir é igual ao campo de origem title: title
                title,
                year,
                platform,
                price
            });

            //Aguardar a operação de cadastro
            await newGame.save() // save() é operação do mongoose para cadastrar

        }catch(error){
            console.log(error);
        }

    }

    //Excluir jogo
    async delete(id){

        try{

            await Game.findByIdAndDelete(id);
            console.log(`O jogo com a id ${id} foi deletado`)

        }catch(error){

            console.log(error);

        }

    }

    async update(id, title, year, platform, price){

        try{

            await Game.findByIdAndUpdate(id, {
                title,
                year, 
                platform,
                price
            });

            console.log(`O jogo de id ${id} foi alterado com sucesso`)

        }catch(error){
            console.log(error)
        }

    }

}


// Exporta e ja criando a instancia da classe
export default new gameService();