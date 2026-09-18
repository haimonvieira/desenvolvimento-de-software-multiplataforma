//use conectaTech_aula

db.clientes.drop()
db.produtos.drop()
db.pedidos.drop()

db.clientes.insertMany([
  { _id: 'C001', nome: 'Ana Souza', email: 'ana@exemplo.com' },
  { _id: 'C002', nome: 'Bruno Lima', email: 'bruno@exemplo.com' },
  { _id: 'C003', nome: 'Carla Mendes', email: 'carla@exemplo.com' },
  { _id: 'C004', nome: 'Diego Santos', email: 'diego@exemplo.com' }
])

db.produtos.insertMany([
  { _id: 'P001', nome: 'Caderno Universitario', categoria: 'papelaria', preco: 24.90, estoque: 40 },
  { _id: 'P002', nome: 'Caneta Azul', categoria: 'papelaria', preco: 3.50, estoque: 100 },
  { _id: 'P003', nome: 'Mochila Escolar', categoria: 'acessorios', preco: 129.90, estoque: 20 },
  { _id: 'P004', nome: 'Mouse USB', categoria: 'informatica', preco: 59.90, estoque: 30 },
  { _id: 'P005', nome: 'Teclado Mecanico', categoria: 'informatica', preco: 189.90, estoque: 15 },
  { _id: 'P006', nome: 'Garrafa Termica', categoria: 'utilidades', preco: 79.90, estoque: 25 },
  { _id: 'P007', nome: 'Headset', categoria: 'informatica', preco: 149.90, estoque: 18 },
  { _id: 'P008', nome: 'Agenda 2026', categoria: 'papelaria', preco: 39.90, estoque: 35 }
])

db.pedidos.insertMany([
  {
    _id: 'PED001', cliente_id: 'C001', cliente_nome: 'Ana Souza', data: '2026-09-15', total: 67.30,
    itens: [
      { produto_id: 'P001', produto: 'Caderno Universitario', quantidade: 2, preco: 24.90 },
      { produto_id: 'P002', produto: 'Caneta Azul', quantidade: 5, preco: 3.50 }
    ]
  },
  {
    _id: 'PED002', cliente_id: 'C002', cliente_nome: 'Bruno Lima', data: '2026-09-15', total: 249.80,
    itens: [
      { produto_id: 'P004', produto: 'Mouse USB', quantidade: 1, preco: 59.90 },
      { produto_id: 'P005', produto: 'Teclado Mecanico', quantidade: 1, preco: 189.90 }
    ]
  },
  {
    _id: 'PED003', cliente_id: 'C001', cliente_nome: 'Ana Souza', data: '2026-09-15', total: 209.70,
    itens: [
      { produto_id: 'P003', produto: 'Mochila Escolar', quantidade: 1, preco: 129.90 },
      { produto_id: 'P008', produto: 'Agenda 2026', quantidade: 2, preco: 39.90 }
    ]
  },
  {
    _id: 'PED004', cliente_id: 'C003', cliente_nome: 'Carla Mendes', data: '2026-09-15', total: 114.90,
    itens: [
      { produto_id: 'P002', produto: 'Caneta Azul', quantidade: 10, preco: 3.50 },
      { produto_id: 'P006', produto: 'Garrafa Termica', quantidade: 1, preco: 79.90 }
    ]
  },
  {
    _id: 'PED005', cliente_id: 'C004', cliente_nome: 'Diego Santos', data: '2026-09-15', total: 359.70,
    itens: [
      { produto_id: 'P007', produto: 'Headset', quantidade: 2, preco: 149.90 },
      { produto_id: 'P004', produto: 'Mouse USB', quantidade: 1, preco: 59.90 }
    ]
  },
  {
    _id: 'PED006', cliente_id: 'C002', cliente_nome: 'Bruno Lima', data: '2026-09-15', total: 114.60,
    itens: [
      { produto_id: 'P001', produto: 'Caderno Universitario', quantidade: 3, preco: 24.90 },
      { produto_id: 'P008', produto: 'Agenda 2026', quantidade: 1, preco: 39.90 }
    ]
  }
])

/*
Embedding guarda os dados relacionados dentro do mesmo documento. A vantagem é ler o conjunto de uma vez.
Referencing mantem os dados em documentos separados e usa um identificador para criar a ligacao

Um documento MongoDB possui um limite de 16MB. Portante, listas que crescem indefinidamente nao devem ser incorporadas sem criterio
*/

//Demonstração - Observar embedding e referencing
db.pedidos.findOne({_id: "PED001"}) //Embedding
db.clientes.findOne({_id: "C001"}) //Referencing

/*
Bucket: Agrupa muitos dados de um intervalo ou grupo em um unico documento. É util quando informacoes chegam em grande quantidade ao longo do tempo
Computed: Guarda um valor calculado pronto para evitar repetir o calculo em toda leitura. A troca é fazer mais trabalho na escrita para obter leitura mais rapida
*/
db.pedidos.find({_id: "PED002"}, {_id: 1, total: 1, itens: 1})

/*
Padrões Subset e Extended Reference

Subset: mantem junto apenas o subconjunto mais utilizado e deixa o historico completo separada. É um meio-termo entre guardar tudo junto e separar tudo.

Extended Reference: Além do identificador da referencia, copia alguns campos mais usados para evitar buscas extras em consultas simples.
*/
// Demonstração - Extended Reference
db.pedidos.find({}, {_id: 1, cliente_nome: 1, total: 1})

/*
Validação de esquema

A validação de esquema cria regras minimas para os documentos. A flexibilidade continua existindo, mas campos importantes podem ser exigido e ter o tipo controlado.
*/
db.createCollection("produtos_validacao", 
  {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["nome", "preco"],
        properties: {
          nome: {bsonType: "string"},
          preco: {bsonType: "double", minimum: 0},
        }
      }
    }
  }
)
