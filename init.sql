-- --------------------------------------------------------
-- CONFIGURACIÓN INICIAL
-- --------------------------------------------------------
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `citas-db`;
USE `citas-db`;

-- --------------------------------------------------------
-- 1. TABLA: users (Padre de business_info)
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('owner','admin') DEFAULT 'owner',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 2. TABLA: business_info (Vinculada a users)
-- --------------------------------------------------------
CREATE TABLE `business_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` char(36) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `specialty` varchar(150) DEFAULT NULL,
  `description` text,
  `location` text,
  `rating` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 3. TABLA: branches
-- --------------------------------------------------------
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 4. TABLA: services
-- --------------------------------------------------------
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `duration_minutes` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 5. TABLAS DE APOYO
-- --------------------------------------------------------
CREATE TABLE `business_hours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_id` int NOT NULL,
  `day_of_week` int NOT NULL COMMENT '0=Dom, 1=Lun...',
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `disabled_dates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_id` int NOT NULL,
  `closed_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 6. TABLA: employees (MODIFICADA: Agregado email y age)
-- --------------------------------------------------------
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `age` tinyint unsigned DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 7. TABLAS OPERATIVAS
-- --------------------------------------------------------
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `service_id` int NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `booker_name` varchar(150) NOT NULL,
  `booker_email` varchar(100) NOT NULL,
  `booker_phone` varchar(20) NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  KEY `employee_id` (`employee_id`),
  KEY `service_id` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `revoked_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- RESTRICCIONES (Foreign Keys)
-- --------------------------------------------------------
ALTER TABLE `business_info`
  ADD CONSTRAINT `fk_business_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `branches`
  ADD CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `business_info` (`id`) ON DELETE CASCADE;

ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `business_info` (`id`) ON DELETE CASCADE;

ALTER TABLE `business_hours`
  ADD CONSTRAINT `business_hours_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `business_info` (`id`) ON DELETE CASCADE;

ALTER TABLE `disabled_dates`
  ADD CONSTRAINT `disabled_dates_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `business_info` (`id`) ON DELETE CASCADE;

ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `appointments_ibfk_4` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

-- --------------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS
-- --------------------------------------------------------
DELIMITER //

DROP PROCEDURE IF EXISTS `sp_register_owner` //
CREATE PROCEDURE `sp_register_owner`(
    IN p_id CHAR(36),
    IN p_full_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_slug VARCHAR(110);
    DECLARE v_business_id INT;
    SET v_slug = LOWER(REPLACE(p_full_name, ' ', '-'));
    SET v_slug = CONCAT(v_slug, '-', SUBSTRING(p_id, 1, 8));
    START TRANSACTION;
    INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`)
    VALUES (p_id, p_full_name, p_email, p_phone, p_password, 'owner');
    INSERT INTO `business_info` (`owner_id`, `slug`, `name`, `description`)
    VALUES (p_id, v_slug, CONCAT('Negocio de ', p_full_name), 'Bienvenido.');
    SET v_business_id = LAST_INSERT_ID();
    INSERT INTO `branches` (`business_id`, `name`, `address`, `phone`)
    VALUES (v_business_id, 'Sucursal Principal', 'Dirección por definir', p_phone);
    COMMIT;
END //

DROP PROCEDURE IF EXISTS `sp_update_business_info` //
CREATE PROCEDURE `sp_update_business_info`(
    IN p_owner_id CHAR(36),
  IN p_business_id INT,
    IN p_name VARCHAR(150),
    IN p_specialty VARCHAR(150),
    IN p_description TEXT,
    IN p_location TEXT,
    IN p_rating VARCHAR(50),
    IN p_logo_url VARCHAR(255)
)
BEGIN
  IF EXISTS (
    SELECT 1
    FROM `business_info`
    WHERE `id` = p_business_id
      AND `owner_id` = p_owner_id
  ) THEN
        START TRANSACTION;
        UPDATE `business_info`
        SET `name` = COALESCE(p_name, `name`),
            `specialty` = COALESCE(p_specialty, `specialty`),
            `description` = COALESCE(p_description, `description`),
            `location` = COALESCE(p_location, `location`),
            `rating` = COALESCE(p_rating, `rating`),
            `logo_url` = COALESCE(p_logo_url, `logo_url`)
    WHERE `id` = p_business_id
      AND `owner_id` = p_owner_id;
        IF p_location IS NOT NULL THEN
      UPDATE `branches` SET `address` = p_location WHERE `business_id` = p_business_id ORDER BY `id` ASC LIMIT 1;
        END IF;
        COMMIT;
    END IF;
END //

DELIMITER ;

COMMIT;