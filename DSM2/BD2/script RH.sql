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
delimiter $$
create function fn_classificar_funcionario(
	p_salario decimal(10, 2),
    p_anos_empresa int
)
returns varchar(30)
deterministic
begin
	declare v_classe varchar(30);
    case
		when p_anos_empresa >= 5 and p_salario >= 8000 then
			set v_classe = 'Especialista Senior';
		when p_anos_empresa >= 3 and p_salario >= 3000 then
			set v_classe = 'Profissional Pleno';
		when p_anos_empresa >= 1 then 
			set v_classe = 'Profisional Junior';
		else
			set v_classe = 'Trainee';
        end case;
        
        return v_classe;
    
end$$
delimiter ;

# Utilizar a funcao junto com a utilizacao do TIMESTAMPDIFF

select
	concat(nome, ' ', sobrenome) as 'funcionario',
    salario,
    timestampdiff(year, data_admissao, curdate()) as 'tempo de empresa (anos)', 
    fn_classificar_funcionario(salario, timestampdiff(year, data_admissao, curdate())) as 'classificacao'
from funcionarios 
where ativo = 1;

# GERENCIAMENTO DOS FUNCTIONS NO MYSQL
# Listar todas as functions do banco atual
show function status where db='empresa_rh';

# Ver codigo-fonte de uma function
show create function fn_calcular_bonus;

# Remover uma function
drop function if exists fn_nome_formal;

# Exercicio

# Bloco A
/*
	A1.  Escreva uma consulta que exiba o nome completo (nome + sobrenome) com a inicial do nome 
    em maiúsculo e o sobrenome todo em maiúsculo. Ex: Carlos MENDES.
	A2.  Liste o nome do funcionário e o comprimento (LENGTH) do seu e-mail, ordenado do e-mail mais longo para o mais curto.
	A3.  Mostre todos os funcionários admitidos há mais de 5 anos, exibindo nome, 
    data de admissão e o número de anos completos de empresa.
	A4.  Calcule para cada funcionário ativo: salário bruto, desconto INSS de 11% (arredondado) e salário líquido estimado.
	A5.  Use CASE para classificar cada departamento em 'Área de TI', 'Área Administrativa' ou 'Área Comercial' 
    com base no nome_depto.
*/

/*
A1.  Escreva uma consulta que exiba o nome completo (nome + sobrenome) com a inicial do nome 
    em maiúsculo e o sobrenome todo em maiúsculo. Ex: Carlos MENDES.
*/

select 
	concat(
		upper(left(nome, 1)), substring(nome, 2), ' ', upper(sobrenome)) as 'funcionario'
from funcionarios;

/*
	A2.  Liste o nome do funcionário e o comprimento (LENGTH) do seu e-mail, 
    ordenado do e-mail mais longo para o mais curto.
*/
select 
	nome, length(email) as comprimento_email
from funcionarios
order by length(email) desc;

/*
	A3.  Mostre todos os funcionários admitidos há mais de 5 anos, exibindo nome, 
    data de admissão e o número de anos completos de empresa.
*/

select
	nome, 
    date_format(data_admissao, '%d/%m/%Y') as data_admissao, 
    timestampdiff(year, data_admissao, curdate()) as 'anos completos'
from funcionarios
where timestampdiff(year, data_admissao, curdate()) > 5;

/*
	A4.  Calcule para cada funcionário ativo: salário bruto, 
    desconto INSS de 11% (arredondado) e salário líquido estimado.
*/
select 
	nome, 
    round(salario, 2) as salario_bruto, 
    round(salario * 0.11, 2) as 'desconto 11%', 
    round(salario - (salario * 0.11), 2) as salario_liquido
from funcionarios;

/*
	A5.  Use CASE para classificar cada departamento em 'Área de TI', 'Área Administrativa' ou 'Área Comercial' 
    com base no nome_depto.
*/
select
	nome,
	case id_depto
		when 1 then 'Área TI'
        when 2 then 'Área Comerical'
        when 3 then 'Área Admnistrativa'
        when 4 then 'Área Admnistrativa'
        when 5 then 'Área TI'
        else 'Outros'
	end
        as 'Departamento'
from funcionarios;
select id_depto, nome_depto from departamentos;

# Bloco B

/*
B1. Crie a função fn_email_corporativo(nome, sobrenome) que gera um e-mail 
no formato nome.sobrenome@empresa.com.br (tudo minúsculo, sem espaços).
B2. Crie a função fn_salario_liquido(salario) que calcule:
 se salário <= 6.000 desconta8% de INSS; se entre 6.001 e 9.000 desconta 11%; acima de 9.000 desconta 14%. 
 Retorne o valor líquido arredondado em 2 casas.
B3. Crie a função fn_data_br(data DATE) que receba uma data e retorne no formatobrasileiro DD/MM/AAAA.
B4. Crie a função fn_nivel_cargo(salario, anos_empresa) que retorne: 
'Júnior' (< 2anos ou < 6k), 'Pleno' (2–4 anos e 6k–8,9k), 'Sênior' (>= 5 anos e >= 9k) 
ou'Especialista' (>= 5 anos e >= 10k).
B5. Crie a função fn_mascara_cpf(cpf VARCHAR(11)) 
que receba 11 dígitos e retorneno formato XXX.XXX.XXX-XX. Dica: use SUBSTRING e CONCAT.
*/

/*
B1. Crie a função fn_email_corporativo(nome, sobrenome) que gera um e-mail 
no formato nome.sobrenome@empresa.com.br (tudo minúsculo, sem espaços).
*/

delimiter $$
create function fn_email_corporativo(nome varchar (100), sobrenome varchar(100))
returns varchar(100)
deterministic
begin

	return lower(concat(nome, '.', sobrenome, '@empresa.com.br'));

end$$
delimiter ;

select
	fn_email_corporativo(nome, sobrenome) as 'email corporativo'
from funcionarios;

/*
B2. Crie a função fn_salario_liquido(salario) que calcule:
 se salário <= 6.000 desconta 8% de INSS; se entre 6.001 e 9.000 desconta 11%; acima de 9.000 desconta 14%. 
 Retorne o valor líquido arredondado em 2 casas.
*/

delimiter $$
create function fn_salario_liquido(salario decimal(10, 2))
returns decimal(10,2)
deterministic
begin
	declare salario_liquido decimal(10, 2);
    
    if salario <= 6000 then
		set salario_liquido = salario - (salario * 0.08);
	elseif salario >= 6001 and salario <= 9000 then
		set salario_liquido = salario - (salario * 0.11);
	else
		set salario_liquido = salario - (salario * 0.14);
	end if;
	return round(salario_liquido, 2);
end$$
delimiter ;

select 
	nome,
	salario,
	fn_salario_liquido(salario) as 'salario liquido'
from funcionarios;

/*
B3. Crie a função fn_data_br(data DATE) que receba uma data e retorne no formatobrasileiro DD/MM/AAAA.
*/
delimiter $$
create function fn_data_br(data date)
returns varchar(10)
deterministic
begin

	return date_format(data, '%d/%m/%Y');

end$$
delimiter ;

select 
	nome,
    fn_data_br(data_admissao) as data_formatada
from funcionarios;

/*
B4. Crie a função fn_nivel_cargo(salario, anos_empresa) que retorne: 
'Júnior' (< 2anos ou < 6k), 'Pleno' (2–4 anos e 6k–8,9k), 'Sênior' (>= 5 anos e >= 9k) 
ou'Especialista' (>= 5 anos e >= 10k).
*/

delimiter $$ 
create function fn_nivel_cargo(salario decimal(10,2), anos_empresa int)
returns varchar(20)
deterministic
begin
	
    declare cargo varchar(20);
    
	case 
		when salario < 6000 or anos_empresa < 2 then
			set cargo = 'Júnior';
		when (salario >= 6000 and salario <= 8900) or (anos_empresa >= 2 and anos_empresa <= 4) then
			set cargo = 'Pleno';
		when salario >= 9000 or anos_empresa >= 5 then
			set cargo = 'Sênior';
		when salario >= 10000 or anos_empresa >= 5 then
			set cargo = 'Especialista';
		else
			set cargo = 'Sem cargo';
	end case;
    
    return cargo;
        
end$$
delimiter ;

select 
	nome,
	salario,
    timestampdiff(year, data_admissao, curdate()),
	fn_nivel_cargo(salario, timestampdiff(year, data_admissao, curdate()))
from funcionarios;

/*
B5. Crie a função fn_mascara_cpf(cpf VARCHAR(11)) 
que receba 11 dígitos e retorneno formato XXX.XXX.XXX-XX. Dica: use SUBSTRING e CONCAT.
*/

delimiter $$
create function fn_mascara_cpf(cpf varchar(11))
returns varchar(14)
deterministic
begin
	declare cpf_mascarado varchar(14);
    
    set cpf_mascarado = concat(substring(cpf, 1, 3), '.', substring(cpf, 4, 3), '.', substring(cpf, 7, 3), '-',
    substring(cpf, 10, 2));
    
    return cpf_mascarado;
end$$
delimiter ;

select fn_mascara_cpf('12345678909');

# Bloco C
/*
Bloco C — Desafio: Query Completa com Functions
C1. Relatório Completo de Funcionários:
Monte uma única consulta SELECT que utilize pelo menos 5 functions diferentes(nativas ou criadas) e exiba:
• Nome formal (Sobrenome, Nome)
• Cargo em maiúsculas
• Tempo de empresa formatado (X anos e Y meses)
• Salário formatado em Real (R$ X.XXX,XX)
• Classificação (Júnior / Pleno / Sênior)
• Status: 'Colaborador Ativo' ou 'Desligado'
*/

delimiter $$
create function fn_status(ativo boolean)
returns varchar(10)
deterministic
begin

	if ativo = 1 then
		return 'Ativo';
	else
		return 'Desligado';
    end if;
    
end$$
delimiter ;

select
	concat(upper(sobrenome), ', ', nome) as 'funcionario',
    upper(cargo) as 'cargo',
    fn_tempo_empresa(data_admissao) as 'tempo de empresa',
    concat('R$ ', replace(replace(replace(format(salario, 2), ',', '$'), '.', ','), '$', '.')) as 'salario',
    fn_nivel_cargo(salario, timestampdiff(year, data_admissao, curdate())) as 'nivel do cargo',
    fn_status(ativo) as 'status'
from funcionarios;













