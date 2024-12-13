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
-- Table structure for table `usersaddress`
--

DROP TABLE IF EXISTS `usersaddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersaddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `addressName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressDetail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zipCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `usersId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `isMain` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usersAddress_usersId_fkey` (`usersId`),
  CONSTRAINT `usersAddress_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersaddress`
--

LOCK TABLES `usersaddress` WRITE;
/*!40000 ALTER TABLE `usersaddress` DISABLE KEYS */;
INSERT INTO `usersaddress` VALUES (2,'Diskotik','Jl. Makmur no.25','Jakarta','Banten','Indonesia','15123',-6.2088,106.8466,'165158e4-2bbd-4221-9822-36e13c010915','2024-12-09 14:48:22.358','2024-12-09 14:48:22.358',NULL,1),(5,'Rumah','Jl. Kebangsaan no.23','Tangerang','Banten','Indonesia','15123',-6.23348808466673,106.6331260189041,'165158e4-2bbd-4221-9822-36e13c010915','2024-12-09 14:48:22.358','2024-12-09 14:48:22.358',NULL,1),(6,'Kantor','Jl. Makmur no.23','Jakarta','Banten','Indonesia','15123',-6.2088,106.8466,'66fb1c7e-a7d0-4ec0-bb59-41e8f96dbebd','2024-12-09 14:48:22.358','2024-12-09 14:48:22.358',NULL,0),(7,'Selingkuhan','Jl. Makmur no.25','Jakarta','Banten','Indonesia','15123',-6.2088,106.8466,'66fb1c7e-a7d0-4ec0-bb59-41e8f96dbebd','2024-12-09 14:48:22.358','2024-12-09 14:48:22.358',NULL,0);
/*!40000 ALTER TABLE `usersaddress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-12 15:07:38
