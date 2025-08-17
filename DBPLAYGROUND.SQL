DROP FUNCTION IF EXISTS calcular_puntos_partido;

DELIMITER $$

CREATE FUNCTION calcular_puntos_partido (
    elo_ganador FLOAT,
    elo_perdedor FLOAT,
    tipo_especial VARCHAR(10),
    ronda VARCHAR(20)
)
    RETURNS JSON DETERMINISTIC
BEGIN
    DECLARE diferencia FLOAT;
    DECLARE puntos_ganador INT;
    DECLARE puntos_perdedor INT;
    DECLARE es_mayor BOOLEAN;
    DECLARE puntos_bono INT DEFAULT 0;

    -- Bonificación por ronda
    CASE ronda
        WHEN 'Octavos' THEN SET puntos_bono = 2;
        WHEN 'Cuartos' THEN SET puntos_bono = 5;
        WHEN 'Semifinal' THEN SET puntos_bono = 10;
        WHEN 'Final' THEN SET puntos_bono = 15;
        WHEN 'Campeón' THEN SET puntos_bono = 20;
        ELSE SET puntos_bono = 0;
        END CASE;

    -- Casos especiales
    IF tipo_especial IN ('Forfeit', 'Bye') THEN
        RETURN JSON_OBJECT(
                'ganador', CAST(5 + puntos_bono AS CHAR),
                'perdedor', '0',
                'bonificacion', CAST(puntos_bono AS CHAR)
               );
    END IF;

    -- Calcular puntos normales
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
            'ganador', CAST(puntos_ganador + puntos_bono AS CHAR),
            'perdedor', CAST(puntos_perdedor AS CHAR),
            'bonificacion', CAST(puntos_bono AS CHAR)
           );
END$$

DELIMITER ;

SHOW COLUMNS FROM participaciones LIKE 'ronda_alcanzada';

SELECT COUNT(*) FROM participaciones WHERE ronda_alcanzada = 'Campe?n';

UPDATE participaciones
SET ronda_alcanzada = 'Campeón'
WHERE ronda_alcanzada = 'Campe?n';
SELECT DISTINCT ronda_alcanzada FROM participaciones;

UPDATE participaciones
SET ronda_alcanzada = 'Campeón'
WHERE ronda_alcanzada = 'Campe�n';

UPDATE participaciones
SET ronda_alcanzada = 'Final'
WHERE ronda_alcanzada = 'Campe�n';



ALTER TABLE participaciones
    MODIFY ronda_alcanzada ENUM(
        'Grupos',
        '32avos',
        '16avos',
        'Octavos',
        'Cuartos',
        'Semifinal',
        'Final',
        'Campeón'
        )
        CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

UPDATE participaciones SET ronda_alcanzada = 'Campeón' WHERE ronda_alcanzada = 8;
UPDATE participaciones SET ronda_alcanzada = 'Final' WHERE ronda_alcanzada = 8;

ALTER TABLE participaciones
    MODIFY ronda_alcanzada ENUM(
        'Grupos','32avos','16avos','Octavos','Cuartos','Semifinal','Final','Campeón'
        )
        CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;



