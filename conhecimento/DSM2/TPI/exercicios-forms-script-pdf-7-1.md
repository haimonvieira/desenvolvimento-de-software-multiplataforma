---
disciplina: DSM2/TPI
titulo: script pdf 7.1
fonte: DSM2/TPI/exercicios/Forms/script pdf 7.1.sql
tipo: sql
paginas: 0
extraido_em: 2026-10-24
---

```sql
create database banco_java;
use banco_java;

create table if not exists pacientes
(
	codigo int,
    nome varchar(100),
    endereco varchar(100),
    complemento varchar(50),
    rg varchar(12),
    cpf varchar(14),
    data_nascimento varchar(10)
);

create table if not exists passagens
(
	codigo int,
    nome varchar(100),
    telefone varchar(100),
    rg varchar(12),
    local varchar(20),
    data varchar(10),
    horario varchar(5),
    numero_poltrona int
);

create table if not exists veiculos
(
	codigo int,
    marca varchar(50),
    placa varchar(7),
    tipo varchar(20),
    modelo varchar(20),
    chassi varchar(17)
);
```
