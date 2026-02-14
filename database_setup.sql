-- Database Setup for Toko Hasanah (MySQL / MariaDB)
-- Run this script in phpMyAdmin or via MySQL command line

-- 1. Create and Select Database
CREATE DATABASE IF NOT EXISTS db_toko_hasanah;
USE db_toko_hasanah;

-- 2. Table structure for table `products`
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

-- 3. Table structure for table `sessions` (used by express-mysql-session)
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table structure for table `users` (Added based on your screenshot)
-- Using the structure from your error message
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `role` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Insert Default Admin User
-- Password: '021105' (matches your server.js hardcoded password)
INSERT INTO `users` (`username`, `password`, `role`) VALUES
('zidan', '021105', 'admin');
