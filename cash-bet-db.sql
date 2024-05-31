-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cash_bet_version_1
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `admin_rights`
--

DROP TABLE IF EXISTS `admin_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_rights` (
  `rights_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `view_dashboard` int NOT NULL DEFAULT '0',
  `view_partners` int NOT NULL DEFAULT '0',
  `add_partner` int NOT NULL DEFAULT '0',
  `add_credit` int NOT NULL DEFAULT '0',
  `block_partner` int NOT NULL DEFAULT '0',
  `delete_partner` int NOT NULL DEFAULT '0',
  `view_users` int NOT NULL DEFAULT '0',
  `add_user` int NOT NULL DEFAULT '0',
  `edit_user` int NOT NULL DEFAULT '0',
  `delete_user` int NOT NULL DEFAULT '0',
  `view_reports` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`rights_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_rights`
--



--
-- Table structure for table `credit`
--

DROP TABLE IF EXISTS `credit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit` (
  `credit_id` int NOT NULL AUTO_INCREMENT,
  `given_by` int NOT NULL,
  `given_to` int NOT NULL,
  `credit_amount` mediumtext NOT NULL,
  `credit_type` enum('minus','plus') DEFAULT NULL,
  `transaction_date` timestamp NOT NULL,
  PRIMARY KEY (`credit_id`),
  KEY `given_by` (`given_by`),
  KEY `given_to` (`given_to`)
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit`
--



--
-- Table structure for table `event_id`
--

DROP TABLE IF EXISTS `event_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_id` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_number` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_number` (`event_number`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_id`
--



--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `game_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `game_number` int NOT NULL,
  `receipt_number` int NOT NULL,
  `league` varchar(50) DEFAULT NULL,
  `bet` varchar(50) NOT NULL,
  `odd` float(10,2) DEFAULT NULL,
  `date_added` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `home` varchar(100) NOT NULL,
  `away` varchar(50) NOT NULL,
  `date_played` timestamp NOT NULL,
  `short_score` varchar(50) DEFAULT NULL,
  `long_score` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--



--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipt` (
  `receipt_id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `cashier_id` int NOT NULL,
  `admin_id` double DEFAULT NULL,
  `receipt_number` int NOT NULL,
  `stake` int NOT NULL,
  `total_odds` float(15,2) DEFAULT NULL,
  `possible_win` int NOT NULL,
  `date_added` timestamp NOT NULL,
  `action_date` timestamp NULL DEFAULT NULL,
  `receipt_status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`receipt_id`),
  KEY `shop_id` (`shop_id`),
  KEY `cashier_id` (`cashier_id`),
  CONSTRAINT `receipt_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`),
  CONSTRAINT `receipt_ibfk_2` FOREIGN KEY (`cashier_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt`
--



--
-- Table structure for table `shop`
--

DROP TABLE IF EXISTS `shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop` (
  `shop_id` int NOT NULL AUTO_INCREMENT,
  `created_by` int DEFAULT NULL,
  `shop_name` varchar(255) NOT NULL,
  `shop_location` varchar(225) NOT NULL,
  `min_stake` int NOT NULL,
  `max_stake` int NOT NULL,
  `max_payout` int NOT NULL,
  `operator` int DEFAULT '0',
  `date_added` timestamp NOT NULL,
  `date_updated` timestamp NULL DEFAULT NULL,
  `manager_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`shop_id`),
  KEY `admin_id` (`created_by`),
  KEY `operator` (`operator`),
  CONSTRAINT `shop_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop`
--



--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `linked_to` int NOT NULL DEFAULT '0',
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `user_telephone` varchar(25) NOT NULL,
  `user_role` varchar(40) NOT NULL,
  `duty_station` varchar(225) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `date_added` timestamp NULL DEFAULT NULL,
  `date_updated` timestamp NULL DEFAULT NULL,
  `login_status` int DEFAULT '0',
  `block_status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_telephone` (`user_telephone`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--



--
-- Table structure for table `user_session`
--

DROP TABLE IF EXISTS `user_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_session` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `session_started` timestamp NULL DEFAULT NULL,
  `session_ended` timestamp NULL DEFAULT NULL,
  `session_status` int DEFAULT '0',
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_session`
--


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-31 12:55:06
