// Importar o express
import express from "express";
// Carregando express
const app = express();

//Configurações do express
app.use(express.json()) // permitindo usar .json

// Rota principal da API
app.get("/", (req, res) => {
    //json que sera retornado pela api
    const games = [
        {
            title: "God of War: Ragnarok",
            year: "2023",
            platform: "Playstation 4",
            price: 198
        },
        {
            title: "The Sims",
            year: "2016",
            platform: "PC (Windows)",
            price: 149
        },
        {
            title: "CS GO",
            year: "2012",
            platform: "PC (Windows)",
            price: 89
        }
    ];

    //Configurando o retorno da API
    res.status(200).json(games);

})

app.get("/movies", (req, res) => {

    const movies = [
        {
            title: "Eu Robo",
            year: 2010
        }
    ]

    res.json(movies);

})


// Iniciando servidor da API
const port = 4000;
app.listen(port, (error) => {
    if(error){
        console.log("Erro ao iniciar o servidor da API: " + error)
    }else{
        console.log("API iniciada com sucesso na porta: http://localhost:" + port)
    }
})