// Serviços do TMDB
// Integração com o TMDB Search Multi (extensão do projeto)

// Função para buscar produções no TMDB
async function buscar(query) {
    try {
        const token = process.env.TMDB_API_TOKEN;

        // Chamando o endpoint Search Multi do TMDB
        const resposta = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=pt-BR`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        });

        const dados = await resposta.json();

        // Normalizando cada produção para o formato do contrato:
        // tmdbId, titulo, tipo, ano, sinopse, poster
        const producoes = (dados.results || [])
            // O projeto trata apenas de filmes, séries e documentários
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .map(item => {
                // Filmes usam title/release_date; séries usam name/first_air_date
                const titulo = item.title || item.name;
                const data = item.release_date || item.first_air_date;
                return {
                    tmdbId: item.id,
                    titulo: titulo,
                    tipo: item.media_type === 'movie' ? 'filme' : 'série',
                    ano: data ? Number(data.substring(0, 4)) : null,
                    sinopse: item.overview,
                    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null
                };
            });

        return producoes;
    } catch (error) {
        console.log(error);
    }
}

export default { buscar }
