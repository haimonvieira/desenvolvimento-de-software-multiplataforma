create database escola;
use escola;

create table cursos
(
id int auto_increment primary key,
nome varchar(100),
duracao int, -- duração do curso em meses
turno varchar(10) -- Manhã, Tarde ou Noite
);

create table alunos
(
id int auto_increment primary key,
nome varchar(100),
email varchar(150),
cidade varchar(80),
curso_id int,
ativo boolean default true,
foreign key (curso_id) references cursos(id)
);

-- Inserir Coluna faltante na tabela alunos
alter table alunos add column idade int;

#Inserção de um registro por vez
insert into cursos (nome,duracao,turno) values
("Desenvolvimento de Sistemas", 36, "Manhã");

insert into cursos (nome,duracao,turno) values
("Administração", 24, "Noite");

#Insercao de varios registros de uma unica vez na tabela
Insert into cursos (nome,duracao,turno) values
("Enfermagem", 36, "Tarde"),
("Contabilidade", 24, "Manhã"),
("Informática", 18, "Noite");

insert into alunos (nome,email,idade,cidade,curso_id,ativo) values
("Ana Silva", "ana@email.com",20,"São Paulo",1,True),
("Bruno Souza", "bruno@email.com",22,"Campinas",1,True),
("Carla Pereira", "carla@email.com",19,"São Paulo",2,True),
("Diego Martins", "diego@email.com",25,"Santos",3,False),
("Elena Costa", "elena@email.com",21,"Campinas",1,True),
("Felipe Ramos", "felipe@email.com",18,"São Paulo",4,True),
("Gabi Alves", "gabi@email.com",23,"Sorocaba",2,False),
("Hugo Lima", "hugo@email.com",20,"Campinas",5,True);

# Listagem de Dados Básico

-- Verificar todos os registros da tabela alunos
select * from alunos;

-- Ver apena nome e cidade dos alunos
select nome,cidade from alunos;

-- Listar todos os alunos que são de São Paulo
select nome,cidade from alunos where cidade="São Paulo";

-- Lista nome e email dos alunos que cursam o curso_id 1
select nome,email from alunos where curso_id=1;

-- Listar nome e idade do aluno com idade maior de 20.
select nome, idade from alunos where idade > 20;

-- Lista nome e idade do aluno com idade igual ou menor que 20
select nome, idade from alunos where idade <= 20;

-- Listar nome e idade do aluno que tenha exatamente 20 anos.
select nome, idade from alunos where idade = 20;

-- Listar todos os alunos que não sejam de São Paulo
select * from alunos where cidade != "São Paulo";
select * from alunos where not cidade = "São Paulo";
select * from alunos where cidade <> "São Paulo";

-- Listar todos os alunos de São Paulo e que tenham idade maior que 19
select * from alunos where cidade = "São Paulo" and idade > 19;

-- Listar alunos que sejam de Campinas ou Sorocaba
select * from alunos where cidade = "Campinas" or cidade = "Sorocaba";

-- Listar alunos cujo o nome comece com "a"
select * from alunos where nome like "a%";

-- Listar alunos cujo o nome termine com "A"
select * from alunos where nome like "%A";

-- Listar alunos cujo o nome tenha a letra A em qualquer parte
select * from alunos where nome like "%a%";

-- Listar aluno cujo o nome tenha a letra G na terceira posição
select * from alunos where nome like "__g%";

-- Listar aluno cujo o nome tenha a letra M na penultima posição 
select * from alunos where nome like "%m_";

-- Listar somente os alunos que sejam de São Paulo, Campinas e Santos
select * from alunos where cidade in ("São Paulo","Campinas","Santos");

-- Listar somente os alunos que cursam os cursos 1,2,3
select * from alunos where curso_id in (1,2,3);

-- Listar alunos que tenham idade entre 19 e 22
select * from alunos where idade between 19 and 22;

-- Listar alunos que não possuam E-mail cadastrado
select * from alunos where email is null;
select * from alunos where email = null;

-- Listar apenas alunos que possuam email;
select * from alunos where email is not null;

-- Listar apenas os alunos ativos
select * from alunos where ativo = true;
select * from alunos where ativo is True;

-- Listar apenas os alunos desativados
select * from alunos where ativo = false;
select * from alunos where ativo is false;