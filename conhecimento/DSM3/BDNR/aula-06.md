---
disciplina: DSM3/BDNR
titulo: Aula 06
fonte: DSM3/BDNR/Aula_06.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

APOSTILA DO ALUNO

Banco de Dados Não Relacional

Modelando Dados no MongoDB

Curso Superior de Tecnologia em Desenvolvimento de Software Multiplataforma

Embedding e referencing

Quando duas informações se relacionam, como um pedido e seus itens, surge a pergunta central da modelagem no MongoDB: esses dados devem ficar juntos, dentro do mesmo documento, ou separados, em documentos diferentes? Existem dois caminhos, e cada um tem nome próprio.

Embedding: guardar junto

A estratégia de embedding, que significa aninhamento, consiste em guardar os dados relacionados dentro do próprio documento. No exemplo a seguir, um pedido guarda a lista completa de seus itens dentro de si.

{

cliente: 'Maria Silva',

data: '2026-05-20',

itens: [

{ produto: 'Caderno', quantidade: 2, preco: 18.50 },

{ produto: 'Caneta', quantidade: 5, preco: 3.00 }

]

}

A vantagem é clara: para ver o pedido completo, basta buscar um único documento. Tudo está ali, junto. Essa abordagem é rápida para leitura e simples de entender.

| Quando usar embeddingUse quando os dados são quase sempre acessados juntos, quando um lado pertence claramente ao outro, e quando a quantidade de itens aninhados não cresce sem limite. O pedido e seus itens são um exemplo perfeito. |

Referencing: guardar separado

A estratégia de referencing, que significa referenciamento, guarda os dados em documentos separados e usa apenas o identificador para ligar um ao outro, de forma parecida com a chave estrangeira do modelo relacional. No exemplo, o pedido guarda apenas o identificador do cliente.

{

cliente_id: 'abc123',

data: '2026-05-20',

total: 250.00

}

Os dados completos do cliente ficam em outra coleção. A vantagem aparece quando o cliente tem muitos pedidos: seus dados ficam guardados uma única vez, e qualquer atualização é feita em um só lugar.

| Quando usar referencingUse quando os dados são acessados separadamente, quando o relacionamento é de muitos para muitos, quando as informações mudam com frequência, ou quando os dados ligados podem crescer muito. |

Comparando as duas estratégias

| Aspecto | Embedding (junto) | Referencing (separado) |

| Leitura | Muito rápida, tudo de uma vez | Exige buscar em mais de um lugar |

| Atualização | Pode repetir dados | Dado em um lugar só |

| Melhor para | Dados acessados juntos | Dados independentes |

| Exemplo | Pedido e seus itens | Cliente e seus pedidos |

| Limite importanteUm documento no MongoDB pode ter no máximo dezesseis megabytes. Por isso, listas que crescem sem parar, como o histórico de todas as ações de um usuário, não devem ser guardadas por embedding. Nesses casos, o referencing é a escolha certa. |

Exercícios

Explique, com suas palavras, a diferença entre embedding e referencing.

Para um blog com posts e seus comentários, qual estratégia você usaria? Justifique.

Para uma escola com alunos e cursos, em que um aluno faz vários cursos e um curso tem vários alunos, qual estratégia é mais indicada?

Por que uma lista que cresce indefinidamente não deve ser guardada por embedding?

Padrões Bucket e Computed

O que são padrões de modelagem

Padrões de modelagem são soluções recorrentes para problemas de organização de dados. No MongoDB, esses padrões ajudam a estruturar documentos de acordo com o volume, a frequência de acesso e o tipo de consulta.

O padrão Bucket

O padrão Bucket, que significa balde, resolve o problema dos dados que chegam em grande quantidade ao longo do tempo, como leituras de sensores. Em vez de criar um documento para cada leitura, agrupam-se várias leituras de um período em um único documento.

Imagine um sensor que mede a temperatura a cada dez segundos. Criar um documento por leitura geraria milhares de documentos por hora. Com o padrão Bucket, junta-se todas as leituras de uma hora em um único documento, como no exemplo.

{

sensor: 'temp01',

hora: '2026-05-20 10:00',

leituras: [

{ minuto: 0, valor: 22.5 },

{ minuto: 1, valor: 22.7 }

],

media: 22.6

}

| Aplicação em situação realAplicativos que monitoram batimentos cardíacos ou passos ao longo do dia usam o padrão Bucket. Em vez de guardar cada batimento isolado, agrupam os dados em blocos de tempo, economizando espaço e tornando as consultas muito mais rápidas. |

O padrão Computed

O padrão Computed, que significa calculado, resolve o problema de cálculos repetidos. Em vez de recalcular um valor toda vez que ele é consultado, o valor é calculado uma vez e guardado pronto dentro do documento.

Por exemplo, em vez de somar todas as avaliações de um produto a cada vez que alguém abre a página, guarda-se a média já calculada e a quantidade de avaliações diretamente no documento do produto.

{

nome: 'Mochila Escolar',

preco: 120.00,

media_avaliacoes: 4.7,

total_avaliacoes: 152

}

Assim, mostrar a nota do produto é instantâneo, pois o valor já está pronto. O custo é que, a cada nova avaliação, a média precisa ser recalculada e atualizada. Vale a pena quando há muito mais leituras do que escritas.

| A troca por trás do padrãoO padrão Computed troca um pouco de trabalho na escrita por muita velocidade na leitura. Como a maioria dos sistemas lê muito mais do que escreve, essa troca quase sempre compensa. |

Exercícios

Explique o problema que o padrão Bucket resolve e dê um exemplo de dados que se beneficiariam dele.

Desenhe, em formato de documento, um Bucket que agrupe as vendas de um dia de uma loja.

Explique a troca que o padrão Computed faz entre leitura e escrita.

Cite um valor que valeria a pena pré-calcular e guardar no documento de um perfil de usuário de rede social.

Padrões Subset e Extended Reference

O padrão Subset

O padrão Subset, que significa subconjunto, é um meio-termo inteligente entre embedding e referencing. Ele guarda junto apenas a parte mais usada dos dados, e deixa o restante separado.

Pense em um filme com milhares de comentários. Guardar todos por embedding deixaria o documento gigante. Guardar todos separados exigiria uma busca extra. O padrão Subset resolve guardando os cinco comentários mais recentes dentro do documento do filme, e mantendo o histórico completo em outra coleção.

{

titulo: 'Filme Exemplo',

comentarios_recentes: [

{ autor: 'Ana', texto: 'Otimo filme' },

{ autor: 'Bruno', texto: 'Gostei muito' }

]

}

| Por que funcionaNa maioria das vezes, o usuário só vê os comentários mais recentes ao abrir a página. O padrão Subset atende a esse caso comum de forma rápida, sem carregar milhares de comentários antigos que quase ninguém vai ler. |

O padrão Extended Reference

O padrão Extended Reference, que significa referência estendida, melhora o referencing simples. Além de guardar o identificador do documento ligado, ele copia também alguns campos mais usados, evitando uma busca extra.

No exemplo, um pedido guarda o identificador do cliente, mas também copia seu nome e e-mail, que são as informações mais necessárias ao listar pedidos.

{

cliente_id: 'abc123',

cliente_nome: 'Maria Silva',

cliente_email: 'maria@exemplo.com',

data: '2026-05-20',

total: 250.00

}

Assim, para listar os pedidos com o nome do cliente, não é preciso buscar na coleção de clientes. A informação essencial já está ali. O cuidado é que, se o cliente mudar de nome, a cópia pode ficar desatualizada, o que muitas vezes é aceitável.

| Quando a cópia desatualizada não é problemaEm um pedido, faz sentido guardar o nome do cliente no momento da compra. Se ele mudar de nome depois, o pedido antigo pode continuar com o nome antigo, pois reflete como era na época. Nem toda cópia precisa ser atualizada. |

Exercícios

Explique como o padrão Subset combina o melhor do embedding e do referencing.

Para uma rede social, que parte dos dados de um perfil você guardaria por Subset em uma publicação?

Explique o que o padrão Extended Reference copia além do identificador, e por quê.

Dê um exemplo de campo copiado que pode ficar desatualizado sem causar problema.

Validação de Esquema

Flexibilidade com responsabilidade

A flexibilidade do MongoDB é uma vantagem, mas às vezes é preciso garantir que certos campos sempre existam e tenham o tipo correto. Por exemplo, todo usuário deve ter um nome e um e-mail válidos. Para isso existe a validação de esquema, que define regras mínimas que os documentos devem seguir.

| EquilíbrioA validação não tira a flexibilidade do MongoDB. Ela apenas estabelece um mínimo de regras onde isso é importante, deixando o restante livre. É possível exigir que o e-mail exista, mas permitir campos extras livres. |

Criando uma coleção com validação

A validação é definida no momento de criar a coleção, por meio de uma regra chamada validator. O exemplo cria uma coleção de usuários exigindo que cada documento tenha nome e e-mail, ambos do tipo texto.

db.createCollection('usuarios', {

validator: {

$jsonSchema: {

bsonType: 'object',

required: ['nome', 'email'],

properties: {

nome: { bsonType: 'string' },

email: { bsonType: 'string' },

idade: { bsonType: 'int', minimum: 0 }

}

}

}

})

A partir dessa definição, o MongoDB recusa qualquer tentativa de inserir um usuário sem nome ou sem e-mail. O campo idade, quando presente, precisa ser um número inteiro não negativo, mas não é obrigatório.

Testando a validação

Para ver a validação em ação, basta tentar inserir um documento que desrespeite as regras. A primeira inserção a seguir funciona, pois tem nome e e-mail. A segunda é recusada, pois falta o e-mail.

db.usuarios.insertOne({ nome: 'Joao', email: 'joao@ex.com' })

db.usuarios.insertOne({ nome: 'Pedro' })

| O que aconteceA primeira inserção é aceita normalmente. A segunda retorna um erro de validação, impedindo que um usuário sem e-mail seja gravado. Assim, a regra protege a qualidade dos dados sem exigir esforço manual a cada inserção. |

Exercícios

Explique para que serve a validação de esquema e por que ela não elimina a flexibilidade do MongoDB.

Crie uma coleção de produtos que exija os campos nome e preco.

Tente inserir um produto sem o campo preco e observe o erro retornado.

Acrescente uma regra que exija que o preço seja um número maior ou igual a zero.
