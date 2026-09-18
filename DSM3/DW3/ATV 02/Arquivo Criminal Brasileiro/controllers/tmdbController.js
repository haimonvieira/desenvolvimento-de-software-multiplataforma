// Controller do TMDB
// Trata a requisição de busca de produções
// Importando o service
import tmdbService from '../services/tmdbService.js';

// Função que trata a requisição para BUSCAR produções no TMDB
const buscarProducoes = async (req, res) => {
    try {
        // Coletando a query string enviada (ex: /tmdb/buscar?query=Tremembé)
        const { query } = req.query;

        // Validando a query string
        if (query == undefined || query.trim() === '') {
            res.status(400).json({ error: 'A query string "query" é obrigatória. Exemplo: /tmdb/buscar?query=Tremembé' });
        } else {
            const producoes = await tmdbService.buscar(query);
            res.status(200).json({ producoes: producoes });
            // Cod. 200 - OK - Requisição feita com sucesso
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar produções no TMDB.' });
    }
}

// Exportando as funções
export default { buscarProducoes }
