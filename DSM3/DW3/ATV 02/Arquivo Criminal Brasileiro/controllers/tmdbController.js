// Controller do TMDB
// Trata a requisição de busca de produções
// Importando o service
import tmdbService from '../services/tmdbService.js';

// Função que trata a requisição para BUSCAR produções no TMDB
const buscarProducoes = async (req, res) => {
    try {
        // Coletando a query string enviada (ex: /tmdb/buscar?query=Tremembé)
        const { query } = req.query;

        // Validando a query string. O typeof protege contra ?query=a&query=b, que faz o
        // Express montar um array — nesse caso query.trim não existiria e a rota quebraria.
        if (typeof query !== 'string' || query.trim() === '') {
            res.status(400).json({ error: 'A query string "query" é obrigatória. Exemplo: /tmdb/buscar?query=Tremembé' });
        } else {
            const producoes = await tmdbService.buscar(query);
            res.status(200).json({ producoes: producoes });
            // Cod. 200 - OK - Requisição feita com sucesso
        }
    } catch (error) {
        // Antes o service engolia o erro e a rota respondia 200 com lista vazia,
        // mascarando token inválido/limite excedido como "nenhum resultado".
        console.log(error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar produções no TMDB.' });
    }
}

// Exportando as funções
export default { buscarProducoes }
