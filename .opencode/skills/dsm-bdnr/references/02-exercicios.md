# Exercícios e atividades — BDNR

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| `aula-01` a `aula-08` | Blocos de exercícios ao fim de cada aula | **Não** |
| `simulado-revisao-bdnr.md` | 10 questões sobre `oficinaDB` | **Não**; objetivas Q6–Q9 derivadas; Q10 sem comando |
| `atividade-avaliativa-atv2-atv2-n1.md` | 4 exercícios práticos | **Não** |
| `exercicio01`–`exercicio04` | Resoluções de aluno da ATV2 | Respostas de aluno, **não** gabarito |
| `haimon-cugler-vieira-bdnr.md` | Relatório com comandos e saídas | Saídas reais, sem gabarito formal |
| `atividade-avaliativa-atv1-conectatech-setup-mongodb.md` | Script com 3 desafios **já resolvidos** | Resolvido no próprio arquivo |

## Simulado `oficinaDB` (p. 1–9)

Banco `oficinaDB`, com as coleções `clientes`, `veiculos` e `ordens_servico`.
Cada ordem tem um array `servicos` com `descricao`, `quantidade` e
`valor_unitario` (p. 1).

### Questões discursivas (Q1–Q5)

Não há resposta oficial. O que se espera, pelo conteúdo das aulas:

| Q | Tema | Onde estudar |
| --- | --- | --- |
| Q1 | Por que modelar com documentos em vez de tabelas | aula-01, §2 |
| Q2 | Decisão embedding × referencing em `servicos` | aula-06, §Embedding e referencing |
| Q3 | Índice adequado para consulta por status/data | aula-08, §Índices |
| Q4 | Pipeline para relatório por cliente | aula-07, §Agrupando com Group |
| Q5 | Explicar `$lookup` e quando evitar | aula-07, §O estágio lookup |

### Objetivas (Q6–Q9)

**Sem gabarito oficial.** Respostas **derivadas** do conteúdo:

| Q | Resposta derivada | Justificativa |
| --- | --- | --- |
| Q6 | **A** | Consulta com `$in` e faixa inclusiva |
| Q7 | **D** | Estágio de agrupamento |
| Q8 | **A** | `$group` por cliente com `$sum`, `$avg`, `$max` e `$min` |
| Q9 | **C** | Índice composto na ordem dos campos filtrados |

A Q8 aparece entre as p. 5–6 e usa exatamente:

```js
{ $group: {
    _id: "$id_cliente",
    quantidade: { $sum: 1 },
    total: { $sum: "$valor_total" },
    media: { $avg: "$valor_total" },
    maior: { $max: "$valor_total" },
    menor: { $min: "$valor_total" }
} }
```

### Q10 — irrespondível

A p. 8 pede para analisar "o seguinte comando", mas o comando **não foi
extraído** (provavelmente era imagem). Ao responder, diga que o corpus não
permite resolver a Q10.

### Cuidados com as tabelas

As tabelas do simulado estão quebradas na extração: `ordens_servi co`,
`Ativ o` e `_id` dividido em `10 / 1`, `10 / 2`, `10 / 3` (p. 1). Não reproduza
esses erros.

## ATV2 — exercícios práticos

Enunciado em `atividade-avaliativa-atv2-atv2-n1.md`. Entregáveis:

- `produtos.json`
- `exercicio01.txt`
- `clientes.json`
- `pedidos.json`
- `modelagem.txt`
- `exercicio03.txt`
- `exercicio04.txt`

Massa: **20 produtos, 12 clientes e 20 pedidos** (LEIA-ME da ATV2). O campo
`pedidos.cliente_id` corresponde a `clientes.codigo`.

Importação:

```bash
mongoimport --uri "<SUA_STRING_DE_CONEXAO>" --db lojaTech \
  --collection produtos --file produtos.json --jsonArray
```

### Exercício 1 — catálogo

Resolução em `...-haimon-cugler-vieira-exercicio01.md`: consultas, projeção,
`sort` e `update`.

### Exercício 2 — clientes e pedidos

Resolução em `...-haimon-cugler-vieira-exercicio02.md`: embedding, referencing
e validação.

**Atenção:** os arrays `itens` foram reduzidos, mas o campo `total` veio do
dataset completo. Exemplos de inconsistência:

| Pedido | Soma dos itens | `total` no arquivo |
| --- | --- | --- |
| PED001 | 159,70 | 214,60 |
| PED002 | 2.548,70 | 4.187,50 |
| PED004 | — | inconsistente |
| PED005 | — | inconsistente |

Além disso, PED002 cita `CLI005` e PED004 cita `CLI006`, mas só CLI001–CLI004
foram inseridos. Não use esses totais como verdade.

### Exercício 3 — aggregation

Resolução em `...-haimon-cugler-vieira-exercicio03.md`: `$unwind`, `$group`,
`$sort`, `$limit` e `$lookup`. O top-3 (Cabo HDMI 30, Cabo Rede 29, Mouse 27)
só fecha com os **20 pedidos completos**; rodar depois do exercício 2 muda o
resultado.

### Exercício 4 — índices

Resolução em `...-haimon-cugler-vieira-exercicio04.md`: índice único, composto,
`explain` e índice de texto.

## ATV1 — script `conectaTech`

`atividade-avaliativa-atv1-conectatech-setup-mongodb.md` traz carga, demos de
modelagem, pipelines e **três desafios já resolvidos**:

1. total por cliente;
2. faturamento por produto;
3. pedidos com dados do cliente.

Cuidados:

- `//use conectaTech_aula` está comentado, mas os `drop()` executam no banco
  corrente.
- Uma projeção usa `item` em vez de `itens`.
- O comentário do `$unwind` fala em `MediaElementAudioSourceNode` (errado).
- Há typos: "Bucked", "cescem", "Subsest", "reduziar", "pepeline".

## Relatório `loja_escolar` (p. 1–8)

O único conjunto com **comando e saída**. O "Desafio individual" tem itens
**a–f** com resultados (p. 5–8), incluindo:

- `db.produtos.countDocuments({})` → **6**;
- `db.produtos.countDocuments({ categoria: "Papelaria" })` → **3**.

A p. 1 mostra `db.getName()` retornando `db_456r2yvtd_456r9s6j6` depois de
`use loja_escolar` — incoerência do ambiente, não regra.

## Carga de dados

`atividade-avaliativa-atv2-massa-dados-exercicios-mongodb-carga-mongodb.md`:

- **não é idempotente**: não faz `drop()`;
- rodar duas vezes **duplica** documentos;
- o próprio arquivo avisa "Execute este arquivo apenas uma vez".

Massa `techmix` (`...techmix-as-text.md`): 16 documentos em JSONL. Tem dados
inconsistentes — P005 "Camiseta Dev Mode" está em `informatica` com preço
3499.9 (cópia do notebook P001) e P006 "Ventilador" tem
`"material":"algodao"`. Não use como exemplo de modelagem correta.

## Como responder "me dá a resposta"

1. Se for objetiva do simulado, dê a alternativa, explique o comando e **avise
   que o gabarito não está no corpus**.
2. Se for pipeline, escreva o pipeline completo e explique estágio por estágio.
3. Se for modelagem, compare embedding e referencing com o critério de acesso
   conjunto e o limite de 16 MB.
4. Se for índice, diga os campos, a ordem e o custo de gravação.
5. Sempre cite `arquivo.md` + seção (ou página, nos PDFs).
6. Se a pergunta for sobre a Q10 do simulado, diga que o comando não está no
   corpus.
