-- Migración: Agregar columna categoria a la tabla points
-- Fecha: 2025-11-16
-- Propósito: Permitir categorizar puntos globalmente, separado de categoría por piso

-- Agregar columna categoria
ALTER TABLE points ADD COLUMN IF NOT EXISTS categoria VARCHAR(255);

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'points'
ORDER BY ordinal_position;

-- Ejemplo de actualización de datos existentes (opcional)
-- UPDATE points SET categoria = 'Sin categoría' WHERE categoria IS NULL;

-- Verificar estructura final de la tabla
\d points;
