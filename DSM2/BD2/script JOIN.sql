create database if not exists joins_demo;
use joins_demo;

# IF NOT EXISTS -> Verifica se o BD não existe e então cria
# caso contrário não irá criar o BD.

create table if not exists departamentos
(
	id int auto_increment primary key,
    nome varchar(80) not null
);

create table if not exists pessoas
(
	id int auto_increment primary key,
    nome varchar(100) not null,
    id_gestor int null,
    depto_id int null,
    constraint fk_pessoas_depto foreign key (depto_id) references departamentos(id),
    constraint fk_pessoas_gestor foreign key (id_gestor) references pessoas(id)
);

create table if not exists tarefas
(
	id int auto_increment primary key,
    descricao varchar(120) not null,
    status enum('Pendente', 'Em Andamento', 'Concluido') not null default 'Pendente',
    pessoa_id int null,
    constraint fk_tarefas_pessoa foreign key(pessoa_id) references pessoas(id)
);

create table if not exists projetos
(
	id int auto_increment primary key,
    nome varchar(120) not null
);

create table if not exists alocacoes
(
	id int auto_increment primary key,
    pessoa_id int not null,
    projeto_id int not null,
    horas_semana tinyint not null,
    constraint fk_aloc_pessoa foreign key(pessoa_id) references pessoas(id),
    constraint fk_aloc_projeto foreign key(projeto_id) references projetos(id)
);


# Departamentos
insert into departamentos(nome) values
('TI'), ('Financeiro'), ('RH');

# Pessoas
insert into pessoas(nome, id_gestor, depto_id) values
('Ana', null, 1), ('Bruno', 1, 1), ('Carla', 1, 1),
('Diego', 2, null), ('Eduardo', null, 3), ('Fernanda', 5, 2);

# Tarefas
insert into tarefas(descricao, status, pessoa_id) values
('Levantar requisitos', 'Concluido', 2), 
('Desenhar protótipo', 'Em Andamento', 3),
('Configurar servidor', 'Pendente', null),
('Reunião com cliente', 'Concluido', 1),
('Aprovar orçamento', 'Pendente', null);

# Projetos
insert into projetos(nome) values
('Projeto Alfa'), ('Projeto Beta'), ('Projeto Gama');


# Alocações
insert into alocacoes(pessoa_id, projeto_id, horas_semana) values
(1, 1, 10), (2, 1, 20), (3, 2, 15);

# INNER JOIN
select p.id, p.nome, t.id as 'tarefa atribuida', t.descricao, t.status from pessoas p
INNER JOIN tarefas t ON p.id = t.pessoa_id 
ORDER BY p.id;

# EQUI JOIN
select p.id, p.nome, t.id as 'tarefa atribuida', t.descricao, t.status from pessoas p
JOIN tarefas t ON p.id = t.pessoa_id
ORDER BY p.id;
-- Caso a tabela 'pessoas' e 'tarefas' utilizem o id para se relacionar, usar 'using(id)'

# LEFT JOIN
select p.id, p.nome, t.id as 'tarefa', t.descricao, t.status from pessoas p
left join tarefas t on p.id = t.pessoa_id
order by p.id, t.id;

#RIGHT JOIN
select p.id, p.nome, t.id as 'tarefa', t.descricao, t.status from pessoas p
right join tarefas t on p.id = t.pessoa_id
order by p.id, t.id;



