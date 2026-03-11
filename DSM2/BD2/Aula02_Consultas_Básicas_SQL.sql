-- Criar o banco de dados 
CREATE DATABASE escola; 
-- Selecionar o banco para uso 
USE escola;

-- Tabela de cursos 
CREATE TABLE cursos 
(
id INT AUTO_INCREMENT PRIMARY KEY,  
nome       VARCHAR(100) NOT NULL,     
duracao    INT,        -- duração em meses     
turno      VARCHAR(10)   -- Manhã, Tarde ou Noite
 );  
 
 -- Tabela de alunos 
 CREATE TABLE alunos 
 (     
 id         INT AUTO_INCREMENT PRIMARY KEY,     
 nome       VARCHAR(100) NOT NULL,     
 email      VARCHAR(150),     
 idade      INT,     
 cidade     VARCHAR(80),     
 curso_id   INT,     
 ativo      BOOLEAN DEFAULT TRUE 
 );
 
 -- Inserir um curso 
 INSERT INTO cursos (nome, duracao, turno) VALUES 
 ('Desenvolvimento de Sistemas', 36, 'Manhã');   
 INSERT INTO cursos (nome, duracao, turno) VALUES 
 ('Administração', 24, 'Noite');
 
 -- Inserir vários cursos de uma vez
 INSERT INTO cursos (nome, duracao, turno) VALUES     
 ('Enfermagem',    36, 'Tarde'),     
 ('Contabilidade', 24, 'Manhã'),     
 ('Informática',   18, 'Noite');  
 
 -- Inserir alunos 
 INSERT INTO alunos (nome, email, idade, cidade, curso_id, ativo) VALUES     
 ('Ana Silva',     'ana@email.com',    20, 'São Paulo',   1, TRUE),     
 ('Bruno Souza',   'bruno@email.com',  22, 'Campinas',    1, TRUE),     
 ('Carla Pereira', 'carla@email.com',  19, 'São Paulo',   2, TRUE),     
 ('Diego Martins', 'diego@email.com',  25, 'Santos',      3, FALSE),     
 ('Elena Costa',   'elena@email.com',  21, 'Campinas',    1, TRUE),     
 ('Felipe Ramos',  'felipe@email.com', 18, 'São Paulo',   4, TRUE),     
 ('Gabi Alves',    'gabi@email.com',   23, 'Sorocaba',    2, FALSE),     
 ('Hugo Lima',     'hugo@email.com',   20, 'Campinas',    5, TRUE);
 
 
 -- Ver todos os alunos 
 SELECT * FROM alunos;  
 
 -- Ver apenas nome e cidade 
 SELECT nome, cidade FROM alunos;
 
 -- Alunos de São Paulo 
 SELECT * FROM alunos WHERE cidade = 'São Paulo';  
 -- Alunos do curso_id 1 (Desenvolvimento de Sistemas) 
 SELECT nome, email FROM alunos WHERE curso_id = 1;
 
 -- Alunos com idade maior que 20 
 SELECT nome, idade FROM alunos WHERE idade > 20;  
 
 -- Alunos com 20 anos ou menos 
 SELECT nome, idade FROM alunos WHERE idade <= 20;  
 
 -- Alunos com exatamente 22 anos 
 SELECT * FROM alunos WHERE idade = 22;
 
 -- Alunos que NÃO são de São Paulo 
 SELECT nome, cidade FROM alunos WHERE cidade != 'São Paulo';  
 
 -- Equivalente usando <> 
 SELECT nome, cidade FROM alunos WHERE cidade <> 'São Paulo';
 
 -- Alunos de São Paulo E maiores de 19 anos 
 SELECT nome, cidade, idade FROM alunos WHERE cidade = 'São Paulo' AND idade > 19;  
 
 -- Alunos de Campinas OU Sorocaba 
 SELECT nome, cidade FROM alunos WHERE cidade = 'Campinas' OR cidade = 'Sorocaba';
 
 -- Alunos cujo nome começa com 'A' 
 SELECT * FROM alunos WHERE nome LIKE 'A%';  
 
 -- Alunos cujo nome termina com 'a' 
 SELECT * FROM alunos WHERE nome LIKE '%a';  
 
 -- Alunos cujo email contém 'email.com' 
 SELECT nome, email FROM alunos WHERE email LIKE '%email.com';
 
 -- Alunos de São Paulo, Campinas ou Santos 
 SELECT nome, cidade FROM alunos WHERE cidade IN ('São Paulo', 'Campinas', 'Santos');  
 
 -- Alunos dos cursos 1, 2 ou 3 
 SELECT nome, curso_id FROM alunos WHERE curso_id IN (1, 2, 3);
 
 -- Alunos com idade entre 19 e 22 anos 
 SELECT nome, idade FROM alunos WHERE idade BETWEEN 19 AND 22;
 
 -- Alunos sem e-mail cadastrado 
 SELECT nome FROM alunos WHERE email IS NULL;  
 
 -- Alunos com e-mail cadastrado 
 SELECT nome, email FROM alunos WHERE email IS NOT NULL;
 
 -- Alunos ativos 
 SELECT nome FROM alunos WHERE ativo = TRUE;  
 
 -- Alunos inativos 
 SELECT nome FROM alunos WHERE ativo = FALSE;