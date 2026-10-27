# Glossário — BDNR

## A–C

| Termo | Significado | Observação |
| --- | --- | --- |
| **ACID** | Atomicidade, Consistência, Isolamento e Durabilidade | Modelo tradicional dos bancos relacionais |
| **Aggregation** | Pipeline de transformação de documentos | Sequência de estágios |
| **Atlas** | MongoDB gerenciado na nuvem | Camada gratuita M0 |
| **BASE** | Basicamente disponível, Soft state, Eventual consistency | Modelo oposto ao ACID |
| **Bigtable** | Artigo do Google de 2006 | Marco do NoSQL |
| **BSON** | Representação binária de JSON usada pelo MongoDB | Suporta mais tipos que JSON |
| **Bucket** | Padrão de modelagem que agrupa eventos | Evita arrays ilimitados |
| **CAP** | Consistência, Disponibilidade e Tolerância a partições | Brewer, 2000 |
| **Cassandra** | Banco de colunas | Exemplo de categoria |
| **Chave quente (hot key)** | Chave que concentra carga em um shard | Risco do sharding |
| **Cluster** | Conjunto de nós | Base dos sistemas distribuídos |
| **Coleção** | Conjunto de documentos | Equivale à tabela |
| **Compass** | Interface gráfica do MongoDB | Conecta com a mesma string |
| **Computed** | Padrão que guarda valor calculado | Evita recalcular |
| **Consistência eventual** | Leituras podem ficar temporariamente desatualizadas | Característica do BASE |
| **CRUD** | Create, Read, Update, Delete | Operações básicas |

## D–H

| Termo | Significado | Observação |
| --- | --- | --- |
| **deleteMany** | Remove vários documentos | `{}` apaga todos |
| **deleteOne** | Remove um documento | — |
| **Documento** | Registro BSON com campos e valores | Equivale à linha |
| **Dynamo** | Artigo da Amazon de 2007 | Marco do NoSQL |
| **Embedding** | Aninhar dados dentro do documento | Limite de 16 MB |
| **Extended Reference** | Padrão que copia poucos campos do documento referenciado | Reduz `$lookup` |
| **find** | Consulta documentos | Aceita filtro e projeção |
| **findOne** | Retorna um documento | — |
| **Grafos** | Categoria NoSQL | Exemplo: Neo4j |

## I–P

| Termo | Significado | Observação |
| --- | --- | --- |
| **Índice** | Estrutura que acelera a consulta | Custa espaço e gravação |
| **insertMany** | Insere vários documentos | Lista entre colchetes |
| **insertOne** | Insere um documento | — |
| **JSON** | Formato textual de dados | Base do documento |
| **`$jsonSchema`** | Validador de esquema | Usado no `createCollection` |
| **`$lookup`** | Estágio de junção | `from`, `localField`, `foreignField`, `as` |
| **`$match`** | Estágio de filtro | Como o `WHERE` |
| **M0** | Camada gratuita do Atlas | Permanente |
| **mongosh** | Shell oficial do MongoDB | Substitui o `mongo` legado |
| **MongoDB** | Banco de documentos | Criado em 2009 |
| **NoSQL** | Not Only SQL | Complementa o relacional |
| **Nó** | Máquina de um sistema distribuído | — |
| **Neo4j** | Banco de grafos | Exemplo de categoria |
| **Partição de rede** | Falha de comunicação entre nós | Torna P inevitável |
| **Particionamento** | Divisão dos dados em shards | Também chamado de sharding |
| **Pipeline** | Sequência de estágios de agregação | — |
| **Projeção** | Escolha dos campos retornados | `1` inclui, `0` exclui |

## Q–Z

| Termo | Significado | Observação |
| --- | --- | --- |
| **Redis** | Banco chave-valor | Cache, sessões e contadores |
| **Referencing** | Referenciar outro documento | Usa `_id` e `$lookup` |
| **Replicação** | Cópias dos dados em nós diferentes | Disponibilidade e leitura |
| **Sharding** | Divisão horizontal dos dados | Shards |
| **`$sort`** | Estágio ou método de ordenação | `1` crescente, `-1` decrescente |
| **Subset** | Padrão que traz só os campos mais usados | — |
| **Teorema CAP** | Consistência, disponibilidade e partição | Escolha real é C ou A |
| **TTL** | Índice de expiração automática | `expireAfterSeconds` |
| **`$unwind`** | Desmonta um array | Um documento por item |
| **`updateMany`** | Atualiza vários documentos | — |
| **`updateOne`** | Atualiza um documento | — |
| **`$addToSet`** | Adiciona item sem duplicar | — |
| **`$inc`** | Soma/subtrai valor numérico | — |
| **`$pull`** | Remove itens de um array | — |
| **`$push`** | Adiciona item a um array | Permite repetição |
| **`$rename`** | Renomeia campo | Novo nome em string |
| **`$set`** | Define o valor de um campo | — |
| **`$unset`** | Remove campo | — |
