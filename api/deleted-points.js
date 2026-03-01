import { getPool } from './_lib/db.js';
import { authenticateToken, requireAdmin } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';

export default async function handler(req, res) {
  console.log('📥 Request a /api/deleted-points:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    const user = authenticateToken(req);

    // GET /api/deleted-points - Listar puntos eliminados
    if (req.method === 'GET') {
      const { rows } = await pool.query(
        `SELECT dp.*, c.nombre as compania_nombre
         FROM deleted_points dp
         LEFT JOIN companies c ON dp.compania = c.id
         ORDER BY dp.deleted_at DESC`
      );

      console.log(`✅ Puntos eliminados encontrados: ${rows.length}`);
      return res.status(200).json(rows);
    }

    // POST /api/deleted-points/restore?id=xxx - Restaurar punto
    if (req.method === 'POST' && req.url.includes('/restore')) {
      requireAdmin(user); // Solo admin puede restaurar
      
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      // Verificar que el punto eliminado existe
      const deletedPoint = await pool.query(
        'SELECT * FROM deleted_points WHERE id = $1',
        [id]
      );

      if (deletedPoint.rows.length === 0) {
        return res.status(404).json({ error: 'Punto eliminado no encontrado' });
      }

      const point = deletedPoint.rows[0];

      // Restaurar a la tabla points
      await pool.query(
        `INSERT INTO points (id, nombre, compania, coordenadas, inventario, fotos, documentos, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          point.original_id,
          point.nombre,
          point.compania,
          point.coordenadas,
          point.inventario,
          point.fotos,
          point.documentos,
          point.created_at
        ]
      );

      // Eliminar de deleted_points
      await pool.query('DELETE FROM deleted_points WHERE id = $1', [id]);

      console.log('✅ Punto restaurado:', point.original_id);
      return res.status(200).json({ 
        message: 'Punto restaurado correctamente',
        pointId: point.original_id
      });
    }

    // DELETE /api/deleted-points?id=xxx - Eliminar permanentemente
    if (req.method === 'DELETE') {
      requireAdmin(user); // Solo admin puede eliminar permanentemente
      
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      const { rows } = await pool.query(
        'DELETE FROM deleted_points WHERE id = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Punto eliminado no encontrado' });
      }

      console.log('✅ Punto eliminado permanentemente:', id);
      return res.status(200).json({ message: 'Punto eliminado permanentemente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
