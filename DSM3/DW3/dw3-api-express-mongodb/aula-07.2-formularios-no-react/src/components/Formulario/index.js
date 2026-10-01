import { use, useState } from "react";

const Formulario = () => {
  //Criando os estados para os campos do formulario
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  //Funcao que trata a submissao do formulario
  const handleSubmit = (evento) => {
    //Evitar o comportamento padrao do formulario de recarregar a pagina
    evento.preventDefault();
    console.log(nome, sobrenome, email, senha, confirmarSenha);
  };

  return (
    <>
      <h1>Cadastro de Usuário</h1>
      <br />
      <form onSubmit={handleSubmit}>
        {/* Quando o valor do input mudar, pegue o novo valor (evento.target.value) e atualize o estado com esse valor */}
        <input
          type="text"
          placeholder="Digite seu nome..."
          onChange={(evento) => setNome(evento.target.value)}
          value={nome}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Digite seu sobrenome..."
          onChange={(evento) => setSobrenome(evento.target.value)}
          value={sobrenome}
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="Digite seu email..."
          onChange={(evento) => setEmail(evento.target.value)}
          value={email}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Digite sua senha..."
          onChange={(evento) => setSenha(evento.target.value)}
          value={senha}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Confirmar senha..."
          onChange={(evento) => setConfirmarSenha(evento.target.value)}
          value={confirmarSenha}
        />
        <br />
        <br />
        <button type="submit">Cadastrar</button>
        <br />
        <br />
      </form>
      <h4>Chamando os estados para enxergar seus valores:</h4>
      <p>{nome}</p>
      <p>{email}</p>
      <p>{senha}</p>
    </>
  );
};

export default Formulario;
