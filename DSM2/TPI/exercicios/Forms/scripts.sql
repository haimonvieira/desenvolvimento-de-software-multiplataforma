CREATE TABLE IF NOT EXISTS `consultavenda`.`vendas` (
  `codigo` INT(11) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `nome_produto` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`codigo`));

CREATE TABLE IF NOT EXISTS `consultausuario`.`usuarios` (
  `nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `login` VARCHAR(20) NOT NULL,
  `senha` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`login`));

CREATE TABLE IF NOT EXISTS `consultaempresa`.`empresas` (
  `cnpj` INT(11) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `endereco` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`cnpj`));

CREATE TABLE IF NOT EXISTS `consultaproduto`.`produtos` (
  `codigo` INT(11) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`codigo`));

CREATE TABLE IF NOT EXISTS `consultafilme`.`filmes` (
  `codigo` INT(11) NOT NULL,
  `titulo` VARCHAR(50) NOT NULL,
  `genero` VARCHAR(50) NULL DEFAULT NULL,
  `produtora` VARCHAR(20) NULL DEFAULT NULL,
  `data_compra` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`codigo`));

CREATE TABLE IF NOT EXISTS `consultaprefeitura`.`prefeituras` (
  `codigo` INT(11) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `cidade` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`codigo`));