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
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalPrice` int DEFAULT NULL,
  `totalWeight` int DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `deliveryFee` int NOT NULL,
  `paymentProof` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPaid` tinyint(1) NOT NULL,
  `storesId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usersId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderTypeId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `notes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAddressId` int DEFAULT NULL,
  `isSolved` tinyint(1) DEFAULT NULL,
  `isProcessed` tinyint(1) DEFAULT NULL,
  `isDone` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_storesId_fkey` (`storesId`),
  KEY `order_usersId_fkey` (`usersId`),
  KEY `order_orderTypeId_fkey` (`orderTypeId`),
  KEY `order_userAddressId_fkey` (`userAddressId`),
  CONSTRAINT `order_orderTypeId_fkey` FOREIGN KEY (`orderTypeId`) REFERENCES `ordertype` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_storesId_fkey` FOREIGN KEY (`storesId`) REFERENCES `stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_userAddressId_fkey` FOREIGN KEY (`userAddressId`) REFERENCES `usersaddress` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('08988a05-ee45-49bb-b34a-d6321222ca63',NULL,NULL,NULL,8000,NULL,0,'1','165158e4-2bbd-4221-9822-36e13c010915',2,'2024-12-09 03:59:22.438','2024-12-10 06:42:36.098',NULL,NULL,2,1,NULL,NULL),('1e4a2eee-1e10-4dc3-beb6-04c6721500b8',240000,40,NULL,8000,NULL,0,'1','165158e4-2bbd-4221-9822-36e13c010915',2,'2024-12-09 03:59:15.459','2024-12-17 07:13:53.988',NULL,NULL,2,1,0,1),('24baa1cb-cf36-4697-9a77-56c4c612646d',NULL,NULL,NULL,8000,NULL,0,'1','165158e4-2bbd-4221-9822-36e13c010915',1,'2024-12-09 06:27:19.553','2024-12-12 06:45:52.817',NULL,'test',2,0,NULL,NULL),('3de76591-8e10-46c4-87a5-8f7915352b6c',45500,7,NULL,8000,NULL,0,'1','165158e4-2bbd-4221-9822-36e13c010915',1,'2024-12-09 04:04:09.259','2024-12-16 15:45:36.908',NULL,'Item: Kaos, Quantity: 1',5,0,0,NULL),('96371176-3116-4749-bc18-803bda165657',NULL,NULL,NULL,8000,NULL,0,'1','165158e4-2bbd-4221-9822-36e13c010915',1,'2024-12-09 06:15:13.300','2024-12-09 06:15:13.300',NULL,NULL,2,1,NULL,NULL),('b54c75a2-b062-402d-b37f-98dcd19f567b',NULL,NULL,NULL,8000,NULL,0,'1','165158e4-2bbd-4221-9822-36e13c010915',1,'2024-12-09 04:06:49.865','2024-12-09 04:06:49.865',NULL,NULL,2,1,NULL,NULL),('b8de4796-391e-4c4c-958a-8eaf383174ea',NULL,NULL,NULL,8000,NULL,0,'1','66fb1c7e-a7d0-4ec0-bb59-41e8f96dbebd',1,'2024-12-09 04:36:59.396','2024-12-09 04:36:59.396',NULL,NULL,6,1,NULL,NULL),('bc2ca2e8-3778-48e3-94fd-07726ac066d8',65000,10,NULL,8000,NULL,0,'1','66fb1c7e-a7d0-4ec0-bb59-41e8f96dbebd',1,'2024-12-09 04:16:27.357','2024-12-17 07:15:38.374',NULL,NULL,6,1,0,NULL),('c9d4c1e1-e72b-419e-8e1d-88a4ae536690',NULL,NULL,NULL,8000,NULL,0,'1','66fb1c7e-a7d0-4ec0-bb59-41e8f96dbebd',1,'2024-12-09 03:58:10.603','2024-12-10 06:48:47.825',NULL,NULL,7,1,NULL,NULL),('e5242585-ca53-4d10-9949-3ce4cd5b1483',NULL,NULL,NULL,8000,NULL,0,'1','66fb1c7e-a7d0-4ec0-bb59-41e8f96dbebd',1,'2024-12-09 04:36:53.079','2024-12-09 04:36:53.079',NULL,NULL,6,1,NULL,NULL);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-18 22:42:32
