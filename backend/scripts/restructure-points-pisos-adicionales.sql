-- ========================================
-- Migración: Reestructurar puntos con Planta Baja + Pisos Adicionales
-- Fecha: 2025-11-16
-- Autor: Sistema de Gestión Vard Assets
-- ========================================

-- 1. Agregar nuevas columnas para Planta Baja
ALTER TABLE points ADD COLUMN IF NOT EXISTS compania_propietaria UUID;
ALTER TABLE points ADD COLUMN IF NOT EXISTS compania_alojada UUID;
ALTER TABLE points ADD COLUMN IF NOT EXISTS nr_inventario_sap VARCHAR(100);
ALTER TABLE points ADD COLUMN IF NOT EXISTS mijloc_fix BOOLEAN DEFAULT FALSE;

-- 2. Agregar claves foráneas para compañías
ALTER TABLE points 
  ADD CONSTRAINT fk_compania_propietaria 
  FOREIGN KEY (compania_propietaria) 
  REFERENCES companies(id) 
  ON DELETE SET NULL;

ALTER TABLE points 
  ADD CONSTRAINT fk_compania_alojada 
  FOREIGN KEY (compania_alojada) 
  REFERENCES companies(id) 
  ON DELETE SET NULL;

-- 3. Renombrar columna pisos a pisos_adicionales para claridad
-- Si la columna 'pisos' existe, renombrarla
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'points' AND column_name = 'pisos'
  ) THEN
    ALTER TABLE points RENAME COLUMN pisos TO pisos_adicionales;
  END IF;
END $$;

-- 4. Si no existe pisos_adicionales, crearla
ALTER TABLE points ADD COLUMN IF NOT EXISTS pisos_adicionales JSONB DEFAULT '[]'::jsonb;

-- 5. Migrar datos de compañia antigua a compania_propietaria (si existe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'points' AND column_name = 'compañia'
  ) THEN
    UPDATE points 
    SET compania_propietaria = "compañia" 
    WHERE "compañia" IS NOT NULL 
      AND compania_propietaria IS NULL;
  END IF;
END $$;

-- 6. Asegurar que pisos_adicionales sea array vacío si es NULL
UPDATE points
SET pisos_adicionales = '[]'::jsonb
WHERE pisos_adicionales IS NULL;

-- 7. Crear índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_points_nombre ON points(nombre);
CREATE INDEX IF NOT EXISTS idx_points_mijloc_fix ON points(mijloc_fix) WHERE mijloc_fix = TRUE;
CREATE INDEX IF NOT EXISTS idx_points_compania_propietaria ON points(compania_propietaria);
CREATE INDEX IF NOT EXISTS idx_points_compania_alojada ON points(compania_alojada);
CREATE INDEX IF NOT EXISTS idx_points_nr_sap ON points(nr_inventario_sap) WHERE nr_inventario_sap IS NOT NULL;

-- 8. Crear índice GIN para búsqueda dentro de pisos_adicionales
CREATE INDEX IF NOT EXISTS idx_points_pisos_adicionales_gin 
  ON points USING GIN (pisos_adicionales);

-- 9. Agregar comentarios a las columnas
COMMENT ON COLUMN points.nombre IS 'Nombre del punto para búsqueda (ej: 234150) - Planta Baja';
COMMENT ON COLUMN points.categoria IS 'Categoría de la Planta Baja (ej: Container tip birou)';
COMMENT ON COLUMN points.compania_propietaria IS 'Compañía propietaria del punto/container';
COMMENT ON COLUMN points.compania_alojada IS 'Compañía alojada en el punto (puede ser diferente de propietaria)';
COMMENT ON COLUMN points.nr_inventario_sap IS 'Número de inventario SAP (opcional)';
COMMENT ON COLUMN points.mijloc_fix IS 'Si el punto es fijo (⭐ Mijloc Fix)';
COMMENT ON COLUMN points.pisos_adicionales IS 'Array JSONB de pisos adicionales con estructura: {numero, nombre_punto, nombre_piso, categoria, compania_propietaria, compania_alojada, mijloc_fix, inventario, fotos, documentos}';
COMMENT ON COLUMN points.inventario IS 'Inventario de la Planta Baja';
COMMENT ON COLUMN points.fotos IS 'Fotos de la Planta Baja';
COMMENT ON COLUMN points.documentos IS 'Documentos de la Planta Baja';

-- 10. Verificar estructura final
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'points'
ORDER BY ordinal_position;

-- 11. Ejemplo de punto con estructura nueva (COMENTADO - solo referencia)
/*
INSERT INTO points (
  nombre,
  categoria,
  compania_propietaria,
  compania_alojada,
  nr_inventario_sap,
  mijloc_fix,
  coordenadas,
  inventario,
  fotos,
  documentos,
  pisos_adicionales
) VALUES (
  '234150',
  'Container tip birou',
  'uuid-empresa-a',
  'uuid-empresa-b',
  'SAP-12345',
  TRUE,
  '{"x": 100, "y": 100}'::jsonb,
  '[{"objeto": "obj-1", "cantidad": 10}]'::jsonb,
  '["url-foto-1"]'::jsonb,
  '["url-doc-1"]'::jsonb,
  '[
    {
      "numero": 1,
      "nombre_punto": "234567 - etj 1",
      "nombre_piso": "Etajul 1",
      "categoria": "Container tip magaize",
      "compania_propietaria": "uuid-empresa-a",
      "compania_alojada": "uuid-empresa-c",
      "mijloc_fix": false,
      "inventario": [{"objeto": "obj-2", "cantidad": 5}],
      "fotos": ["url-foto-2"],
      "documentos": []
    },
    {
      "numero": 2,
      "nombre_punto": "234890 - etj 2",
      "nombre_piso": "Etajul 2",
      "categoria": "Container tip depozit",
      "compania_propietaria": "uuid-empresa-a",
      "compania_alojada": "uuid-empresa-d",
      "mijloc_fix": true,
      "inventario": [],
      "fotos": [],
      "documentos": []
    }
  ]'::jsonb
);
*/

-- ========================================
-- Fin de la migración
-- ========================================
