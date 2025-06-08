-- phpMyAdmin SQL Dump
-- version 5.2.2deb1+noble1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 06, 2025 at 11:13 PM
-- Server version: 8.0.42-0ubuntu0.24.04.1
-- PHP Version: 8.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Atta`
--

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id` int NOT NULL,
  `nombre` enum('1era','2da','3era','4ta') NOT NULL,
  `elo_inicial` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clubes`
--

CREATE TABLE `clubes` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `historial_categorias`
--

CREATE TABLE `historial_categorias` (
  `id` int NOT NULL,
  `jugador_id` int NOT NULL,
  `categoria_anterior` int DEFAULT NULL,
  `categoria_nueva` int NOT NULL,
  `fecha_cambio` datetime DEFAULT CURRENT_TIMESTAMP,
  `motivo` enum('Ascenso','Descenso','Ajuste','Inicial') NOT NULL,
  `torneo_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jugadores`
--

CREATE TABLE `jugadores` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `elo` float DEFAULT NULL,
  `club_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `ultimo_torneo_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `jugadores`
--
DELIMITER $$
CREATE TRIGGER `trigger_elo_inicial` BEFORE INSERT ON `jugadores` FOR EACH ROW BEGIN
                    IF NEW.elo IS NULL THEN
                        SET NEW.elo = (SELECT elo_inicial FROM categorias WHERE id = NEW.categoria_id);
                    END IF;
                END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `participaciones`
--

CREATE TABLE `participaciones` (
  `id` int NOT NULL,
  `jugador_id` int NOT NULL,
  `torneo_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `elo_antes` float NOT NULL,
  `elo_despues` float NOT NULL,
  `bonificacion` int DEFAULT '0',
  `ronda_alcanzada` enum('Grupos','32avos','16avos','Octavos','Cuartos','Semifinal','Final','Campeón') DEFAULT NULL,
  `posicion` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partidos`
--

CREATE TABLE `partidos` (
  `id` int NOT NULL,
  `jugador1_id` int NOT NULL,
  `jugador2_id` int DEFAULT NULL,
  `ganador_id` int NOT NULL,
  `torneo_id` int NOT NULL,
  `ronda` enum('Grupos','32avos','16avos','Octavos','Cuartos','Semifinal','Final','Campeón') DEFAULT NULL,
  `tipo_especial` enum('Forfeit','Bye') DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Triggers `partidos`
--
DELIMITER $$
CREATE TRIGGER `actualizar_elo_partido` AFTER INSERT ON `partidos` FOR EACH ROW BEGIN
    DECLARE elo_ganador FLOAT;
    DECLARE elo_perdedor FLOAT;
    DECLARE cat_ganador INT;
    DECLARE cat_perdedor INT;
    DECLARE puntos JSON;
    DECLARE puntos_ganador FLOAT;
    DECLARE puntos_perdedor FLOAT;
    DECLARE puntos_bono FLOAT;
    DECLARE id_perdedor INT;

    -- Manejo de ELO nulo para el ganador
    SELECT IFNULL(elo, (SELECT elo_inicial FROM categorias WHERE id = categoria_id)), 
           categoria_id 
    INTO elo_ganador, cat_ganador
    FROM jugadores 
    WHERE id = NEW.ganador_id;

    -- Calcular puntos según el tipo de partido
    SET puntos = calcular_puntos_partido(
        elo_ganador,
        IFNULL((SELECT elo FROM jugadores WHERE id = NEW.jugador2_id), 0),
        NEW.tipo_especial,
        NEW.ronda
    );

    -- Extraer valores numéricos
    SET puntos_ganador = CAST(JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.ganador')) AS FLOAT);
    SET puntos_perdedor = CAST(JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.perdedor')) AS FLOAT);
    SET puntos_bono = CAST(JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.bonificacion')) AS FLOAT);

    -- Actualizar ELO del ganador
    UPDATE jugadores
    SET elo = elo + puntos_ganador
    WHERE id = NEW.ganador_id;

    -- Registrar participación del ganador
    INSERT INTO participaciones (jugador_id, torneo_id, categoria_id, elo_antes, elo_despues, bonificacion, ronda_alcanzada)
    VALUES (
        NEW.ganador_id,
        NEW.torneo_id,
        cat_ganador,
        elo_ganador,
        elo_ganador + puntos_ganador,
        puntos_bono,
        NEW.ronda
    );

    -- Procesar perdedor solo si existe (no es Bye/Forfeit)
    IF NEW.jugador2_id IS NOT NULL AND NEW.tipo_especial IS NULL THEN
        -- Determinar ID del perdedor
        SET id_perdedor = IF(NEW.jugador1_id = NEW.ganador_id, NEW.jugador2_id, NEW.jugador1_id);
        
        -- Manejo de ELO nulo para el perdedor
        SELECT IFNULL(elo, (SELECT elo_inicial FROM categorias WHERE id = categoria_id)), 
               categoria_id 
        INTO elo_perdedor, cat_perdedor
        FROM jugadores 
        WHERE id = id_perdedor;

        -- Actualizar ELO del perdedor
        UPDATE jugadores
        SET elo = elo + puntos_perdedor
        WHERE id = id_perdedor;

        -- Registrar participación del perdedor
        INSERT INTO participaciones (jugador_id, torneo_id, categoria_id, elo_antes, elo_despues)
        VALUES (
            id_perdedor,
            NEW.torneo_id,
            cat_perdedor,
            elo_perdedor,
            elo_perdedor + puntos_perdedor
        );
    END IF;

    -- Actualizar último torneo de ambos jugadores (si existen)
    UPDATE jugadores SET ultimo_torneo_id = NEW.torneo_id WHERE id = NEW.ganador_id;
    IF NEW.jugador2_id IS NOT NULL THEN
        UPDATE jugadores SET ultimo_torneo_id = NEW.torneo_id WHERE id = NEW.jugador2_id;
    END IF;
END
$$
DELIMITER ;



CREATE TABLE `torneos` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `ubicacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `torneo_categorias` (
  `torneo_id` int NOT NULL,
  `categoria_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

ALTER TABLE `clubes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);


ALTER TABLE `historial_categorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugador_id` (`jugador_id`),
  ADD KEY `categoria_anterior` (`categoria_anterior`),
  ADD KEY `categoria_nueva` (`categoria_nueva`),
  ADD KEY `torneo_id` (`torneo_id`);


ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `club_id` (`club_id`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `ultimo_torneo_id` (`ultimo_torneo_id`);


ALTER TABLE `participaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugador_id` (`jugador_id`),
  ADD KEY `torneo_id` (`torneo_id`),
  ADD KEY `categoria_id` (`categoria_id`);


ALTER TABLE `partidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugador1_id` (`jugador1_id`),
  ADD KEY `jugador2_id` (`jugador2_id`),
  ADD KEY `ganador_id` (`ganador_id`),
  ADD KEY `torneo_id` (`torneo_id`);


ALTER TABLE `torneos`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `torneo_categorias`
  ADD PRIMARY KEY (`torneo_id`,`categoria_id`),
  ADD KEY `categoria_id` (`categoria_id`);


ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `categorias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;


ALTER TABLE `clubes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;


ALTER TABLE `historial_categorias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;


ALTER TABLE `jugadores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participaciones`
--
ALTER TABLE `participaciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `partidos`
--
ALTER TABLE `partidos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `torneos`
--
ALTER TABLE `torneos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `historial_categorias`
--
ALTER TABLE `historial_categorias`
  ADD CONSTRAINT `historial_categorias_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_categorias_ibfk_2` FOREIGN KEY (`categoria_anterior`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `historial_categorias_ibfk_3` FOREIGN KEY (`categoria_nueva`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_categorias_ibfk_4` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `jugadores`
--
ALTER TABLE `jugadores`
  ADD CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jugadores_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jugadores_ibfk_3` FOREIGN KEY (`ultimo_torneo_id`) REFERENCES `torneos` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `participaciones`
--
ALTER TABLE `participaciones`
  ADD CONSTRAINT `participaciones_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participaciones_ibfk_2` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participaciones_ibfk_3` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `partidos`
--
ALTER TABLE `partidos`
  ADD CONSTRAINT `partidos_ibfk_1` FOREIGN KEY (`jugador1_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `partidos_ibfk_2` FOREIGN KEY (`jugador2_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `partidos_ibfk_3` FOREIGN KEY (`ganador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `partidos_ibfk_4` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `torneo_categorias`
--
ALTER TABLE `torneo_categorias`
  ADD CONSTRAINT `torneo_categorias_ibfk_1` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `torneo_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;