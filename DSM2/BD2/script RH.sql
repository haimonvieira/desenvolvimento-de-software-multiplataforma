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

# Exemplo pratico com função data e hora

#Exemplo 1 - Tempo de empresa, ano de entrada e data formatada:
select
	concat(nome,' ', sobrenome)                   as 'funcionario',
	date_format(data_admissao, '%d/%m/%Y')         as 'admitido em',
    year(data_admissao)                            as 'ano de entrada',
    timestampdiff(year, data_admissao, curdate())  as 'anos de empresa',
    timestampdiff(month, data_admissao, curdate()) as 'meses de empresa',
    datediff(curdate(), data_admissao)             as 'dias de empresa'
from funcionarios
where ativo = 1
order by data_admissao;

# Exemplo 2 - Funcionarios que completarao aniversario de empresa este mes:
select
	concat(nome, ' ', sobrenome) as 'funcionario',
    date_format(data_admissao, '%d/%m/%Y') as 'data admissao',
    timestampdiff(year, data_admissao, curdate()) + 1 as 'proximo aniversario em anos'
from funcionarios
where month(data_admissao) = month(curdate()) and ativo = 1;

# Exemplo 3 - Listar funcionarios e suas datas proximo aumento (a cada 2 anos):
select
	nome,
    data_admissao,
    date_add(data_admissao,
		interval(floor(timestampdiff(year, data_admissao, curdate()) / 2) + 1) * 2 year) as 'proximo aumento'
from funcionarios
where ativo = 1;

# Criando uma function de data

delimiter $$
create function fn_tempo_empresa(p_admissao date)
returns varchar(60)
deterministic
begin
	declare v_anos int;
    declare v_meses int;
    set v_anos = timestampdiff(year, p_admissao, curdate());
    set v_meses = timestampdiff(month, p_admissao, curdate()) mod 12;
    
    return concat(v_anos, ' ano(s) e ', v_meses, ' mês(es)');

end$$
delimiter ;

# Usando a funcao
select
	concat(nome, ' ', sobrenome) as 'funcionario',
    fn_tempo_empresa(data_admissao) as 'tempo de empresa'
from funcionarios
where ativo = 1
order by data_admissao;


# Funcoes condificonais (IF e Case)
# Funcao IF
# Sintaxe IF(condicao, valor_se_verdadeiro, valor_se_falso)
select
	nome,
    salario,
    if(ativo = 1, 'ativo', 'inativo') as 'status',
    if(salario >= 8000, 'senior', 'pleno') as 'nivel'
from funcionarios;

# IFNULL: substitui NULL por um valor padrao
select
	nome,
    ifnull(cargo, 'sem cargo') as 'cargo'
from funcionarios;

# COALESCE: retorna o primeiro valor nao-nulo da lista
select
	nome,
	coalesce(cargo, email, 'sem informacao') as referencia
from funcionarios;

# NULLIF: retorna null se os dois valores forem iguais
select
	nome,
    nullif(ativo, 0) as 'ativo ou nulo'
from funcionarios;

/*
Case - Multiplas condicoes
O CASE funciona como um IF/ELSE dentro do SQL.
*/
select
	nome,
    case id_depto
		when 1 then 'Tecnologia'
        when 2 then 'Comercial'
        when 3 then 'RH'
        when 4 then 'Financeiro'
        else 'Outro'
    end 
    as 'Departamento'
from funcionarios;
	

# Forma 2: CASE com expressoes (mais poderosa)
select
	concat(nome, ' ', sobrenome) as 'funcionario',
    salario,
	case
		when salario < 6000                then 'Faixa A - até 6K'
        when salario between 6000 and 8999 then 'Faixa B - 6K a 9K'
        when salario >= 9000               then 'Faixa C - acima de 9K'
	end
    as 'Faixa salarial'
from funcionarios
order by salario;

# Criando uma function condicional completa





