use('loja');
db.produtos.insertOne({
    nome: "caneca",
    preco: 25.00,
    categoria: "cozinha",
    estoque: 15
})

db.produtos.insertMany([
    {
        id: "P014", nome: "Camera Action One", categoria: "fotografia", preco: 899.90, estoque: 6,
        atributosEspecificos: {resolucao: "4K", estabilizacao: "digital", resistenciaAgua: "10m"}
    },
    {
        id: "P015", nome: "Livro Python Aplicado", categoria: "livros", preco: 94.90, estoque: 22,
        atributosEspecificos: {autor: "Carlos Nogueira", paginas: 360, assuntos: ["Python", "dados", "automacao"]}
    },
    {
        id: "P016", nome: "Garrafa Smart Temp", categoria: "utilidades", preco: 79.90, estoque: 30,
        atributosEspecificos: {capacidade: "500ml", material: "inox", recursos: ["temperatura", "display"]}
    }
])

db.produtos.find({"atributosEspecificos.resolucao": "4K"})
db.produtos.find({"atributosEspecificos.autor": "Carlos Nogueira"})
db.produtos.find({"atributosEspecificos.material": "inox"})