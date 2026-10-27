---
disciplina: DSM3/BDNR
titulo: Aula 08
fonte: DSM3/BDNR/Aula_08.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Índices e Prática Integrada no MongoDB

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

Índices

O que é um índice

Um índice de banco de dados funciona como o índice remissivo de um livro. Para encontrar um assunto em um livro sem índice, seria preciso folhear todas as páginas. Com o índice, vai-se direto à página certa. No MongoDB, sem um índice, o banco precisa percorrer todos os documentos da coleção para encontrar o que se procura. Com um índice, ele vai direto ao resultado.

| Definição: ÍndiceÍndice é uma estrutura que o banco mantém para encontrar documentos rapidamente, sem precisar percorrer todos eles. Ele acelera as buscas, mas ocupa espaço e deixa as gravações um pouco mais lentas, pois precisa ser atualizado a cada mudança. |

Criando um índice

O método createIndex cria um índice sobre um campo. O número um indica a ordem crescente. O exemplo cria um índice sobre o campo matricula de uma coleção de alunos, tornando rápidas as buscas por matrícula.

db.alunos.createIndex({ matricula: 1 })

A partir desse momento, qualquer busca por matrícula será muito mais rápida, mesmo que a coleção tenha milhões de alunos. Sem o índice, o banco teria que verificar aluno por aluno.

Verificando se o índice é usado

O método explain mostra como o MongoDB executou uma consulta, permitindo verificar se um índice foi usado. Basta acrescentá-lo ao final da consulta.

db.alunos.find({ matricula: '202612345' }).explain('executionStats')

Na resposta, é possível observar se a busca percorreu a coleção inteira ou se utilizou o índice. Quando o índice é usado, a consulta examina poucos documentos em comparação com uma varredura completa.

Índices compostos e únicos

Um índice composto cobre mais de um campo ao mesmo tempo, útil para buscas que filtram por vários critérios juntos. Já um índice único garante que não existam valores repetidos em um campo, como dois alunos com a mesma matrícula.

db.alunos.createIndex({ matricula: 1 }, { unique: true })

| O custo dos índicesÍndices aceleram leituras, mas cada índice precisa ser atualizado a cada inserção ou alteração, o que deixa as gravações um pouco mais lentas e ocupa espaço. Por isso, cria-se índice apenas nos campos realmente usados em buscas frequentes, e não em todos. |

Exercícios

Explique a analogia entre um índice de banco de dados e o índice de um livro.

Crie um índice sobre um campo de uma coleção sua e descreva qual busca ele acelera.

Use explain em uma consulta e identifique se o índice foi usado.

Explique por que não se deve criar índice em todos os campos de uma coleção.

Índices Especiais

Índice de texto

O índice de texto permite buscar palavras dentro de campos de texto, como um mecanismo de busca. Ele entende várias palavras e ignora diferenças de acentuação. O exemplo cria um índice de texto sobre o título e o resumo de uma coleção de livros.

db.livros.createIndex({ titulo: 'text', resumo: 'text' })

Com o índice criado, busca-se por palavras usando o operador text. O exemplo procura livros que mencionem banco de dados no título ou no resumo.

db.livros.find({ $text: { $search: 'banco de dados' } })

| Aplicação em situação realA barra de busca de uma livraria virtual, onde o usuário digita palavras e recebe livros relacionados, pode ser construída com um índice de texto. Ele encontra os termos mesmo que estejam em meio a outras palavras. |

Índice de expiração automática

O índice de expiração, chamado de TTL, da expressão em inglês para tempo de vida, apaga documentos automaticamente após um tempo. É perfeito para dados temporários, como sessões de usuário ou códigos de verificação, que não precisam ser guardados para sempre.

O exemplo cria um índice que apaga cada documento da coleção de sessões uma hora após sua criação, sem nenhuma intervenção manual.

db.sessoes.createIndex(

{ criadoEm: 1 },

{ expireAfterSeconds: 3600 }

)

| Por que isso é útilSem o índice de expiração, alguém precisaria criar uma rotina para apagar dados antigos periodicamente. Com ele, o próprio MongoDB faz a limpeza sozinho, o que simplifica muito a manutenção de dados temporários. |

Outros índices

O MongoDB também oferece índices geoespaciais, voltados ao armazenamento e à consulta de coordenadas de localização. Eles permitem localizar pontos próximos de uma posição e são utilizados em aplicações de mapas, logística e entregas.

Exercícios

Crie um índice de texto sobre um campo de texto de uma coleção e faça uma busca por palavra.

Explique uma situação em que o índice de texto seria mais útil que uma busca comum.

Crie um índice de expiração que apague documentos após sessenta segundos e observe o efeito.

Cite dois tipos de dado que se beneficiariam da expiração automática.

MongoDB: conceitos e comandos

Mapa de conceitos e comandos

| Tema | Principais comandos e conceitos |

| Conexão | Atlas, mongosh, Compass, string de conexão |

| Inserir | insertOne, insertMany, campo _id |

| Consultar | find, findOne, projeção, sort, skip, limit |

| Operadores | gt, lt, gte, lte, in, or, and, not |

| Atualizar | updateOne, updateMany, set, inc, push, pull |

| Remover | deleteOne, deleteMany |

| Modelar | embedding, referencing, Bucket, Computed, Subset |

| Agregar | match, project, group, unwind, lookup |

| Desempenho | createIndex, explain, índices de texto e TTL |

Questões conceituais

As perguntas a seguir retomam decisões importantes de modelagem, atualização, agregação e desempenho no MongoDB.

Quando guardar dados juntos por embedding e quando separá-los por referencing?

Qual a diferença entre updateOne e updateMany, e por que o segundo exige cuidado?

Para que serve o pipeline de agregação e quais são seus estágios mais usados?

Como um índice acelera uma consulta e qual o seu custo?

Exercícios Integrados de MongoDB

Questões conceituais

As questões conceituais abordam os principais fundamentos do MongoDB.

Explique a diferença entre as estratégias de embedding e referencing, indicando uma situação ideal para cada uma.

Descreva o que faz o estágio group no pipeline de agregação e cite três acumuladores.

Explique o que é um índice e por que ele não deve ser criado em todos os campos.

Diferencie consistência imediata e consistência eventual, relacionando com os modelos ACID e BASE.

Atividades práticas

As atividades práticas integram operações, consultas, agregação e índices no MongoDB.

Crie uma coleção de produtos e insira ao menos cinco documentos com campos variados.

Escreva uma consulta que use ao menos dois operadores combinados, como faixa de preço e categoria.

Monte um pipeline de agregação que mostre a quantidade e o preço médio de produtos por categoria.

Crie um índice apropriado para uma consulta frequente e demonstre, com explain, que ele é usado.
