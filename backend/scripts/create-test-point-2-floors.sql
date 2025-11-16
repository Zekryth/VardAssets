-- Script para crear punto de prueba con 2 pisos
-- Fecha: 2025-11-16
-- Propósito: Verificar que la navegación de pisos funciona en el panel flotante

-- Eliminar punto de prueba anterior si existe
DELETE FROM points WHERE nombre = 'PUNTO PRUEBA 2 PISOS';

-- Insertar punto con 2 pisos
INSERT INTO points (
  id,
  nombre,
  compañia,
  coordenadas,
  inventario,
  fotos,
  documentos,
  pisos,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'PUNTO PRUEBA 2 PISOS',
  NULL,
  '{"x": 100, "y": 100}'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[
    {
      "numero": 1,
      "nombre": "Planta Baja",
      "categoria": "Almacén",
      "compañia": null,
      "inventario": [
        {
          "objeto": "test-obj-1",
          "cantidad": 50,
          "unidad": "cajas"
        }
      ],
      "fotos": [],
      "documentos": []
    },
    {
      "numero": 2,
      "nombre": "Primer Piso",
      "categoria": "Oficinas",
      "compañia": null,
      "inventario": [
        {
          "objeto": "test-obj-2",
          "cantidad": 20,
          "unidad": "escritorios"
        }
      ],
      "fotos": [],
      "documentos": []
    }
  ]'::jsonb,
  NOW(),
  NOW()
);

-- Verificar que se creó correctamente
SELECT 
  id,
  nombre,
  jsonb_array_length(pisos) as total_pisos,
  pisos->0->>'nombre' as piso_1_nombre,
  pisos->0->>'categoria' as piso_1_categoria,
  pisos->1->>'nombre' as piso_2_nombre,
  pisos->1->>'categoria' as piso_2_categoria
FROM points
WHERE nombre = 'PUNTO PRUEBA 2 PISOS';
