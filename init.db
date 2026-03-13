-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: database:3306
-- Tiempo de generación: 16-02-2026 a las 04:11:31
-- Versión del servidor: 9.5.0
-- Versión de PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `citas-db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointments`
--

CREATE TABLE `appointments` (
  `id` int NOT NULL,
  `client_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `service_id` int NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `branches`
--

CREATE TABLE `branches` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE `clients` (
  `id` int NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `branch_id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revoked_tokens`
--

CREATE TABLE `revoked_tokens` (
  `id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `revoked_tokens`
--

INSERT INTO `revoked_tokens` (`id`, `token`, `expires_at`, `created_at`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjMjgyZjlhLTZkYTYtNDJjNi1iZmRjLTg2YjY4NjFhOGZlZiIsInRpbWVzdGFtcCI6MTc2OTk5MjY2NDI4NiwiaWF0IjoxNzY5OTkyNjY0LCJleHAiOjE3Njk5OTYyNjR9.f5ee7JJe-_zFaCRMoDH-IlyHPjXIwopIX8k5CnlOVqY', '2026-02-01 19:37:44', '2026-02-02 00:39:37'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjMjgyZjlhLTZkYTYtNDJjNi1iZmRjLTg2YjY4NjFhOGZlZiIsInRpbWVzdGFtcCI6MTc3MDYwMjMxNDA3MSwiaWF0IjoxNzcwNjAyMzE0LCJleHAiOjE3NzA2MDU5MTR9.2nq1M0ukSaUV-ENUtqvPaakHVQ7DMkePoaAR5x_qMJs', '2026-02-08 20:58:34', '2026-02-09 01:59:21'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjMjgyZjlhLTZkYTYtNDJjNi1iZmRjLTg2YjY4NjFhOGZlZiIsInRpbWVzdGFtcCI6MTc3MDYwMjc5MTI4MywiaWF0IjoxNzcwNjAyNzkxLCJleHAiOjE3NzA2MDYzOTF9.QFWyfkewYcromValx2_-KjtWVAYeq_Ba3hpvzykPi80', '2026-02-08 21:06:31', '2026-02-09 02:06:39'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxZWMxMDk1LTA1ZTUtNGRiNy05ODgwLWIxZGNkNjNjNGRiYiIsInRpbWVzdGFtcCI6MTc3MDYwMzUyNjkyNSwiaWF0IjoxNzcwNjAzNTI2LCJleHAiOjE3NzA2MDcxMjZ9.JTH4IaWsu1wkLJM0d_Kh3pBjsMCUfW-21nltRQRhfBY', '2026-02-08 21:18:46', '2026-02-09 02:18:53'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxZWMxMDk1LTA1ZTUtNGRiNy05ODgwLWIxZGNkNjNjNGRiYiIsInRpbWVzdGFtcCI6MTc3MTIwNDU1OTgwMCwiaWF0IjoxNzcxMjA0NTU5LCJleHAiOjE3NzEyMDgxNTl9.RcbhT21Jw7GB1zbbDDFTeE6e6ex8SOIc46j_MhmWNNc', '2026-02-15 20:15:59', '2026-02-16 01:16:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `duration_minutes` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('owner','admin') DEFAULT 'owner',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `last_login`, `created_at`) VALUES
('c1ec1095-05e5-4db7-9880-b1dcd63c4dbb', 'Arturo Castañeda', 'arturocs160@gmail.com', '+522383894385', '$2b$10$AblGz/gViMv6COUT9oBMzOPbjcQaOLc00Q1eN44cuz5simOceUH6W', 'owner', NULL, '2026-02-09 02:18:29'),
('d9f93032-7c55-4b49-aa52-666eea0a33f0', 'Pruebas Pruebas', 'pruebas@gmail.com', '+522383894385', '$2b$10$Ms83Ku9MgLIPn1UsTZX73OxbtZz2/0MiXfKQkM84qhPEt5YJVrQIS', 'owner', NULL, '2026-02-16 01:12:59'),
('e130e9e9-d7da-403a-9060-b93d52295200', 'Arturo Prueba', 'arturo@gmail.com', '+5223894385', '$2b$10$i92Wswh/yBw0uNMI2znz.OFemZYjvXGe9ynhtKSXDaUZVqjw2LA..', 'owner', NULL, '2026-02-16 00:10:04');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indices de la tabla `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indices de la tabla `revoked_tokens`
--
ALTER TABLE `revoked_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `revoked_tokens`
--
ALTER TABLE `revoked_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `appointments_ibfk_4` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Filtros para la tabla `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
