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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0846326d-6cf9-4ee1-9976-37da2750f492','d29a90589f73be681157ddfe2abac0fd6ad46690470a69c1da5b1cebb5ce80f8','2024-12-09 03:37:48.934','20241207052237_update5',NULL,NULL,'2024-12-09 03:35:47.372',1),('3b5a52b6-28dd-40a9-b0c7-676cc41ed88a','8b5ab4b10c3477a0c0ef6a7d479ed7008cded28201324955465a962d2e0e9a07','2024-12-09 03:32:48.860','20241205051515_update2',NULL,NULL,'2024-12-09 03:31:46.126',1),('8e3c5dc3-cc26-4d58-b3f8-4d8c2f4b5a10','08ac902c0545fa7da976dc81f5815e46d9dbf1d3b17bfa69ce242b176054c61e','2024-12-09 03:34:30.295','20241205073023_update3',NULL,NULL,'2024-12-09 03:32:49.202',1),('cbde9b62-ebb9-4ee4-a04b-651dd357d8ef','dc836834330746def9614a6f6c4a04d593be02608d2a763e23ebc9746d8632b9','2024-12-09 03:31:45.854','20241203065016_db_laundry',NULL,NULL,'2024-12-09 03:25:02.987',1),('e1d4db6e-0c46-4c06-b239-2beab6fbbff8','df902ff2dab3515188f29cdd574397c71da15b8dcff81d57d1314fd5f4a18c24','2024-12-09 03:35:09.984','20241206075238_update3',NULL,NULL,'2024-12-09 03:34:31.565',1),('fdc7e5a0-5736-4d46-ab84-ae5e97a78410','71c092d7ac60002249af19fbc77ac6884ea5af57e83097b3a5189db7c1058bb0','2024-12-09 03:35:46.373','20241206113015_update4',NULL,NULL,'2024-12-09 03:35:10.753',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
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
