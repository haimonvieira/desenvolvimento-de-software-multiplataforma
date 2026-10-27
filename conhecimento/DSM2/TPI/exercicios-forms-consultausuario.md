---
disciplina: DSM2/TPI
titulo: consultausuario
fonte: DSM2/TPI/exercicios/Forms/consultausuario.sql
tipo: sql
paginas: 0
extraido_em: 2026-10-24
---

```sql
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
```
