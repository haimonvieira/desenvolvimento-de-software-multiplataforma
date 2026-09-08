// Serviços de Games
// Aqui será inserido os métodos para Ler, cadastrar, Alterar e Excluir games

// Importando o Model
import Game from "../models/Games.js"

class gameService {
    // Serviço/MÉTODO para ler os jogos
    async getAll() {
        // Tentativa da promessa (sucesso)
        try {
            //  o método .find() do mongoose busca registros
            const games = await Game.find()
            return games
            // Caso ocorra um erro será executado o catch
        } catch (error) {
            console.log(error)
        }
    }
    // MÉTODO PARA CADASTRAR JOGOS
    async Create(title, year, price, descriptions) {
        try {
            // Enviando os dados a serem cadastrados para o Model
            const newGame = new Game({
                // title: title,
                title,
                year,
                price,
                descriptions
            });
            // Aguardar a operação de cadastro
            await newGame.save(); // .save() é o método do mongoose para cadastrar
        } catch (error) {
            console.log(error);
        }
    }
    // MÉTODO PARA EXCLUIR UM JOGO
    async Delete(id) {
        try {
            await Game.findByIdAndDelete(id);
            // O método findByIdAndDelete() do mongoose busca um registro pela ID e deleta
            console.log(`O jogo com a id ${id} foi deletado.`)
        } catch (error) {
            console.log(error)
        }

    }

    //  MÉTODO PARA ALTERAR UM JOGO
    async Update(id, title, year, price, descriptions) {
        try {
            await Game.findByIdAndUpdate(id, {
                // title : title
                title,
                year,
                price,
                descriptions
            })
            console.log(`O jogo com a id ${id} foi alterado.`)
        } catch (error) {
            console.log(error)
        }
    }

    // MÉTODO PARA LISTAR UM REGISTRO ÚNICO
    async getOne(id) {
        try {
            const game = await Game.findOne({ _id: id })
            // findOne : método do Mongoose para selecionar um registro único
            return game
        } catch (error) {
            console.log(error)
        }
    }
    // ENCERRA A CLASSE
}
// Exportando a classe
export default new gameService()

