create database livrosEcia;
use livrosecia;

-- Criar tabelas
create table  clientes
(
	id_cliente int auto_increment primary key,
    nome varchar(100) not null,
    rua varchar(100),
    cidade varchar(50),
    cep varchar(10),
    data_nascimento date
);

insert into clientes (nome, rua, cidade, cep, data_nascimento) values
('Haimon', 'Shitiro Maeji', 'Registro', '11900000', '2001-12-11');

-- Seleciona os dados retornando a idade da pessoa
select nome, timestampdiff(year, data_nascimento, curdate()) as idade from clientes limit 1;


create table livros
(
	id_livro int auto_increment primary key,
    titulo varchar(100),
    autor varchar(100),
    preco decimal(10,2),
    categoria varchar(50)
);

create table pedidos
(
	id_pedido int auto_increment primary key,
    data_pedido date,
    valor_total decimal(10,2),
    id_cliente int,
    constraint fk_id_cliente foreign key (id_cliente) references clientes(id_cliente)
);

insert into pedidos (id_cliente, valor_total) values
(1, 20.20);

select * from clientes, pedidos where clientes.id_cliente = pedidos.id_cliente;














