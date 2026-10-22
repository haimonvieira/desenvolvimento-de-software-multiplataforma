// Importando os hooks useState e useEffect
import { useState, useEffect } from "react";
import styles from "@/components/HomeContent/HomeContent.module.css";
import Loading from "../Loading";
// Importando a biblioteca Axios
import axios from "axios";

const HomeContent = () => {
  const [games, setGames] = useState([]);
  // Estado para controlar o gif de carregamento
  const [loading, setLoading] = useState(true);

  // useEffect
  // Aqui será criada a função para pegar os jogos da API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:4000/games");
        setGames(response.data.games);
        console.log(response);
      } catch (error) {
        console.log(error);
        // Finally é executado no final da promessa
      } finally {
        // Delay de 3 segundo para mudar o estado para false
        setTimeout(() => setLoading(false), 3000);
      }
    };
    // Invocando a função dentro do useEffect
    fetchGames();
  }, []);

  //Funcao para deletar o jogo
  const deleteGame = async (gameId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/games/${gameId}`,
      );

      //Verificando o codigo de status que a api retorna
      if (response.status === 204) {
        alert("O jogo foi excluido com sucesso");
        //Atualizando a lista de jogos do componente
        setGames(games.filter((game) => game._id !== gameId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.homeContent}>
        {/* CARD LISTA DE JOGOS */}
        <div className={styles.listGamesCard}>
          {/* TITLE */}
          <div className={styles.title}>
            <h2>Lista de jogos</h2>
          </div>
          {/*  Ternário para mostrar a lista de jogos ou o gif de carregamento */}
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <div className={styles.games} id={styles.games}>
              {/* Lista de jogos irá aqui */}
              {games.map((game) => (
                <ul className={styles.listGames}>
                  <div className={styles.gameImg}>
                    <img src="images/game_cd_cover.png" alt="Capa do jogo" />
                  </div>
                  <div className={styles.gameInfo}>
                    <h3>{game.title}</h3>
                    <li>Plataforma: {game.descriptions.platform}</li>
                    <li>Gênero: {game.descriptions.genre}</li>
                    <li>Classificação: {game.descriptions.rating}</li>
                    <li>Ano: {game.year}</li>
                    <li>
                      Preço:{" "}
                      {game.price.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </li>
                    {/* Botao de deletar */}
                    <button
                      className={styles.btnDel}
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Deseja mesmo excluir o jogo?",
                        );
                        //Se o usuario confirmar
                        if (confirmed) {
                          //Chamando a funcao que deleta o jogo enviando o id
                          deleteGame(game._id);
                        }
                      }}
                    >
                      Deletar
                    </button>
                  </div>
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default HomeContent;
