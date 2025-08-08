

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `Atta`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `cambiar_categoria_jugador` (IN `p_jugador_id` INT, IN `p_nueva_categoria_id` INT, IN `p_motivo` VARCHAR(20), IN `p_torneo_id` INT)   BEGIN
    DECLARE vieja_categoria_id INT;
    DECLARE elo_inicial_nuevo FLOAT;
    DECLARE v_elo_actual FLOAT;

    -- Validar motivo
    IF p_motivo NOT IN ('Ascenso', 'Descenso', 'Ajuste') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Motivo inválido. Debe ser Ascenso, Descenso o Ajuste';
END IF;

    -- Verificar que el jugador existe
    IF NOT EXISTS (SELECT 1 FROM jugadores WHERE id = p_jugador_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Jugador no encontrado';
END IF;

    -- Verificar que la nueva categoría existe
    IF NOT EXISTS (SELECT 1 FROM categorias WHERE id = p_nueva_categoria_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Categoría no encontrada';
END IF;

    -- Obtener categoría actual y ELO del jugador
SELECT categoria_id, elo INTO vieja_categoria_id, v_elo_actual
FROM jugadores
WHERE id = p_jugador_id;

-- Obtener ELO inicial de la nueva categoría
SELECT elo_inicial INTO elo_inicial_nuevo
FROM categorias
WHERE id = p_nueva_categoria_id;

-- Actualizar categoría del jugador
UPDATE jugadores
SET
    categoria_id = p_nueva_categoria_id,
    elo = IF(p_motivo = 'Ascenso', elo_inicial_nuevo, v_elo_actual)
WHERE id = p_jugador_id;

-- Registrar en el historial
INSERT INTO historial_categorias (
    jugador_id,
    categoria_anterior,
    categoria_nueva,
    motivo,
    torneo_id
)
VALUES (
           p_jugador_id,
           vieja_categoria_id,
           p_nueva_categoria_id,
           p_motivo,
           p_torneo_id
       );
END$$

--
-- Functions
--
create
definer = root@localhost function calcular_puntos_partido(elo_ganador float, elo_perdedor float,
                                                              tipo_especial varchar(10), ronda varchar(20)) returns json
    deterministic
BEGIN
    DECLARE diferencia FLOAT;
    DECLARE puntos_ganador INT;
    DECLARE puntos_perdedor INT;
    DECLARE es_mayor BOOLEAN;
    DECLARE bono_ganador INT DEFAULT 0;
    DECLARE bono_perdedor INT DEFAULT 0;

    -- Bonificaciones según ronda
    IF LOWER(ronda) = 'campeon' THEN
        SET bono_ganador = 20; -- Campeón
        SET bono_perdedor = 15; -- Finalista
ELSE
        CASE ronda
            WHEN 'Octavos' THEN SET bono_perdedor = 2;
WHEN 'Cuartos' THEN SET bono_perdedor = 5;
WHEN 'Semifinal' THEN SET bono_perdedor = 10;
ELSE SET bono_perdedor = 0;
END CASE;
END IF;

    -- Forfeit o Bye
    IF tipo_especial IN ('Forfeit', 'Bye') THEN
        RETURN JSON_OBJECT(
                'ganador', CAST(5 + bono_ganador AS CHAR),
                'perdedor', CAST(bono_perdedor AS CHAR),
                'bono_ganador', CAST(bono_ganador AS CHAR),
                'bono_perdedor', CAST(bono_perdedor AS CHAR)
               );
END IF;

    -- Cálculo normal
    SET diferencia = ABS(elo_ganador - elo_perdedor);
    SET es_mayor = (elo_ganador >= elo_perdedor);

    IF es_mayor THEN
        IF diferencia <= 50 THEN
            SET puntos_ganador = 8; SET puntos_perdedor = -5;
        ELSEIF diferencia <= 100 THEN
            SET puntos_ganador = 6; SET puntos_perdedor = -4;
        ELSEIF diferencia <= 250 THEN
            SET puntos_ganador = 4; SET puntos_perdedor = -3;
        ELSEIF diferencia <= 500 THEN
            SET puntos_ganador = 3; SET puntos_perdedor = -2;
        ELSEIF diferencia <= 1000 THEN
            SET puntos_ganador = 2; SET puntos_perdedor = -1;
ELSE
            SET puntos_ganador = 0; SET puntos_perdedor = 0;
END IF;
ELSE
        IF diferencia <= 100 THEN
            SET puntos_ganador = 10; SET puntos_perdedor = -10;
        ELSEIF diferencia <= 200 THEN
            SET puntos_ganador = 20; SET puntos_perdedor = -15;
        ELSEIF diferencia <= 350 THEN
            SET puntos_ganador = 30; SET puntos_perdedor = -20;
        ELSEIF diferencia <= 500 THEN
            SET puntos_ganador = 40; SET puntos_perdedor = -25;
        ELSEIF diferencia <= 1000 THEN
            SET puntos_ganador = 50; SET puntos_perdedor = -30;
ELSE
            SET puntos_ganador = 75; SET puntos_perdedor = -50;
END IF;
END IF;

RETURN JSON_OBJECT(
        'ganador', CAST(puntos_ganador AS CHAR),
        'perdedor', CAST(puntos_perdedor AS CHAR),
        'bono_ganador', CAST(bono_ganador AS CHAR),
        'bono_perdedor', CAST(bono_perdedor AS CHAR)
       );
END;
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
                              `id` int NOT NULL,
                              `nombre` enum('1era','2da','3era','4ta') NOT NULL,
                              `elo_inicial` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `elo_inicial`) VALUES
                                                             (1, '1era', 1000),
                                                             (2, '2da', 800),
                                                             (3, '3era', 600),
                                                             (4, '4ta', 400);

-- --------------------------------------------------------

--
-- Table structure for table `clubes`
--

CREATE TABLE `clubes` (
                          `id` int NOT NULL,
                          `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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

    -- CORRECCIÓN CLAVE: Identificar correctamente al perdedor ANTES de calcular puntos
    IF NEW.jugador2_id IS NOT NULL THEN
        SET id_perdedor = IF(NEW.ganador_id = NEW.jugador1_id, NEW.jugador2_id, NEW.jugador1_id);

        -- Obtener ELO del perdedor REAL
        SELECT IFNULL(elo, (SELECT elo_inicial FROM categorias WHERE id = categoria_id))
        INTO elo_perdedor
        FROM jugadores
        WHERE id = id_perdedor;
    ELSE
        SET id_perdedor = NULL;
        SET elo_perdedor = 0;  -- Para casos de Bye/Forfeit
    END IF;

    -- CORRECCIÓN: Usar elo_perdedor REAL en lugar de jugador2_id
    IF elo_ganador IS NOT NULL AND elo_perdedor IS NOT NULL THEN
        SET puntos = calcular_puntos_partido(
                elo_ganador,
                elo_perdedor,
                NEW.tipo_especial,
                NEW.ronda
                     );
    ELSE
        -- Casos como Bye o Forfeit
        SET puntos = calcular_puntos_partido(
                elo_ganador,
                0,
                NEW.tipo_especial,
                NEW.ronda
                     );
    END IF;


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
    IF id_perdedor IS NOT NULL AND NEW.tipo_especial IS NULL THEN
        -- Ya tenemos elo_perdedor de la consulta anterior, obtenemos categoría
        SELECT categoria_id
        INTO cat_perdedor
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

-- --------------------------------------------------------

--
-- Table structure for table `torneos`
--

CREATE TABLE `torneos` (
                           `id` int NOT NULL,
                           `nombre` varchar(100) NOT NULL,
                           `fecha` date NOT NULL,
                           `ubicacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `torneo_categorias`
--

CREATE TABLE `torneo_categorias` (
                                     `torneo_id` int NOT NULL,
                                     `categoria_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Table structure for table `_prisma_migrations`
--

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `clubes`
--
ALTER TABLE `clubes`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `historial_categorias`
--
ALTER TABLE `historial_categorias`
    ADD PRIMARY KEY (`id`),
  ADD KEY `jugador_id` (`jugador_id`),
  ADD KEY `categoria_anterior` (`categoria_anterior`),
  ADD KEY `categoria_nueva` (`categoria_nueva`),
  ADD KEY `torneo_id` (`torneo_id`);

--
-- Indexes for table `jugadores`
--
ALTER TABLE `jugadores`
    ADD PRIMARY KEY (`id`),
  ADD KEY `club_id` (`club_id`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `ultimo_torneo_id` (`ultimo_torneo_id`);

--
-- Indexes for table `participaciones`
--
ALTER TABLE `participaciones`
    ADD PRIMARY KEY (`id`),
  ADD KEY `jugador_id` (`jugador_id`),
  ADD KEY `torneo_id` (`torneo_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indexes for table `partidos`
--
ALTER TABLE `partidos`
    ADD PRIMARY KEY (`id`),
  ADD KEY `jugador1_id` (`jugador1_id`),
  ADD KEY `jugador2_id` (`jugador2_id`),
  ADD KEY `ganador_id` (`ganador_id`),
  ADD KEY `torneo_id` (`torneo_id`);

--
-- Indexes for table `torneos`
--
ALTER TABLE `torneos`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `torneo_categorias`
--
ALTER TABLE `torneo_categorias`
    ADD PRIMARY KEY (`torneo_id`,`categoria_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
    ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `clubes`
--
ALTER TABLE `clubes`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `historial_categorias`
--
ALTER TABLE `historial_categorias`
    MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jugadores`
--
ALTER TABLE `jugadores`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `participaciones`
--
ALTER TABLE `participaciones`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `partidos`
--
ALTER TABLE `partidos`
    MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `torneos`
--
ALTER TABLE `torneos`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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



DELIMITER $$

create
definer = root@`%` procedure procesar_partido(IN p_jugador1_id int, IN p_jugador2_id int, IN p_ganador_id int,
                                                  IN p_torneo_id int, IN p_ronda varchar(20),
                                                  IN p_tipo_especial varchar(10))
BEGIN
    DECLARE partido_id INT;
    DECLARE elo_ganador FLOAT;
    DECLARE elo_perdedor FLOAT;
    DECLARE cat_ganador INT;
    DECLARE cat_perdedor INT;
    DECLARE puntos JSON;
    DECLARE puntos_ganador FLOAT;
    DECLARE puntos_perdedor FLOAT;
    DECLARE bono_ganador FLOAT;
    DECLARE bono_perdedor FLOAT;
    DECLARE id_perdedor INT;
    DECLARE ronda_perdedor VARCHAR(20);


    -- variables para diagnóstico
    DECLARE v_sqlstate CHAR(5);
    DECLARE v_errno INT;
    DECLARE v_text TEXT;

    -- handler que devuelve el error real de MySQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
GET DIAGNOSTICS CONDITION 1
    v_sqlstate = RETURNED_SQLSTATE,
    v_errno    = MYSQL_ERRNO,
    v_text     = MESSAGE_TEXT;

ROLLBACK;

SET @proc_error_msg = CONCAT('MySQL ', v_errno, ' (', v_sqlstate, '): ', v_text);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @proc_error_msg;
END;
START TRANSACTION;

-- Insertar el partido
INSERT INTO partidos (jugador1_id, jugador2_id, ganador_id, torneo_id, ronda, tipo_especial)
VALUES (p_jugador1_id, p_jugador2_id, p_ganador_id, p_torneo_id, p_ronda, p_tipo_especial);

SET partido_id = LAST_INSERT_ID();

    -- Obtener ELO y categoría del ganador
SELECT IFNULL(elo, (SELECT elo_inicial FROM categorias WHERE id = categoria_id)), categoria_id
INTO elo_ganador, cat_ganador
FROM jugadores
WHERE id = p_ganador_id;

-- Identificar y obtener info del perdedor
IF p_jugador2_id IS NOT NULL THEN
        SET id_perdedor = IF(p_ganador_id = p_jugador1_id, p_jugador2_id, p_jugador1_id);

SELECT IFNULL(elo, (SELECT elo_inicial FROM categorias WHERE id = categoria_id))
INTO elo_perdedor
FROM jugadores
WHERE id = id_perdedor;
ELSE
        SET id_perdedor = NULL;
        SET elo_perdedor = 0;
END IF;

    -- Calcular puntos ELO
    SET puntos = calcular_puntos_partido(
            elo_ganador,
            elo_perdedor,
            p_tipo_especial,
            p_ronda
                 );

    SET bono_ganador = CAST(JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.bono_ganador')) AS FLOAT);
    SET bono_perdedor = CAST(JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.bono_perdedor')) AS FLOAT);
    SET puntos_ganador = CAST( JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.ganador')) AS FLOAT) + bono_ganador;
    SET puntos_perdedor = CAST(JSON_UNQUOTE(JSON_EXTRACT(puntos, '$.perdedor')) AS FLOAT) + bono_perdedor;

    -- Actualizar ELO del ganador
UPDATE jugadores
SET elo              = elo + puntos_ganador ,
    ultimo_torneo_id = p_torneo_id
WHERE id = p_ganador_id;

-- Participación del ganador
INSERT INTO participaciones (jugador_id, torneo_id, categoria_id, elo_antes, elo_despues, bonificacion,
                             ronda_alcanzada)
VALUES (p_ganador_id,
        p_torneo_id,
        cat_ganador,
        elo_ganador,
        elo_ganador + puntos_ganador,
        bono_ganador,
        p_ronda);

-- Procesar perdedor
IF id_perdedor IS NOT NULL AND p_tipo_especial IS NULL THEN
SELECT categoria_id INTO cat_perdedor FROM jugadores WHERE id = id_perdedor;

UPDATE jugadores
SET elo              = elo + puntos_perdedor,
    ultimo_torneo_id = p_torneo_id
WHERE id = id_perdedor;

-- Determinar ronda alcanzada por el perdedor

IF LOWER(p_ronda) = 'campeon' THEN
            SET ronda_perdedor = 'Final';
ELSE
            SET ronda_perdedor = p_ronda;
END IF;

INSERT INTO participaciones (jugador_id,
                             torneo_id,
                             categoria_id,
                             elo_antes,
                             elo_despues,
                             bonificacion,
                             ronda_alcanzada)
VALUES (id_perdedor,
        p_torneo_id,
        cat_perdedor,
        elo_perdedor,
        elo_perdedor + puntos_perdedor,
        bono_perdedor,
        ronda_perdedor);

END IF;
COMMIT;
END;
DELIMITER ;
ALTER TABLE partidos
    MODIFY ronda ENUM(
        'grupos',   -- ← Todo en minúsculas
        '32avos',
        '16avos',
        'octavos',   -- Antes 'Octavos'
        'cuartos',   -- Antes 'Cuartos'
        'semifinal',
        'final',
        'campeón'    -- Antes 'Campeón'
        );