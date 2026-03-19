// O arquivo index.js é o arquivo principal do projeto

// Importando o MÓDULOS do Express
const express = require("express");

// Criando uma instância do Express
const app = express();

// Configurando o EJS
app.set('view engine','ejs')

// Criando a rota principal do site ("/")
app.get("/",(req,res)=>{
    // res.send("<h1>Bem-Vindo ao meu primeiro site em Node.js e Express.js!</h1>")
    res.render("index")
});

// Criando a rota de perfil do usuário
app.get("/perfil", (req,res)=>{
    // res.send("<h2>Bem-Vindo ao seu perfil!</h2>")
    res.render("perfil")
})

app.get("/clientes",(req,res) =>{
  const listaClientes = ['Maria','João','Kevin','Haimon','Jociele'];
  res.render("clientes",{
    listaClientes : listaClientes,
  });
});

app.get("/clientes/:lista", (req,res)=>{
    const lista = req.params.lista;
    res.render("detalhesclientes",{
      lista: lista,
    });
});

// Rota de Produtos
app.get("/produtos",(req,res)=>{
  const listaProdutos = ['Computador','Celular','Tablet','Notebook'];
  res.render("produtos",{
    // Enviando variáveis para a página HTML
    listaProdutos : listaProdutos
  })
})

// Rota de Produtos - Com Parâmetro
app.get("/produtos/:produto",(req,res)=>{
        const produto = req.params.produto;
        res.render("detalhesProduto",{
          produto: produto,
        });
})

app.get("/servicos",(req,res)=>{
    res.render("servicos")
})

// Iniciando o servidor na porta 8080
const port = 8080;
app.listen(port, (error) => {
  if (error) {
    console.log("Ocorreu um erro!"+error);
  } else {
    console.log(`Servidor inciado com sucesso no endereço: http://localhost:${port}`);
  }
});  
