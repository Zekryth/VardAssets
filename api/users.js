import { getPool } from './_lib/db.js';
import { authenticateToken, requireAdmin } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  console.log('📥 Request a /api/users:', req.method);
  
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    const user = authenticateToken(req);
    requireAdmin(user); // Solo admin puede gestionar usuarios

    // GET /api/users - Listar usuarios
    if (req.method === 'GET') {
      const { search, page = 1, limit = 10 } = req.query;
      
      let query = 'SELECT id, email, username, role, created_at, updated_at FROM users';
      let countQuery = 'SELECT COUNT(*) FROM users';
      let params = [];
      
      if (search) {
        const whereClause = ' WHERE email ILIKE $1 OR username ILIKE $1';
        query += whereClause;
        countQuery += whereClause;
        params.push(`%${search}%`);
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

      const [{ rows }, countResult] = await Promise.all([
        pool.query(query, params),
        pool.query(countQuery, search ? [`%${search}%`] : [])
      ]);

      console.log(`✅ Usuarios encontrados: ${rows.length}`);
      return res.status(200).json({
        users: rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // POST /api/users - Crear usuario
    if (req.method === 'POST') {
      console.log('📥 POST /api/users - Body:', { email: req.body.email, username: req.body.username });
      
      const { email, password, username, role = 'user' } = req.body;
      
      if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, contraseña y nombre de usuario son obligatorios' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await pool.query(
        `INSERT INTO users (id, email, password, username, role, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         RETURNING id, email, username, role, created_at, updated_at`,
        [email.trim().toLowerCase(), hashedPassword, username.trim(), role]
      );

      console.log('✅ Usuario creado:', rows[0].id);
      return res.status(201).json(rows[0]);
    }

    // PUT /api/users?id=xxx - Actualizar usuario
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { email, password, username, role } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
      }

      let updateFields = [];
      let params = [];
      let paramCount = 1;

      if (email) {
        updateFields.push(`email = $${paramCount}`);
        params.push(email.trim().toLowerCase());
        paramCount++;
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push(`password = $${paramCount}`);
        params.push(hashedPassword);
        paramCount++;
      }

      if (username) {
        updateFields.push(`username = $${paramCount}`);
        params.push(username.trim());
        paramCount++;
      }

      if (role) {
        updateFields.push(`role = $${paramCount}`);
        params.push(role);
        paramCount++;
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
      }

      updateFields.push('updated_at = NOW()');
      params.push(id);

      const { rows } = await pool.query(
        `UPDATE users 
         SET ${updateFields.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, email, username, role, created_at, updated_at`,
        params
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      console.log('✅ Usuario actualizado:', id);
      return res.status(200).json(rows[0]);
    }

    // DELETE /api/users?id=xxx - Eliminar usuario
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
      }

      // No permitir eliminarse a sí mismo
      if (id === user.id) {
        return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
      }

      const { rows } = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, email, username',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      console.log('✅ Usuario eliminado:', id);
      return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
