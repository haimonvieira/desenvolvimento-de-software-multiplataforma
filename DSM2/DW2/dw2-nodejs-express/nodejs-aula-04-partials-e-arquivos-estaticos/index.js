//Importando o MÓDULO do Express
const express = require("express");

//Criando instancia do Express
const app = express();

//Iniciando servidor na porta 8080
const port = 8080;

//Configurando o EJS
app.set('view engine', 'ejs');

//Criando a rota principal do site
app.get("/", (req, res) => {
    res.render("index");
})


//Criando rota de perfil do usuario
app.get("/perfil", (req, res) =>{
    res.render("perfil");
});

app.get("/clientes", (req, res) => {
    res.render("clientes");
});

app.get("/produtos", (req, res) => {
    res.render("produtos");
});

app.get("/servicos", (req, res) => {
    res.render("servicos");
})

app.listen(port, (error) =>{

    if(error){

        console.log("Ocorreu um erro: " + error.message);

    }else{
     
        console.log("Servidor iniciado na endereço: http://localhost:" + port);

    }

});
