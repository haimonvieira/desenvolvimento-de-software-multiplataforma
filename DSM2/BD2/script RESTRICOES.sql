create database faculdade;
use faculdade;

-- Tarefa 1
create table alunos
(
	id_aluno int primary key not null auto_increment,
    nome varchar(100) not null,
    email varchar(50) not null unique,
    nota_media decimal(10, 2) default 0.0,
    check(nota_media >= 0 and nota_media <= 10),
    ativo boolean default true
);

-- Tarefa 2
create table matriculas
(
	id_matricula int primary key not null auto_increment,
    id_aluno int,
    curso varchar(80) not null,
    data_inicio date default(curdate()),
    foreign key (id_aluno) references alunos(id_aluno) on delete cascade
);


-- 1. Inserindo dados na tabela PAI (alunos)
-- Note que não precisamos informar o 'id_aluno', o banco cria sozinho!
INSERT INTO alunos (nome, email, nota_media, ativo) VALUES
('Ana Silva', 'ana.silva@exemplo.com', 8.50, TRUE),
('Bruno Souza', 'bruno.souza@exemplo.com', 6.75, TRUE),
('Carla Dias', 'carla.dias@exemplo.com', 9.20, TRUE),
('Daniel Rocha', 'daniel.rocha@exemplo.com', 5.00, FALSE); -- Aluno inativo

-- 2. Inserindo dados na tabela FILHA (matriculas)
-- Aqui usamos os IDs que foram gerados automaticamente acima (1, 2, 3...)
INSERT INTO matriculas (id_aluno, curso, data_inicio) VALUES
(1, 'Desenvolvimento de Software', '2023-02-01'),
(1, 'Ciência de Dados', '2023-08-15'), -- Ana faz dois cursos!
(2, 'Desenvolvimento de Software', '2023-02-01'),
(3, 'Segurança da Informação', '2023-03-10'), -- Combina com seu interesse em criptografia!
(4, 'Redes de Computadores', '2022-08-01');

-- 3. Verificando se tudo deu certo (Seleção simples)
SELECT * FROM alunos;
SELECT * FROM matriculas;

select nome, email, nota_media, curso from alunos a, matriculas m where a.id_aluno = m.id_aluno;



