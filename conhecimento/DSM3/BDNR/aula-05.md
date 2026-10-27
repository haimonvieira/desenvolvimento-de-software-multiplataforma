---
disciplina: DSM3/BDNR
titulo: Aula 05
fonte: DSM3/BDNR/Aula_05.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Refinando, Atualizando e Removendo

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

Refinando Consultas

Projeção: escolhendo os campos

Por padrão, o find retorna todos os campos de cada documento. Muitas vezes, porém, interessa ver apenas alguns. A projeção permite escolher quais campos aparecem. Ela é informada como um segundo conjunto de chaves dentro do find, em que cada campo recebe o número um para aparecer.

db.produtos.find(

{ categoria: 'papelaria' },

{ nome: 1, preco: 1 }

)

Esse comando traz apenas o nome e o preço dos produtos de papelaria. O campo _id costuma aparecer mesmo sem ser pedido. Para escondê-lo, basta atribuir o número zero a ele.

db.produtos.find(

{ categoria: 'papelaria' },

{ nome: 1, preco: 1, _id: 0 }

)

| DicaUse o número um para incluir um campo e o número zero para excluí-lo. Em geral, não se misturam inclusões e exclusões no mesmo comando, com exceção do campo _id, que pode sempre ser desligado com zero. |

Ordenação

O método sort organiza os resultados. Ele recebe o campo pelo qual ordenar e a direção: o número um para ordem crescente, do menor para o maior, e o número menos um para ordem decrescente, do maior para o menor. O exemplo ordena os produtos do mais barato ao mais caro.

db.produtos.find().sort({ preco: 1 })

Para ordenar do mais caro ao mais barato, troca-se o um pelo menos um.

db.produtos.find().sort({ preco: -1 })

Paginação

Quando há muitos resultados, é comum mostrá-los em páginas, como faz uma loja virtual. Dois métodos trabalham juntos para isso. O limit define quantos documentos por página, e o skip define quantos pular. Para mostrar a primeira página com dois produtos, usa-se apenas o limit.

db.produtos.find().limit(2)

Para mostrar a segunda página, pula-se os dois primeiros e mostra-se os dois seguintes.

db.produtos.find().skip(2).limit(2)

| Aplicação em situação realQuando uma loja virtual mostra os produtos em páginas de dez em dez, ela usa exatamente essa combinação. A terceira página pula vinte produtos e mostra os dez seguintes. É assim que a navegação por páginas funciona por trás das telas. |

Exercícios

Liste os produtos mostrando apenas nome e preço, escondendo o campo _id.

Ordene os produtos do mais caro ao mais barato.

Mostre apenas os três primeiros produtos ordenados por preço crescente.

Simule a segunda página de uma listagem que mostra dois produtos por página.

Atualizando Documentos

Atualizando um documento

O método updateOne altera o primeiro documento que atende a um critério. Ele recebe duas partes: o critério para encontrar o documento e a alteração a aplicar. A alteração usa o operador set, que define o novo valor de um campo. O exemplo aumenta o preço da Caneca para trinta.

db.produtos.updateOne(

{ nome: 'Caneca' },

{ $set: { preco: 30.00 } }

)

| Atenção à estruturaO updateOne sempre tem duas partes separadas por vírgula: primeiro o filtro que localiza o documento, depois a alteração com $set. Esquecer o $set e passar apenas o campo é um erro comum que pode apagar o resto do documento. |

Outros operadores de atualização

Além do set, existem operadores úteis para situações específicas. A tabela a seguir resume os principais.

| Operador | O que faz | Exemplo |

| $set | Define o valor de um campo | { $set: { preco: 30 } } |

| $inc | Soma ou subtrai de um número | { $inc: { preco: 5 } } |

| $unset | Remove um campo | { $unset: { voltagem: 1 } } |

| $rename | Renomeia um campo | { $rename: { preco: valor } } |

O operador inc é especialmente prático para somar ou subtrair sem precisar saber o valor atual. O exemplo aumenta o preço de todos os produtos de papelaria em dois reais.

Atualizando vários documentos

Para alterar vários documentos de uma vez, usa-se updateMany, que funciona como o updateOne mas aplica a mudança a todos os que atendem ao critério. O exemplo aplica o aumento a toda a categoria papelaria.

db.produtos.updateMany(

{ categoria: 'papelaria' },

{ $inc: { preco: 2 } }

)

| CuidadoO updateMany altera todos os documentos que atendem ao critério. Se o critério for esquecido ou estiver muito amplo, muitos documentos podem ser alterados por engano. Sempre confira o filtro antes de executar. |

Exercícios

Atualize o preço de um produto específico usando updateOne com set.

Use inc para aumentar em cinco reais o preço de um produto.

Adicione um campo novo, como estoque, a um produto existente usando set.

Use updateMany para aplicar um aumento a todos os produtos de uma categoria.

Removendo e Usando Listas

Removendo documentos

O método deleteOne remove o primeiro documento que atende a um critério. O exemplo remove o produto chamado Caneta.

db.produtos.deleteOne({ nome: 'Caneta' })

Para remover vários documentos de uma vez, usa-se deleteMany. O exemplo remove todos os produtos de uma categoria.

db.produtos.deleteMany({ categoria: 'acessorios' })

| Cuidado máximoO comando deleteMany sem nenhum critério, ou seja, com chaves vazias, apaga TODOS os documentos da coleção. Tenha muito cuidado e sempre confira o filtro antes de executar uma remoção. |

Trabalhando com listas

Documentos no MongoDB podem conter listas, também chamadas de arrays. Um produto, por exemplo, pode ter uma lista de etiquetas. Operadores específicos permitem alterar essas listas sem reescrever o documento inteiro. Uma lista de etiquetas pode ser adicionada ao produto antes das operações de manipulação.

db.produtos.updateOne(

{ nome: 'Mochila' },

{ $set: { etiquetas: ['escolar'] } }

)

Adicionando e removendo itens da lista

O operador push adiciona um item ao final de uma lista. O exemplo adiciona a etiqueta resistente à mochila.

db.produtos.updateOne(

{ nome: 'Mochila' },

{ $push: { etiquetas: 'resistente' } }

)

O operador pull remove um item específico da lista. O exemplo remove a etiqueta escolar.

db.produtos.updateOne(

{ nome: 'Mochila' },

{ $pull: { etiquetas: 'escolar' } }

)

Existe ainda o operador addToSet, parecido com o push, mas que só adiciona o item se ele ainda não estiver na lista, evitando repetições.

| Operadores de listapush adiciona ao final. pull remove um item específico. addToSet adiciona somente se ainda não existir, garantindo que não haja itens repetidos. |

Exercícios

Remova um produto específico da coleção usando deleteOne.

Adicione uma lista de etiquetas a um produto usando set.

Use push para acrescentar uma nova etiqueta e depois pull para remover outra.

Use addToSet para tentar adicionar uma etiqueta que já existe, e observe que ela não é duplicada.

Exercício Integrador

O exercício integrador constrói um pequeno catálogo de livros aplicando as operações de CRUD em quatro etapas: criar, ler, atualizar e apagar.

Etapa 1: Criar

Insira pelo menos cinco livros usando insertMany. Cada livro deve ter os campos titulo, autor, ano, genero e preco. O exemplo a seguir serve de ponto de partida, e outros livros podem ser acrescentados para ampliar a prática.

db.livros.insertMany([

{ titulo: 'Dom Casmurro', autor: 'Machado', ano: 1899, genero: 'romance', preco: 40 },

{ titulo: 'O Cortico', autor: 'Azevedo', ano: 1890, genero: 'romance', preco: 35 },

{ titulo: 'NoSQL Essencial', autor: 'Sadalage', ano: 2013, genero: 'tecnico', preco: 90 }

])

Etapa 2: Ler

Realize as consultas a seguir e observe os resultados.

Liste todos os livros mostrando apenas titulo e preco.

Busque os livros do gênero romance.

Busque os livros com preço acima de cinquenta.

Liste os livros ordenados do mais antigo ao mais recente pelo ano.

Etapa 3: Atualizar

Pratique as alterações nos documentos com os comandos a seguir.

Aumente em dez reais o preço de um livro específico usando inc.

Adicione um campo editora a um dos livros usando set.

Aplique um aumento de cinco reais em todos os livros de romance usando updateMany.

Etapa 4: Apagar

Por fim, pratique as remoções com cuidado.

Remova um livro específico pelo título usando deleteOne.

Conte quantos livros restaram na coleção usando countDocuments.
