CREATE DATABASE AgroVerde;

USE AgroVerde;

CREATE TABLE propriedades
(
    id_propriedade   INT AUTO_INCREMENT PRIMARY KEY,
    nome_propriedade VARCHAR(100),
    municipio        VARCHAR(100),
    area_hectares    FLOAT,
    tipo_solo        VARCHAR(50)
);

INSERT INTO propriedades(nome_propriedade, municipio, area_hectares, tipo_solo)
VALUES ("Sítio Boa Esperança", "Registro", 12.5, "Argiloso"),
       ("Fazenda Santa Maria", "Cajati", 45, "Arenoso"),
       ("Chácara Verde", "Pariquera-Açu ", 8, "Humoso"),
       ("Sítio Sol Nascente", "Eldorado ", 20, "Argiloso"),
       ("Rancho Bela Vista", "Juquiá ", 35.5, "Arenoso"),
       ("Sítio das Palmeiras", "Registro ", 15, "Humoso"),
       ("Fazenda Boa Colheita ", "Cajati ", 60, "Argiloso"),
       ("Chácara Primavera ", "Pariquera-Açu ", 9.5, "Arenoso");

CREATE TABLE produtores
(
    id_produtor    INT AUTO_INCREMENT PRIMARY KEY,
    nome_produtor  VARCHAR(100),
    telefone       VARCHAR(100),
    id_propriedade INT,
    ativo          BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_propriedade) REFERENCES propriedades (id_propriedade)
);

INSERT INTO produtores(nome_produtor, telefone, id_propriedade, ativo)
VALUES ("João da Silva", "(13) 99812-3456", 1, true),
       ("Maria Oliveira", "(13) 98723-4567 ", 2, true),
       ("Carlos Souza", "(13) 99634-5678", 3, false),
       ("Ana Pereira", "(13) 97545-6789", 4, true),
       ("Pedro Almeida", "(13) 96456-7890", 5, true),
       ("Lucia Fernandes", "(13) 99367-8901", 6, false),
       ("Roberto Costa", "(13) 98278-9012", 7, true),
       ("Fernanda Santos", "(13) 97189-0123", 8, true);

CREATE TABLE culturas
(
    id_cultura       INT AUTO_INCREMENT PRIMARY KEY,
    nome_cultura     VARCHAR(100),
    id_propriedade   INT,
    area_plantada_ha INT,
    data_plantio     DATE,
    status           VARCHAR(100),
    FOREIGN KEY (id_propriedade) REFERENCES propriedades (id_propriedade)
);

INSERT INTO culturas (nome_cultura, id_propriedade, area_plantada_ha, data_plantio, status)
VALUES ("Banana", 1, 5, "2024-03-01", "Produzindo"),
       ("Mandioca", 2, 10, "2024-01-15", "Colhida"),
       ("Tomate", 3, 2, "2024-05-10", "Produzindo"),
       ("Milho", 4, 8, "2024-02-20", "Produzindo"),
       ("Batata-doce", 5, 6, "2024-04-05", "Colhida"),
       ("Banana", 6, 4, "2024-03-18", "Produzindo"),
       ("Soja", 7, 30, "2024-01-10", "Produzindo"),
       ("Tomate", 8, 3, "2024-06-01", "Aguardando"),
       ("Milho", 1, 4, "2024-02-10", "Colhida"),
       ("Mandioca", 5, 5, "2024-03-25", "Produzindo");

CREATE TABLE colheitas
(
    id_colheita   INT AUTO_INCREMENT PRIMARY KEY,
    id_cultura    INT,
    data_colheita DATE,
    quantidade_kg INT,
    qualidade     VARCHAR(30),
    FOREIGN KEY (id_cultura) REFERENCES culturas (id_cultura)
);

INSERT INTO colheitas (id_cultura, data_colheita, quantidade_kg, qualidade)
VALUES (2, "2024-06-10", 4500, "Boa"),
       (5, "2024-08-20", 2800, "Excelente"),
       (9, "2024-07-15", 3200, "Regular"),
       (1, "2024-09-01", 1800, "Boa"),
       (4, "2024-08-05", 5200, "Excelente"),
       (6, "2024-09-10", 1500, "Boa"),
       (7, "2024-09-15", 12000, "Boa"),
       (10, "2024-09-20", 2100, "Regular");

CREATE TABLE vendas
(
    id_venda              INT AUTO_INCREMENT PRIMARY KEY,
    id_colheita           INT,
    data_venda            DATE,
    quantidade_vendida_kg INT,
    preco_por_kg          FLOAT,
    comprador             VARCHAR(100),
    FOREIGN KEY (id_colheita) REFERENCES colheitas (id_colheita)
);

INSERT INTO vendas(id_colheita, data_venda, quantidade_vendida_kg, preco_por_kg, comprador)
VALUES (1, "2024-06-15", 3000, 1.8, "Mercado Central"),
       (2, "2024-08-25", 2000, 2.5, "Feira Municipal"),
       (3, "2024-07-20", 2500, 0.9, "Merenda Escola"),
       (4, "2024-09-05", 1200, 3.5, "Feira Municipal"),
       (5, "2024-08-10", 4000, 1.2, "Mercado Central"),
       (6, "2024-09-12", 1000, 3.8, "Restaurante Verde"),
       (7, "2024-09-18", 8000, 2.1, "Cooperativa Sul"),
       (8, "2024-09-22", 1500, 0.95, "Mercado Central");

-- Questão 1

-- Consulta 1.1: Liste o nome e o município de TODAS as propriedades cadastradas, exibindo também aárea em hectares.
select nome_propriedade, municipio, area_hectares
from propriedades;
-- Consulta 1.2: Exiba todos os produtores que estão ATIVOS (ativo = 'Sim'), mostrando nome do produtor etelefone.
select nome_produtor, telefone
from produtores
where ativo;
-- Consulta 1.3: Liste todas as culturas com status igual a 'Produzindo', exibindo o nome da cultura, a áreaplantada
-- e a data de plantio.
select nome_cultura, area_plantada_ha, data_plantio
from culturas
where status in ('Produzindo');
-- Consulta 1.4: Mostre todas as colheitas cuja quantidade colhida seja superior a 2.500 kg,
-- exibindo oid_colheita, a quantidade e a qualidade.
select id_colheita, quantidade_kg, qualidade
from colheitas
where quantidade_kg > 2500;
-- Consulta 1.5: Exiba todas as vendas realizadas para o comprador 'Mercado Central',
-- mostrando a data davenda, a quantidade vendida e o preço por kg.
select data_venda, quantidade_vendida_kg, preco_por_kg
from vendas
where comprador in ('Mercado Central');


-- Questão 2

-- Consulta 2.1: Escreva uma consulta que retorne somente os nomes das propriedades localizadas nomunicípio de 'Registro'.
select nome_propriedade
from propriedades
where
-- Consulta 2.2: Escreva uma consulta que retorne somente os nomes das propriedades localizadas nomunicípio de 'Registro'.

-- Consulta 2.3: Escreva uma consulta que retorne o nome da cultura,
-- a área plantada e o status dasculturas com área_plantada_ha entre 4 e 10 hectares (utilize BETWEEN).

-- Consulta 2.4: Escreva uma consulta que retorne todas as colheitas com
-- qualidade 'Excelente' ou 'Boa',ordenadas pela quantidade colhida em ordem decrescente.

-- Consulta 2.5: Escreva uma consulta que calcule o valor total arrecadado
-- em cada venda(quantidade_vendida_kg × preco_por_kg), exibindo o id_venda,
-- o comprador e o valor totalcalculado com o alias valor_total.