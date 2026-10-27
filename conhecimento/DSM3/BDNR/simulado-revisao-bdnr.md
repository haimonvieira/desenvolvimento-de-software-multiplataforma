---
disciplina: DSM3/BDNR
titulo: Simulado Revisao BDNR
fonte: DSM3/BDNR/Simulado_Revisao_BDNR.pdf
tipo: pdf
paginas: 9
extraido_em: 2026-10-24
---

<!-- page: 1 -->

Contexto: Oficina Mecânica Auto Center Avenida

Estrutura do banco de dados

Considere o banco de dados oficinaDB, contendo três coleções:

Coleção           Campos

clientes          _id, nome, cidade, telefone, ativo

veiculos          _id, id_cliente, placa, modelo, ano

ordens_servi      _id, id_cliente, id_veiculo, data_abertura, status,
co                valor_total, servicos

Na coleção ordens_servico, o campo servicos é um array de documentos
com descricao, quantidade e valor_unitario.

Para a resolução, considere que id_cliente e id_veiculo são referências
numéricas aos respectivos campos _id, valor_total é numérico e
data_abertura utiliza o tipo Date.


Questão 1

A oficina realizou o cadastro de três novos clientes e precisa armazenar
seus dados na coleção clientes.

Desenvolva um único comando MongoDB para inserir os seguintes
documentos:

_id   Nome            Cidade          Telefone         Ativ
                                                       o

10    Carlos          Registro        1399999000       true
1     Mendes                          1

10    Ana Oliveira    Pariquera-      1399999000       true
2                     Açu             2

10    Roberto         Jacupiranga     1399999000       false
3     Lima                            3

O comando deverá inserir os três documentos em uma única operação,
preservando os tipos de dados.

<!-- page: 2 -->

Questão 2

O setor administrativo deseja identificar ordens de serviço concluídas que
apresentem valores elevados.

Desenvolva uma consulta MongoDB que retorne somente as ordens de
serviço que atendam simultaneamente às seguintes condições:

      Status igual a "Concluída".

      Valor total superior a R$ 1.500,00 e inferior ou igual a R$ 5.000,00.

      Exibir apenas _id, id_cliente, status e valor_total.

      Ordenar os resultados pelo maior valor total.


Questão 3

A oficina deseja localizar veículos para uma campanha de manutenção
preventiva.

Desenvolva uma consulta na coleção veiculos que retorne veículos cujo
ano de fabricação seja inferior a 2015 ou cujo modelo seja "Gol" ou "Palio",
considerando apenas veículos fabricados a partir de 2005.

O resultado deverá apresentar a placa, o modelo e o ano, ordenados do
veículo mais antigo para o mais recente.


Questão 4

A direção deseja identificar clientes que representam maior faturamento
para a oficina.

<!-- page: 3 -->

Desenvolva um pipeline de agregação na coleção ordens_servico que:

      Considere somente ordens com status "Concluída".

      Agrupe os documentos por id_cliente.

      Calcule a quantidade de ordens e a soma do faturamento.

      Retorne somente os clientes com pelo menos três ordens concluídas
       e faturamento superior a R$ 5.000,00.

      Organize o resultado pelo maior faturamento.


Questão 5

O gerente deseja identificar os serviços mais realizados, utilizando o array
servicos da coleção ordens_servico.

Desenvolva um pipeline que considere somente ordens concluídas,
individualize os serviços armazenados no array, agrupe-os pela descrição
e calcule a quantidade total executada e o faturamento de cada serviço,
multiplicando sua quantidade pelo valor unitário.

A consulta deverá retornar somente os serviços com quantidade total
superior a dez, ordenados pelo maior faturamento.


Questão 6

A oficina deseja identificar ordens de serviço que possuam status
"Pendente" ou "Em andamento" e cujo valor total esteja entre R$ 1.000,00
e R$ 3.000,00, incluindo ambos os limites.

Qual comando MongoDB atende corretamente à solicitação?

A) db.ordens_servico.find({ status: { $in: ['Pendente', 'Em andamento'] },
valor_total: { $gte: 1000, $lte: 3000 } })

B) db.ordens_servico.find({ status: { $and: ['Pendente', 'Em andamento'] },
valor_total: { $gt: 1000, $lt: 3000 } })

<!-- page: 4 -->

C) db.ordens_servico.find({ status: { $in: ['Pendente', 'Em andamento'] },
valor_total: { $gt: 1000, $lt: 3000 } })

D) db.ordens_servico.find({ status: { $nin: ['Pendente', 'Em andamento'] },
valor_total: { $gte: 1000, $lte: 3000 } })

E) db.ordens_servico.find({ status: 'Pendente', valor_total: { $gte: 1000,
$lte: 3000 } })


Questão 7

Um desenvolvedor elaborou o seguinte pipeline para calcular o
faturamento total por cliente:

<!-- page: 5 -->

Ao executar o comando, o MongoDB apresenta um erro de sintaxe.

Qual alternativa identifica corretamente o problema e apresenta a
solução?

A) O operador $group não permite utilizar $sum mais de uma vez. É
necessário remover total_ordens.

B) O operador $match não pode ser utilizado após $group. É necessário
movê-lo obrigatoriamente para o início.

C) O pipeline não permite utilizar $sort após $match. É necessário
substituir $sort por find().

D) Está faltando fechar o array do pipeline com ] antes do parêntese final
do aggregate().

E) O campo _id não pode receber uma referência a outro campo. Deve ser
substituído por null.


Questão 8

A direção deseja obter um relatório com o total de ordens concluídas, o
faturamento acumulado, o valor médio, o maior e o menor valor de
ordem de serviço, agrupados pelo cliente.

Qual pipeline está correto?

A) db.ordens_servico.aggregate([{ $match: { status: "Concluída" } },
{ $group: { _id: "$id_cliente", quantidade: { $sum: 1 }, total: { $sum:
"$valor_total" }, media: { $avg: "$valor_total" }, maior: { $max:
"$valor_total" }, menor: { $min: "$valor_total" } } }])

B) db.ordens_servico.aggregate([{ $match: { status: "Concluída" } },
{ $group: { _id: "$id_cliente", quantidade: { $count: "$_id" }, total: { $sum:
"$valor_total" }, media: { $sum: "$valor_total" }, maior: { $max:
"$valor_total" }, menor: { $min: "$valor_total" } } }])

<!-- page: 6 -->

C) db.ordens_servico.aggregate([{ $group: { _id: "$id_cliente", quantidade:
{ $sum: 1 }, total: { $avg: "$valor_total" }, media: { $sum: "$valor_total" },
maior: { $max: "$valor_total" }, menor: { $min: "$valor_total" } } },
{ $match: { status: "Concluída" } }])

D) db.ordens_servico.aggregate([{ $match: { status: "Concluída" } },
{ $group: { _id: "$id_cliente", quantidade: { $sum: 1 }, total: { $sum:
"$valor_total" }, media: { $avg: "$valor_total" }, maior: { $min:
"$valor_total" }, menor: { $max: "$valor_total" } } }])

E) db.ordens_servico.aggregate([{ $match: { status: "Concluída" } },
{ $group: { _id: "$status", quantidade: { $sum: 1 }, total: { $sum:
"$valor_total" }, media: { $avg: "$valor_total" }, maior: { $max:
"$valor_total" }, menor: { $min: "$valor_total" } } }])


Questão 9 — Correção de sintaxe em comando de inserção

Um desenvolvedor pretende inserir dois novos veículos em uma única
operação, mas escreveu o seguinte comando:

<!-- page: 7 -->

O comando apresenta um erro na estrutura dos argumentos.

Qual alternativa apresenta a correção adequada?

A) Substituir insertMany() por insertOne(), mantendo os dois documentos
como argumentos separados.

B) Substituir insertMany() por find(), mantendo os documentos sem
alterações.

C) Utilizar insertMany() e envolver os dois documentos em um único
array: insertMany([{...}, {...}]).

D) Utilizar insertMany() com um único objeto contendo duas
propriedades, uma para cada veículo.

E) Substituir os campos _id por id, pois insertMany() não permite
informar _id explicitamente.


Questão 10 — Interpretação de pipeline de agregação

<!-- page: 8 -->

Analise o seguinte comando:


Considerando a ordem de execução dos estágios e o funcionamento dos
operadores, qual alternativa descreve corretamente o resultado?

A) Retorna todos os clientes cadastrados, incluindo aqueles sem ordens
concluídas, calculando a média de todas as ordens.

B) Retorna somente os clientes com pelo menos duas ordens concluídas e
faturamento total superior a R$ 1.500,00.

C) Retorna os clientes que possuem qualquer ordem superior a R$
1.500,00, independentemente da quantidade de ordens concluídas.

D) Retorna clientes com mais de duas ordens concluídas de valor
individual mínimo de R$ 500,00, cuja média dessas ordens seja superior a
R$ 1.500,00, ordenados pela maior média.

<!-- page: 9 -->

E) Retorna os clientes com mais de duas ordens concluídas, calculando a
média antes de excluir os documentos cujo valor seja inferior a R$ 500,00.
