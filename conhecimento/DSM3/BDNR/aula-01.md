---
disciplina: DSM3/BDNR
titulo: Aula 01
fonte: DSM3/BDNR/Aula_01.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

Fundamentos do Mundo NoSQL

1. Modelo Relacional

1.1 Banco de dados

Um banco de dados é uma coleção organizada de informações que pode ser facilmente acessada, gerenciada e atualizada. Praticamente todo sistema que se utiliza no dia a dia depende de um banco de dados por trás dele. Quando alguém realiza uma compra em uma loja virtual, consulta o saldo bancário pelo aplicativo ou pesquisa um vídeo em uma plataforma de streaming, há um banco de dados respondendo a essas solicitações.

O modelo relacional, criado na década de 1970, organiza os dados em tabelas e permanece adequado a uma ampla variedade de sistemas. Seus princípios servem de base para compreender as diferenças de estrutura, escalabilidade e flexibilidade encontradas nos bancos NoSQL.

| Definição: Modelo RelacionalO modelo relacional organiza os dados em tabelas formadas por linhas e colunas. Cada tabela representa um tipo de entidade, cada linha representa um registro individual e cada coluna representa um atributo desse registro. |

1.2 Tabelas, linhas e colunas

Imagine uma biblioteca que precisa controlar seus livros. No modelo relacional, ela teria uma tabela chamada Livros, em que cada linha representa um livro e cada coluna representa uma informação sobre esse livro. O resultado seria algo parecido com a tabela a seguir.

| id | titulo | autor | ano |

| 1 | Dom Casmurro | Machado de Assis | 1899 |

| 2 | O Cortiço | Aluísio Azevedo | 1890 |

| 3 | Memórias Póstumas | Machado de Assis | 1881 |

Nessa tabela, a coluna id serve para identificar cada livro de forma única. Esse identificador é chamado de chave primária. A chave primária é fundamental porque garante que nunca haja confusão entre dois registros, mesmo que eles tenham títulos ou autores parecidos.

| Definição: Chave PrimáriaA chave primária é uma coluna, ou um conjunto de colunas, cujo valor identifica de forma única cada linha de uma tabela. Não pode haver duas linhas com a mesma chave primária, e ela nunca pode ficar vazia. |

1.3 Relacionamentos entre tabelas

O poder do modelo relacional aparece quando várias tabelas se conectam. Suponha que a biblioteca também precise registrar os empréstimos dos livros. Não faria sentido repetir todas as informações do livro a cada empréstimo. Em vez disso, cria-se uma tabela Emprestimos que apenas aponta para o livro por meio do seu identificador.

| id | id_livro | aluno | data |

| 1 | 1 | Maria Silva | 2026-03-10 |

| 2 | 3 | João Santos | 2026-03-11 |

| 3 | 1 | Ana Oliveira | 2026-03-15 |

A coluna id_livro na tabela Emprestimos aponta para a coluna id da tabela Livros. Esse vínculo é chamado de chave estrangeira. Observa-se que o livro de identificador 1, Dom Casmurro, foi emprestado duas vezes, e não foi necessário repetir seu título e autor em nenhum momento.

| Definição: Chave EstrangeiraA chave estrangeira é uma coluna que aponta para a chave primária de outra tabela, criando um relacionamento entre elas. É o mecanismo que conecta as tabelas no modelo relacional. |

1.4 Normalização

O ato de separar as informações em várias tabelas para evitar repetição tem um nome: normalização. A ideia central é que cada informação seja armazenada em um único lugar. Se o nome de um autor estivesse repetido em centenas de registros e precisasse ser corrigido, seria necessário alterar todas as cópias. Com a normalização, a correção é feita em um único ponto.

| Exemplo do mundo realPense em uma agenda de contatos no celular. O número de telefone de um amigo fica salvo uma única vez. Quando ele troca de número, a atualização é feita em um só lugar, e todas as conversas e chamadas passam a usar o número novo automaticamente. Esse é o espírito da normalização. |

1.5 Propriedades ACID

Os bancos relacionais ficaram conhecidos por garantir um conjunto de propriedades chamado ACID. Essas quatro letras representam garantias que tornam o banco confiável, especialmente em situações em que erros não podem acontecer, como em transações financeiras.

Atomicidade: uma operação acontece por completo ou não acontece de forma alguma. Não existe meio-termo.

Consistência: o banco sempre passa de um estado válido para outro estado válido, respeitando todas as regras definidas.

Isolamento: operações simultâneas não interferem umas nas outras.

Durabilidade: uma vez confirmada, a operação permanece registrada mesmo que falte energia logo em seguida.

| Exemplo do mundo realImagine uma transferência bancária de cem reais entre duas contas. A atomicidade garante que o dinheiro saia de uma conta e entre na outra como uma única operação indivisível. É impossível que o valor saia de uma conta sem entrar na outra. Se algo der errado no meio do caminho, tudo é desfeito e nenhuma conta fica prejudicada. |

Exercícios

Em uma tabela de Alunos com as colunas matricula, nome, curso e email, qual coluna seria a candidata natural a chave primária? Justifique.

Desenhe, no papel, duas tabelas relacionadas para representar uma loja: uma de Produtos e uma de Vendas. Indique a chave primária de cada uma e a chave estrangeira que as conecta.

Explique, com suas palavras, o que a propriedade de atomicidade impede de acontecer em uma transferência bancária.

Cite uma situação do seu dia a dia em que a repetição de informação poderia causar problemas, e explique como a normalização ajudaria.

2. Limitações do Modelo Relacional

O modelo relacional continua adequado a uma grande quantidade de sistemas, mas pode apresentar dificuldades em cenários de escala muito elevada, relacionamentos profundos, estruturas aninhadas e esquemas com grande variação de atributos.

2.1 Escala e relacionamentos profundos

Considere uma rede social com cem milhões de usuários, em que cada pessoa tem em média trezentos amigos. Uma pergunta simples como quais são os amigos dos meus amigos exige que o banco percorra os relacionamentos de centenas de pessoas. No modelo relacional, isso é feito com uma operação chamada junção, que combina dados de várias tabelas.

Quando uma única consulta precisa combinar muitas tabelas, ou percorrer vários níveis de relacionamento, as junções se acumulam. Em pequena escala, isso funciona bem. Em escala de rede social, com bilhões de conexões, essas junções sucessivas tornam-se lentas e caras, mesmo em servidores potentes.

| Exemplo do mundo realEm uma rede social, descobrir uma conexão do tipo amigo de um amigo de um amigo pode ser feito de forma natural em um banco de grafos. No modelo relacional, a mesma pergunta pode exigir combinar a tabela de amizades com ela mesma três vezes, o que se torna pesado conforme a rede cresce. |

2.2 Descasamento entre objetos e tabelas

As linguagens de programação modernas trabalham com objetos. Um objeto Pedido, por exemplo, costuma conter dentro de si uma lista de itens, que por sua vez contêm informações do produto. Essa estrutura é hierárquica e aninhada, ou seja, uma coisa fica dentro da outra.

O modelo relacional, porém, não armazena estruturas aninhadas. Para guardar um pedido com seus itens, é necessário quebrar o objeto em várias tabelas e depois remontá-lo a cada consulta. Esse trabalho constante de desmontar e remontar é conhecido como descasamento objeto-relacional, e gera código repetitivo e propenso a erros.

| Aplicação práticaUm pedido de comida em um aplicativo de delivery é, naturalmente, um único objeto: tem o cliente, o endereço e a lista de itens com suas quantidades. Faz sentido guardá-lo como uma unidade. No modelo relacional, ele precisa ser dividido em pelo menos três tabelas separadas. |

2.3 Rigidez do esquema

No modelo relacional, antes de guardar qualquer dado é necessário definir a estrutura exata da tabela: quais colunas existem e de que tipo é cada uma. Essa estrutura fixa é chamada de esquema. O problema aparece quando diferentes registros precisam guardar informações diferentes.

Imagine um catálogo de produtos variados. Uma camiseta tem tamanho e cor. Um eletrodoméstico tem voltagem e potência. Um livro tem autor e número de páginas. Em uma única tabela relacional, seria preciso criar uma coluna para cada atributo possível, e a maioria ficaria vazia na maior parte das linhas, desperdiçando espaço e gerando confusão.

| produto | tamanho | voltagem | autor |

| Camiseta | M | (vazio) | (vazio) |

| Ventilador | (vazio) | 110V | (vazio) |

| Livro NoSQL | (vazio) | (vazio) | Sadalage |

A tabela acima ilustra o desperdício: cada produto preenche apenas as colunas que fazem sentido para ele, deixando as demais vazias. Em um catálogo real com centenas de tipos de produto, esse problema se multiplica.

Exercícios

Explique, com suas palavras, por que a pergunta amigos dos meus amigos pode ser lenta em um banco relacional de grande escala.

Dê um exemplo de um objeto do mundo real que tenha uma estrutura aninhada, ou seja, com uma lista dentro dele.

Pense em um catálogo de uma loja de instrumentos musicais. Liste três produtos diferentes e mostre como cada um teria atributos distintos que não se aplicam aos outros.

Em sua opinião, o modelo relacional deve ser abandonado por causa dessas limitações? Justifique a resposta.

3. Tipos de Dados

Os dados podem ser classificados em três grandes grupos de acordo com seu nível de organização: estruturados, semiestruturados e não estruturados. Essa classificação influencia a forma de armazenamento e consulta mais adequada a cada tipo de informação.

3.1 Dados estruturados

Dados estruturados são aqueles que seguem um formato rígido e bem definido. Cada informação tem um lugar certo, com um tipo conhecido. As tabelas de um banco relacional são o exemplo perfeito. Quando se sabe exatamente quais campos existem e qual o tipo de cada um, tem-se um dado estruturado.

| Exemplo do mundo realUma planilha de notas de uma turma é um dado estruturado. Cada linha é um aluno, e as colunas são sempre as mesmas: nome, nota da prova 1, nota da prova 2 e média. Todo aluno tem exatamente os mesmos campos. |

3.2 Dados semiestruturados

Dados semiestruturados possuem organização parcial e flexível. Eles utilizam marcações que identificam cada parte da informação, porém nem todos os registros precisam apresentar exatamente os mesmos campos. O JSON é um dos formatos mais utilizados para representar esse tipo de dado.

| Definição: JSONJSON, sigla para JavaScript Object Notation, é um formato de texto para representar dados em pares de nome e valor. É legível tanto para pessoas quanto para máquinas, e é a base de como o MongoDB armazena informações. |

Observe dois produtos representados em JSON. Eles compartilham alguns campos, mas cada um tem informações específicas, sem que isso cause qualquer problema.

{

"nome": "Camiseta Básica",

"preco": 49.90,

"tamanho": "M",

"cor": "azul"

}

{

"nome": "Ventilador de Mesa",

"preco": 159.90,

"voltagem": "110V",

"potencia": "45W"

}

Os dois registros representam produtos, mas cada um armazena apenas os atributos que fazem sentido para suas características. Não há necessidade de criar colunas vazias para atributos inexistentes, demonstrando a flexibilidade do modelo semiestruturado.

3.3 Dados não estruturados

Dados não estruturados são aqueles que não possuem uma organização interna padronizada. Fotos, vídeos, áudios e textos livres entram nessa categoria. Não há campos nem marcações claras dentro de uma imagem que digam onde está cada informação. Apesar disso, esse é o tipo de dado mais abundante no mundo atual.

| Exemplo do mundo realA foto que alguém tira com o celular é um dado não estruturado. Dentro do arquivo da imagem não há campos como rosto ou paisagem prontos para consulta. Para extrair informação dali, são necessárias técnicas especiais, como reconhecimento de imagem por inteligência artificial. |

3.4 Comparação entre os tipos de dados

| Tipo | Organização | Exemplo |

| Estruturado | Rígida e fixa | Planilha, tabela relacional |

| Semiestruturado | Flexível, com marcações | Documento JSON, arquivo XML |

| Não estruturado | Sem padrão interno | Foto, vídeo, áudio, texto livre |

Exercícios

Classifique cada item a seguir como estruturado, semiestruturado ou não estruturado: uma planilha de gastos, uma música em MP3, um documento JSON de um perfil de usuário, um vídeo de aula, uma tabela de funcionários.

Escreva, em formato JSON, a representação de um livro com os campos titulo, autor e ano. Depois, escreva a de um filme com campos diferentes. Note como ambos podem coexistir sem problema.

Por que se afirma que os dados não estruturados são os mais abundantes no mundo atual? Pense nas redes sociais.

Qual tipo de dado o modelo relacional tradicional representa melhor? E qual representa pior?

4. História e Fundamentos do NoSQL

4.1 Origem do termo NoSQL

O termo NoSQL pode parecer indicar que essas tecnologias são contra os bancos relacionais ou contra a linguagem SQL. Essa interpretação está equivocada. A sigla é entendida como Not Only SQL, ou seja, não apenas SQL. A ideia não é substituir os bancos relacionais, mas oferecer alternativas para os casos em que eles não são a melhor escolha.

| Definição: NoSQLNoSQL é o nome dado a um conjunto de tecnologias de banco de dados que não seguem o modelo relacional tradicional. O nome significa Not Only SQL, indicando que essas tecnologias complementam, e não substituem, os bancos relacionais. |

4.2 Sistemas em grande escala

No início dos anos dois mil, empresas como Google, Amazon e Facebook cresceram a ponto de lidar com volumes de dados e quantidades de usuários nunca vistos antes. Os bancos relacionais tradicionais começaram a custar caro demais e a apresentar limites para essa escala. Diante disso, essas empresas desenvolveram suas próprias soluções.

Em 2006, o Google publicou um artigo descrevendo o Bigtable, um sistema próprio para armazenar grandes volumes de dados. Em 2007, a Amazon apresentou o Dynamo, com a mesma motivação. Esses dois trabalhos influenciaram praticamente todos os bancos NoSQL que vieram depois.

4.3 Popularização do termo

A palavra NoSQL ganhou força em 2009, durante um encontro de desenvolvedores em São Francisco, organizado por Johan Oskarsson. A partir desse período, dezenas de bancos surgiram ou se consolidaram, cada um direcionado a tipos específicos de problema.

4.4 Principais motivações

Três motivações principais impulsionaram o surgimento e a popularização dos bancos NoSQL: escalabilidade, flexibilidade e desempenho. Elas ajudam a identificar cenários em que tecnologias não relacionais podem ser adequadas.

Escalabilidade: a capacidade de crescer adicionando mais servidores comuns, em vez de depender de um único servidor cada vez mais caro e potente.

Flexibilidade: a possibilidade de armazenar dados de formatos variados sem precisar definir uma estrutura rígida de antemão.

Desempenho: a capacidade de responder muito rapidamente a tipos específicos de operação que os bancos relacionais atendem com dificuldade.

| Exemplo do mundo realQuando um vídeo viraliza e milhões de pessoas o acessam ao mesmo tempo, a plataforma precisa crescer rapidamente para aguentar a demanda. Adicionar dezenas de servidores comuns de forma automática, em vez de comprar um único supercomputador, é o tipo de escalabilidade que os bancos NoSQL tornam possível. |

4.5 Categorias de bancos NoSQL

Os bancos NoSQL se dividem em quatro grandes categorias, cada uma adequada a características específicas de armazenamento, acesso e relacionamento entre dados.

| Categoria | Exemplo | Bom para |

| Chave-valor | Redis | Cache, sessões, contadores rápidos |

| Documentos | MongoDB | Catálogos, perfis, conteúdo variado |

| Colunas | Cassandra | Grandes volumes, históricos, telemetria |

| Grafos | Neo4j | Redes sociais, recomendações, conexões |

Exercícios

O que significa a sigla NoSQL e por que essa interpretação é importante para não criar uma ideia equivocada sobre a tecnologia?

Quais foram as duas empresas e os dois sistemas que influenciaram o surgimento dos bancos NoSQL?

Explique, com suas palavras, a diferença entre crescer comprando um servidor mais potente e crescer adicionando vários servidores comuns.

Escolha uma aplicação que você usa no dia a dia e tente imaginar qual das quatro categorias NoSQL poderia ser útil para ela. Justifique.
