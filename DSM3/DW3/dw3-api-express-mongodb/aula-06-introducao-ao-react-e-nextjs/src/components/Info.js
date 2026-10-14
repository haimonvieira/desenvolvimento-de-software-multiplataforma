// Importando o hook useState : permite criar estados para os componentes
import { useState } from "react";

const Info = () => {
  const [indice, setIndice] = useState(0);
  const informacoes = ["Diego", "Registro", "18 anos"];

  return (
    <>
      <div>
        <p>Informações: {informacoes[indice]}</p>
        <button onClick={() => {setIndice(indice + 1)}}>Mudar</button>
      </div>
    </>
  );
};

export default Info;
