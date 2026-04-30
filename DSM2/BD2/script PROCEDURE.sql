create database sysbook;
use sysbook;

create table autores
(
autorId int auto_increment primary key,
nome varchar(255) not null,
pais varchar(50)
);

create table livros
(
livroId int auto_increment primary key,
titulo varchar(255) not null,
autorId int,
preco decimal (10,2) not null,
estoque int default 0,
constraint fk_autorId_livros foreign key(autorId) references autores(autorid)
);

create table vendas
(
vendaId int auto_increment primary key,
livroId int,
dataVenda date,
quantidade int not null,
valorTotal decimal(10,2),
constraint fk_livroId_vendas foreign key(livroId) references livros(livroId)
);

insert into autores(nome, pais) values
('Machado de Assis', 'Brasil'),
('Clarice Linspecitor', 'Brasil'),
('Jorge Amado', 'Brasil');

insert into livros (titulo, autorId, preco, estoque) values
('Dom Casmurro', 1, 34.90, 12),
('A hora da Estrela', 2, 29.90, 7),
('Capitães da Areia', 3, 39.90, 9);

insert into vendas (livroId, datavenda, quantidade, valorTotal) values
(1, '2024-09-01', 3, 104.70),
(2, '2024-09-02', 2, 59.80),
(3, '2024-09-02', 1, 39.90);

#criar função para calcular total de vendas
delimiter $$
create function totalVendas() returns decimal(10,2)
deterministic
begin
	declare total decimal(10,2);
    select sum(valorTotal) into total from vendas;
    return ifnull(total,0);
end $$
delimiter ;

#Executar função totalVendas()
select totalVendas() as totalVendas;

#Criar a função para calcular o valor total de um produto vendido
delimiter $$
create function valorTotalProduto(id int, quantidade int) returns decimal(10,2)
deterministic
begin
	 declare valorTotal decimal(10,2);
     declare precoUnitario decimal(10,2);

		-- Buscar o preço do livro na tabela
        select preco into precoUnitario from livros where livroId = id limit 1;
        if precoUnitario is null then
			return 0;
		end if;
        
        -- Calcular o valor total do livro 
        set valorTotal = precoUnitario * quantidade;
        return valorTotal;
end $$
delimiter ;

select * from livros;
select valorTotalProduto(1, 5);

# Criar procedure para registrar venda efetuada
delimiter $$
create procedure registrarVenda(in id int, in quantidade int)
begin
	declare valorTotal decimal(10,2);
    set valorTotal = valorTotalProduto(id, quantidade);
    insert into vendas(livroId, dataVenda, quantidade, valorTotal) values
    (id, curdate(), quantidade, valorTotal);
end $$
delimiter ;

select * from vendas;

call registrarVenda(2, 8);

# Criar função calcular estoque para baixar estoque de livro ao vender
delimiter $$
create function calcularEstoque(id int) returns int
deterministic
begin
	declare estoqueAtual int;
    declare qtdVenda int;
    declare vendasTotal int;
    declare estoqueAtualizado int;
    
    select estoque into estoqueAtual from livros where livroId = id;
    select sum(quantidade) into qtdVenda from vendas where livroId = id;
    set estoqueAtualizado = estoqueAtual - qtdVenda;
    
    return estoqueAtualizado;
end $$
delimiter ;

select calcularEstoque(2);

delimiter $$
create function valorVenda(id int, qtd int) returns decimal(10,2)
deterministic
begin
	declare vUnit decimal(10,2);
    declare vVenda decimal(10,2);
    -- Buscar valor unitario do livro
    select preco into vUnit from livros where livroId = id;
    
    -- Calcular valor total do livro vendido
    set vVenda = valorTotalProduto(id, qtd);
    -- Retorna o valor total do livro vendido
    return vVenda;
end $$
delimiter ;

#BaixarEstoque
delimiter $$
create function baixarEstoque(id int, qtd int) returns int
deterministic
begin
	declare estoqueAtual int;
    declare estoqueAtualizado int;
    
    -- buscar estoque atual
    select estoque into estoqueAtual from livros where livroId = id;
    
    -- calcular estoque atualizado
    set estoqueAtualizado = estoqueAtual - qtd;
    
    -- Retornar o valor atualizado do estoque
    return estoqueAtualizado;
end $$
delimiter ;
