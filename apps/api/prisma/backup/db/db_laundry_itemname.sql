-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: db_laundry
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `itemname`
--

DROP TABLE IF EXISTS `itemname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemname` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemname`
--

LOCK TABLES `itemname` WRITE;
/*!40000 ALTER TABLE `itemname` DISABLE KEYS */;
INSERT INTO `itemname` VALUES (1,'Kaos','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(2,'Kemaja','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(3,'Celana Panjang','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(4,'Celana Pendek','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(5,'Jeans','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(6,'Handuk','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(7,'Sprei & Bed Cover','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(8,'Boneka','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(9,'Celana Dalam','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(10,'Bra','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(11,'Kaos Kaki','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(12,'Jaket','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(13,'Boneka','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(14,'Jas','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(15,'Gorden','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(16,'Karpet','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(17,'Guling','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(18,'Bantal','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(19,'Selimut','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(20,'Cadar','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL),(21,'Tas','2024-12-09 03:49:13.152','2024-12-09 03:49:13.152',NULL);
/*!40000 ALTER TABLE `itemname` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-12 15:07:39
