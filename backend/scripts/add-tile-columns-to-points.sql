-- ============================================================================
-- Script: add-tile-columns-to-points.sql
-- Descripción: Agregar columnas de tile a la tabla points
-- Fecha: 2025-11-16
-- ============================================================================

-- Agregar columnas tile a points
ALTER TABLE points 
ADD COLUMN IF NOT EXISTS tile_x INTEGER,
ADD COLUMN IF NOT EXISTS tile_y INTEGER,
ADD COLUMN IF NOT EXISTS zoom_level INTEGER DEFAULT 1;

-- Índice para búsqueda de puntos por tile
CREATE INDEX IF NOT EXISTS idx_points_tile ON points(tile_x, tile_y, zoom_level);

-- Comentarios
COMMENT ON COLUMN points.tile_x IS 'Coordenada X del tile donde se encuentra el punto';
COMMENT ON COLUMN points.tile_y IS 'Coordenada Y del tile donde se encuentra el punto';
COMMENT ON COLUMN points.zoom_level IS 'Nivel de zoom del punto';

-- Función para calcular y actualizar tiles de puntos existentes
-- (basado en coordenadas x, y con tile_size = 512)
CREATE OR REPLACE FUNCTION calculate_point_tiles() RETURNS void AS $$
DECLARE
  tile_size INTEGER := 512;
BEGIN
  UPDATE points
  SET 
    tile_x = FLOOR(x / tile_size),
    tile_y = FLOOR(y / tile_size),
    zoom_level = 1
  WHERE x IS NOT NULL AND y IS NOT NULL;
  
  RAISE NOTICE 'Tiles calculados para % puntos', (SELECT COUNT(*) FROM points WHERE tile_x IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

-- Ejecutar cálculo de tiles para puntos existentes
SELECT calculate_point_tiles();

-- Verificar
SELECT 
  COUNT(*) as total_points,
  COUNT(tile_x) as points_with_tiles
FROM points;

SELECT 'Columnas tile agregadas exitosamente a points' AS status;
