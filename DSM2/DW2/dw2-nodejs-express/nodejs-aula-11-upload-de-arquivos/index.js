import express from 'express';
import multer from 'multer';
import connection from './config/sequelize-config.js';

//Importando model
import Imagem from './models/Imagem.js';

const app = express();
const port = 8081;

app.use(express.static('public'));
//Setando EJS como renderizador de pagina
app.set('view engine', 'ejs');

connection.authenticate().then(() => {
    console.log("Conexao com BD realizada com sucesso");
}).catch((error) => {
    console.log("Erro ao realizar conexao com BD: " + error);
});

//Criando banco de dados
connection.query("create database if not exists galeria;").then(() => {
    console.log("Banco de dados criado.");
}).catch(error => {
    console.log("Erro ao criar banco de dados: " + error);
})

const upload = multer({
    dest: 'public/uploads/'
})

app.get("/", (req, res) => {

    Imagem.findAll().then(imagens => {
        res.render('index', {
            imagens: imagens
        })
    }).catch(error => {
        console.log("Erro ao carregar imagens: " + error);
    })

})

app.post("/upload", upload.single('file'), (req, res) => {

    //Gravando nome do arquivo gerado pelu multer na variavel 'file'
    const file = req.file.filename;
    Imagem.create({
        arquivo: file
    }).then(() => {
        res.redirect("/");
    }).catch(error => {
        console.log("Erro ao gravar arquivo no banco de dados: " + error);
    })

})



app.listen(port, (error) => {
    if(error){
        console.log("Erro ao iniciar o servidor: " + error);
    }else{
        console.log(`Servidor iniciado com sucesso em http://localhost:${port}`)
    }
})

