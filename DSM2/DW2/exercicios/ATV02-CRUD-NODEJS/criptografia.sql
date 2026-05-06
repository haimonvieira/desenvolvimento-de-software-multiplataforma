-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: criptografia
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `algoritmos`
--

DROP TABLE IF EXISTS `algoritmos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algoritmos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `tamanho_chave` varchar(255) NOT NULL,
  `ano_criacao` int(11) NOT NULL,
  `nivel_seguranca` varchar(255) NOT NULL,
  `criador_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `criador_id` (`criador_id`),
  CONSTRAINT `algoritmos_ibfk_1` FOREIGN KEY (`criador_id`) REFERENCES `criadores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `algoritmos`
--

LOCK TABLES `algoritmos` WRITE;
/*!40000 ALTER TABLE `algoritmos` DISABLE KEYS */;
INSERT INTO `algoritmos` VALUES (1,'Argon2id','Hash de senha (derivação de chave)','Configurável (ex: 32 bytes)',2015,'Impenetrável',1,'2026-05-05 00:00:00','2026-05-05 15:54:21'),(2,'AES','Criptografia simétrica','128, 192 ou 256 bits',2001,'Altamente secreto',2,'2026-05-05 00:00:00','2026-05-05 00:00:00'),(3,'RSA','Criptografia assimétrica','2048, 3072 ou 4096 bits',1977,'Padrão',3,'2026-05-05 00:00:00','2026-05-05 00:00:00'),(4,'SHA-256','Função hash','256 bits (fixo)',2001,'Impenetrável',4,'2026-05-05 00:00:00','2026-05-05 00:00:00'),(5,'bcrypt','Hash de senha (derivação de chave)','~184 bits (hash de 60 caracteres)',1999,'Seguro (mas superado por Argon2id)',5,'2026-05-05 00:00:00','2026-05-05 00:00:00');
/*!40000 ALTER TABLE `algoritmos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `criadores`
--

DROP TABLE IF EXISTS `criadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `criadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criadores`
--

LOCK TABLES `criadores` WRITE;
/*!40000 ALTER TABLE `criadores` DISABLE KEYS */;
INSERT INTO `criadores` VALUES (1,'Alex Biryukov','2026-05-05 00:00:00','2026-05-05 00:00:00'),(2,'Joan Daemen','2026-05-05 00:00:00','2026-05-05 00:00:00'),(3,'Ronald Rivest','2026-05-05 00:00:00','2026-05-05 00:00:00'),(4,'NSA','2026-05-05 00:00:00','2026-05-05 00:00:00'),(5,'Niels Provos','2026-05-05 00:00:00','2026-05-05 00:00:00');
/*!40000 ALTER TABLE `criadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfis`
--

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codinome` varchar(255) NOT NULL,
  `no_conectado` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis`
--

LOCK TABLES `perfis` WRITE;
/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
INSERT INTO `perfis` VALUES (1,'haimonvieira','haimonvieira@gmail.com','2026-05-04 00:00:00','2026-05-06 09:05:14');
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-06  9:45:21
