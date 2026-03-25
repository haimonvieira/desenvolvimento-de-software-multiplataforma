create database banco_java;
use banco_java;

create table clientes
(
	id int primary key auto_increment,
    codigo int,
    nome varchar(100),
    telefone varchar(20),
    email varchar(150)
);