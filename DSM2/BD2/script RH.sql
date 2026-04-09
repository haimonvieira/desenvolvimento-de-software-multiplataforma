/*
O que São Functions no MySQL?
Uma função em MySQL é um bloco de código pré-definido que 
recebe zero ou mais parâmetros, processa uma lógica interna 
e retorna sempre um único valor. Diferente de Stored Procedures, 
as funções podem ser usadas diretamente dentro de consultas SELECT.
*/

create database if not exists empresa_rh;
use empresa_rh;

create table if not exists departamentos 
(
id_depto int auto_increment primary key,
nome_depto varchar(60) not null,
localizacao varchar(60),
orcamento decimal(12,2)
);

create table if not exists funcionarios
(
id_func int auto_increment primary key,
nome varchar(50) not null,
sobrenome varchar(50) not null,
email varchar(50),
cargo varchar(50),
salario decimal(10,2),
id_depto int,
data_admissao date,
ativo tinyint(1) default 1,
foreign key (id_depto) references departamentos (id_depto)
);

#inserir dados
insert into departamentos (nome_depto, localizacao, orcamento) values
("Tecnologia", "São Paulo",580000.00),
("Comercial", "Rio de janeiro", 420000.00),
("RH", "São Paulo", 150000.00),
("Financeiro", "Curitiba", 310000.00),
("Infraestrutura", "São Paulo",270000.00);

insert into funcionarios (nome,sobrenome,email,cargo,salario,id_depto,data_admissao) values
("Carlos", "Mendes", 'carlos.mendes@emp.com', "Dev Backend", 8500.00,1,"2019-03-15"),
("Fernanda", "Lima", 'fernanda.lima@emp.com', "Dev Frontend", 7800.00,1,"2020-07-01"),
("Ricardo", "Alves", 'Ricardo.alves@emp.com', "DBA", 9200.00,1,"2018-11-20"),
("Juliana", "Souza", 'juliana.souza@emp.com', "Vendedora", 5400.00,2,"2021-01-10"),
("Marcos", "Pereira", 'marcos.pereira@emp.com', "Gerente de vendas", 11000.00,2,"2017-06-05"),
("Patrcia", "Costa", 'patricia.costa@emp.com', "Analista RH", 6100.00,3,"2020-09-22"),
("Bruno", "Oliveira", 'bruno.oliveira@emp.com', "Analista Financeiro", 7300.00,4,"2019-04-18"),
("Amanda", "Rocha", 'amanda.rocha@emp.com', "Coordenadora", 8900.00,4,"2016-12-01"),
("Felipe", "Martins", 'felipe.martins@emp.com', "Sysadmin", 8100.00,5,"2018-08-30"),
("Larissa", "Ferreira", 'larissa.ferreira@emp.com', "Dev Backend", 8200.00,1,"2022-02-14");

#Exemplo de função de texto

#Exemplo 1 - Nome completo em maisuculas e email em minusculas
select upper(concat(nome, " ", sobrenome)) as "nome completo", lower(email) as 'email padronizado'
from funcionarios;

#Exemplo 2 - Extrair usuario e dominio do email
select email, left(email, locate('@', email)-1) as 'usuario', substring(email, locate('@', email)+1) as dominio
from funcionarios;

#Exemplo 3 - Mascarar parte do email por privacidade
select nome, 
concat(
	left(email, 3), 
	rpad('*', length(left(email, locate('@', email)-1))-3, '*'),
	substring(email, locate('@', email))
) as 'email mascarado' 
from funcionarios;

#Criando uma function de text
#Vamos criar uma função que retorna nome formatado como 'Sobrenome, Nome':

delimiter $$
create function fn_nome_formal(p_nome varchar(50), p_sobrenome varchar(50))
returns varchar(110)
deterministic
begin
	return concat(upper(p_sobrenome), ', ', p_nome);
end$$
delimiter ;

#Usando a função criada
select fn_nome_formal(nome, sobrenome) as 'nome formal', cargo from funcionarios;

#Exemplos práticos com salários

#Exemplo 1 - Calcular salário com bonus de 15% e INSS de 11%, arredondado:
select
	concat(nome, ' ', sobrenome) as 'funcionario',
    format(salario, 2) as 'salario bruto',
    format(round(salario * 1.15, 2), 2) as 'salario com bonus 15%',
    format(round(salario * 0.11, 2), 2) as 'desconto 11% INSS',
    format(round(salario * 1.15 - salario * 0.11, 2), 2) as 'salario liquido'
from funcionarios where ativo
order by salario desc;

#Exemplo 2 - Classificar salário em faixas usando MOD e divisão:
select
	nome, salario,
    floor(salario / 1000) as 'faixa mil',
    mod(salario, 1000) as 'faixa centena',
    ceil(salario / 1000) * 1000 as 'proximo a milhar'
from funcionarios where ativo
order by salario desc;

#Criando uma function numérica
#calcula o bonus progressivo baseado na faixa salarial:

delimiter $$
create function fn_calcular_bonus(p_salario decimal(10, 2))
returns decimal(10, 2)
deterministic
begin
	declare valor_percentual decimal(5, 2);
    
    if p_salario <= 5000 then
		set valor_percentual = 0.20; # 20% de bonus para salario ate 5000
	elseif p_salario <= 8000 then
		set valor_percentual = 0.15; # 15% de bonus para salario de 5000 ate 8000
	else
		set valor_percentual = 0.10; # 10% de bonus para salario acima de 8000
	end if;
    return round(p_salario * valor_percentual, 2);
end$$
delimiter ;

#Usando a funcao
select 
	concat(nome, ' ', sobrenome) as 'funcionario',
    format(salario, 2) as 'salario',
    format(fn_calcular_bonus(salario), 2) as 'bonus'
from funcionarios where ativo;


