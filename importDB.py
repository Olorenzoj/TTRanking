import pandas as pd
import mysql.connector
from mysql.connector import Error

# Configuración de la base de datos
config = {
    'user': 'root',
    'password': 'ognaOrFgBnUrIcCklkrHrtadSgkpJyEo',
    'host': 'switchback.proxy.rlwy.net',
    'port': '35971',
    'database': 'railway',
    'raise_on_warnings': True
}

# Función mejorada para calcular el ELO
def calcular_elo(formula):
    if pd.isna(formula) or formula == '':
        return None
    
    # Si ya es un número, retornarlo directamente
    if isinstance(formula, (int, float)):
        return float(formula)
    
    # Si es una cadena que empieza con '=', intentar evaluar
    if isinstance(formula, str) and formula.startswith('='):
        try:
            # Limpiar la expresión
            expr = formula.replace('=', '').replace(' ', '')
            # Manejar múltiples operadores consecutivos
            expr = expr.replace('++', '+').replace('--', '-').replace('+-', '-').replace('-+', '-')
            return eval(expr)
        except:
            return None
    else:
        try:
            # Intentar convertir a número
            return float(formula)
        except:
            return None

# Información de categorías (id y elo_inicial)
categorias_info = {
    'Primera': {'id': 1, 'elo_inicial': 1000},
    'Segunda': {'id': 2, 'elo_inicial': 1800},
    'Tercera': {'id': 3, 'elo_inicial': 1600},
    'Cuarta': {'id': 4, 'elo_inicial': 1400}
}

excel_path = '/home/oscar/ranking-atta/ranking.xlsx'

try:
    # Conectar a la base de datos
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    # PASO 1: Desactivar el trigger temporalmente
    cursor.execute("DROP TRIGGER IF EXISTS trigger_elo_inicial")
    conn.commit()
    print("Trigger desactivado temporalmente")

    # PASO 2: Insertar clubes nuevos
    clubes_set = set()
    
    for hoja in categorias_info.keys():
        # Determinar filas a saltar según la hoja
        skiprows = 1 if hoja == 'Segunda' else 2
        
        # Leer hoja con manejo de diferentes estructuras
        df = pd.read_excel(excel_path, sheet_name=hoja, skiprows=skiprows)
        
        # Renombrar columnas según estructura
        if hoja == 'Segunda':
            # Verificar si hay suficientes columnas
            if len(df.columns) >= 3:
                df.columns = ['nombre', 'club', 'elo']
            else:
                print(f"Error: Hoja '{hoja}' no tiene suficientes columnas. Saltando...")
                continue
        else:
            # Verificar si hay suficientes columnas
            if len(df.columns) >= 3:
                df.columns = ['nombre', 'club', 'elo']
            else:
                print(f"Error: Hoja '{hoja}' no tiene suficientes columnas. Saltando...")
                continue
        
        # Filtrar filas vacías y recolectar clubes
        df = df[df['nombre'].notna() & (df['nombre'] != '')]
        clubes_set.update(df['club'].dropna().unique())

    # Insertar clubes que no existen
    for club in clubes_set:
        if club and club != '':  # Filtrar valores vacíos
            cursor.execute("""
                INSERT IGNORE INTO clubes (nombre) 
                VALUES (%s)
            """, (club.strip(),))
    conn.commit()

    # PASO 3: Insertar jugadores con sus relaciones
    for hoja, info in categorias_info.items():
        categoria_id = info['id']
        elo_inicial = info['elo_inicial']
        
        skiprows = 0
        
        # Leer hoja con manejo de diferentes estructuras
        df = pd.read_excel(excel_path, sheet_name=hoja, skiprows=skiprows)
        
        # Renombrar columnas según estructura
        if hoja == 'Segunda':
            # Verificar si hay suficientes columnas
            if len(df.columns) >= 3:
                df.columns = ['nombre', 'club', 'elo']
            else:
                print(f"Error: Hoja '{hoja}' no tiene suficientes columnas. Saltando...")
                continue
        else:
            # Verificar si hay suficientes columnas
            if len(df.columns) >= 3:
                df.columns = ['nombre', 'club', 'elo']
            else:
                print(f"Error: Hoja '{hoja}' no tiene suficientes columnas. Saltando...")
                continue
        
        # Filtrar filas vacías
        df = df[df['nombre'].notna() & (df['nombre'] != '')]
        
        for _, row in df.iterrows():
            nombre = row['nombre']
            if pd.isna(nombre) or nombre == '':
                continue
                
            nombre = str(nombre).strip()
            club = row['club'] if not pd.isna(row['club']) else 'Sin Club'
            elo_calculado = calcular_elo(row['elo'])
            
            # Si no se pudo calcular, usar elo_inicial de la categoría
            if elo_calculado is None:
                elo_calculado = elo_inicial
                print(f"Usando ELO inicial para {nombre} (valor original: {row['elo']})")
            
            # Obtener ID del club
            cursor.execute("SELECT id FROM clubes WHERE nombre = %s", (club,))
            club_id = cursor.fetchone()
            club_id = club_id[0] if club_id else None
            
            # Insertar jugador con ELO calculado
            cursor.execute("""
                INSERT INTO jugadores (nombre, elo, club_id, categoria_id) 
                VALUES (%s, %s, %s, %s)
            """, (nombre, elo_calculado, club_id, categoria_id))
    
    conn.commit()
    print("¡Datos importados exitosamente!")

except Error as e:
    print("Error durante la importación:", e)
    if conn.is_connected():
        conn.rollback()
except Exception as e:
    print("Error general:", e)
    if conn.is_connected():
        conn.rollback()
finally:
    if conn.is_connected():
        # PASO 4: Reactivar el trigger
        try:
            cursor.execute("""
                CREATE TRIGGER trigger_elo_inicial BEFORE INSERT ON jugadores
                FOR EACH ROW
                BEGIN
                    IF NEW.elo IS NULL THEN
                        SET NEW.elo = (SELECT elo_inicial FROM categorias WHERE id = NEW.categoria_id);
                    END IF;
                END
            """)
            conn.commit()
            print("Trigger reactivado")
        except Error as e:
            print("Error al reactivar el trigger:", e)
        
        cursor.close()
        conn.close()