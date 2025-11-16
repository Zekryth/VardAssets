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
      const { id } = req.query;

      if (id) {
        // GET /api/points/:id - Obtener un punto específico
        const { rows } = await pool.query(
          `SELECT p.*, 
                  c.nombre as company_name
           FROM points p
           LEFT JOIN companies c ON p.compañia = c.id
           WHERE p.id = $1`,
          [id]
        );

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Punto no encontrado' });
        }

        let pointData = rows[0];

        console.log('📍 [GET POINT] Raw data:', {
          id: pointData.id,
          nombre: pointData.nombre,
          pisos_tipo: typeof pointData.pisos,
          pisos_es_string: typeof pointData.pisos === 'string',
          pisos_raw: pointData.pisos
        });

        // 🔥 ARREGLO CRÍTICO: Parsear pisos si es string
        if (typeof pointData.pisos === 'string') {
          try {
            pointData.pisos = JSON.parse(pointData.pisos);
            console.log('✅ [GET POINT] Pisos parseados correctamente:', pointData.pisos);
          } catch (e) {
            console.error('❌ [GET POINT] Error parseando pisos:', e);
            pointData.pisos = [];
          }
        }

        // Asegurar que sea array
        if (!Array.isArray(pointData.pisos)) {
          console.warn('⚠️ [GET POINT] pisos no es array, convirtiendo:', typeof pointData.pisos);
          pointData.pisos = [];
        }

        // Backward compatibility: migrar datos viejos
        if (pointData.pisos.length === 0) {
          console.log('📦 [GET POINT] Migrando datos viejos al formato de pisos');
          
          let inventario = pointData.inventario || [];
          let fotos = pointData.fotos || [];
          let documentos = pointData.documentos || [];

          // Parsear si son strings
          if (typeof inventario === 'string') {
            try { inventario = JSON.parse(inventario); } catch (e) { inventario = []; }
          }
          if (typeof fotos === 'string') {
            try { fotos = JSON.parse(fotos); } catch (e) { fotos = []; }
          }
          if (typeof documentos === 'string') {
            try { documentos = JSON.parse(documentos); } catch (e) { documentos = []; }
          }

          pointData.pisos = [{
            numero: 1,
            nombre: pointData.nombre || 'Planta Baja',
            categoria: pointData.categoria || '',
            compañia: pointData.compañia || null,
            inventario,
            fotos,
            documentos
          }];
        }

        // Asegurar que cada piso tenga categoria y compañia
        pointData.pisos = pointData.pisos.map((piso, index) => {
          console.log(`📋 [GET POINT] Procesando piso ${index + 1}:`, {
            nombre: piso.nombre,
            categoria: piso.categoria,
            compañia: piso.compañia,
            inventario_count: piso.inventario?.length || 0
          });

          return {
            ...piso,
            categoria: piso.categoria || pointData.categoria || '',
            compañia: piso.compañia || pointData.compañia || null
          };
        });

        console.log('🏢 [GET POINT] Total pisos en respuesta:', pointData.pisos.length);
        console.log('🔍 [GET POINT] ¿Debería mostrar navegación?', pointData.pisos.length > 1);

        return res.status(200).json(pointData);
      }

      // GET /api/points - Obtener todos los puntos
      const { rows } = await pool.query(
        `SELECT p.*, 
                c.nombre as company_name,
                jsonb_array_length(COALESCE(p.inventario, '[]'::jsonb)) as items_count
         FROM points p
         LEFT JOIN companies c ON p.compañia = c.id
         ORDER BY p.created_at DESC`
      );

      console.log(`✅ [GET POINTS] Puntos encontrados: ${rows.length}`);
      
      // Parsear pisos de cada punto
      const pointsData = rows.map(point => {
        let pointData = { ...point };
        
        // Si pisos es string, parsearlo
        if (typeof pointData.pisos === 'string') {
          try {
            pointData.pisos = JSON.parse(pointData.pisos);
          } catch (e) {
            console.error('❌ Error parseando pisos del punto', pointData.id, ':', e);
            pointData.pisos = [];
          }
        }

        // Asegurar array
        if (!Array.isArray(pointData.pisos)) {
          pointData.pisos = [];
        }

        // Backward compatibility
        if (pointData.pisos.length === 0) {
          let inventario = pointData.inventario || [];
          let fotos = pointData.fotos || [];
          let documentos = pointData.documentos || [];

          if (typeof inventario === 'string') {
            try { inventario = JSON.parse(inventario); } catch (e) { inventario = []; }
          }
          if (typeof fotos === 'string') {
            try { fotos = JSON.parse(fotos); } catch (e) { fotos = []; }
          }
          if (typeof documentos === 'string') {
            try { documentos = JSON.parse(documentos); } catch (e) { documentos = []; }
          }

          pointData.pisos = [{
            numero: 1,
            nombre: pointData.nombre || 'Planta Baja',
            categoria: pointData.categoria || '',
            compañia: pointData.compañia || null,
            inventario,
            fotos,
            documentos
          }];
        }

        return pointData;
      });

      // Log detallado de los primeros 2 puntos para debugging
      if (pointsData.length > 0) {
        pointsData.slice(0, 2).forEach((point, index) => {
          console.log(`📍 [GET POINTS] Punto ${index + 1}:`, {
            id: point.id,
            nombre: point.nombre,
            pisos_tipo: typeof point.pisos,
            pisos_length: Array.isArray(point.pisos) ? point.pisos.length : 'N/A',
            tiene_categoria_global: !!point.categoria,
            tiene_compañia_global: !!point.compañia
          });
          
          // Si tiene pisos, mostrar el primero
          if (point.pisos && Array.isArray(point.pisos) && point.pisos.length > 0) {
            console.log(`   Piso 1:`, {
              nombre: point.pisos[0].nombre,
              categoria: point.pisos[0].categoria,
              compañia: point.pisos[0].compañia
            });
          }
        });
      }
      
      return res.status(200).json(pointsData);
    }

    // POST /api/points - Crear punto
    if (req.method === 'POST') {
      const { nombre, categoria, compañia, coordenadas, pisos, inventario, fotos, documentos } = req.body;
      
      console.log('📝 [POINTS] === INICIO CREACIÓN ===');
      console.log('   Datos recibidos:', {
        nombre,
        categoria,
        compañia,
        coordenadas,
        pisos: pisos?.length || 'no enviado',
        inventario: inventario?.length || 'no enviado',
        fotos: fotos?.length || 'no enviado',
        documentos: documentos?.length || 'no enviado'
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
      console.log('📦 [POINTS] Payload recibido:', { nombre, categoria, compañia, coordenadas, pisos_count: pisos?.length });

      // Si viene 'pisos', usar nuevo formato; si no, crear piso único con datos antiguos
      let pisosData;
      if (pisos && Array.isArray(pisos)) {
        pisosData = pisos;
        console.log('✅ [POINTS] Usando nuevo formato de pisos:', pisos.length);
        console.log('🔍 [POINTS] Primer piso:', pisosData[0]);
      } else {
        // Backward compatibility: convertir formato antiguo a pisos
        pisosData = [{
          numero: 1,
          nombre: 'Planta Baja',
          inventario: inventario || [],
          fotos: fotos || [],
          documentos: documentos || []
        }];
        console.log('🔄 [POINTS] Convertido formato antiguo a pisos');
      }

      const { rows } = await pool.query(
        `INSERT INTO points (nombre, categoria, compañia, coordenadas, pisos)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          nombre.trim(),
          categoria?.trim() || null,
          compañia || null,
          JSON.stringify(coordenadas),
          JSON.stringify(pisosData)
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
      const { nombre, categoria, compañia, coordenadas, pisos, inventario, fotos, documentos } = req.body;

      console.log(`📝 [POINTS] Actualizando punto: ${id}`);
      console.log('📦 [POINTS] Datos para actualizar:', { nombre, categoria, compañia, pisos_count: pisos?.length });

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      if (!nombre?.trim()) {
        return res.status(400).json({ 
          error: 'El nombre del punto es obligatorio' 
        });
      }

      // Si viene 'pisos', usar nuevo formato; si no, mantener formato antiguo
      let pisosData;
      if (pisos && Array.isArray(pisos)) {
        pisosData = pisos;
        console.log('✅ [POINTS] Actualizando con nuevo formato de pisos:', pisos.length);
      } else if (inventario || fotos || documentos) {
        // Backward compatibility: convertir formato antiguo a pisos
        pisosData = [{
          numero: 1,
          nombre: 'Planta Baja',
          inventario: inventario || [],
          fotos: fotos || [],
          documentos: documentos || []
        }];
        console.log('🔄 [POINTS] Convertido formato antiguo a pisos en actualización');
      }

      const { rows } = await pool.query(
        `UPDATE points 
         SET nombre = COALESCE($1, nombre),
             categoria = COALESCE($2, categoria),
             compañia = COALESCE($3, compañia),
             coordenadas = COALESCE($4, coordenadas),
             pisos = COALESCE($5, pisos),
             updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [
          nombre?.trim(),
          categoria?.trim() || null,
          compañia,
          coordenadas ? JSON.stringify(coordenadas) : null,
          pisosData ? JSON.stringify(pisosData) : null,
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
