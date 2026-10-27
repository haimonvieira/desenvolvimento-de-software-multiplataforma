---
disciplina: DSM2/BD2
titulo: AULA06   LISTA DE EXERCÍCIOS   FUNCTIONS
fonte: DSM2/BD2/AULA06 - LISTA DE EXERCÍCIOS - FUNCTIONS.docx
tipo: docx
paginas: 0
extraido_em: 2026-10-24
---

| LISTA DE EXERCÍCIOS |

| 📋  InstruçõesUse o banco empresa_rh criado no início deste material.Para os exercícios de criação de função, lembre-se de usar DELIMITER $$ e DROP FUNCTION IF EXISTS antes de recriar.Teste cada função com um SELECT após a criação. |

Bloco A — Funções Nativas (Aquecimento)

A1.  Escreva uma consulta que exiba o nome completo (nome + sobrenome) com a inicial do nome em maiúsculo e o sobrenome todo em maiúsculo. Ex: Carlos MENDES.

A2.  Liste o nome do funcionário e o comprimento (LENGTH) do seu e-mail, ordenado do e-mail mais longo para o mais curto.

A3.  Mostre todos os funcionários admitidos há mais de 5 anos, exibindo nome, data de admissão e o número de anos completos de empresa.

A4.  Calcule para cada funcionário ativo: salário bruto, desconto INSS de 11% (arredondado) e salário líquido estimado.

A5.  Use CASE para classificar cada departamento em 'Área de TI', 'Área Administrativa' ou 'Área Comercial' com base no nome_depto.

Bloco B — Criação de Functions

B1.  Crie a função fn_email_corporativo(nome, sobrenome) que gera um e-mail no formato nome.sobrenome@empresa.com.br (tudo minúsculo, sem espaços).

B2.  Crie a função fn_salario_liquido(salario) que calcule: se salário <= 6.000 desconta 8% de INSS; se entre 6.001 e 9.000 desconta 11%; acima de 9.000 desconta 14%. Retorne o valor líquido arredondado em 2 casas.

B3.  Crie a função fn_data_br(data DATE) que receba uma data e retorne no formato brasileiro DD/MM/AAAA.

B4.  Crie a função fn_nivel_cargo(salario, anos_empresa) que retorne: 'Júnior' (< 2 anos ou < 6k), 'Pleno' (2–4 anos e 6k–8,9k), 'Sênior' (>= 5 anos e >= 9k) ou 'Especialista' (>= 5 anos e >= 10k).

B5.  Crie a função fn_mascara_cpf(cpf VARCHAR(11)) que receba 11 dígitos e retorne no formato XXX.XXX.XXX-XX. Dica: use SUBSTRING e CONCAT.

Bloco C — Desafio: Query Completa com Functions

C1. Relatório Completo de Funcionários:

Monte uma única consulta SELECT que utilize pelo menos 5 functions diferentes (nativas ou criadas) e exiba:

Nome formal (Sobrenome, Nome)

Cargo em maiúsculas

Tempo de empresa formatado (X anos e Y meses)

Salário formatado em Real (R$ X.XXX,XX)

Classificação (Júnior / Pleno / Sênior)

Status: 'Colaborador Ativo' ou 'Desligado'
