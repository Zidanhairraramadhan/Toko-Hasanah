-- Database Setup for Toko Hasanah (MySQL / MariaDB)
-- Run this script in phpMyAdmin or via MySQL command line

CREATE DATABASE IF NOT EXISTS toko_hasanah;
USE toko_hasanah;

-- Table structure for table `products`
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `discount` int(11) DEFAULT NULL,
  `image` text,
  `rating` float DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `stock` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `sessions` (used by express-mysql-session)
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Insert dummy data if needed
-- INSERT INTO `products` (...) VALUES (...);
