-- ============================================================================
-- Script: create-map-tiles-table.sql
-- Descripción: Crear tabla para gestión de tiles/trozos del mapa
-- Fecha: 2025-11-16
-- ============================================================================

-- Tabla principal de tiles del mapa
CREATE TABLE IF NOT EXISTS map_tiles (
  id SERIAL PRIMARY KEY,
  
  -- Identificación del tile
  tile_x INTEGER NOT NULL,           -- Coordenada X del tile (ej: 0, 1, 2...)
  tile_y INTEGER NOT NULL,           -- Coordenada Y del tile (ej: 0, 1, 2...)
  zoom_level INTEGER DEFAULT 1,      -- Nivel de zoom (1 = base, 2 = zoom 2x, etc)
  
  -- Dimensiones del tile
  width INTEGER DEFAULT 512,         -- Ancho en píxeles
  height INTEGER DEFAULT 512,        -- Alto en píxeles
  
  -- Imagen de fondo del tile
  background_image_url TEXT,         -- URL de la imagen almacenada
  background_image_filename TEXT,    -- Nombre original del archivo
  
  -- Metadata
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Índice único por tile
  CONSTRAINT unique_tile_coords UNIQUE(tile_x, tile_y, zoom_level)
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_map_tiles_coords ON map_tiles(tile_x, tile_y);
CREATE INDEX IF NOT EXISTS idx_map_tiles_zoom ON map_tiles(zoom_level);
CREATE INDEX IF NOT EXISTS idx_map_tiles_uploaded_by ON map_tiles(uploaded_by);

-- Comentarios
COMMENT ON TABLE map_tiles IS 'Almacena información de cada tile/trozo del mapa modular';
COMMENT ON COLUMN map_tiles.tile_x IS 'Coordenada X del tile en la grilla';
COMMENT ON COLUMN map_tiles.tile_y IS 'Coordenada Y del tile en la grilla';
COMMENT ON COLUMN map_tiles.zoom_level IS 'Nivel de zoom: 1=base, 2=2x, 4=4x';
COMMENT ON COLUMN map_tiles.background_image_url IS 'URL de la imagen de fondo del tile';

-- Verificar creación
SELECT 'Tabla map_tiles creada exitosamente' AS status;
SELECT COUNT(*) as total_tiles FROM map_tiles;
