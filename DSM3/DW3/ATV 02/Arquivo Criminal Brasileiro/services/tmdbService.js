// Serviços do TMDB
// Integração com o TMDB Search Multi (extensão do projeto)

// Gênero 99 do TMDB é "Documentary" — o Search Multi classifica documentário
// como `media_type: 'movie'`, então o tipo só pode ser distinguido por genre_ids.
const GENERO_DOCUMENTARIO = 99;

// Função para buscar produções no TMDB
async function buscar(query) {
    const token = process.env.TMDB_API_TOKEN;

    // O TMDB aceita duas credenciais, com o mesmo nível de acesso:
    //  - API Key (v3): 32 caracteres hexadecimais, enviada em ?api_key=
    //  - Read Access Token (v4): JWT que começa com "eyJ", enviado em Authorization: Bearer
    const ehReadAccessToken = Boolean(token) && token.startsWith('eyJ');
    const apiKey = ehReadAccessToken ? '' : `&api_key=${encodeURIComponent(token)}`;
    const autorizacao = ehReadAccessToken ? { 'Authorization': `Bearer ${token}` } : {};

    // Chamando o endpoint Search Multi do TMDB
    const resposta = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=pt-BR${apiKey}`, {
        headers: {
            ...autorizacao,
            'accept': 'application/json'
        }
    });

    // Sem esta checagem um token inválido/limite excedido viraria "nenhum resultado".
    if (!resposta.ok) {
        // Cod. 401: token ausente/inválido. Cod. 429: limite de requisições excedido.
        throw new Error(`O TMDB respondeu com status ${resposta.status}.`);
    }

    const dados = await resposta.json();

    // Normalizando cada produção para o formato do contrato:
    // tmdbId, titulo, tipo, ano, sinopse, poster
    const producoes = (dados.results || [])
        // O TMDB devolve também `media_type: 'person'` no Search Multi
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map(item => {
            // Filmes usam title/release_date; séries usam name/first_air_date
            const titulo = item.title || item.name;
            const data = item.release_date || item.first_air_date;
            const generos = item.genre_ids || [];
            // Filme de gênero Documentary é documentário; série de documentário
            // continua sendo série, pois no contrato não existe "série documental".
            const tipo = generos.includes(GENERO_DOCUMENTARIO) && item.media_type === 'movie'
                ? 'documentário'
                : (item.media_type === 'movie' ? 'filme' : 'série');
            return {
                tmdbId: item.id,
                titulo: titulo,
                tipo: tipo,
                ano: data ? Number(data.substring(0, 4)) : null,
                sinopse: item.overview || null,
                poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null
            };
        });

    return producoes;
}

export default { buscar }
