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
-- Table structure for table `worker`
--

DROP TABLE IF EXISTS `worker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worker` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workerRole` enum('SUPER_ADMIN','OUTLET_ADMIN','WASHING_WORKER','IRONING_WORKER','PACKING_WORKER','DRIVER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `profilePicture` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `identityNumber` text COLLATE utf8mb4_unicode_ci,
  `motorcycleType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plateNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changePasswordToken` text COLLATE utf8mb4_unicode_ci,
  `storeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `worker_email_key` (`email`),
  KEY `worker_storeId_fkey` (`storeId`),
  CONSTRAINT `worker_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker`
--

LOCK TABLES `worker` WRITE;
/*!40000 ALTER TABLE `worker` DISABLE KEYS */;
INSERT INTO `worker` VALUES ('16d1b992-522d-4694-b71c-2770cf5131a4','driver2@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','DRIVER','Ahmad','Subroto','081234567894','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567894','Ninja 4 tak','B 666 DEV',NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('1f523639-4b84-48b7-9657-80ffd4ac0cb7','ironingworker5@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','IRONING_WORKER','Fira','Widyaningrum','081545678902','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','5014567892',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('23778a27-807d-4d17-9418-0b60298177e9','ironingworker2@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','IRONING_WORKER','Sari','Andini','081245678902','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','2014567892',NULL,NULL,NULL,'2','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('49961f25-16ef-4bda-9b52-fe693ab6c84f','outletadmin3@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','OUTLET_ADMIN','Dewi','Lestari','081345678900','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','3014567890',NULL,NULL,NULL,'3','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('4ba42a96-858f-4e0c-85aa-9cb3d6af9c00','outletadmin@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','OUTLET_ADMIN','Budi','Santoso','081234567890','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567890',NULL,NULL,NULL,'1','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('4e0a3017-6f80-489d-b20c-e6397139dc62','outletadmin5@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','OUTLET_ADMIN','Mira','Kartika','081545678900','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','5014567890',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('514cb1c5-ea3c-4db2-b6e7-7c4f2032a6bc','driver4@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','DRIVER','Agus','Putra','081445678904','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','4014567894','Mio M3','B 6789 GHI',NULL,'4','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('53c1a6ab-01f0-4d88-9c19-0ead8c031d11','driver@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','DRIVER','Ahmad','Subroto','081234567894','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567894','Ninja 4 tak','B 666 DEV',NULL,'1','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('57efa7c0-f5ef-457d-a531-772a187dcdd8','outletadmin4@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','OUTLET_ADMIN','Rani','Haryanto','081445678900','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','4014567890',NULL,NULL,NULL,'4','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('62dcddb2-17fc-4379-9833-782f6a40dcdd','driver3@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','DRIVER','Rizky','Aditya','081345678904','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','3014567894','Beat Street','B 5678 DEF',NULL,'3','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('6a4a5620-6d68-4d60-9655-9072fcb0c7a5','outletadmin2@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','OUTLET_ADMIN','Budi','Santoso','081234567890','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567890',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('7566fb34-5541-45ae-b358-69efd9f1672d','washingworker2@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','WASHING_WORKER','Siti','Aminah','081234567891','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567891',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('767977c3-933d-4f22-8ddf-8d218875d2bc','ironingworker4@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','IRONING_WORKER','Nia','Anggraini','081445678902','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','4014567892',NULL,NULL,NULL,'4','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('7d8de8e5-62e6-4f57-9394-e56620e6842e','packingworker3@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','PACKING_WORKER','Anton','Rahman','081345678903','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','3014567893',NULL,NULL,NULL,'3','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('8ea5c13e-edc1-4e3f-bbf6-e73309c88a04','ironingworker@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','IRONING_WORKER','Joko','Pratama','081234567892','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567892',NULL,NULL,NULL,'1','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('91577c3a-e3d4-43f8-a40b-fdaa5ec9a8d9','ironingworker3@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','IRONING_WORKER','Lina','Wulandari','081345678902','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','3014567892',NULL,NULL,NULL,'3','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('927e6f71-553e-4536-88cc-a8248181bdc6','driver5@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','DRIVER','Iqbal','Hakim','081545678904','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','5014567894','NMAX','B 8901 JKL',NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('94b86ad1-d39c-49d0-b97b-44fc3f990e88','washingworker@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','WASHING_WORKER','Siti','Aminah','081234567891','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567891',NULL,NULL,NULL,'1','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('9c80416d-3ee5-4743-b5e6-2debd95b62cc','washingworker3@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','WASHING_WORKER','Eko','Susanto','081345678901','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','3014567891',NULL,NULL,NULL,'3','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('a6e5620a-3be5-417c-ba01-f6782532ce6c','packingworker@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','PACKING_WORKER','Ani','Wijaya','081234567893','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567893',NULL,NULL,NULL,'1','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('b3db5a51-d7a2-4a4d-a604-db0d6879fa8c','packingworker4@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','PACKING_WORKER','Hendra','Gunawan','081445678903','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','4014567893',NULL,NULL,NULL,'4','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('c3a31c30-81b4-4978-b5bf-e9d40bc8813d','ironingworke2@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','IRONING_WORKER','Joko','Pratama','081234567892','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567892',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('d7485b97-9d09-41a0-9561-5d24c32a9468','packingworker5@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','PACKING_WORKER','Bayu','Pangestu','081545678903','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','5014567893',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('e977692c-18db-4285-839a-a30e36b8957f','superadmin@cnc.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','SUPER_ADMIN','Super','Saia','08123123124','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','302138124',NULL,NULL,NULL,'1','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('ec05e445-0529-4780-9387-ce9cf05442e6','washingworker5@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','WASHING_WORKER','Deni','Supriyadi','081545678901','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','5014567891',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('f1705c43-fb70-40ef-9681-ae1d268db22a','washingworker4@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','WASHING_WORKER','Fajar','Santoso','081445678901','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','4014567891',NULL,NULL,NULL,'4','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL),('feff7f19-569b-4469-858e-9760343e7289','packingworker2@example.com','$2b$10$IwZHMAGiwAoNS83fokA.DO74dRsjH5okF/zNm8gLffyajxUqkbPnC','PACKING_WORKER','Ani','Wijaya','081234567893','https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg','1234567893',NULL,NULL,NULL,'5','2024-12-09 03:49:12.349','2024-12-09 03:49:12.349',NULL);
/*!40000 ALTER TABLE `worker` ENABLE KEYS */;
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
