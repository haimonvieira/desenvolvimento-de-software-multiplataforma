---
name: DSM — Banco de Dados Não Relacional (BDNR)
description: Responde dúvidas de Banco de Dados Não Relacional do curso DSM usando o material local em conhecimento/DSM3/BDNR. Cobre NoSQL (Not Only SQL), limitações do modelo relacional, dados estruturados/semiestruturados, as quatro categorias NoSQL (chave-valor, documentos, colunas e grafos), Teorema CAP, ACID versus BASE, replicação e sharding, MongoDB (documento, coleção, Atlas M0, mongosh, Compass), CRUD (insertOne/insertMany, find/findOne, updateOne/updateMany, deleteOne/deleteMany), operadores de comparação e lógicos, projeção, sort, skip/limit, arrays, embedding versus referencing, padrões de modelagem, validação com $jsonSchema, pipeline de agregação ($match, $project, $group, $sort, $limit, $unwind, $lookup) e índices (simples, composto, único, texto e TTL). Use quando a pergunta citar BDNR, NoSQL, MongoDB, documento, coleção, aggregation, sharding, CAP ou modelagem de documentos.
metadata:
  opencode/autoinvoke: false
---

# Banco de Dados Não Relacional (DSM3/BDNR)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus tem 8 aulas em `.docx` (sem paginação),
2 PDFs com paginação, scripts de carga, resoluções de aluno e um simulado.

## Escopo

Entram: definição de NoSQL e origem do termo; limitações do modelo relacional;
dados estruturados, semiestruturados e não estruturados; JSON/BSON; as quatro
categorias NoSQL; Teorema CAP; ACID versus BASE; replicação e sharding;
MongoDB e MongoDB Atlas; `mongosh` e Compass; inserção, consulta, atualização e
remoção; operadores de comparação e lógicos; projeção, ordenação e paginação;
arrays; embedding e referencing; padrões Bucket, Computed, Subset e Extended
Reference; validação com `$jsonSchema`; pipeline de agregação; índices simples,
compostos, únicos, de texto e TTL; `explain('executionStats')`.

Não entram (e não devem ser inventados como se fossem do material): comandos de
Redis, Cassandra ou Neo4j; transações multi-documento (`withTransaction`);
backup e restauração (`mongodump`/`mongorestore`); criação de usuários e roles;
drivers Node.js/Python e Mongoose; estágios avançados de agregação (`$facet`,
`$bucket`, `$out`, `$merge`); `$regex`, `$exists`, `$elemMatch`, `$size`, `$all`,
`upsert`, `arrayFilters`; índices geoespaciais, wildcard, parciais ou esparsos;
GridFS, change streams e time series.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "insertMany" --disciplina DSM3/BDNR --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre.** Para as aulas em `.docx` e para os scripts, cite
   `conhecimento/DSM3/BDNR/<arquivo>.md` e a **seção** (`§Nome da seção`). Só
   use `p. N` nos dois PDFs: `simulado-revisao-bdnr.md` (9 p.) e
   `haimon-cugler-vieira-bdnr.md` (8 p.).

4. **Entregue o comando completo**, com `db.<coleção>.<método>(...)`, não só a
   explicação. O material cobra a sintaxe.

5. **Diferencie o que é do material e o que é derivação.** O gabarito do
   simulado não está no corpus; as respostas objetivas são **derivadas**.

6. **Se não houver cobertura**, diga "isso não está no material indexado de
   BDNR" e só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| NoSQL significa "não usa SQL" | É **Not Only SQL**: complementa, não substitui, o relacional — `aula-01`, §4.1 |
| CAP permite escolher os três | Com partição de rede (inevitável), a escolha real é entre **consistência e disponibilidade** — `aula-02`, §Por que é preciso escolher |
| ACID e BASE são sinônimos | ACID é rígido; BASE aceita consistência eventual — `aula-02`, §ACID versus BASE |
| Sharding e replicação são a mesma coisa | Replicação copia; **sharding** divide os dados em fragmentos — `aula-02`, §Replicação e particionamento |
| `insertOne` e `insertMany` são equivalentes | `insertMany` recebe uma **lista entre colchetes** — `aula-04`, §Inserindo vários de uma vez |
| `$set` e `$inc` fazem o mesmo | `$set` define o valor; `$inc` **soma/subtrai** — `aula-05`, §Atualizando Documentos |
| `deleteMany({})` é seguro | Sem critério, apaga **TODOS** os documentos — `aula-05`, §Removendo documentos |
| Embedding é sempre melhor | Embedding serve para dados acessados juntos; referencing, para dados independentes e muitos-para-muitos; documento limitado a **16 MB** — `aula-06`, §Embedding e referencing |
| `$unwind` agrupa | `$unwind` **desmonta** um array, gerando um documento por item — `aula-07`, §O estágio unwind |
| `$lookup` é um JOIN relacional puro | É a junção do aggregation, com `from`, `localField`, `foreignField` e `as` — `aula-07`, §O estágio lookup |
| Índice só acelera | Também ocupa espaço e **deixa a gravação mais lenta** — `aula-08`, §Índices |
| `.pretty()` é necessário no mongosh | `.pretty()` é do shell legado `mongo`; o `mongosh` já formata — `aula-04`, §Buscando todos os documentos |
| `$rename` aceita identificador | O novo nome precisa ser **string**: `{ $rename: { preco: "valor" } }` — `aula-05`, §Outros operadores |

## Números e fatos que precisam sair exatos

- **NoSQL = Not Only SQL** — `aula-01`, §4.1.
- **Bigtable** (Google) em **2006**; **Dynamo** (Amazon) em **2007** —
  `aula-01`, §4.2.
- O termo ganha força em **2009**, em evento organizado por **Johan
  Oskarsson** — `aula-01`, §4.3.
- **Quatro categorias:** chave-valor (**Redis**), documentos (**MongoDB**),
  colunas (**Cassandra**) e grafos (**Neo4j**) — `aula-01`, §4.5.
- **Teorema CAP:** formulado por **Eric Brewer em 2000** — `aula-02`,
  §O Teorema CAP.
- **Sharding:** divide os dados em **fragmentos ou shards** — `aula-02`,
  §Particionamento.
- **MongoDB:** banco de documentos criado em **2009** — `aula-03`,
  §O que é o MongoDB.
- **Atlas:** camada gratuita permanente **M0** — `aula-03`, §O que é o Atlas.
- **Limite de documento:** **16 MB** — `aula-06`, §Comparando as duas
  estratégias.
- **Índice TTL:** `expireAfterSeconds: 3600` no exemplo — `aula-08`,
  §Índice de expiração automática.
- **Massa da ATV2:** **20 produtos, 12 clientes e 20 pedidos** — LEIA-ME da
  ATV2.
- **Contagens do relatório:** `countDocuments({})` = **6**;
  `countDocuments({ categoria: "Papelaria" })` = **3** —
  `haimon-cugler-vieira-bdnr.md`, p. 5 e 8.

## Cuidados ao responder

- As aulas são `.docx` sem paginação. **Não invente `p. N`** para elas; cite a
  seção.
- **Não há gabarito oficial** nas aulas, no simulado ou na ATV2. As resoluções
  `exercicio01`–`exercicio04` são **respostas de aluno**, não gabarito.
- No simulado, as objetivas Q6–Q9 têm respostas derivadas: **Q6 A, Q7 D, Q8 A,
  Q9 C**. A **Q10 é irrespondível**: o comando que ela manda analisar não foi
  extraído (provável imagem) — `simulado-revisao-bdnr.md`, p. 8.
- O simulado tem tabelas quebradas (`ordens_servi co`, `Ativ o`, `_id` partido
  em `10 / 1`) — p. 1. Não reproduza esses erros.
- `aula-05` mostra `{ $rename: { preco: valor } }`; o correto é `"valor"` entre
  aspas.
- `aula-04` usa `.pretty()`; no `mongosh` isso não é necessário.
- `aula-08` diz que o índice de texto ignora acentuação; isso depende do
  analisador/idioma — registre como simplificação.
- No `exercicio02`, os arrays `itens` foram reduzidos, mas `total` veio do
  dataset completo; os totais não fecham. Não use esses números como verdade.
- O `exercicio03` só reproduz o top-3 (Cabo HDMI 30, Cabo Rede 29, Mouse 27)
  com os 20 pedidos completos.
- A carga `carga_mongodb.js` **não é idempotente**: rodar duas vezes duplica
  documentos; o próprio arquivo manda executar uma vez.
- O script `conectatech` tem `item` em vez de `itens` em uma projeção e
  comentários errados (`MediaElementAudioSourceNode`); não copie.
- O `techmix` tem dados inconsistentes (P005 e P006); não os use como exemplo
  de modelagem correta.
- `modelagem.txt` duplica os itens 2.7 e 2.8 do `exercicio02`.
- Não altere os arquivos em `DSM3/BDNR/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência e lacunas.
- `references/01-conceitos.md` — NoSQL, CAP, modelagem, CRUD, aggregation e índices.
- `references/02-exercicios.md` — simulado, ATV2, resoluções e respostas derivadas.
- `references/03-fontes.md` — inventário dos 21 arquivos.
- `references/04-glossario.md` — termos de NoSQL e MongoDB.
