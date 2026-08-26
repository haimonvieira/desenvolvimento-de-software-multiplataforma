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
    async create(title, year, price, descriptions){

        try{

            //Enviando os dados a serem cadastrados para o Model
            const newGame = new Game({
                //title: title,
                // Mesmo campo que quero inserir é igual ao campo de origem title: title
                title,
                year,
                price,
                descriptions
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

    async update(id, title, year, price, descriptions){

        try{

            await Game.findByIdAndUpdate(id, {
                title,
                year, 
                price,
                descriptions
            });

            console.log(`O jogo de id ${id} foi alterado com sucesso`)

        }catch(error){
            console.log(error)
        }

    }

    // Método para listar um registro unico
    async getOne(id){

        try{

            // findOne: metodo do mongoose para selecionar um registro
            const game = await Game.findOne({_id: id})
            return game

        }catch(error){

            console.log(error)
            
        }

    }

}   


// Exporta e ja criando a instancia da classe
export default new gameService();