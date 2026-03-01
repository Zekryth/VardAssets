import { getPool } from './_lib/db.js';
import { authenticateToken } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';

export default async function handler(req, res) {
  console.log('📥 Request a /api/objects:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    const user = authenticateToken(req);
    console.log('✅ Usuario autenticado:', user.email);

    // GET /api/objects - Listar objetos
    if (req.method === 'GET') {
      const { search } = req.query;
      
      let query = 'SELECT * FROM objects';
      let params = [];
      
      if (search) {
        query += ' WHERE nombre ILIKE $1 OR categoria ILIKE $1';
        params.push(`%${search}%`);
      }
      
      query += ' ORDER BY created_at DESC';

      const { rows } = await pool.query(query, params);
      
      console.log(`✅ Objetos encontrados: ${rows.length}`);
      return res.status(200).json(rows);
    }

    // POST /api/objects - Crear objeto
    if (req.method === 'POST') {
      console.log('📥 POST /api/objects - Body:', req.body);
      
      // Accept both frontend naming (numeroInventario) and backend (nr_inventario)
      const { nombre, categoria, numeroInventario, nr_inventario, nick, icono, descripcion, imagen, unidad, precio } = req.body;
      const inventoryNumber = numeroInventario || nr_inventario;
      
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      const { rows } = await pool.query(
        `INSERT INTO objects (id, nombre, categoria, nr_inventario, nick, icono, descripcion, imagen, unidad, precio, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          nombre.trim(),
          categoria?.trim() || 'General',
          inventoryNumber?.trim() || null,
          nick?.trim() || null,
          icono?.trim() || '📦',
          descripcion?.trim() || null,
          imagen?.trim() || null,
          unidad?.trim() || 'unidad',
          precio || 0
        ]
      );

      console.log('✅ Objeto creado:', rows[0].id);
      return res.status(201).json(rows[0]);
    }

    // PUT /api/objects?id=xxx - Actualizar objeto
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { nombre, categoria, numeroInventario, nr_inventario, nick, icono, descripcion, imagen, unidad, precio } = req.body;
      const inventoryNumber = numeroInventario || nr_inventario;

      if (!id) {
        return res.status(400).json({ error: 'ID de objeto requerido' });
      }

      const { rows } = await pool.query(
        `UPDATE objects 
         SET nombre = COALESCE($1, nombre),
             categoria = COALESCE($2, categoria),
             nr_inventario = COALESCE($3, nr_inventario),
             nick = COALESCE($4, nick),
             icono = COALESCE($5, icono),
             descripcion = COALESCE($6, descripcion),
             imagen = COALESCE($7, imagen),
             unidad = COALESCE($8, unidad),
             precio = COALESCE($9, precio),
             updated_at = NOW()
         WHERE id = $10
         RETURNING *`,
        [nombre?.trim(), categoria?.trim(), inventoryNumber?.trim(), nick?.trim(), icono?.trim(), descripcion?.trim(), imagen?.trim(), unidad?.trim(), precio, id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Objeto no encontrado' });
      }

      console.log('✅ Objeto actualizado:', id);
      return res.status(200).json(rows[0]);
    }

    // DELETE /api/objects?id=xxx - Eliminar objeto
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID de objeto requerido' });
      }

      const { rows } = await pool.query(
        'DELETE FROM objects WHERE id = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Objeto no encontrado' });
      }

      console.log('✅ Objeto eliminado:', id);
      return res.status(200).json({ message: 'Objeto eliminado correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
