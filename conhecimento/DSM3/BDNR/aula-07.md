---
disciplina: DSM3/BDNR
titulo: Aula 07
fonte: DSM3/BDNR/Aula_07.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Gerando Relatórios com Agregação

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

Pipeline de agregação

O pipeline de agregação funciona como uma esteira. Os documentos entram, passam por uma lista de estágios em sequência, e cada estágio transforma o que recebe antes de passar adiante. O resultado do último estágio é a resposta final. Isso permite consultas muito mais ricas do que o find sozinho.

O comando usado é o aggregate, que recebe uma lista de estágios entre colchetes. Cada estágio é um conjunto de chaves começando com o sinal de cifrão.

O estágio match: filtrar

O estágio match filtra os documentos, exatamente como o filtro do find. Costuma ser o primeiro estágio, para reduzir a quantidade de dados antes das próximas etapas. O exemplo seleciona apenas os produtos da categoria papelaria.

db.produtos.aggregate([

{ $match: { categoria: 'papelaria' } }

])

O estágio project: escolher campos

O estágio project escolhe quais campos aparecem, como a projeção do find, mas com um poder extra: ele também pode criar campos novos calculados. O exemplo mostra apenas o nome e o preço, e cria um campo novo indicando se o produto é caro.

db.produtos.aggregate([

{ $match: { categoria: 'papelaria' } },

{ $project: {

nome: 1,

preco: 1,

caro: { $gt: ['$preco', 50] }

} }

])

| Atenção ao cifrão no campoDentro do pipeline, para se referir ao valor de um campo, escreve-se o nome do campo com um cifrão na frente e entre aspas, como dolar-cifrao preco. Isso diz ao MongoDB para usar o valor guardado naquele campo, e não o texto literal. |

Exercícios

Explique, com suas palavras, o que significa o pipeline de agregação funcionar como uma esteira.

Monte um pipeline com um único estágio match que filtre produtos de uma categoria.

Acrescente um estágio project que mostre apenas o nome e o preço dos produtos filtrados.

Crie, com project, um campo calculado que indique se o preço é maior que um valor à sua escolha.

Agrupando com Group

Agrupamento de dados

O estágio group é o coração da agregação. Ele junta os documentos que compartilham um mesmo valor e calcula resultados para cada grupo. É o que permite responder perguntas como quanto foi vendido por categoria ou quantos produtos existem de cada tipo.

No group, o campo _id define o critério de agrupamento, ou seja, por qual campo os documentos serão agrupados. Os demais campos são os cálculos a fazer para cada grupo. O exemplo conta quantos produtos existem em cada categoria.

db.produtos.aggregate([

{ $group: {

_id: '$categoria',

total: { $sum: 1 }

} }

])

O resultado é um documento por categoria, cada um com o nome da categoria e a quantidade de produtos nela. O acumulador sum com valor um conta uma unidade para cada documento do grupo.

Os acumuladores

Os acumuladores são as operações de cálculo feitas em cada grupo. A tabela a seguir mostra os mais usados.

| Acumulador | O que calcula |

| $sum | Soma valores ou conta documentos |

| $avg | Calcula a média |

| $min | Encontra o menor valor |

| $max | Encontra o maior valor |

| $push | Junta os valores em uma lista |

Um relatório mais completo

Combinando vários acumuladores, monta-se um relatório rico. O exemplo a seguir calcula, para cada categoria, a quantidade de produtos, o preço médio, o mais barato e o mais caro.

db.produtos.aggregate([

{ $group: {

_id: '$categoria',

quantidade: { $sum: 1 },

preco_medio: { $avg: '$preco' },

mais_barato: { $min: '$preco' },

mais_caro: { $max: '$preco' }

} }

])

| Aplicação em situação realEsse tipo de relatório é exatamente o que um gerente de loja quer ver: um resumo por categoria com totais e médias. O pipeline de agregação gera esse painel diretamente do banco, sem precisar de planilhas externas. |

Exercícios

Conte quantos produtos existem em cada categoria usando group e sum.

Calcule o preço médio dos produtos de cada categoria usando avg.

Monte um relatório que mostre, por categoria, o produto mais caro e o mais barato.

Some o valor total de todos os produtos de cada categoria, multiplicando preço por estoque se você tiver esse campo.

Estágios Avançados

Ordenar e limitar resultados

Os estágios sort e limit também funcionam dentro do pipeline, geralmente após o group, para organizar o relatório. O exemplo agrupa produtos por categoria, conta cada uma, ordena da maior para a menor e mostra só as três primeiras, formando um ranking.

db.produtos.aggregate([

{ $group: { _id: '$categoria', total: { $sum: 1 } } },

{ $sort: { total: -1 } },

{ $limit: 3 }

])

O estágio unwind: desmontar listas

Muitos documentos contêm listas. Por exemplo, um pedido tem uma lista de itens. O estágio unwind desmonta a lista, criando um documento separado para cada item dela. Isso permite analisar os itens individualmente.

Imagine uma coleção de pedidos em que cada pedido tem uma lista de itens. Para descobrir qual produto foi mais vendido, primeiro desmonta-se a lista com unwind, depois agrupa-se por produto.

db.pedidos.aggregate([

{ $unwind: '$itens' },

{ $group: {

_id: '$itens.produto',

vendidos: { $sum: '$itens.quantidade' }

} },

{ $sort: { vendidos: -1 } }

])

| Como o unwind funcionaSe um pedido tem três itens na lista, o unwind transforma esse único pedido em três documentos, um para cada item. A partir daí, é possível agrupar e somar os itens como se fossem registros independentes. |

Montando um pipeline completo

A força do pipeline está em combinar estágios. Um relatório de produtos mais vendidos pode juntar match para filtrar um período, unwind para abrir os itens, group para somar, sort para ordenar e limit para pegar os campeões. Cada estágio cuida de uma parte do trabalho.

Exercícios

Monte um ranking das três categorias com mais produtos, usando group, sort e limit.

Crie uma coleção de pedidos em que cada pedido tenha uma lista de itens.

Use unwind para desmontar a lista de itens dos pedidos e observe o resultado.

Descubra qual produto foi mais vendido somando as quantidades após o unwind.

Juntando Coleções

O estágio lookup

Às vezes, os dados que interessam estão em duas coleções diferentes. Por exemplo, os pedidos em uma coleção e os clientes em outra. O estágio lookup junta as duas, trazendo as informações relacionadas. É parecido com a junção do modelo relacional.

O lookup precisa de quatro informações: a coleção a buscar, o campo local que liga as coleções, o campo correspondente na outra coleção, e o nome do campo novo onde o resultado será guardado. O exemplo junta cada pedido com os dados do seu cliente.

db.pedidos.aggregate([

{ $lookup: {

from: 'clientes',

localField: 'cliente_id',

foreignField: '_id',

as: 'dados_cliente'

} }

])

Após esse estágio, cada pedido ganha um campo novo, chamado dados_cliente, contendo as informações do cliente correspondente. Assim, é possível ver o pedido e o cliente juntos em um único resultado.

| Quando usar o lookupO lookup é útil quando os dados foram modelados por referencing. Vale lembrar, porém, que se duas informações são quase sempre usadas juntas, o embedding pode evitar a necessidade do lookup. A escolha da modelagem afeta diretamente a necessidade dessa junção. |

Organizando o resultado

O lookup sempre traz o resultado como uma lista, mesmo quando há um único cliente. Para deixar o resultado mais limpo, costuma-se usar o unwind logo depois, transformando a lista de um item em um campo direto.

db.pedidos.aggregate([

{ $lookup: {

from: 'clientes',

localField: 'cliente_id',

foreignField: '_id',

as: 'dados_cliente'

} },

{ $unwind: '$dados_cliente' }

])

| Aplicação em situação realUm relatório de vendas que mostra o nome do cliente ao lado de cada pedido usa o lookup para buscar esse nome na coleção de clientes. É como cruzar duas listas para montar uma terceira mais completa. |

Exercícios

Explique, com suas palavras, o que o estágio lookup faz.

Crie duas coleções, uma de pedidos e uma de clientes, ligadas por um identificador.

Use lookup para trazer os dados do cliente dentro de cada pedido.

Acrescente um unwind após o lookup e compare o resultado com o anterior.
