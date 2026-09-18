// Serviços de Casos
// Aqui será inserido os métodos para Ler, cadastrar, Alterar e Excluir casos

// Importando o Model
import Caso from "../models/Casos.js"

class casoService {
    // Serviço/MÉTODO para ler os casos
    async getAll() {
        try {
            // o método .find() do mongoose busca registros
            const casos = await Caso.find()
            return casos
        } catch (error) {
            console.log(error)
        }
    }
    // MÉTODO PARA CADASTRAR UM CASO
    async Create(titulo, resumo, categorias, detalhes, producoes) {
        try {
            const newCaso = new Caso({
                titulo,
                resumo,
                categorias,
                detalhes,
                producoes
            });
            // .save() é o método do mongoose para cadastrar
            await newCaso.save();
        } catch (error) {
            console.log(error);
        }
    }
    // MÉTODO PARA EXCLUIR UM CASO
    async Delete(id) {
        try {
            await Caso.findByIdAndDelete(id);
            // O método findByIdAndDelete() do mongoose busca um registro pela ID e deleta
            console.log(`O caso com a id ${id} foi deletado.`)
        } catch (error) {
            console.log(error)
        }
    }
    // MÉTODO PARA ALTERAR UM CASO
    async Update(id, titulo, resumo, categorias, detalhes, producoes) {
        try {
            await Caso.findByIdAndUpdate(id, {
                titulo,
                resumo,
                categorias,
                detalhes,
                producoes
            })
            console.log(`O caso com a id ${id} foi alterado.`)
        } catch (error) {
            console.log(error)
        }
    }
    // MÉTODO PARA LISTAR UM CASO ÚNICO
    async getOne(id) {
        try {
            const caso = await Caso.findOne({ _id: id })
            // findOne : método do Mongoose para selecionar um registro único
            return caso
        } catch (error) {
            console.log(error)
        }
    }
}
// Exportando a classe
export default new casoService()
