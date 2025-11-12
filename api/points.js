import { getPool } from './_lib/db.js';
import { authenticateToken } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';

export default async function handler(req, res) {
  console.log('📥 Request a /api/points:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    const user = authenticateToken(req);
    console.log('✅ Usuario autenticado:', user.email);

    // GET /api/points - Listar puntos
    if (req.method === 'GET') {
      const { rows } = await pool.query(
        `SELECT p.*, 
                c.nombre as company_name,
                jsonb_array_length(COALESCE(p.inventario, '[]'::jsonb)) as items_count
         FROM points p
         LEFT JOIN companies c ON p.compañia = c.id
         ORDER BY p.created_at DESC`
      );

      console.log(`✅ Puntos encontrados: ${rows.length}`);
      return res.status(200).json(rows);
    }

    // POST /api/points - Crear punto
    if (req.method === 'POST') {
      console.log('📥 POST /api/points - Body:', req.body);
      
      const { nombre, compañia, coordenadas, inventario, fotos, documentos } = req.body;
      
      if (!nombre || !coordenadas) {
        return res.status(400).json({ error: 'Nombre y coordenadas son obligatorios' });
      }

      // Validar coordenadas
      if (typeof coordenadas.x !== 'number' || typeof coordenadas.y !== 'number') {
        return res.status(400).json({ error: 'Coordenadas inválidas (x, y requeridos)' });
      }

      const { rows } = await pool.query(
        `INSERT INTO points (id, nombre, compañia, coordenadas, inventario, fotos, documentos, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [
          nombre.trim(),
          compañia || null,
          JSON.stringify(coordenadas),
          JSON.stringify(inventario || []),
          JSON.stringify(fotos || []),
          JSON.stringify(documentos || [])
        ]
      );

      // Incluir nombre de compañía
      const pointWithCompany = await pool.query(
        `SELECT p.*, c.nombre as company_name
         FROM points p
         LEFT JOIN companies c ON p.compañia = c.id
         WHERE p.id = $1`,
        [rows[0].id]
      );

      console.log('✅ Punto creado:', rows[0].id);
      return res.status(201).json(pointWithCompany.rows[0]);
    }

    // PUT /api/points?id=xxx - Actualizar punto
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { nombre, compañia, coordenadas, inventario, fotos, documentos } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      const { rows } = await pool.query(
        `UPDATE points 
         SET nombre = COALESCE($1, nombre),
             compañia = COALESCE($2, compañia),
             coordenadas = COALESCE($3, coordenadas),
             inventario = COALESCE($4, inventario),
             fotos = COALESCE($5, fotos),
             documentos = COALESCE($6, documentos),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
          nombre?.trim(),
          compañia,
          coordenadas ? JSON.stringify(coordenadas) : null,
          inventario ? JSON.stringify(inventario) : null,
          fotos ? JSON.stringify(fotos) : null,
          documentos ? JSON.stringify(documentos) : null,
          id
        ]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Punto no encontrado' });
      }

      console.log('✅ Punto actualizado:', id);
      return res.status(200).json(rows[0]);
    }

    // DELETE /api/points?id=xxx - Eliminar punto (mover a papelera)
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      // Mover a deleted_points
      const { rows: point } = await pool.query('SELECT * FROM points WHERE id = $1', [id]);
      
      if (point.length === 0) {
        return res.status(404).json({ error: 'Punto no encontrado' });
      }

      await pool.query(
        `INSERT INTO deleted_points (id, original_id, nombre, compañia, coordenadas, inventario, fotos, documentos, deleted_by, deleted_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          point[0].id,
          point[0].nombre,
          point[0].compañia,
          point[0].coordenadas,
          point[0].inventario,
          point[0].fotos,
          point[0].documentos,
          JSON.stringify({ id: user.id, email: user.email })
        ]
      );

      await pool.query('DELETE FROM points WHERE id = $1', [id]);

      console.log('✅ Punto eliminado (movido a papelera):', id);
      return res.status(200).json({ message: 'Punto eliminado correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
