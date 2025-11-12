import { getPool } from './_lib/db.js';
import { authenticateToken } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';

export default async function handler(req, res) {
  console.log('📥 Request a /api/companies:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    const user = authenticateToken(req);
    console.log('✅ Usuario autenticado:', user.email);

    // GET /api/companies - Listar compañías
    if (req.method === 'GET') {
      const { search, page = 1, limit = 10 } = req.query;
      
      let query = 'SELECT * FROM companies';
      let params = [];
      
      if (search) {
        query += ' WHERE nombre ILIKE $1 OR persona_contacto ILIKE $1 OR email ILIKE $1';
        params.push(`%${search}%`);
      }
      
      query += ' ORDER BY created_at DESC';
      
      // Paginación
      const offset = (page - 1) * limit;
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const { rows } = await pool.query(query, params);
      
      // Contar total
      const countQuery = search 
        ? 'SELECT COUNT(*) FROM companies WHERE nombre ILIKE $1 OR persona_contacto ILIKE $1 OR email ILIKE $1'
        : 'SELECT COUNT(*) FROM companies';
      const { rows: countRows } = await pool.query(countQuery, search ? [`%${search}%`] : []);
      
      console.log(`✅ Compañías encontradas: ${rows.length} de ${countRows[0].count}`);
      
      return res.status(200).json({
        data: rows,
        total: parseInt(countRows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // POST /api/companies - Crear compañía
    if (req.method === 'POST') {
      console.log('📥 POST /api/companies - Body:', req.body);
      
      const { nombre, personaContacto, telefono, email, direccion } = req.body;
      
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      const { rows } = await pool.query(
        `INSERT INTO companies (id, nombre, persona_contacto, telefono, email, direccion, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [nombre.trim(), personaContacto?.trim(), telefono?.trim(), email?.trim(), direccion?.trim()]
      );

      console.log('✅ Compañía creada:', rows[0].id);
      return res.status(201).json(rows[0]);
    }

    // PUT /api/companies?id=xxx - Actualizar compañía
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { nombre, personaContacto, telefono, email, direccion } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID de compañía requerido' });
      }

      const { rows } = await pool.query(
        `UPDATE companies 
         SET nombre = COALESCE($1, nombre),
             persona_contacto = COALESCE($2, persona_contacto),
             telefono = COALESCE($3, telefono),
             email = COALESCE($4, email),
             direccion = COALESCE($5, direccion),
             updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [nombre?.trim(), personaContacto?.trim(), telefono?.trim(), email?.trim(), direccion?.trim(), id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Compañía no encontrada' });
      }

      console.log('✅ Compañía actualizada:', id);
      return res.status(200).json(rows[0]);
    }

    // DELETE /api/companies?id=xxx - Eliminar compañía
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID de compañía requerido' });
      }

      const { rows } = await pool.query(
        'DELETE FROM companies WHERE id = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Compañía no encontrada' });
      }

      console.log('✅ Compañía eliminada:', id);
      return res.status(200).json({ message: 'Compañía eliminada correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
