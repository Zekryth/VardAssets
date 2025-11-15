-- Migración: Agregar sistema de pisos a puntos
-- Fecha: 2024-11-16
-- Descripción: Agrega campo 'pisos' JSONB y migra datos existentes de inventario/fotos/documentos al piso 1

-- Paso 1: Agregar columna pisos (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'points' AND column_name = 'pisos'
    ) THEN
        ALTER TABLE points 
        ADD COLUMN pisos JSONB DEFAULT '[{"numero": 1, "nombre": "Planta Baja", "inventario": [], "fotos": [], "documentos": []}]'::jsonb;
        
        RAISE NOTICE 'Columna pisos agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna pisos ya existe, omitiendo creación';
    END IF;
END $$;

-- Paso 2: Migrar datos existentes de inventario/fotos/documentos al piso 1
UPDATE points 
SET pisos = jsonb_build_array(
    jsonb_build_object(
        'numero', 1,
        'nombre', 'Planta Baja',
        'inventario', COALESCE(inventario, '[]'::jsonb),
        'fotos', COALESCE(fotos, '[]'::jsonb),
        'documentos', COALESCE(documentos, '[]'::jsonb)
    )
)
WHERE pisos IS NULL 
   OR pisos = '[]'::jsonb
   OR jsonb_array_length(pisos) = 0;

-- Paso 3: Verificar migración
SELECT 
    COUNT(*) as total_puntos,
    COUNT(CASE WHEN pisos IS NOT NULL AND jsonb_array_length(pisos) > 0 THEN 1 END) as puntos_con_pisos,
    COUNT(CASE WHEN jsonb_array_length(pisos) > 1 THEN 1 END) as puntos_con_multiples_pisos
FROM points;

-- Paso 4: Ver ejemplos de datos migrados
SELECT 
    id,
    nombre,
    jsonb_array_length(pisos) as cantidad_pisos,
    pisos->0->>'nombre' as piso_1_nombre,
    jsonb_array_length(COALESCE(pisos->0->'inventario', '[]'::jsonb)) as piso_1_items
FROM points
LIMIT 5;

-- NOTA: NO eliminar columnas antiguas todavía para permitir rollback
-- Después de verificar que todo funciona correctamente, ejecutar:
-- ALTER TABLE points DROP COLUMN inventario;
-- ALTER TABLE points DROP COLUMN fotos;
-- ALTER TABLE points DROP COLUMN documentos;
