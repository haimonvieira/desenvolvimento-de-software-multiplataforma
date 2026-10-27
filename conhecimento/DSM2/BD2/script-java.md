---
disciplina: DSM2/BD2
titulo: script JAVA
fonte: DSM2/BD2/script JAVA.sql
tipo: sql
paginas: 0
extraido_em: 2026-10-24
---

```sql
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

select * from clientes;
```
