// Controller de casos
// O controller tratará as requisições do cliente
// Importando o service
import casoService from '../services/casoService.js';
// Importando o ObjectID do mongodb
import { ObjectId } from 'mongodb';

// Função que irá tratar a requisição para LISTAR os casos
const getAllCasos = async (req, res) => {
    try {
        const casos = await casoService.getAll()
        res.status(200).json({ casos: casos })
        // Cod. 200 - OK - Requisição feita com sucesso
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Ocorreu um erro ao listar os casos. Erro interno do servidor.' })
    }
}

// Função que irá tratar a requisição para CADASTRAR um caso
const createCaso = async (req, res) => {
    try {
        // Coletando dados enviados no Body (estrutura completa de Caso, sem _id)
        const { titulo, resumo, categorias, detalhes, producoes } = req.body;

        // Enviando dados para o Service cadastrar
        await casoService.Create(titulo, resumo, categorias, detalhes, producoes);
        res.status(201).json({ message: "Caso cadastrado com sucesso!" })
        // Cod. 201 (CREATED) -> Recurso criado com sucesso no servidor
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

// Função que trata a requisição para EXCLUIR um caso
const deleteCaso = async (req, res) => {
    try {
        // Coletando a ID da rota
        const id = req.params.id;
        // Fazendo a validação do ObjectID
        if (ObjectId.isValid(id)) {
            await casoService.Delete(id);
            res.sendStatus(204);
            // Cod. 204 (NO CONTENT) : Requisição bem sucedida, porém não há conteúdo para retornar.
        } else {
            res.status(400).json({ error: 'Requisição mal formada, ID inválido.' })
            // Cod. 400 : BAD REQUEST
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno do servidor.' })
    }
}

// Função que trata a requisição para ALTERAR um caso
const updateCaso = async (req, res) => {
    try {
        // Coletando a ID da rota
        const id = req.params.id
        // Validando o ObjectID
        if (ObjectId.isValid(id)) {
            // Coletando os dados que serão alterados
            const { titulo, resumo, categorias, detalhes, producoes } = req.body
            // Enviando os dados para o service
            await casoService.Update(id, titulo, resumo, categorias, detalhes, producoes);
            res.status(200).json({ message: 'Caso atualizado com sucesso.' });
        } else {
            res.status(400).json({ error: 'Requisição mal formada, ID inválido.' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro interno do servidor.' })
    }
}

// Função que trata a requisição para LISTAR um caso ÚNICO
const getOneCaso = async (req, res) => {
    try {
        const id = req.params.id;
        if (ObjectId.isValid(id)) {
            const caso = await casoService.getOne(id);
            // Verificando se houve retorno na busca
            if (!caso) {
                res.status(404).json({ error: 'Caso não encontrado.' });
                // Cod. 404 - Not found
            } else {
                res.status(200).json({ caso });
            }
        // Se o ID não for válido
        } else {
            res.status(400).json({error: 'O ID informado é inválido.'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// Exportando as funções
export default { getAllCasos, createCaso, deleteCaso, updateCaso, getOneCaso }
