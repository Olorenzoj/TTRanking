-- Crear tipos ENUM personalizados para PostgreSQL
CREATE TYPE categoria_enum AS ENUM ('1era', '2da', '3era', '4ta');
CREATE TYPE ronda_enum AS ENUM ('Grupos', '32avos', '16avos', 'Octavos', 'Cuartos', 'Semifinal', 'Final', 'Campeón');
CREATE TYPE motivo_enum AS ENUM ('Ascenso', 'Descenso', 'Ajuste', 'Inicial');
CREATE TYPE tipo_especial_enum AS ENUM ('Forfeit', 'Bye');

-- Tabla: categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre categoria_enum NOT NULL,
  elo_inicial REAL NOT NULL
);

-- Tabla: clubes
CREATE TABLE clubes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla: torneos
CREATE TABLE torneos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  ubicacion VARCHAR(100)
);

-- Tabla: torneo_categorias
CREATE TABLE torneo_categorias (
  torneo_id INTEGER NOT NULL REFERENCES torneos(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (torneo_id, categoria_id)
);

-- Tabla: jugadores
CREATE TABLE jugadores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  elo REAL,
  club_id INTEGER NOT NULL REFERENCES clubes(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  ultimo_torneo_id INTEGER REFERENCES torneos(id) ON DELETE SET NULL
);

-- Tabla: historial_categorias
CREATE TABLE historial_categorias (
  id SERIAL PRIMARY KEY,
  jugador_id INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  categoria_anterior INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  categoria_nueva INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  motivo motivo_enum NOT NULL,
  torneo_id INTEGER REFERENCES torneos(id) ON DELETE SET NULL
);

-- Tabla: participaciones
CREATE TABLE participaciones (
  id SERIAL PRIMARY KEY,
  jugador_id INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  torneo_id INTEGER NOT NULL REFERENCES torneos(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  elo_antes REAL NOT NULL,
  elo_despues REAL NOT NULL,
  bonificacion INTEGER DEFAULT 0,
  ronda_alcanzada ronda_enum,
  posicion INTEGER
);

-- Tabla: partidos
CREATE TABLE partidos (
  id SERIAL PRIMARY KEY,
  jugador1_id INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  jugador2_id INTEGER REFERENCES jugadores(id) ON DELETE CASCADE,
  ganador_id INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  torneo_id INTEGER NOT NULL REFERENCES torneos(id) ON DELETE CASCADE,
  ronda ronda_enum,
  tipo_especial tipo_especial_enum,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger: Asignar ELO inicial automático
CREATE OR REPLACE FUNCTION trigger_elo_inicial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.elo IS NULL THEN
    NEW.elo := (SELECT elo_inicial FROM categorias WHERE id = NEW.categoria_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_elo_inicial
BEFORE INSERT ON jugadores
FOR EACH ROW EXECUTE FUNCTION trigger_elo_inicial();

-- Trigger: Actualizar ELO después de partido (simplificado)
CREATE OR REPLACE FUNCTION actualizar_elo_partido()
RETURNS TRIGGER AS $$
DECLARE
  elo_ganador REAL;
  elo_perdedor REAL;
  cat_ganador INTEGER;
  cat_perdedor INTEGER;
  puntos JSON;
  puntos_ganador REAL;
  puntos_perdedor REAL;
  puntos_bono REAL;
  id_perdedor INTEGER;
BEGIN
  -- Manejar ELO nulo para ganador
  SELECT COALESCE(elo, (SELECT elo_inicial FROM categorias c WHERE c.id = j.categoria_id), 
         categoria_id 
  INTO elo_ganador, cat_ganador
  FROM jugadores j
  WHERE id = NEW.ganador_id;

  -- Calcular puntos (función externa hipotética)
  puntos := calcular_puntos_partido(
    elo_ganador,
    COALESCE((SELECT elo FROM jugadores WHERE id = NEW.jugador2_id), 0),
    NEW.tipo_especial,
    NEW.ronda
  );

  -- Extraer valores
  puntos_ganador := (puntos->>'ganador')::REAL;
  puntos_perdedor := (puntos->>'perdedor')::REAL;
  puntos_bono := (puntos->>'bonificacion')::REAL;

  -- Actualizar ganador
  UPDATE jugadores SET elo = elo + puntos_ganador WHERE id = NEW.ganador_id;

  -- Registrar participación ganador
  INSERT INTO participaciones (
    jugador_id, torneo_id, categoria_id, 
    elo_antes, elo_despues, bonificacion, ronda_alcanzada
  ) VALUES (
    NEW.ganador_id, NEW.torneo_id, cat_ganador,
    elo_ganador, elo_ganador + puntos_ganador, 
    puntos_bono, NEW.ronda
  );

  -- Procesar perdedor si existe
  IF NEW.jugador2_id IS NOT NULL AND NEW.tipo_especial IS NULL THEN
    id_perdedor := CASE 
      WHEN NEW.jugador1_id = NEW.ganador_id THEN NEW.jugador2_id
      ELSE NEW.jugador1_id
    END;

    SELECT COALESCE(elo, (SELECT elo_inicial FROM categorias c WHERE c.id = j.categoria_id), 
           categoria_id 
    INTO elo_perdedor, cat_perdedor
    FROM jugadores j
    WHERE id = id_perdedor;

    UPDATE jugadores SET elo = elo + puntos_perdedor WHERE id = id_perdedor;

    INSERT INTO participaciones (
      jugador_id, torneo_id, categoria_id, 
      elo_antes, elo_despues
    ) VALUES (
      id_perdedor, NEW.torneo_id, cat_perdedor,
      elo_perdedor, elo_perdedor + puntos_perdedor
    );
  END IF;

  -- Actualizar último torneo
  UPDATE jugadores SET ultimo_torneo_id = NEW.torneo_id WHERE id = NEW.ganador_id;
  IF NEW.jugador2_id IS NOT NULL THEN
    UPDATE jugadores SET ultimo_torneo_id = NEW.torneo_id WHERE id = NEW.jugador2_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER actualizar_elo_partido
AFTER INSERT ON partidos
FOR EACH ROW EXECUTE FUNCTION actualizar_elo_partido();

-- Tabla: _prisma_migrations (mantenida igual)
CREATE TABLE _prisma_migrations (
  id VARCHAR(36) PRIMARY KEY,
  checksum VARCHAR(64) NOT NULL,
  finished_at TIMESTAMP(3),
  migration_name VARCHAR(255) NOT NULL,
  logs TEXT,
  rolled_back_at TIMESTAMP(3),
  started_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  applied_steps_count INTEGER NOT NULL DEFAULT 0
);