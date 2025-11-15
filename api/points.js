import { getPool } from './_lib/db.js';
import { authenticateToken } from './_lib/auth.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';
import { initializeDatabase } from './_lib/init.js';

export default async function handler(req, res) {
  console.log('📥 [POINTS] Request:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  await initializeDatabase();
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
      const { nombre, compañia, coordenadas, inventario, fotos, documentos } = req.body;
      
      console.log('📝 [POINTS] === INICIO CREACIÓN ===');
      console.log('   Datos recibidos:', {
        nombre,
        compañia,
        coordenadas,
        inventario: inventario?.length || 0,
        fotos: fotos?.length || 0,
        documentos: documentos?.length || 0
      });

      // Validaciones
      if (!nombre?.trim()) {
        console.warn('⚠️ [POINTS] Nombre vacío');
        return res.status(400).json({ 
          error: 'El nombre del punto es obligatorio' 
        });
      }

      if (!coordenadas || (typeof coordenadas.x !== 'number' && typeof coordenadas.lat !== 'number')) {
        console.warn('⚠️ [POINTS] Coordenadas inválidas:', coordenadas);
        return res.status(400).json({ 
          error: 'Las coordenadas son obligatorias (x,y o lat,lng)' 
        });
      }

      console.log('🔍 [POINTS] Verificando estructura de tabla...');
      
      // Verificar que la columna "compañia" existe
      const { rows: columns } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'points' 
          AND column_name = 'compañia'
      `);

      if (columns.length === 0) {
        console.error('❌ [POINTS] Columna "compañia" NO existe');
        console.error('   Ejecuta este SQL en Neon:');
        console.error('   ALTER TABLE points RENAME COLUMN company_id TO compañia;');
        return res.status(500).json({
          error: 'Error de configuración de base de datos',
          details: 'La columna "compañia" no existe. Contacta al administrador.'
        });
      }

      console.log('✅ [POINTS] Columna "compañia" verificada');

      // Si hay compañía, verificar que existe
      if (compañia) {
        console.log(`🔍 [POINTS] Verificando compañía: ${compañia}`);
        const { rows: companyCheck } = await pool.query(
          `SELECT id, nombre FROM companies WHERE id = $1`,
          [compañia]
        );

        if (companyCheck.length === 0) {
          console.warn(`⚠️ [POINTS] Compañía no encontrada: ${compañia}`);
          return res.status(400).json({ 
            error: 'La compañía seleccionada no existe' 
          });
        }

        console.log(`✅ [POINTS] Compañía verificada: ${companyCheck[0].nombre}`);
      }

      console.log('💾 [POINTS] Insertando en base de datos...');

      const { rows } = await pool.query(
        `INSERT INTO points (nombre, compañia, coordenadas, inventario, fotos, documentos)
         VALUES ($1, $2, $3, $4, $5, $6)
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

      const newPoint = rows[0];
      console.log('✅ [POINTS] Punto creado exitosamente:', {
        id: newPoint.id,
        nombre: newPoint.nombre,
        compañia: newPoint.compañia
      });

      // Obtener punto con datos de compañía
      const { rows: fullPoint } = await pool.query(`
        SELECT 
          p.*,
          c.nombre as company_name
        FROM points p
        LEFT JOIN companies c ON p.compañia = c.id
        WHERE p.id = $1
      `, [newPoint.id]);

      return res.status(201).json(fullPoint[0]);
    }

    // PUT /api/points?id=xxx - Actualizar punto
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { nombre, compañia, coordenadas, inventario, fotos, documentos } = req.body;

      console.log(`📝 [POINTS] Actualizando punto: ${id}`);

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      if (!nombre?.trim()) {
        return res.status(400).json({ 
          error: 'El nombre del punto es obligatorio' 
        });
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
        console.warn(`⚠️ [POINTS] Punto no encontrado: ${id}`);
        return res.status(404).json({ error: 'Punto no encontrado' });
      }

      console.log(`✅ [POINTS] Punto actualizado: ${rows[0].nombre}`);

      // Retornar con datos de compañía
      const { rows: fullPoint } = await pool.query(`
        SELECT 
          p.*,
          c.nombre as company_name
        FROM points p
        LEFT JOIN companies c ON p.compañia = c.id
        WHERE p.id = $1
      `, [rows[0].id]);

      return res.status(200).json(fullPoint[0]);
    }

    // DELETE /api/points?id=xxx - Eliminar punto (mover a papelera)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      console.log(`🗑️ [POINTS] Moviendo a papelera: ${id}`);

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      // Mover a deleted_points
      const { rows: point } = await pool.query('SELECT * FROM points WHERE id = $1', [id]);
      
      if (point.length === 0) {
        return res.status(404).json({ error: 'Punto no encontrado' });
      }

      await pool.query(
        `INSERT INTO deleted_points (original_id, nombre, compañia, coordenadas, inventario, fotos, documentos, deleted_by, deleted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
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

      console.log(`✅ [POINTS] Punto movido a papelera: ${point[0].nombre}`);
      return res.status(200).json({ 
        message: 'Punto movido a papelera',
        point: point[0]
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('💥 [POINTS] Error:', error);
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('   Stack:', error.stack);
    return handleError(error, res);
  }
}
