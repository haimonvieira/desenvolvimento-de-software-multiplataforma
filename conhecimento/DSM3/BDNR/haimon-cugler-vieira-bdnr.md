---
disciplina: DSM3/BDNR
titulo: Haimon Cugler Vieira   BDNR
fonte: DSM3/BDNR/Haimon Cugler Vieira - BDNR.pdf
tipo: pdf
paginas: 8
extraido_em: 2026-10-24
---

<!-- page: 1 -->

MongoDB na prática
1. Criar o banco de dados e a coleção
Comandos
  use loja_escolar

  db.createCollection("produtos")

  show collections

  db.getName()

Resultados
  { ok: 1 }

  produtos

  db_456r2yvtd_456r9s6j6


2. Inserir documentos
Comando
  db.produtos.insertMany([
    { nome: "Caderno", categoria: "Papelaria", preco: 18.50, estoque: 30, ativo: true },
    { nome: "Caneta azul", categoria: "Papelaria", preco: 3.50, estoque: 80, ativo: true },
    { nome: "Mochila", categoria: "Acessorios", preco: 89.90, estoque: 12, ativo: true },
    { nome: "Estojo", categoria: "Acessorios", preco: 24.00, estoque: 0, ativo: false },
    { nome: "Lapis", categoria: "Papelaria", preco: 2.00, estoque: 55, ativo: true },
    { nome: "Garrafa", categoria: "Acessorios", preco: 35.00, estoque: 20, ativo: true }
  ])

Resultado
  {
      acknowledged: true,
      insertedIds: {
        '0': ObjectId('6ad77c30388a0fb7ade9e27d'),
        '1': ObjectId('6ad77c30388a0fb7ade9e27e'),
        '2': ObjectId('6ad77c30388a0fb7ade9e27f'),
        '3': ObjectId('6ad77c30388a0fb7ade9e280'),
        '4': ObjectId('6ad77c30388a0fb7ade9e281'),
        '5': ObjectId('6ad77c30388a0fb7ade9e282')
      }
  }


3. Relatórios simples com find()
Relatório 1 - Todos os produtos
Comando
  db.produtos.find({})

Resultado

<!-- page: 2 -->

  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27d'),
           nome: 'Caderno',
           categoria: 'Papelaria',
           preco: 18.5,
           estoque: 30,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27e'),
           nome: 'Caneta azul',
           categoria: 'Papelaria',
           preco: 3.5,
           estoque: 80,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27f'),
           nome: 'Mochila',
           categoria: 'Acessorios',
           preco: 89.9,
           estoque: 12,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e280'),
           nome: 'Estojo',
           categoria: 'Acessorios',
           preco: 24,
           estoque: 0,
           ativo: false
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e281'),
           nome: 'Lapis',
           categoria: 'Papelaria',
           preco: 2,
           estoque: 55,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e282'),
           nome: 'Garrafa',
           categoria: 'Acessorios',
           preco: 35,
           estoque: 20,
           ativo: true
      }
  ]

Relatório 2 - Apenas produtos da Papelaria
Comando
  db.produtos.find({ categoria: "Papelaria" })

Resultado

<!-- page: 3 -->

  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27d'),
           nome: 'Caderno',
           categoria: 'Papelaria',
           preco: 18.5,
           estoque: 30,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27e'),
           nome: 'Caneta azul',
           categoria: 'Papelaria',
           preco: 3.5,
           estoque: 80,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e281'),
           nome: 'Lapis',
           categoria: 'Papelaria',
           preco: 2,
           estoque: 55,
           ativo: true
      }
  ]

Relatório 3 - Produtos com preço acima de R$ 20,00
Comando
  db.produtos.find({ preco: { $gt: 20 } })

Resultado
  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27f'),
           nome: 'Mochila',
           categoria: 'Acessorios',
           preco: 89.9,
           estoque: 12,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e280'),
           nome: 'Estojo',
           categoria: 'Acessorios',
           preco: 24,
           estoque: 0,
           ativo: false
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e282'),
           nome: 'Garrafa',
           categoria: 'Acessorios',
           preco: 35,
           estoque: 20,
           ativo: true
      }
  ]

Relatório 4 - Produtos com estoque disponível
Comando
  db.produtos.find({ estoque: { $gt: 0 } })

Resultado

<!-- page: 4 -->

  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27d'),
           nome: 'Caderno',
           categoria: 'Papelaria',
           preco: 18.5,
           estoque: 30,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27e'),
           nome: 'Caneta azul',
           categoria: 'Papelaria',
           preco: 3.5,
           estoque: 80,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27f'),
           nome: 'Mochila',
           categoria: 'Acessorios',
           preco: 89.9,
           estoque: 12,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e281'),
           nome: 'Lapis',
           categoria: 'Papelaria',
           preco: 2,
           estoque: 55,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e282'),
           nome: 'Garrafa',
           categoria: 'Acessorios',
           preco: 35,
           estoque: 20,
           ativo: true
      }
  ]

Relatório 5 - Mostrar somente nome e preço
Comando
  db.produtos.find({}, { nome: 1, preco: 1, _id: 0 })

Resultado
  [
      { nome: 'Caderno', preco: 18.5 },
      { nome: 'Caneta azul', preco: 3.5 },
      { nome: 'Mochila', preco: 89.9 },
      { nome: 'Estojo', preco: 24 },
      { nome: 'Lapis', preco: 2 },
      { nome: 'Garrafa', preco: 35 }
  ]

Relatório 6 - Produtos ordenados pelo menor preço
Comando
  db.produtos.find({}).sort({ preco: 1 })

Resultado

<!-- page: 5 -->

  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e281'),
           nome: 'Lapis',
           categoria: 'Papelaria',
           preco: 2,
           estoque: 55,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27e'),
           nome: 'Caneta azul',
           categoria: 'Papelaria',
           preco: 3.5,
           estoque: 80,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27d'),
           nome: 'Caderno',
           categoria: 'Papelaria',
           preco: 18.5,
           estoque: 30,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e280'),
           nome: 'Estojo',
           categoria: 'Acessorios',
           preco: 24,
           estoque: 0,
           ativo: false
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e282'),
           nome: 'Garrafa',
           categoria: 'Acessorios',
           preco: 35,
           estoque: 20,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27f'),
           nome: 'Mochila',
           categoria: 'Acessorios',
           preco: 89.9,
           estoque: 12,
           ativo: true
      }
  ]

Relatório 7 - Quantidade de produtos cadastrados
Comando
  db.produtos.countDocuments({})

Resultado
  6


4. Desafio individual
a) Produtos da categoria Acessorios
Comando
  db.produtos.find({ categoria: "Acessorios" })

Resultado

<!-- page: 6 -->

  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27f'),
           nome: 'Mochila',
           categoria: 'Acessorios',
           preco: 89.9,
           estoque: 12,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e280'),
           nome: 'Estojo',
           categoria: 'Acessorios',
           preco: 24,
           estoque: 0,
           ativo: false
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e282'),
           nome: 'Garrafa',
           categoria: 'Acessorios',
           preco: 35,
           estoque: 20,
           ativo: true
      }
  ]

b) Produtos que custam menos de R$ 30,00
Comando
  db.produtos.find({ preco: { $lt: 30 } })

Resultado
  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27d'),
           nome: 'Caderno',
           categoria: 'Papelaria',
           preco: 18.5,
           estoque: 30,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27e'),
           nome: 'Caneta azul',
           categoria: 'Papelaria',
           preco: 3.5,
           estoque: 80,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e280'),
           nome: 'Estojo',
           categoria: 'Acessorios',
           preco: 24,
           estoque: 0,
           ativo: false
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e281'),
           nome: 'Lapis',
           categoria: 'Papelaria',
           preco: 2,
           estoque: 55,
           ativo: true
      }
  ]

c) Produtos inativos

<!-- page: 7 -->

Comando
  db.produtos.find({ ativo: false })

Resultado
  [
      {
          _id: ObjectId('6ad77c30388a0fb7ade9e280'),
          nome: 'Estojo',
          categoria: 'Acessorios',
          preco: 24,
          estoque: 0,
          ativo: false
      }
  ]

d) Mostrar somente nome e estoque, sem _id
Comando
  db.produtos.find({}, { nome: 1, estoque: 1, _id: 0 })

Resultado
  [
      { nome: 'Caderno', estoque: 30 },
      { nome: 'Caneta azul', estoque: 80 },
      { nome: 'Mochila', estoque: 12 },
      { nome: 'Estojo', estoque: 0 },
      { nome: 'Lapis', estoque: 55 },
      { nome: 'Garrafa', estoque: 20 }
  ]

e) Produtos do maior para o menor estoque
Comando
  db.produtos.find({}).sort({ estoque: -1 })

Resultado

<!-- page: 8 -->

  [
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27e'),
           nome: 'Caneta azul',
           categoria: 'Papelaria',
           preco: 3.5,
           estoque: 80,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e281'),
           nome: 'Lapis',
           categoria: 'Papelaria',
           preco: 2,
           estoque: 55,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27d'),
           nome: 'Caderno',
           categoria: 'Papelaria',
           preco: 18.5,
           estoque: 30,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e282'),
           nome: 'Garrafa',
           categoria: 'Acessorios',
           preco: 35,
           estoque: 20,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e27f'),
           nome: 'Mochila',
           categoria: 'Acessorios',
           preco: 89.9,
           estoque: 12,
           ativo: true
      },
      {
           _id: ObjectId('6ad77c30388a0fb7ade9e280'),
           nome: 'Estojo',
           categoria: 'Acessorios',
           preco: 24,
           estoque: 0,
           ativo: false
      }
  ]

f) Quantidade de produtos da categoria Papelaria
Comando
  db.produtos.countDocuments({ categoria: "Papelaria" })

Resultado
  3
