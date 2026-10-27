---
disciplina: DSM3/BDNR
titulo: Aula 02
fonte: DSM3/BDNR/Aula_02.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Como Funcionam os Bancos Distribuídos

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

O Teorema CAP

O que é um sistema distribuído

Um sistema distribuído utiliza vários nós que trabalham em conjunto. Em bancos pequenos, os dados podem permanecer em um único computador, chamado de nó. Quando o volume de dados ou a quantidade de acessos cresce além da capacidade de uma única máquina, o banco pode ser distribuído por vários nós, formando um cluster.

| Definições importantesNó é cada computador ou servidor individual que faz parte do sistema.Cluster é o conjunto de nós trabalhando juntos como se fossem um único banco de dados. |

A distribuição dos dados por vários nós amplia a capacidade do sistema, mas introduz o desafio de manter informações coerentes entre máquinas conectadas por rede. Como falhas de comunicação podem ocorrer, o Teorema CAP descreve as propriedades envolvidas nesse cenário.

As três propriedades

O Teorema CAP foi formulado por Eric Brewer no ano 2000. Ele afirma que um sistema distribuído não consegue garantir, ao mesmo tempo, as três propriedades a seguir. É preciso abrir mão de pelo menos uma delas.

Consistência (Consistency): toda leitura recebe sempre a informação mais recente. Se um dado foi atualizado, qualquer consulta seguinte verá o valor novo.

Disponibilidade (Availability): toda requisição recebe uma resposta, mesmo que parte do sistema esteja com problemas.

Tolerância a Partições (Partition tolerance): o sistema continua funcionando mesmo quando a comunicação entre os nós falha.

| Definição: Partição de redeUma partição de rede acontece quando os nós de um cluster perdem a comunicação entre si, como se o cluster tivesse sido dividido em pedaços isolados. Isso ocorre por falhas de cabo, de roteador ou de conexão, e é inevitável em sistemas distribuídos. |

Por que é preciso escolher

Como as falhas de rede são inevitáveis, a tolerância a partições não é realmente opcional em um sistema distribuído sério. Isso significa que, na prática, a escolha real fica entre consistência e disponibilidade quando uma falha de rede acontece.

Imagine um cluster dividido em dois grupos de nós que não conseguem se comunicar. Uma atualização chega a um dos grupos. Surge então a pergunta: o outro grupo deve continuar respondendo com a informação antiga, garantindo disponibilidade, ou deve recusar respostas até que a comunicação volte, garantindo consistência? Não há como ter as duas coisas ao mesmo tempo nesse momento.

| Aplicação em situação realPense em dois caixas de uma mesma loja que ficaram sem comunicação entre si. Se ambos continuarem vendendo o último produto do estoque, há disponibilidade, mas o estoque fica inconsistente, pois o produto pode ser vendido duas vezes. Se um deles parar de vender até a comunicação voltar, há consistência, mas se perde disponibilidade. O Teorema CAP é exatamente esse dilema. |

Posicionamento dos bancos no Teorema CAP

Diferentes bancos NoSQL priorizam propriedades distintas do Teorema CAP quando ocorre uma falha de rede, o que influencia seu comportamento.

| Banco | Prioriza | Consequência |

| MongoDB | Consistência | Garante dado sempre atualizado |

| Cassandra | Disponibilidade | Sempre responde, mesmo que com pequeno atraso na sincronia |

| Redis | Consistência | Dado correto e muito rápido em um nó principal |

Exercícios

Explique, com suas palavras, a diferença entre um nó e um cluster.

O que é uma partição de rede e por que ela é considerada inevitável?

Em um sistema de venda de ingressos para um show muito concorrido, o que seria pior: vender o mesmo assento duas vezes ou deixar de vender por alguns segundos? Relacione sua resposta com o Teorema CAP.

Por que se afirma que, na prática, a escolha do CAP fica entre consistência e disponibilidade?

ACID versus BASE

As propriedades ACID priorizam confiabilidade e correção imediata dos dados. Muitos bancos NoSQL adotam a abordagem BASE, que prioriza disponibilidade e flexibilidade. As duas abordagens atendem a necessidades diferentes e devem ser escolhidas conforme os requisitos do sistema.

Propriedades ACID

O modelo ACID prioriza a correção dos dados acima de tudo. Ele garante que cada operação seja completa, deixe o banco sempre em um estado válido, não interfira em outras operações e fique salva permanentemente. É a escolha ideal quando um erro é inaceitável, como no controle de dinheiro.

| Quando o ACID é essencialSistemas bancários, controle de estoque crítico, emissão de notas fiscais e qualquer situação em que um pequeno erro nos dados cause prejuízo real exigem as garantias do ACID. |

Conhecendo o BASE

O modelo BASE faz uma troca consciente. Ele aceita abrir mão da correção imediata e perfeita dos dados em troca de muito mais velocidade e disponibilidade. O nome BASE representa três características.

Disponibilidade básica: o sistema continua funcionando e respondendo mesmo sob falhas parciais.

Estado flexível: os dados podem estar temporariamente diferentes entre os nós, sem que isso seja considerado um erro.

Consistência eventual: dado um tempo sem novas alterações, todos os nós acabam ficando com a mesma informação.

| Definição: Consistência eventualConsistência eventual significa que, após uma atualização, os diferentes nós do sistema podem mostrar valores diferentes por um curto período, mas com o tempo todos convergem para o mesmo valor correto. A palavra eventual aqui quer dizer com o passar do tempo. |

| Aplicação em situação realQuando um vídeo recebe muitas curtidas, é comum ver o contador mostrar números ligeiramente diferentes em telas diferentes por alguns segundos. Ninguém se incomoda com isso, e em troca o sistema responde instantaneamente a milhões de pessoas. Essa é a consistência eventual do modelo BASE em ação. Exigir o número exato a cada instante deixaria o sistema lento sem nenhum benefício real. |

Comparação direta

| Aspecto | ACID | BASE |

| Prioridade | Correção dos dados | Disponibilidade e velocidade |

| Consistência | Imediata e garantida | Eventual, com o tempo |

| Típico de | Bancos relacionais | Muitos bancos NoSQL |

| Ideal para | Dinheiro, estoque crítico | Redes sociais, contadores, cache |

| Uma ideia importanteSistemas reais costumam usar os dois modelos ao mesmo tempo, cada um na parte adequada. Uma loja virtual pode usar BASE para mostrar quantas pessoas estão vendo um produto, mas ACID para processar o pagamento. Saber escolher é uma habilidade essencial do profissional de dados. |

Exercícios

Qual modelo, ACID ou BASE, seria mais adequado para registrar o saldo de uma conta bancária? Por quê?

Qual modelo seria mais adequado para contar quantas pessoas visualizaram uma publicação em uma rede social? Por quê?

Explique, com suas palavras, o que significa a expressão consistência eventual.

Dê um exemplo de um único sistema que poderia usar os dois modelos em partes diferentes, indicando qual parte usaria cada um.

Distribuindo os Dados

Replicação e particionamento

Quando um banco de dados precisa crescer além de um único servidor, ele usa duas estratégias principais para organizar os dados entre os nós. Essas estratégias são a replicação e o particionamento. Elas não competem entre si, e na prática costumam ser usadas juntas.

Replicação: copiar os mesmos dados

A replicação consiste em manter cópias idênticas dos mesmos dados em vários nós. Se um nó falhar, os outros continuam tendo a informação completa, e o sistema não para. Além de proteger contra falhas, a replicação também ajuda a atender mais leituras ao mesmo tempo, pois vários nós podem responder às consultas.

| Aplicação em situação realA replicação funciona como ter cópias de um documento importante guardadas em três lugares diferentes. Se um deles for perdido ou danificado, as outras cópias garantem que a informação não desapareça. O custo é manter as três cópias sempre iguais. |

A replicação tem duas formas comuns. Na primeira, um nó principal recebe todas as alterações e as repassa para os nós secundários, que servem principalmente para leitura e backup. Na segunda, todos os nós podem receber alterações e as compartilham entre si. A primeira é mais simples de manter consistente; a segunda oferece mais disponibilidade.

Particionamento: dividir os dados

O particionamento, também chamado de sharding, faz o contrário da replicação. Em vez de copiar tudo em todo lugar, ele divide os dados de modo que cada nó guarde apenas uma parte do conjunto total. Assim, é possível armazenar volumes de dados muito maiores do que caberia em um único servidor.

| Definição: ShardingSharding é o nome técnico para o particionamento de dados, ou seja, a divisão do conjunto total de dados em pedaços menores, chamados de fragmentos ou shards, distribuídos entre os nós do cluster. |

| Aplicação em situação realImagine uma enciclopédia dividida em volumes: o volume um guarda as letras de A a F, o volume dois de G a M, e assim por diante. Para achar um verbete, vai-se direto ao volume certo. O sharding faz o mesmo com os dados: cada nó guarda uma faixa, e o sistema sabe exatamente onde procurar. |

Estratégias de particionamento

Existem diferentes formas de decidir qual dado vai para qual nó. As três mais comuns são apresentadas a seguir.

Por intervalo: cada nó recebe uma faixa contínua de valores, como nomes de A a F em um nó e de G a M em outro.

Por hash: uma fórmula matemática distribui os dados de forma equilibrada entre os nós, evitando que um fique sobrecarregado.

Por lista: cada valor é atribuído manualmente a um nó específico, como guardar clientes de cada região em um nó dedicado.

| Cuidado com os pontos quentesUm problema comum do particionamento é a chamada chave quente, em que uma parte específica dos dados recebe muito mais acessos que as outras, sobrecarregando um único nó. Por isso a estratégia por hash é tão usada: ela distribui os acessos de forma mais equilibrada. |

Exercícios

Explique a diferença entre replicação e particionamento usando suas próprias palavras.

Qual estratégia protege melhor contra a falha de um servidor: replicação ou particionamento? Justifique.

Qual estratégia permite armazenar um volume maior de dados do que caberia em um único servidor?

Em uma loja com clientes de todo o país, descreva como o particionamento por lista poderia ser usado para organizar os dados por região.

As Quatro Categorias

Categorias NoSQL

Os bancos NoSQL se dividem em quatro grandes categorias, cada uma voltada a características e problemas específicos: chave-valor, documentos, colunas e grafos.

Chave-valor

A categoria chave-valor é a mais simples de todas. Cada informação é guardada como um par formado por uma chave única e um valor associado a ela, como em um dicionário em que se procura uma palavra e se encontra seu significado. É extremamente rápida, ideal para guardar coisas que precisam ser acessadas em frações de segundo.

| Aplicação práticaGuardar a sessão de um usuário logado: a chave seria o identificador da sessão e o valor seria os dados do usuário. Um exemplo de tecnologia dessa categoria é o Redis. |

Documentos

A categoria de documentos guarda cada registro como um documento completo, geralmente em formato JSON, com campos que podem variar de um registro para outro. É a categoria mais versátil e a mais parecida com a forma como os programadores pensam, pois um documento pode conter listas e estruturas aninhadas dentro de si.

| Aplicação práticaUm catálogo de produtos variados, em que cada produto tem seus próprios campos, encaixa-se perfeitamente nessa categoria. Um exemplo de tecnologia dessa categoria é o MongoDB. |

Colunas

A categoria orientada a colunas, também chamada de família de colunas, é projetada para lidar com volumes gigantescos de dados e escritas muito frequentes. Ela organiza os dados de forma a tornar extremamente eficientes as consultas planejadas com antecedência, sendo muito usada em registros históricos e dados de sensores.

| Aplicação práticaGuardar todas as mensagens trocadas em um aplicativo de bilhões de usuários, ou as leituras de milhares de sensores ao longo dos anos. Um exemplo de tecnologia dessa categoria é o Cassandra. |

Grafos

A categoria de grafos é especializada em relacionamentos. Em vez de tratar as conexões entre os dados como algo secundário, ela as coloca no centro. Cada informação é um ponto, e cada relacionamento é uma ligação entre pontos. É imbatível para responder perguntas sobre como as coisas se conectam.

| Aplicação práticaDescobrir amigos em comum em uma rede social, ou recomendar produtos com base no que pessoas parecidas compraram. Um exemplo de tecnologia dessa categoria é o Neo4j. |

Quadro-resumo das categorias

| Categoria | Banco | Ideia central | Melhor para |

| Chave-valor | Redis | Par chave e valor | Cache e sessões |

| Documentos | MongoDB | Documentos JSON | Dados variados |

| Colunas | Cassandra | Famílias de colunas | Grandes volumes |

| Grafos | Neo4j | Pontos e ligações | Relacionamentos |

Exercícios

Associe cada banco ao seu tipo: Redis, MongoDB, Cassandra e Neo4j.

Qual categoria seria mais indicada para um sistema que precisa descobrir conexões entre pessoas? Justifique.

Qual categoria é a mais simples e a mais rápida, ideal para guardar dados temporários como sessões de usuário?

Para um catálogo de produtos em que cada item tem campos diferentes, qual categoria você escolheria? Por quê?
