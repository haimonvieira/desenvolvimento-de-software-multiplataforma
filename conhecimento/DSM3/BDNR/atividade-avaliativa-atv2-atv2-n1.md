---
disciplina: DSM3/BDNR
titulo: ATV2 N1
fonte: DSM3/BDNR/Atividade Avaliativa/ATV2/ATV2-N1.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

Lista de Exercícios Práticos – MongoDB

Banco de Dados Não Relacional

| Aluno(a): __________________________________________ | Turma: __________________________ |

| Professor(a): ______________________________________ | Data: ____ / ____ / ______ |

Orientações gerais

As atividades devem ser resolvidas utilizando MongoDB, preferencialmente pelo mongosh.

As respostas devem ser entregues em arquivos JSON e/ou arquivos de texto contendo os comandos MongoDB solicitados.

Os arquivos devem ser organizados com os nomes indicados em cada exercício.

Não é necessário desenvolver interface gráfica, aplicação web ou utilizar outra linguagem de programação.

## Exercício 1 – Catálogo de Produtos: documentos, consultas e atualização

Situação-problema: Uma pequena loja de tecnologia decidiu utilizar o MongoDB para organizar seu catálogo de produtos. O objetivo é criar uma coleção com produtos de diferentes categorias e praticar a criação de documentos, consultas, projeção, ordenação e atualização.

Tarefas:

1.  Crie um banco de dados chamado lojaTech e uma coleção chamada produtos.

2.  Cadastre no mínimo 8 produtos. Cada documento deve possuir os campos codigo, nome, categoria, descricao, preco, estoque e tags. O campo tags deve armazenar uma lista de valores.

3.  Para demonstrar a flexibilidade do MongoDB, faça com que pelo menos 2 produtos possuam um campo específico que não exista nos demais, por exemplo: voltagem, memoria, tamanho ou cor.

4.  Escreva uma consulta que mostre somente os campos codigo, nome e preco, sem exibir o campo _id.

5.  Escreva uma consulta que localize produtos de uma categoria escolhida e cujo preço esteja dentro de uma faixa de valores definida por você.

6.  Liste os 3 produtos mais caros da coleção.

7.  Atualize o preço de um produto utilizando updateOne e $set.

8.  Aumente o estoque de um produto utilizando $inc e adicione uma nova tag sem repetir valores já existentes.

Entrega: produtos.json com os documentos utilizados e exercicio01.txt com os comandos MongoDB.

## Exercício 2 – Sistema de Pedidos: embedding e referencing

Situação-problema: Uma loja precisa armazenar seus clientes e os pedidos realizados. Um cliente pode realizar vários pedidos ao longo do tempo e seus dados cadastrais podem ser alterados. Cada pedido possui vários itens que pertencem somente àquele pedido.

Tarefas:

1.  Crie duas coleções chamadas clientes e pedidos.

2.  Cadastre no mínimo 4 clientes, cada um com identificador próprio, nome, email e telefone.

3.  Cadastre no mínimo 5 pedidos. Cada pedido deve possuir cliente_id, data, status e uma lista chamada itens.

4.  Dentro de itens, armazene documentos contendo pelo menos produto, quantidade e preco.

5.  Utilize referencing para relacionar cada pedido ao cliente por meio de cliente_id.

6.  Utilize embedding para guardar os itens dentro do documento do pedido.

7.  Escreva um pequeno texto, com aproximadamente 5 linhas, explicando por que o cliente foi referenciado e os itens foram incorporados ao pedido.

8.  Crie uma validação de esquema para a coleção pedidos exigindo, no mínimo, os campos cliente_id, data e itens.

Entrega: clientes.json, pedidos.json e modelagem.txt contendo a justificativa e o comando usado para a validação.

## Exercício 3 – Relatórios de Vendas com Aggregation Pipeline

Situação-problema: A gerência deseja obter informações resumidas a partir da coleção pedidos criada no exercício anterior, sem analisar cada pedido manualmente. Para isso, será utilizado o pipeline de agregação do MongoDB.

Tarefas:

1.  Crie um pipeline que utilize $unwind para trabalhar individualmente com os itens armazenados no array itens.

2.  Agrupe os itens pelo nome do produto utilizando $group.

3.  Calcule, com $sum, a quantidade total vendida de cada produto.

4.  Ordene o resultado da maior para a menor quantidade vendida.

5.  Exiba somente os 3 produtos com maior quantidade vendida.

6.  Crie um segundo pipeline utilizando $lookup para relacionar as coleções pedidos e clientes.

7.  No resultado do segundo pipeline, apresente informações do pedido juntamente com dados do cliente relacionado.

Entrega: exercicio03.txt contendo os dois comandos aggregate() completos. Abaixo de cada comando, inclua um pequeno exemplo em JSON demonstrando o formato esperado do resultado.

## Exercício 4 – Otimização de Consultas com Índices

Situação-problema: Com o aumento da quantidade de produtos cadastrados, algumas consultas passaram a ser realizadas com muita frequência. O objetivo é utilizar índices para melhorar a eficiência das buscas e analisar como o MongoDB executa uma consulta.

Tarefas:

1.  Na coleção produtos, crie um índice único para o campo codigo.

2.  Crie um índice composto envolvendo os campos categoria e preco.

3.  Escreva uma consulta que possa se beneficiar do índice composto criado.

4.  Execute essa consulta utilizando explain('executionStats') e registre o comando utilizado.

5.  Crie um índice de texto em um ou mais campos textuais adequados da coleção produtos.

6.  Faça uma pesquisa utilizando $text e $search.

7.  Escreva entre 3 e 5 linhas explicando por que não é recomendado criar índices em todos os campos de uma coleção.

Entrega: exercicio04.txt contendo os comandos de criação dos índices, as consultas, o explain e a justificativa solicitada.

Organização da entrega

Crie uma pasta chamada Lista_Exercicios_MongoDB e organize nela todos os arquivos solicitados nos quatro exercícios.
