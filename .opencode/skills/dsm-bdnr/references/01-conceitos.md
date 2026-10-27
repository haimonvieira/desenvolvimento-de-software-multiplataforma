# Conceitos consolidados — BDNR

> As aulas são `.docx` sem paginação. As citações usam `arquivo.md` + `§seção`.
> Só os dois PDFs têm `p. N`.

## 1. Por que NoSQL

### Limitações do modelo relacional

O modelo relacional organiza os dados em tabelas com esquema fixo e usa
**junções** para recompor informações. O corpus aponta três problemas práticos
(aula-01, §2):

- **junções custosas** em consultas que cruzam muitas tabelas;
- **descasamento objeto-relacional**: a aplicação trabalha com objetos e o banco
  com tabelas;
- **rigidez do esquema**: mudar a estrutura exige migração.

### Origem do termo

**NoSQL = Not Only SQL** — "não apenas SQL". O termo não é uma negação do SQL:
os bancos de documentos **complementam** os relacionais em cenários específicos
(aula-01, §4.1).

Marcos citados:

- **2006** — Google publica o artigo do **Bigtable** (aula-01, §4.2).
- **2007** — Amazon apresenta o **Dynamo** (aula-01, §4.2).
- **2009** — o termo ganha força em evento organizado por **Johan Oskarsson**
  (aula-01, §4.3).

### Tipos de dados

| Tipo | Definição no corpus | Exemplo |
| --- | --- | --- |
| **Estruturados** | Seguem um esquema rígido, tabular | Registro de uma planilha |
| **Semiestruturados** | Têm alguma organização, mas flexível | JSON, XML |
| **Não estruturados** | Sem estrutura predefinida | Texto livre, imagem, áudio |

Fonte: aula-01, §3.

## 2. As quatro categorias NoSQL

| Categoria | Produto citado | Uso típico |
| --- | --- | --- |
| **Chave-valor** | **Redis** | Cache, sessões, contadores rápidos |
| **Documentos** | **MongoDB** | Dados hierárquicos e semiestruturados |
| **Colunas** | **Cassandra** | Grandes volumes com famílias de colunas |
| **Grafos** | **Neo4j** | Relações complexas entre entidades |

Fonte: aula-01, §4.5; aula-02, §As Quatro Categorias.

## 3. Sistemas distribuídos

### Nó, cluster e partição

- **Nó**: uma máquina do sistema distribuído.
- **Cluster**: conjunto de nós que trabalham juntos.
- **Partição de rede**: falha de comunicação entre partes do cluster.

Fonte: aula-02, §O Teorema CAP.

### Teorema CAP

Formulado por **Eric Brewer em 2000**, o teorema diz que um sistema distribuído
não consegue garantir ao mesmo tempo:

- **C** — Consistência;
- **A** — Disponibilidade;
- **P** — Tolerância a partições.

Como falhas de rede são inevitáveis, **P não é opcional**: na prática a escolha
real é entre **C e A** (aula-02, §Por que é preciso escolher).

| Escolha | Comportamento |
| --- | --- |
| **CP** | Prefere consistência; pode recusar resposta durante a partição |
| **AP** | Prefere disponibilidade; aceita dados temporariamente desatualizados |

### ACID versus BASE

| ACID (relacional) | BASE (NoSQL) |
| --- | --- |
| **A**tomicidade | **B**asicamente disponível |
| **C**onsistência | **S**oft state (estado flexível) |
| **I**solamento | **E**ventual consistency |
| **D**urabilidade | Consistência eventual |

Fonte: aula-02, §ACID versus BASE.

### Replicação e sharding

- **Replicação**: cópias dos mesmos dados em nós diferentes, para
  disponibilidade e leitura.
- **Particionamento (sharding)**: divisão dos dados em **fragmentos ou shards**,
  para escala horizontal.

Estratégias de particionamento citadas: por **intervalo**, por **hash** e por
**lista**. O corpus alerta para a **chave quente** (hot key), que concentra
carga em um shard. Fonte: aula-02, §Replicação e particionamento.

## 4. MongoDB: conceitos básicos

| Conceito relacional | Equivalente no MongoDB |
| --- | --- |
| Banco de dados | Banco de dados |
| Tabela | **Coleção** |
| Linha/registro | **Documento** |
| Coluna | **Campo** |

- **Documento**: registro em BSON, com pares campo–valor e estrutura
  hierárquica.
- **Coleção**: conjunto de documentos.
- **Campo**: par chave–valor dentro do documento.
- Todo documento recebe um `_id` único se não for informado.

Fonte: aula-03, §Documentos, coleções e bancos.

O MongoDB é um banco de **documentos**, criado em **2009** (aula-03,
§O que é o MongoDB).

## 5. Atlas, mongosh e Compass

- **MongoDB Atlas**: serviço gerenciado na nuvem, com camada gratuita
  permanente **M0** (aula-03, §O que é o MongoDB Atlas).
- **Network Access**: para o ambiente de aula, o material libera
  `0.0.0.0/0` (aula-03, §Passo 5).
- **String de conexão**: `mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/`
  (aula-03, §Conectando ao banco).
- **mongosh**: shell de linha de comando. Comandos de navegação:
  `show dbs`, `use <banco>`, `show collections` (aula-03, §Usando o mongosh).
- **Compass**: interface gráfica; permite conectar com a mesma string e filtrar
  visualmente (aula-03, §Usando o Compass).

## 6. CRUD

### Inserção

```js
db.produtos.insertOne({ nome: 'Caneca', preco: 25.00, categoria: 'cozinha' })

db.produtos.insertMany([
  { nome: 'Caderno', preco: 12.50, categoria: 'papelaria' },
  { nome: 'Lápis', preco: 1.50, categoria: 'papelaria' }
])
```

Fonte: aula-04, §Inserindo Documentos.

### Consulta

```js
db.produtos.find()                 // todos
db.produtos.findOne({ nome: 'Caneca' })
db.produtos.find().limit(5)
db.produtos.countDocuments({})     // contagem
```

Fonte: aula-04, §Consultando Documentos.

### Operadores de comparação

| Operador | Significado |
| --- | --- |
| `$eq` | Igual |
| `$ne` | Diferente |
| `$gt` | Maior que |
| `$gte` | Maior ou igual |
| `$lt` | Menor que |
| `$lte` | Menor ou igual |
| `$in` | Está na lista |
| `$nin` | Não está na lista |

```js
db.produtos.find({ preco: { $gte: 20, $lte: 100 } })
db.produtos.find({ categoria: { $in: ['papelaria', 'cozinha'] } })
```

Fonte: aula-04, §Operadores de Comparação.

### Operadores lógicos

| Operador | Efeito |
| --- | --- |
| `$and` | Todas as condições |
| `$or` | Pelo menos uma condição |
| `$not` | Nega uma condição |
| `$nor` | Nenhuma das condições |

```js
db.produtos.find({ $or: [{ categoria: 'papelaria' }, { preco: { $lt: 10 } }] })
db.produtos.find({ preco: { $not: { $gt: 50 } } })
```

Fonte: aula-04, §Operadores Lógicos.

### Projeção, ordenação e paginação

```js
db.produtos.find(
  { categoria: 'papelaria' },
  { nome: 1, preco: 1, _id: 0 }   // 1 inclui, 0 exclui
)

db.produtos.find().sort({ preco: -1 })   // -1 decrescente
db.produtos.find().skip(2).limit(2)      // página 2, 2 itens
```

Fonte: aula-05, §Refinando Consultas.

### Atualização

```js
db.produtos.updateOne({ nome: 'Caneca' }, { $set: { preco: 30.00 } })
db.produtos.updateMany({ categoria: 'papelaria' }, { $inc: { preco: 2 } })
```

| Operador | Efeito |
| --- | --- |
| `$set` | Define o valor do campo |
| `$inc` | Soma (ou subtrai) um valor numérico |
| `$unset` | Remove o campo |
| `$rename` | Renomeia o campo (novo nome em **string**) |

Fonte: aula-05, §Atualizando Documentos.

### Remoção

```js
db.produtos.deleteOne({ nome: 'Caneca' })
db.produtos.deleteMany({ categoria: 'acessorios' })
```

**Cuidado:** `deleteMany({})` sem critério apaga **todos** os documentos
(aula-05, §Removendo documentos).

### Arrays

| Operador | Efeito |
| --- | --- |
| `$push` | Adiciona item (permite repetição) |
| `$pull` | Remove itens que casam com a condição |
| `$addToSet` | Adiciona só se ainda não existir |

Fonte: aula-05, §Trabalhando com listas.

## 7. Modelagem de documentos

### Embedding versus referencing

| Estratégia | Quando usar | Custo |
| --- | --- | --- |
| **Embedding** (aninhar) | Dados acessados juntos e que não crescem sem limite | Documento maior; limite de **16 MB** |
| **Referencing** (referenciar) | Dados independentes, muitos-para-muitos, que mudam muito | Exige `$lookup` ou segunda consulta |

Fonte: aula-06, §Embedding e referencing.

O limite de **16 MB** por documento é o teto que impede aninhar listas
ilimitadas (aula-06, §Comparando as duas estratégias).

### Padrões de modelagem

| Padrão | Ideia |
| --- | --- |
| **Bucket** | Agrupar muitos eventos em um documento, com limite |
| **Computed** | Guardar um valor calculado para evitar recalcular |
| **Subset** | Trazer só os campos mais usados de outro documento |
| **Extended Reference** | Copiar poucos campos do documento referenciado |

Fonte: aula-06, §Padrões Bucket e Computed; §Padrões Subset e Extended
Reference.

### Validação de esquema

```js
db.createCollection('usuarios', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nome', 'email'],
      properties: {
        nome: { bsonType: 'string' },
        email: { bsonType: 'string' }
      }
    }
  }
})
```

Fonte: aula-06, §Criando uma coleção com validação.

## 8. Pipeline de agregação

Um pipeline é uma **sequência de estágios**; a saída de um alimenta o próximo
(aula-07, §Pipeline de agregação).

| Estágio | Função |
| --- | --- |
| `$match` | Filtra documentos (como o `WHERE`) |
| `$project` | Escolhe ou calcula campos |
| `$group` | Agrupa por `_id` e aplica acumuladores |
| `$sort` | Ordena |
| `$limit` | Limita a quantidade |
| `$unwind` | Desmonta um array em vários documentos |
| `$lookup` | Junta outra coleção |

### Acumuladores

`$sum`, `$avg`, `$min`, `$max` e `$push` (aula-07, §Agrupando com Group).

```js
db.produtos.aggregate([
  { $group: {
      _id: '$categoria',
      quantidade: { $sum: 1 },
      preco_medio: { $avg: '$preco' }
  } }
])
```

### `$unwind`

```js
db.pedidos.aggregate([
  { $unwind: '$itens' },
  { $group: { _id: '$itens.produto', vendidos: { $sum: '$itens.quantidade' } } },
  { $sort: { vendidos: -1 } }
])
```

Gera **um documento por item** do array antes de agrupar (aula-07,
§O estágio unwind).

### `$lookup`

```js
db.pedidos.aggregate([
  { $lookup: {
      from: 'clientes',
      localField: 'cliente_id',
      foreignField: '_id',
      as: 'dados_cliente'
  } }
])
```

Fonte: aula-07, §O estágio lookup.

## 9. Índices

Índice é uma estrutura auxiliar que evita varrer todos os documentos. Custo:
ocupa espaço e **torna as gravações mais lentas** (aula-08, §Índices).

```js
db.alunos.createIndex({ matricula: 1 })          // simples
db.alunos.createIndex({ nome: 1, curso: -1 })    // composto
db.alunos.createIndex({ email: 1 }, { unique: true })
db.livros.createIndex({ titulo: 'text', resumo: 'text' })
db.sessoes.createIndex({ criadoEm: 1 }, { expireAfterSeconds: 3600 })
```

Conferência:

```js
db.alunos.find({ matricula: '202612345' }).explain('executionStats')
```

Fonte: aula-08, §Criando um índice; §Verificando se o índice é usado.

### Tipos especiais

- **Texto**: `$text` + `$search` (aula-08, §Índice de texto).
- **TTL**: apaga documentos após o tempo indicado (aula-08, §Índice de
  expiração automática).
- **Geoespacial**: apenas mencionado, sem comando (aula-08, §Índices
  Especiais).
