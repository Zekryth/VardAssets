import { getPool } from './_lib/db.js';
import { authenticateToken } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';
import { initializeDatabase } from './_lib/init.js';

export default async function handler(req, res) {
  console.log('📥 [COMPANIES] Request:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  await initializeDatabase();
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
      const { nombre, personaContacto, telefono, email, direccion } = req.body;
      
      console.log('📝 [COMPANIES] === INICIO CREACIÓN ===');
      console.log('   Datos recibidos:', {
        nombre,
        personaContacto,
        telefono,
        email,
        direccion
      });

      // Validaciones
      if (!nombre?.trim()) {
        console.warn('⚠️ [COMPANIES] Nombre vacío o inválido');
        return res.status(400).json({ 
          error: 'El nombre de la compañía es obligatorio' 
        });
      }

      console.log('🔍 [COMPANIES] Verificando estructura de tabla...');
      
      // Verificar que la columna "nombre" existe
      const { rows: columns } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'companies' 
          AND column_name = 'nombre'
      `);

      if (columns.length === 0) {
        console.error('❌ [COMPANIES] Column "nombre" does not exist in table');
        console.error('   Run this SQL in Supabase:');
        console.error('   ALTER TABLE companies RENAME COLUMN name TO nombre;');
        return res.status(500).json({
          error: 'Database configuration error',
          details: 'Column "nombre" does not exist. Contact administrator.'
        });
      }

      console.log('✅ [COMPANIES] Columna "nombre" verificada');
      console.log('💾 [COMPANIES] Insertando en base de datos...');

      const { rows } = await pool.query(
        `INSERT INTO companies (nombre, persona_contacto, telefono, email, direccion)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          nombre.trim(),
          personaContacto?.trim() || null,
          telefono?.trim() || null,
          email?.trim() || null,
          direccion?.trim() || null
        ]
      );

      const newCompany = rows[0];
      console.log('✅ [COMPANIES] Compañía creada exitosamente:', {
        id: newCompany.id,
        nombre: newCompany.nombre
      });

      return res.status(201).json(newCompany);
    }

    // PUT /api/companies?id=xxx - Actualizar compañía
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { nombre, personaContacto, telefono, email, direccion } = req.body;

      console.log(`📝 [COMPANIES] Actualizando compañía: ${id}`);

      if (!id) {
        return res.status(400).json({ error: 'ID de compañía requerido' });
      }

      if (!nombre?.trim()) {
        return res.status(400).json({ 
          error: 'El nombre de la compañía es obligatorio' 
        });
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
        console.warn(`⚠️ [COMPANIES] Compañía no encontrada: ${id}`);
        return res.status(404).json({ error: 'Compañía no encontrada' });
      }

      console.log(`✅ [COMPANIES] Compañía actualizada: ${rows[0].nombre}`);
      return res.status(200).json(rows[0]);
    }

    // DELETE /api/companies?id=xxx - Eliminar compañía
    if (req.method === 'DELETE') {
      const { id } = req.query;
      console.log(`🗑️ [COMPANIES] Eliminando compañía: ${id}`);

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

      console.log(`✅ [COMPANIES] Compañía eliminada: ${rows[0].nombre}`);
      return res.status(200).json({ 
        message: 'Compañía eliminada exitosamente',
        company: rows[0]
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('💥 [COMPANIES] Error:', error);
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('   Stack:', error.stack);
    return handleError(error, res);
  }
}
