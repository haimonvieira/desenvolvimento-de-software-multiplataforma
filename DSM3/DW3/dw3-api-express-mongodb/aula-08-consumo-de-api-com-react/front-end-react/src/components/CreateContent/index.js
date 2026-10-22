import styles from "@/components/CreateContent/CreateContent.module.css";
//Importanto o hook useState
import { useState } from "react";
import axios from "axios";

const CreateContent = () => {
  //Criando os estados para armazenar as informacoes do formulario
  const [title, setTitle] = useState("");
  const [platform, setPlattform] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  // Funcao que envia os dados para a API (cadastra o jogo)
  const handleSubmit = async (event) => {
    //Evitando recarregamento da pagina
    event.preventDefault();
    //Verificando se todos os campos do formilario foram preenchidos
    if (title && platform && genre && rating && year && price !== "") {
      //Se tudo preenchido, criar json e enviar para a API
      const game = {
        title: title,
        year: year,
        price: price,
        descriptions: {
          platform: platform,
          genre: genre,
          rating: rating,
        },
      };

      try {
        const response = await axios.post(`http://localhost:4000/games`, game);
        //verificando o retorno da API
        if (response.status === 201) {
          alert("Game cadastrado com sucesso");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Por favor, preencha todos os campos");
    }
  };

  return (
    <div className={styles.createContent}>
      <div className="title">
        <h2>Cadastrar novo jogo</h2>
      </div>
      <form id="createForm" className="formPrimary" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Insira o título do jogo"
          className="inputPrimary"
          //Coletando o dado do formulario e atualizando o estado
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="text"
          name="platform"
          id="platform"
          placeholder="Insira a plataforma do jogo"
          className="inputPrimary"
          onChange={(e) => setPlattform(e.target.value)}
          value={platform}
        />
        <input
          type="number"
          name="year"
          id="year"
          placeholder="Insira o ano do jogo"
          className="inputPrimary"
          onChange={(e) => setYear(e.target.value)}
          value={year}
        />
        <input
          type="number"
          name="price"
          id="price"
          placeholder="Insira o preço do jogo"
          className="inputPrimary"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
        <input
          type="text"
          name="genre"
          id="genre"
          placeholder="Insira o gênero do jogo"
          className="inputPrimary"
          onChange={(e) => setGenre(e.target.value)}
          value={genre}
        />
        <input
          type="text"
          name="rating"
          id="rating"
          placeholder="Insira a classificação do jogo"
          className="inputPrimary"
          onChange={(e) => setRating(e.target.value)}
          value={rating}
        />
        <input
          type="submit"
          value="Cadastrar"
          id="createBtn"
          className="btnPrimary"
        />
      </form>
    </div>
  );
};

export default CreateContent;
