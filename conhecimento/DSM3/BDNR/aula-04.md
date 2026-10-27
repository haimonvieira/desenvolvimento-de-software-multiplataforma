---
disciplina: DSM3/BDNR
titulo: Aula 04
fonte: DSM3/BDNR/Aula_04.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Inserindo e Consultando Documentos

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

Inserindo Documentos

Inserindo um documento por vez

Para inserir um único documento em uma coleção, usa-se o método insertOne. Ele recebe, entre parênteses, o documento a ser gravado. O exemplo a seguir insere um produto na coleção produtos.

db.produtos.insertOne({ nome: 'Caneca', preco: 25.00, categoria: 'cozinha' })

Após executar, o MongoDB responde com uma confirmação e um identificador único gerado automaticamente, chamado _id. Esse identificador garante que nenhum documento seja confundido com outro, mesmo que tenham os mesmos valores nos demais campos.

| Definição: o campo _idTodo documento no MongoDB recebe automaticamente um campo chamado _id, que funciona como sua identidade única. Não é necessário criá-lo manualmente, pois o próprio banco gera esse identificador. |

Inserindo vários de uma vez

Quando há muitos documentos para inserir, repetir o insertOne várias vezes é ineficiente. Para isso existe o insertMany, que recebe uma lista de documentos entre colchetes, separados por vírgula.

db.produtos.insertMany([

{ nome: 'Caderno', preco: 18.50, categoria: 'papelaria' },

{ nome: 'Caneta', preco: 3.00, categoria: 'papelaria' },

{ nome: 'Mochila', preco: 120.00, categoria: 'acessorios' }

])

O banco responde com a lista dos identificadores gerados para cada documento. Inserir vários documentos de uma só vez é bem mais rápido do que fazê-lo um por um.

A flexibilidade em ação

Os documentos de uma coleção não precisam ter os mesmos campos. O exemplo a seguir insere um produto com um campo extra de voltagem, que os demais produtos não têm, e isso é válido no MongoDB.

db.produtos.insertOne({ nome: 'Ventilador', preco: 159.90, categoria: 'eletro', voltagem: '110V' })

| Aplicação em situação realEm uma loja de variedades, cada produto tem características próprias. A flexibilidade do MongoDB permite guardar todos eles na mesma coleção, cada um com seus campos, sem precisar planejar uma estrutura fixa de antemão. |

Exercícios

Insira, usando insertOne, um produto de sua escolha com os campos nome, preco e categoria.

Insira, usando insertMany, três produtos diferentes em uma única operação.

Insira um produto que tenha um campo extra que os outros não possuem, e confirme que a operação funciona.

Explique, com suas palavras, para que serve o campo _id e quem o cria.

Consultando Documentos

Buscando todos os documentos

O método find é a forma principal de consultar documentos. Quando usado sem nada entre parênteses, ele retorna todos os documentos da coleção.

db.produtos.find()

No mongosh, o resultado aparece de forma um pouco compacta. Para deixá-lo mais legível, pode-se acrescentar o método pretty ao final, que organiza a exibição.

db.produtos.find().pretty()

Filtrando por um valor

Quase nunca se deseja todos os documentos. O mais comum é buscar apenas os que atendem a um critério. Para isso, passa-se um documento de filtro entre parênteses, indicando o campo e o valor desejado. O exemplo busca todos os produtos da categoria papelaria.

db.produtos.find({ categoria: 'papelaria' })

O MongoDB retorna apenas os documentos cujo campo categoria seja exatamente igual a papelaria. É possível filtrar por qualquer campo, como o nome.

db.produtos.find({ nome: 'Caneca' })

Buscando um único documento

Quando se quer apenas o primeiro documento que atende a um critério, usa-se findOne. Ele retorna um único documento, ou nada, caso nenhum corresponda.

db.produtos.findOne({ categoria: 'acessorios' })

Contando e limitando

O método countDocuments conta quantos documentos atendem a um critério, sem exibi-los. É útil para saber quantidades.

db.produtos.countDocuments({ categoria: 'papelaria' })

Já o método limit, encadeado ao find, restringe quantos documentos serão exibidos. O exemplo mostra apenas os dois primeiros produtos.

db.produtos.find().limit(2)

| Métodos de consultafind busca vários documentos. findOne busca apenas um. countDocuments conta sem exibir. limit restringe a quantidade exibida. |

Exercícios

Liste todos os produtos da sua coleção usando find.

Busque apenas os produtos de uma categoria específica.

Use findOne para trazer um único produto de uma categoria.

Conte quantos produtos existem em uma categoria usando countDocuments, e depois mostre apenas os três primeiros produtos com limit.

Operadores de Comparação

Indo além da igualdade

Os operadores de comparação permitem buscar valores maiores, menores ou dentro de uma faixa. Eles começam com o sinal de cifrão e são utilizados dentro de chaves, associados ao campo consultado.

Maior e menor

O operador para maior que é escrito como cifrão seguido de gt, abreviação de greater than. O exemplo busca produtos com preço acima de cem.

db.produtos.find({ preco: { $gt: 100 } })

A tabela a seguir resume os operadores de comparação mais usados.

| Operador | Significado | Exemplo de uso |

| $gt | Maior que | { preco: { $gt: 100 } } |

| $gte | Maior ou igual a | { preco: { $gte: 100 } } |

| $lt | Menor que | { preco: { $lt: 50 } } |

| $lte | Menor ou igual a | { preco: { $lte: 50 } } |

| $ne | Diferente de | { categoria: { $ne: 'eletro' } } |

| $eq | Igual a | { preco: { $eq: 25 } } |

Buscando em uma faixa

Combinando dois operadores no mesmo campo, é possível buscar valores dentro de uma faixa. O exemplo busca produtos com preço entre vinte e cem, ou seja, maior ou igual a vinte e menor ou igual a cem.

db.produtos.find({ preco: { $gte: 20, $lte: 100 } })

Buscando em uma lista de valores

Quando se quer aceitar vários valores possíveis, o operador in evita escrever várias condições. Ele recebe uma lista entre colchetes. O exemplo busca produtos que sejam de papelaria ou de cozinha.

db.produtos.find({ categoria: { $in: ['papelaria', 'cozinha'] } })

| DicaO operador in é muito prático para substituir várias buscas separadas. Em vez de procurar papelaria e depois cozinha, uma única consulta traz os dois. Seu oposto é o operador nin, que traz os que não estão na lista. |

Exercícios

Busque todos os produtos com preço acima de um valor à sua escolha.

Busque os produtos com preço entre dois valores, usando dois operadores no mesmo campo.

Use o operador in para buscar produtos de duas categorias ao mesmo tempo.

Busque todos os produtos que não sejam de uma determinada categoria, usando o operador ne.

Operadores Lógicos

Combinando condições

Os operadores lógicos permitem combinar várias condições em uma mesma consulta. Eles respondem a perguntas como e, ou, e não. Como os de comparação, começam com o sinal de cifrão.

O operador ou

O operador or traz documentos que atendam a pelo menos uma das condições. Ele recebe uma lista de condições entre colchetes. O exemplo busca produtos que sejam da categoria eletro ou que custem mais de cem.

db.produtos.find({

$or: [

{ categoria: 'eletro' },

{ preco: { $gt: 100 } }

]

})

Esse comando traz tanto os produtos eletro, mesmo que baratos, quanto os produtos caros, mesmo que de outra categoria. Basta atender a uma das condições.

O operador e

Quando se colocam vários campos dentro de um mesmo filtro, o MongoDB já entende que todos devem ser verdadeiros ao mesmo tempo. O exemplo busca produtos de papelaria que custem menos de dez.

db.produtos.find({ categoria: 'papelaria', preco: { $lt: 10 } })

Esse é o caso mais comum do e, e nem precisa de operador especial. Existe também o operador and explícito, útil em situações mais complexas, mas para a maioria dos casos a forma acima é suficiente.

O operador não

O operador not inverte uma condição. O exemplo busca produtos cujo preço não seja maior que cinquenta, ou seja, produtos de até cinquenta.

db.produtos.find({ preco: { $not: { $gt: 50 } } })

Operadores lógicos

| Operador | Significado | Quando usar |

| $or | Ou | Atender a pelo menos uma condição |

| $and | E | Atender a todas as condições |

| $not | Não | Inverter uma condição |

| $nor | Nem | Não atender a nenhuma das condições |

| Combinação de operadoresOs operadores de comparação e os operadores lógicos podem ser combinados livremente. É possível, por exemplo, buscar produtos de papelaria ou de cozinha que custem menos de trinta, combinando in com outras condições. |

Exercícios

Busque produtos que sejam de uma categoria específica ou que custem acima de um valor, usando or.

Busque produtos de uma categoria que custem abaixo de um valor, combinando dois critérios no mesmo filtro.

Monte uma consulta que use o operador not para trazer produtos abaixo de certo preço.

Desafio: combine o operador in com uma condição de preço para buscar produtos de duas categorias que custem menos de um valor à sua escolha.
