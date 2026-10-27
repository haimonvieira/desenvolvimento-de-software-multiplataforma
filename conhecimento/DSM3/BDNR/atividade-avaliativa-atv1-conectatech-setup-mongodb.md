---
disciplina: DSM3/BDNR
titulo: conectaTech setup.mongodb
fonte: DSM3/BDNR/Atividade Avaliativa/ATV1/conectaTech_setup.mongodb.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

//use conectaTech_aula

db.clientes.drop()
db.produtos.drop()
db.pedidos.drop()

db.clientes.insertMany([{_id:'C001',nome:'Ana Souza',email:'ana@exemplo.com'},{_id:'C002',nome:'Bruno Lima',email:'bruno@exemplo.com'},{_id:'C003',nome:'Carla Mendes',email:'carla@exemplo.com'},{_id:'C004',nome:'Diego Santos',email:'diego@exemplo.com'}])

db.produtos.insertMany([{_id: 'P001', nome: 'Caderno Universitario', categoria: 'papelaria', preco: 24.90, estoque: 40 },{ _id: 'P002', nome: 'Caneta Azul', categoria: 'papelaria', preco: 3.50, estoque: 100 },{ _id: 'P003', nome: 'Mochila Escolar', categoria: 'acessorios', preco: 129.90, estoque: 20 },{ _id: 'P004', nome: 'Mouse USB', categoria: 'informatica', preco: 59.90, estoque: 30 },{ _id: 'P005', nome: 'Teclado Mecanico', categoria: 'informatica', preco: 189.90, estoque: 15 },{ _id: 'P006', nome: 'Garrafa Termica', categoria: 'utilidades', preco: 79.90, estoque: 25 },{ _id: 'P007', nome: 'Headset', categoria: 'informatica', preco: 149.90, estoque: 18 },{ _id: 'P008', nome: 'Agenda 2026', categoria: 'papelaria', preco: 39.90, estoque: 35 }])

db.pedidos.insertMany([{_id: 'PED001', cliente_id: 'C001', cliente_nome: 'Ana Souza', data: '2026-09-15', total: 67.30,itens: [{produto_id: 'P001', produto: 'Caderno Universitario', quantidade: 2, preco: 24.90 },{ produto_id: 'P002', produto: 'Caneta Azul', quantidade: 5, preco: 3.50 }]},{_id: 'PED002', cliente_id: 'C002', cliente_nome: 'Bruno Lima', data: '2026-09-15', total: 249.80,itens: [{ produto_id: 'P004', produto: 'Mouse USB', quantidade: 1, preco: 59.90 },{ produto_id: 'P005', produto: 'Teclado Mecanico', quantidade: 1, preco: 189.90 }]},{_id: 'PED003', cliente_id: 'C001', cliente_nome: 'Ana Souza', data: '2026-09-15', total: 209.70,itens: [{produto_id: 'P003', produto: 'Mochila Escolar', quantidade: 1, preco: 129.90 },{ produto_id: 'P008', produto: 'Agenda 2026',quantidade: 2, preco: 39.90 }]},{_id: 'PED004', cliente_id: 'C003', cliente_nome: 'Carla Mendes', data: '2026-09-15', total: 114.90,itens: [{produto_id: 'P002', produto: 'Caneta Azul', quantidade: 10, preco: 3.50 },{ produto_id: 'P006', produto: 'Garrafa Termica', quantidade: 1, preco: 79.90 }]},{_id: 'PED005', cliente_id: 'C004', cliente_nome: 'Diego Santos', data: '2026-09-15', total: 359.70,itens: [{produto_id: 'P007', produto: 'Headset', quantidade: 2, preco: 149.90 },{ produto_id: 'P004', produto: 'Mouse USB', quantidade: 1, preco: 59.90 }]},{_id: 'PED006', cliente_id: 'C002', cliente_nome: 'Bruno Lima', data: '2026-09-15', total: 114.60,itens: [{ produto_id: 'P001', produto: 'Caderno Universitario', quantidade: 3, preco: 24.90 },{ produto_id: 'P008', produto: 'Agenda 2026', quantidade: 1, preco: 39.90 }]}])


/*
Embedding X Referencing

Embedding => guarda dados relacionados dentro do mesmo documento. A vantagem principal é ler o conjunto de uma vez.
Referencing => Mantém os dados em documentos separados e usa um identificador para criar a ligação

Um documento MongoDB possui limite de 16MB . Portanto, listas que cescem indefinidamente não devem ser incorporadas sem critério
*/

// Demostração - Observar EMBEDDING e REFERENCING

db.pedidos.findOne({_id:'PED001'}) //EMBEDDING
db.clientes.findOne({_id:'C001'})  //REFERENCING

/*
Padrões Bucket e Computed

Bucked: Agrupa muitos dados de um intervalo ou grupo em um único documento. É útil quando informações chegam em grande quantidade ao longo do tempo

Computed: Guarda um valor calculado pronto para evitar repetir o cálculo em toda leitura. A troca é fazer mais trabalho na escrita para obter leitura mais rápida.
*/

db.pedidos.find({_id:'PED002'},{_id:1,total:1,item:1})

/*
Padrões Subsest e Extended Reference

Subset: Mantém junto apenas o subconjunto mais utilizado e deixa o histórico completo separado. É um meio-termo entre guardar tudo junto e separar tudo.

Extended Reference: Além do identificador da referência, copia alguns campo mais usados para evitar buscas extras em consultas simples.
*/

// Demostração - Extended Reference
db.pedidos.find({},{_id:1, cliente_nome:1,total:1})

/*
Validação de esquema

A validação de esquema cria regras mínimas para os documentos. A flexibilidade continua existindo, mas campos importantes podem ser exibidas e ter o tipo controlado.
*/

db.createCollection('produtos_validacao',{validator:{$jsonSchema:{bsonType:'object',required:['nome','preco'],properties:{nome:{bsonType:'string'},preco:{bsonType:'double',minimum:0}}}}})

// Pipeline de Agregação
/*
    O pipeline funciona como uma esteira: cada estágio recebe o resultado anterior, transforma e entrega o próximo
*/

// Aggregate, match e project
/*
    $match filtra documentos. É comum colocá-lo cedo para reduziar o volume que seguirá pelo pipeline. $project escolhe campos e também pode criar campos calculados.
*/

// Exemplo 01 - Filtrar uma categoria
db.produtos.aggregate([{$match: {categoria:'papelaria'}}]);

// Exemplo 02 - Filtrar, escolher campos e calcular uma informação
db.produtos.aggregate([{$match: {categoria:'informatica'}}, {$project: {_id:0, nome:1, preco:1, caro:{$gt:['$preco',100]}}}]);

/*
Dentro das expressões do pepeline, $preco significa "use o valor do campo preço". Sem o cifrão, o MongoDB interpretaria o conteúdo como valor literal, não como referência ao campo.
*/

// Group e Acumuladores
/*
    $group reúne documentos que compartilham um critério. O campo _id do group define por qual valor ocorrerá o agrupamento. Os acumuladores calculam resultados para cada grupo.
*/
// Exemplo 03 - Relatório por categoria
db.produtos.aggregate([{$group: {_id: '$categoria', quantidade: {$sum:1}, preco_medio:{$avg:"$preco"}, mais_barato:{$min:'$preco'}, mais_caro:{$max:"$preco"}}},{$sort: {_id:1}}]);

// Exemplo 04 - Ranking das categorias com mais produtos
// SORT / LIMIT / UNWIND

db.produtos.aggregate([{$group:{_id:'$categoria', total:{$sum:1}}},{$sort:{total:-1, _id:1}}, {$limit:3}]);

/*
$unwind "desmonta" uma lista, criando uma saída para cada MediaElementAudioSourceNode. Na coleção pedidos, isso permite tratar cada item como uma unidade de análise.
*/

// Exemplo 05 - Observar o efeito do $unwind
db.pedidos.aggregate([{$unwind:'$itens'}, {$project: {_id:1,cliente_id:1,produto:'$itens.produto',quantidade:'$itens.quantidade'}},{$limit:6}]);

// $lookup - $lookup busca dados relacionados em outra coleção
db.pedidos.aggregate([{$lookup: {from: 'clientes', localField: 'cliente_id', foreignField: '_id', as: 'dados_cliente'}}]);

// Cada pedido recebe o campo dados_cliente como uma lista contendo dados do cliente correspondente.

// Exemplo 06 - Organizar o resultado após o lookup
db.pedidos.aggregate([{$lookup: {from: 'clientes',localField: 'cliente_id',foreignField: '_id',as: 'dados_cliente'}},{$unwind:'$dados_cliente'}, {$project: {_id:1,cliente:'$dados_cliente.nome',email:'$dados_cliente.email',total:1}}]);

// Desafio 1 - Qual é o valor total de pedidos de cada cliente?
db.pedidos.aggregate([{$group: {_id:'$cliente_id', cliente:{$first:'$cliente_nome'},total_comprado:{$sum:'$total'},quantidade_pedidos:{$sum:1}}},{$sort:{total_comprado:-1}}]);

// Desafio 2 - Além da quantidade vendida, qual produto gerou maior valor de vendas nos pedidos?
db.pedidos.aggregate([{$unwind: '$itens'}, {$project: {produto:'$itens.produto',valor_item:{$multiply:[{$toDouble:'$itens.quantidade'},{$toDouble:'$itens.preco'}]}}},{$group: {_id:'$produto', faturamento:{$sum:'$valor_item'}}},{$sort: {faturamento: -1}}]);

// Desafio 3 - Listar os pedidos do maior para menor total, exibindo nome e e-mail do cliente obtidos da coleção clientes
db.pedidos.aggregate([{$lookup: {from:'clientes',localField:'cliente_id',foreignField:'_id',as:'cliente'}},{$unwind:'$cliente'},{$project:{_id:1,data:1,total:1,cliente_nome:'$cliente.nome',cliente_email:'$cliente.email'}},{$sort:{total:-1}}]);
