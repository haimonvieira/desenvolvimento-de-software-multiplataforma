use('loja');

// insertOne() - insercao de um unico registro nna colecao
db.produtos.insertOne({
    nome: "caneca",
    preco: 25.00,
    categoria: "cozinha",
    estoque: 20
})