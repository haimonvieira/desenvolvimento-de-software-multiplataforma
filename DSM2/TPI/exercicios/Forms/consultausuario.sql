create database consultausuario;
use consultausuario;

create table if not exists usuarios
(
	nome varchar(50) not null,
    email varchar(50) not null,
    login varchar(20) primary key not null,
    senha varchar(100)
);

select * from usuarios;