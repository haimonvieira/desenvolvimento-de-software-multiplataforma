---
disciplina: DSM2/BD2
titulo: Atividade 1   N1   HAIMON CUGLER VIEIRA
fonte: DSM2/BD2/exercicio/Atividade 1 - N1 - HAIMON CUGLER VIEIRA.pdf
tipo: pdf
paginas: 12
extraido_em: 2026-10-24
---

<!-- page: 1 -->

                      CURSO TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS

       Atividade Avaliativa — Banco de Dados
                            Estudo de Caso: Agricultura Familiar
                                                   2º DSM


 Aluno(a):                                                      DSM2
                                                       Turma: ____________                     Data:
 Haimon Cugler Vieira
 __________________________________                                                            29
                                                                                               __ / 03   26
                                                                                                    __ / ___
 Professor(a):                                         Nota: ________ / ________
  Wagner
 __________________________________


     📋 Instruções Gerais
     • Leia o enunciado de cada exercício com atenção antes de responder.
     • Utilize o banco de dados e as tabelas fornecidas nesta atividade como base para todas as
     questões.
     • Nas questões práticas (MySQL), execute os comandos no ambiente indicado pelo professor.
     • Nas questões dissertativas, escreva a query SQL corretamente no espaço disponível.
     • Não são permitidas consultas com JOIN nesta atividade — use apenas as tabelas
     individualmente.
     • Cuide da ortografia SQL: palavras-chave em maiúsculo e nomes de tabelas/colunas em
     minúsculo.


 🌱 ESTUDO DE CASO — SISTEMA DE AGRICULTURA FAMILIAR

Contexto: A Cooperativa AgroVerde atua no apoio a produtores rurais da região. Para organizar as
informações de suas propriedades, culturas, colheitas e vendas, a cooperativa precisa de um banco de
dados estruturado. Como desenvolvedor(a), você foi contratado(a) para modelar e implementar esse
sistema.


 Tabela 1 — propriedades
Armazena os dados das propriedades rurais cadastradas na cooperativa.

 id_propriedade     nome_propriedade             municipio               area_hectares          tipo_solo

 1                  Sítio Boa Esperança          Registro                12.5                   Argiloso
 2                  Fazenda Santa Maria          Cajati                  45                     Arenoso
 3                  Chácara Verde                Pariquera-Açu           8                      Humoso
 4                  Sítio Sol Nascente           Eldorado                20                     Argiloso
 5                  Rancho Bela Vista            Juquiá                  35.5                   Arenoso
 6                  Sítio das Palmeiras          Registro                15                     Humoso

               Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 1

<!-- page: 2 -->

 7                     Fazenda Boa Colheita       Cajati                 60                       Argiloso
 8                     Chácara Primavera          Pariquera-Açu          9.5                      Arenoso


 Tabela 2 — produtores
Armazena os dados dos produtores rurais vinculados à cooperativa.

 id_produtor     nome_produtor                 telefone              id_propriedade       ativo

 1               João da Silva                 (13) 99812-3456       1                    Sim
 2               Maria Oliveira                (13) 98723-4567       2                    Sim
 3               Carlos Souza                  (13) 99634-5678       3                    Não
 4               Ana Pereira                   (13) 97545-6789       4                    Sim
 5               Pedro Almeida                 (13) 96456-7890       5                    Sim
 6               Lucia Fernandes               (13) 99367-8901       6                    Não
 7               Roberto Costa                 (13) 98278-9012       7                    Sim
 8               Fernanda Santos               (13) 97189-0123       8                    Sim


 Tabela 3 — culturas
Armazena os tipos de culturas produzidas pelas propriedades.

 id_cultura    nome_cultura         id_propriedade         area_plantada_ha     data_plantio       status

 1             Banana               1                      5                    2024-03-01         Produzindo
 2             Mandioca             2                      10                   2024-01-15         Colhida
 3             Tomate               3                      2                    2024-05-10         Produzindo
 4             Milho                4                      8                    2024-02-20         Produzindo
 5             Batata-doce          5                      6                    2024-04-05         Colhida
 6             Banana               6                      4                    2024-03-18         Produzindo
 7             Soja                 7                      30                   2024-01-10         Produzindo
 8             Tomate               8                      3                    2024-06-01         Aguardando
 9             Milho                1                      4                    2024-02-10         Colhida
 10            Mandioca             5                      5                    2024-03-25         Produzindo


 Tabela 4 — colheitas
Registra as colheitas realizadas por cultura.

 id_colheita     id_cultura       data_colheita        quantidade_kg          qualidade

 1               2                2024-06-10           4500                   Boa

               Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 2

<!-- page: 3 -->

 2                5              2024-08-20           2800                  Excelente
 3                9              2024-07-15           3200                  Regular
 4                1              2024-09-01           1800                  Boa
 5                4              2024-08-05           5200                  Excelente
 6                6              2024-09-10           1500                  Boa
 7                7              2024-09-15           12000                 Boa
 8                10             2024-09-20           2100                  Regular


 Tabela 5 — vendas
Registra as vendas dos produtos colhidos.

 id_venda     id_colheita    data_venda        quantidade_vendida_kg         preco_por_kg       comprador

 1            1              2024-06-15        3000                          1.8                Mercado
                                                                                                Central
 2            2              2024-08-25        2000                          2.5                Feira
                                                                                                Municipal
 3            3              2024-07-20        2500                          0.9                Merenda
                                                                                                Escolar
 4            4              2024-09-05        1200                          3.5                Feira
                                                                                                Municipal
 5            5              2024-08-10        4000                          1.2                Mercado
                                                                                                Central
 6            6              2024-09-12        1000                          3.8                Restaurante
                                                                                                Verde
 7            7              2024-09-18        8000                          2.1                Cooperativa
                                                                                                Sul
 8            8              2024-09-22        1500                          0.95               Mercado
                                                                                                Central


     📌 Script SQL de Referência — Estrutura das Tabelas (criado na Questão 1)
     Os scripts de CREATE TABLE e INSERT INTO deverão ser escritos pelo aluno na Questão 1,
     com base nos atributos e registros apresentados nas tabelas acima.


               Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 3

<!-- page: 4 -->

 QUESTÃO 1 — Criação do Banco de Dados, Tabelas e Inserção
 de Dados

  📋 Enunciado
  Utilizando o MySQL Workbench (ou ferramenta indicada pelo professor), realize os
  procedimentos a seguir com base nas tabelas do estudo de caso da Cooperativa AgroVerde.

  Você deverá:
   a) Criar o banco de dados agroverde;
   b) Criar as 5 tabelas com os atributos corretos, tipos de dados adequados e chaves primárias;
   c) Inserir TODOS os registros fornecidos nas tabelas do estudo de caso;
   d) Executar as 5 consultas básicas solicitadas abaixo.


 Parte A, B e C — Criação e Inserção
Execute no MySQL os comandos de criação do banco, tabelas e inserção de dados. Após a execução,
tire um print de cada etapa e anexe à atividade, conforme orientação do professor.


 Parte D — Consultas Básicas (executar no MySQL)

  PRÁTICA — MySQL
  Consulta 1.1
  Liste o nome e o município de TODAS as propriedades cadastradas, exibindo também a
  área em hectares.


  PRÁTICA — MySQL
  Consulta 1.2
  Exiba todos os produtores que estão ATIVOS (ativo = 'Sim'), mostrando nome do produtor e
  telefone.


  PRÁTICA — MySQL
  Consulta 1.3
  Liste todas as culturas com status igual a 'Produzindo', exibindo o nome da cultura, a área
  plantada e a data de plantio.


  PRÁTICA — MySQL
  Consulta 1.4
  Mostre todas as colheitas cuja quantidade colhida seja superior a 2.500 kg, exibindo o
  id_colheita, a quantidade e a qualidade.


  PRÁTICA — MySQL


             Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 4

<!-- page: 5 -->

Consulta 1.5
Exiba todas as vendas realizadas para o comprador 'Mercado Central', mostrando a data da
venda, a quantidade vendida e o preço por kg.


🖨️ Orientação de Entrega
Após executar todas as consultas, anexe os prints das telas com os resultados obtidos, anexe
também o arquivo .SQL na atividade.
Os prints devem mostrar claramente o comando SQL executado e o resultado retornado pelo
banco.


          Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 5

<!-- page: 6 -->

 QUESTÃO 2 — Consultas Dissertativas (Escrita Manual da Query)

  📋 Enunciado
  Para cada consulta abaixo, escreva manualmente a query SQL correta no espaço indicado.
  Utilize as tabelas do estudo de caso. NÃO é necessário executar — apenas escreva o código
  correto.
  Utilize SELECT, FROM, WHERE e outras cláusulas básicas. Não utilize JOIN.


 DISSERTATIVA — Escreva a Query
 Questão 2.1
 Escreva uma consulta que retorne somente os nomes das propriedades localizadas no
 município de 'Registro'.


Resposta:

select nome_propriedade from
propriedades where municipio = 'Registro


 DISSERTATIVA — Escreva a Query
 Questão 2.2
 Escreva uma consulta que retorne o nome do produtor e o telefone dos produtores cujo
 id_propriedade seja 2, 5 ou 7 (utilize o operador IN).


Resposta:

select nome_produtor from produtores where
id_propriedade in (2, 5, 7);


 DISSERTATIVA — Escreva a Query
 Questão 2.3


            Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 6

<!-- page: 7 -->

 Escreva uma consulta que retorne o nome da cultura, a área plantada e o status das
 culturas com área_plantada_ha entre 4 e 10 hectares (utilize BETWEEN).


Resposta:

select nome_cultura, area_plantada_ha,
status from culturas where
area_plantada_ha between 4 and 10;


 DISSERTATIVA — Escreva a Query
 Questão 2.4
 Escreva uma consulta que retorne todas as colheitas com qualidade 'Excelente' ou 'Boa',
 ordenadas pela quantidade colhida em ordem decrescente.


Resposta:

select * from colheitas where qualidade in
('Excelente', 'Boa') order by quantidade_kg
desc;


 DISSERTATIVA — Escreva a Query
 Questão 2.5
 Escreva uma consulta que calcule o valor total arrecadado em cada venda
 (quantidade_vendida_kg × preco_por_kg), exibindo o id_venda, o comprador e o valor total
 calculado com o alias valor_total.


Resposta:

select id_venda, comprador,
SUM(quantidade_vendida_kg *
preco_por_kg) as valor_total from vendas;

            Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 7

<!-- page: 8 -->

Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 8

<!-- page: 9 -->

QUESTÃO 3 — ORDER BY, GROUP BY e HAVING (Prática
MySQL)

📋 Enunciado
Execute as consultas abaixo no MySQL e anexe os prints com os resultados.
Esta questão avalia o uso correto de ORDER BY, GROUP BY e HAVING para análise dos
dados da Cooperativa AgroVerde.
Não utilize JOIN — trabalhe com as tabelas de forma individual.


PRÁTICA — MySQL | ORDER BY
Consulta 3.1
Liste todas as propriedades ordenadas pela área em hectares do maior para o menor.
Exiba nome_propriedade, municipio e area_hectares.


PRÁTICA — MySQL | GROUP BY
Consulta 3.2
Agrupe as culturas pelo campo nome_cultura e conte quantas vezes cada cultura aparece
na tabela culturas. Exiba nome_cultura e o total com o alias total_plantios.


PRÁTICA — MySQL | GROUP BY + ORDER BY
Consulta 3.3
Agrupe as vendas por comprador e calcule a quantidade total vendida para cada um (SUM
de quantidade_vendida_kg). Exiba comprador e total_kg, ordenado do maior para o menor
total.


PRÁTICA — MySQL | GROUP BY + HAVING
Consulta 3.4
Agrupe as colheitas por qualidade e some a quantidade_kg de cada grupo. Exiba apenas
os grupos cuja soma total seja superior a 5.000 kg. Use o alias total_colhido.


PRÁTICA — MySQL | GROUP BY + HAVING + ORDER BY
Consulta 3.5
Agrupe as vendas por comprador e calcule o valor médio de preco_por_kg (AVG). Exiba
apenas compradores com preço médio superior a R$ 1,50 por kg. Ordene pelos maior
preço médio. Use alias preco_medio.


🖨️ Orientação de Entrega
Após executar todas as consultas, annexe os prints mostrando o comando SQL e o resultado
obtido.
Cada consulta deve ter seu próprio print identificado pelo número da questão.


          Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 9

<!-- page: 10 -->

 QUESTÃO 4 — ORDER BY, GROUP BY e HAVING (Dissertativa)

  📋 Enunciado
  Para cada consulta abaixo, escreva manualmente a query SQL correta no espaço indicado.
  As consultas devem utilizar obrigatoriamente as cláusulas indicadas em cada item.
  Atenção à ordem das cláusulas: FROM → WHERE → GROUP BY → HAVING → ORDER BY.


 DISSERTATIVA | GROUP BY + HAVING
 Questão 4.1
 Escreva uma query que agrupe as culturas pelo campo status e conte quantas culturas
 existem em cada status. Exiba apenas os grupos que possuam mais de 2 culturas. Utilize o
 alias total e a tabela culturas.


Resposta:

select count(nome_cultura) as total, status
from culturas group by status having total >
2;

Cláusulas obrigatórias: SELECT • FROM • GROUP BY • HAVING


 DISSERTATIVA | GROUP BY + HAVING + ORDER BY
 Questão 4.2
 Escreva uma query que agrupe as propriedades pelo campo tipo_solo e calcule a área total
 (SUM) de cada tipo de solo. Exiba apenas os grupos com área total superior a 50 hectares,
 ordenados da maior área para a menor. Utilize os aliases tipo e area_total.


Resposta:
select tipo_solo as tipo,
sum(area_hectares) as area_total from
propriedades
group by tipo having area_total > 50 order
by area_total desc
Cláusulas obrigatórias: SELECT • FROM • GROUP BY • HAVING • ORDER BY


            Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 10

<!-- page: 11 -->

 DISSERTATIVA | WHERE + GROUP BY + HAVING + ORDER BY
 Questão 4.3
 Escreva uma query que filtre apenas as colheitas com qualidade diferente de 'Regular' (use
 WHERE), agrupe pelo campo qualidade, calcule a quantidade média colhida por grupo
 (AVG) e exiba apenas grupos com média superior a 2.000 kg. Ordene pelo maior valor
 médio. Utilize o alias media_kg.


Resposta:

select qualidade, avg(quantidade_kg) as
media_kg from colheitas
where not qualidade = 'Regular'
group by qualidade having media_kg >
2000 order by media_kg desc;


Cláusulas obrigatórias: SELECT • FROM • WHERE • GROUP BY • HAVING • ORDER BY


            Atividade Avaliativa — Banco de Dados | 2º Semestre — Desenvolvimento de Sistemas | Página 11

<!-- page: 12 -->

Criação do BD


Questão 1

1.1


1.2


1.3


1.4


1.5


Questão 3


3.1


3.2


3.3


3.4


3.5
