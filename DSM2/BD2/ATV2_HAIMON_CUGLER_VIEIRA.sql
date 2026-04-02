create database agroverde;
use agroverde;

CREATE TABLE proprietarios
(
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 cpf VARCHAR(14) UNIQUE,
 municipio VARCHAR(80),
 estado VARCHAR(2),
 telefone VARCHAR(20),
 ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE propriedades
(
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 area_hectares DECIMAL(8,2),
 municipio VARCHAR(80),
 proprietario_id INT
);

CREATE TABLE producoes
(
 id INT AUTO_INCREMENT PRIMARY KEY,
 propriedade_id INT,
 cultura VARCHAR(60) NOT NULL,
 safra VARCHAR(10),
 quantidade_kg DECIMAL(10,2),
 vendido BOOLEAN DEFAULT FALSE
);

INSERT INTO proprietarios (nome, cpf, municipio, estado, telefone, ativo) VALUES
 ('Joao Pedro Alves', '111.222.333-44', 'Pato Branco', 'PR', '(46)
99101-2233', TRUE),
 ('Maria das Gracas', '222.333.444-55', 'Francisco Beltrao', 'PR', '(46)
98877-6655', TRUE),
 ('Rui Carlos Neto', '333.444.555-66', 'Chapeco', 'SC', '(49)
99234-5566', TRUE),
 ('Ana Lucia Borges', '444.555.666-77', 'Erechim', 'RS', '(54)
99345-6677', FALSE),
 ('Carlos Matos Jr', '555.666.777-88', 'Cascavel', 'PR', '(45)
99456-7788', TRUE),
 ('Sandra Lima', '666.777.888-99', 'Concordia', 'SC', '(49)
98765-4321', TRUE),
 ('Paulo Henrique Dias', '777.888.999-00', 'Passo Fundo', 'RS', '(54)
99678-9900', TRUE),
 ('Fatima Souza', '888.999.000-11', 'Toledo', 'PR', '(45)
99789-0011', FALSE);

INSERT INTO propriedades (nome, area_hectares, municipio, proprietario_id) VALUES
 ('Sitio Boa Esperanca', 48.50, 'Pato Branco', 1),
 ('Fazenda Agua Limpa', 120.00, 'Francisco Beltrao', 2),
 ('Chacara Serra Verde', 22.75, 'Chapeco', 3),
 ('Propriedade Cerro Azul', 85.30, 'Erechim', 4),
 ('Sitio Primavera', 35.00, 'Cascavel', 5),
 ('Granja Irmao Sol', 60.80, 'Concordia', 6),
 ('Fazenda Recanto', 200.00, 'Passo Fundo', 7),
 ('Chacara dos Pinheiros', 18.40, 'Toledo', 8),
 ('Sitio Bela Vista', 42.00, 'Pato Branco', 1),
 ('Propriedade Sul Verde', 95.60, 'Cascavel', 5);
 
 INSERT INTO producoes (propriedade_id, cultura, safra, quantidade_kg, vendido)
VALUES
 (1, 'Soja', '2023/2024', 72000.00, TRUE),
 (1, 'Milho', '2023/2024', 45000.00, TRUE),
 (2, 'Soja', '2023/2024', 180000.00, TRUE),
 (2, 'Trigo', '2023/2024', 96000.00, FALSE),
 (3, 'Feijao', '2023/2024', 12000.00, TRUE),
 (3, 'Milho', '2022/2023', 18000.00, TRUE),
 (4, 'Soja', '2022/2023', 112000.00, TRUE),
 (5, 'Mandioca', '2023/2024', 9500.00, FALSE),
 (6, 'Soja', '2023/2024', 85000.00, TRUE),
 (7, 'Soja', '2023/2024', 310000.00, TRUE),
 (7, 'Milho', '2023/2024', 215000.00, FALSE),
 (8, 'Hortalicas', '2023/2024', 3200.00, TRUE),
 (9, 'Feijao', '2023/2024', 8800.00, FALSE),
 (10, 'Milho', '2023/2024', 68000.00, TRUE),
 (10, 'Trigo', '2022/2023', 52000.00, TRUE);
 
 -- Parte 3
 /* 
 A1 Exiba todos os registros da tabela proprietarios.
A2 Exiba apenas o nome e o municipio de todos os
proprietarios.
A3 Liste todos os proprietarios do estado do Parana (PR).
A4 Exiba os proprietarios que estao ativos na cooperativa.
A5 Liste os proprietarios que NAO estao ativos.
A6 Exiba todos os registros da tabela producoes.
A7 Liste as producoes que JA foram vendidas.
A8 Liste as producoes que ainda NAO foram vendidas.
*/

-- Exiba todos os registros da tabela de proprietarios
select * from proprietarios;

-- Exiba apenas o nome e o municipio de todos os proprietarios
select nome, municipio from proprietarios;

-- Liste todos os proprietarios do Parana (PR)
select * from proprietarios where estado = 'PR';

-- Exiba os proprietarios que estao ativos na cooperativa
select * from proprietarios where ativo;

-- Liste os proprietarios que nao estao ativos
select * from proprietarios where not ativo;

-- Exiba todos os registros da tabela producoes
select * from producoes;

-- Liste as producoes que JA foram vendidas
select * from producoes where vendido;

-- Liste as producoes que ainda NAO foram vendidas
select * from producoes where not vendido;

/*
B1 Exiba propriedades com area maior que 50 hectares.
B2 Liste propriedades com area igual ou menor que 40
hectares.
B3 Mostre producoes com quantidade acima de 100000 kg.
B4 Exiba propriedades cujo municipio NAO e Pato Branco.
B5 Liste propriedades com area entre 30 e 100 hectares.
B6 Exiba producoes de quantidade entre 10000 e 80000 kg.
*/

--  Exiba propriedades com area maior que 50 hectares.
select * from propriedades where area_hectares > 50;

-- Liste propriedades com area igual ou menor que 40 hectares.
select * from propriedades where area_hectares <= 40;

-- Mostre producoes com quantidade acima de 100000 kg.
select * from producoes where quantidade_kg > 100000;

-- Exiba propriedades cujo municipio NAO e Pato Branco.
select * from propriedades where not municipio = 'Pato Branco';

-- Liste propriedades com area entre 30 e 100 hectares.
select * from propriedades where area_hectares between 30 and 100;

-- Exiba producoes de quantidade entre 10000 e 80000 kg.
select * from producoes where quantidade_kg between 10000 and 80000;

-- Grupo C - Filtros Combinados (AND, OR, IN)
/*
C1 Liste proprietarios do PR que estao ativos.
C2 Exiba proprietarios de SC ou RS.
C3 Liste producoes de Soja ou Milho.
C4 Exiba propriedades dos proprietarios 1, 2 ou 5.
C5 Liste producoes vendidas da safra 2023/2024.
C6 Exiba producoes nao vendidas com mais de 50000 kg.
*/

-- Liste proprietarios do PR que estao ativos.
select * from proprietarios where estado = 'PR' and ativo;

-- Exiba proprietarios de SC ou RS.
select * from proprietarios where estado in('SC', 'RS');

-- Liste producoes de Soja ou Milho.
select * from producoes where cultura in('Soja', 'Milho');

-- Exiba propriedades dos proprietarios 1, 2 ou 5.
select * from propriedades where proprietario_id in (1, 2, 5);

-- Liste producoes vendidas da safra 2023/2024.
select * from producoes where vendido and safra = '2023/2024';

-- Exiba producoes nao vendidas com mais de 50000 kg.
select * from producoes where not vendido and quantidade_kg > 50000;



-- Grupo D - Busca por Padrao (LIKE) e Nulos (IS NULL)
/*
D1 Liste proprietarios cujo nome comece com a letra 'J'.
D2 Exiba propriedades cujo nome contenha a palavra 'Sitio'.
D3 Liste proprietarios cujo nome termine com 'a'.
D4 Exiba producoes cuja cultura contenha 'oja'.
D5 Liste proprietarios sem telefone cadastrado.
D6 Exiba proprietarios com telefone cadastrado.
*/


-- Liste proprietarios cujo nome comece com a letra 'J'.
select * from proprietarios where nome like 'J%';

-- Exiba propriedades cujo nome contenha a palavra 'Sitio'.
select * from propriedades where nome like '%Sitio%';

-- Liste proprietarios cujo nome termine com 'a'.
select * from proprietarios where nome like '%a';

-- Exiba producoes cuja cultura contenha 'oja'.
select * from producoes where cultura like '%oja%';

-- Liste proprietarios sem telefone cadastrado.
select * from proprietarios where telefone is null;

-- Exiba proprietarios com telefone cadastrado.
select * from proprietarios where telefone is not null;












