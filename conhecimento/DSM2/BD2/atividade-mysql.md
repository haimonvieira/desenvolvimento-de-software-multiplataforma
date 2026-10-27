---
disciplina: DSM2/BD2
titulo: atividade mysql
fonte: DSM2/BD2/atividade_mysql.pdf
tipo: pdf
paginas: 4
extraido_em: 2026-10-24
---

<!-- page: 1 -->

                           ATIVIDADE PRÁTICA — MYSQL WORKBENCH

                       Functions e Consultas SQL
                              Banco de Dados │ FastRibeira Logística
                Disciplina: Banco de Dados │ Técnico em Informática │ Valor: 10,0 pontos


🏢🏢 1. Contexto — FastRibeira Logística

A FastRibeira Logística é uma empresa de transporte e distribuição de mercadorias localizada na
região do Vale do Ribeira (SP). Com o crescimento das operações, a empresa migrou seus
controles para um sistema informatizado, cujo banco de dados você irá consultar e manipular
nesta atividade.
O banco de dados é composto pelas seguintes tabelas:
   Tabela                                          Descrição

   cliente    Armazena os dados dos clientes que solicitam transportes (nome, CPF/CNPJ,
              telefone, e-mail, cidade).

  veiculo     Cadastro dos veículos da frota (placa, modelo, ano, capacidade em kg).

 motorista    Dados dos motoristas vinculados a um veículo (nome, CNH, telefone, id_veiculo).

   pedido     Registros dos pedidos de transporte: data, descrição da carga, peso, valor do
              frete, cliente e motorista responsável.

  entrega     Controle de entrega de cada pedido: status (Pendente / Em Transporte /
              Entregue), endereço de destino e data de entrega.


  Antes de iniciar os exercícios:
  Execute o arquivo fastribeira_banco.sql no MySQL Workbench. Ele criará o banco de dados,
  as tabelas e inserirá todos os registros necessários para a atividade.


⚙ 2. Parte 1 — Criação de Functions


  Instruções desta parte:
  Crie cada function no MySQL Workbench utilizando o comando CREATE FUNCTION.
  Lembre-se de definir o DELIMITER antes de cada function e de usar a sintaxe correta do
  MySQL. Após criar cada function, execute a consulta de teste indicada para validar o
  resultado.


1. fn_status_entrega(p_id_pedido INT)
[FUNCTION]

<!-- page: 2 -->

Crie uma function que receba o id de um pedido e retorne o status atual da entrega
correspondente (ex.: 'Pendente', 'Em Transporte' ou 'Entregue').
      • Tipo de retorno: VARCHAR(20)
      • Se o pedido não tiver entrega cadastrada, retorne 'Sem registro'.
Consulta de teste:
  SELECT fn_status_entrega(4) AS status_pedido;


2. fn_total_pedidos_cliente(p_id_cliente INT)
[FUNCTION]
Crie uma function que receba o id de um cliente e retorne a quantidade total de
pedidos realizados por esse cliente.
      • Tipo de retorno: INT
Consulta de teste:
  SELECT fn_total_pedidos_cliente(1) AS total_pedidos;


3. fn_frete_total_motorista(p_id_motorista INT)
[FUNCTION]
Crie uma function que receba o id de um motorista e retorne a soma de todos
os valores de frete dos pedidos atribuídos a ele.
      • Tipo de retorno: DECIMAL(10,2)
      • Se não houver pedidos, retorne 0.00.
Consulta de teste:
  SELECT fn_frete_total_motorista(2) AS total_frete;


4. fn_placa_motorista(p_id_motorista INT)
[FUNCTION]
Crie uma function que receba o id de um motorista e retorne a placa do veículo
vinculado a ele.
      • Tipo de retorno: VARCHAR(10)
Consulta de teste:
  SELECT nome, fn_placa_motorista(id_motorista) AS placa_veiculo
  FROM motorista;


5. fn_categoria_peso(p_peso DECIMAL(8,2))
[FUNCTION]
Crie uma function que receba um valor de peso em kg e retorne uma categoria:
      • Até 500 kg → 'Leve'
      • De 501 a 2000 → 'Média'
      • Acima de 2000 → 'Pesada'
      • Tipo de retorno: VARCHAR(10)
Consulta de teste:
  SELECT id_pedido, peso_kg, fn_categoria_peso(peso_kg) AS categoria
  FROM pedido
  ORDER BY peso_kg;

<!-- page: 3 -->

🔍🔍 3. Parte 2 — Consultas SQL


  Instruções desta parte:
  Escreva os comandos SELECT solicitados abaixo. Algumas consultas pedem o uso das
  functions criadas na Parte 1. Atenção ao uso de JOIN, WHERE, ORDER BY e GROUP BY
  conforme necessário.


6. Todos os clientes cadastrados
[CONSULTA BÁSICA]
Liste o id_cliente, nome e cidade de todos os clientes,
ordenados pelo nome em ordem alfabética.

7. Pedidos com dados do cliente e do motorista
[CONSULTA COM JOIN]
Exiba o id_pedido, a data do pedido, o nome do cliente, o nome do motorista
e o valor do frete. Ordene pelo id_pedido de forma crescente.

8. Entregas com status 'Pendente'
[CONSULTA COM FILTRO]
Liste o id_entrega, o endereço de destino e o id_pedido de todas as
entregas cujo status seja 'Pendente'.

9. Status de entrega usando a function (Questão 1)
[CONSULTA + FUNCTION]
Usando a function fn_status_entrega, liste o id_pedido, o nome do cliente
e o status da entrega para todos os pedidos cadastrados.
Ordene pelo id_pedido.

10. Motoristas e placa do veículo usando a function (Questão 4)
[CONSULTA + FUNCTION]
Usando a function fn_placa_motorista, exiba o nome do motorista,
o número da CNH e a placa do veículo de cada motorista.

11. Total de pedidos por motorista
[CONSULTA COM GROUP BY]
Liste o nome de cada motorista e a quantidade de pedidos que ele atendeu.
Exiba apenas motoristas que tenham ao menos 1 pedido.
Ordene do maior para o menor número de pedidos.

12. Categorias de peso usando a function (Questão 5)
[CONSULTA + FUNCTION]
Usando a function fn_categoria_peso, liste o id_pedido, a descrição da carga,
o peso_kg e a categoria de peso de todos os pedidos.
Ordene pela categoria e depois pelo peso.

13. Pedidos do cliente 'Carlos Eduardo Matos'
[CONSULTA + FUNCTION]
Exiba todos os pedidos do cliente chamado 'Carlos Eduardo Matos'.

<!-- page: 4 -->

Mostre: id_pedido, data_pedido, descricao_carga, valor_frete e o status da
entrega (usando a function fn_status_entrega).

14. Total de frete por motorista usando a function (Questão 3)
[CONSULTA + FUNCTION]
Usando a function fn_frete_total_motorista, exiba o nome de cada
motorista e o total de frete acumulado por ele.
Ordene do maior para o menor total.

15. Veículos e capacidade de carga
[CONSULTA BÁSICA]
Liste todos os veículos com placa, modelo, ano e capacidade_kg.
Ordene pela capacidade em ordem decrescente.


  Entrega:
  Salve todos os comandos em um único arquivo .sql com seu nome e número de matrícula no
  comentário do cabeçalho. Envie pelo ambiente virtual ou conforme orientação do professor.


           Banco de Dados | Técnico em Informática | FastRibeira Logística — MySQL Workbench
