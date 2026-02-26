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

    const normalizeDate = (value) => {
      if (!value) return null;
      const text = String(value).trim();
      if (!text) return null;
      const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : null;
    };

    // GET /api/points - Listar puntos
    if (req.method === 'GET') {
      const { id } = req.query;

      if (id) {
        // GET /api/points/:id - Obtener un punto específico
        const { rows } = await pool.query(
          `SELECT p.*, 
                  COALESCE(p.pisos_adicionales, '[]'::jsonb) as pisos,
                  cp.nombre as compania_propietaria_nombre,
                  ca.nombre as compania_alojada_nombre,
                  COALESCE(cp.nombre, legacy.nombre) as company_name
           FROM points p
           LEFT JOIN companies cp ON p.compania_propietaria = cp.id
           LEFT JOIN companies ca ON p.compania_alojada = ca.id
           LEFT JOIN companies legacy ON p.compañia = legacy.id
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
            compañia: pointData.compania_propietaria || pointData.compañia || null,
            compania_propietaria: pointData.compania_propietaria || pointData.compañia || null,
            compania_alojada: pointData.compania_alojada || null,
            compania_alojada_fecha: normalizeDate(pointData.compania_alojada_fecha),
            compania_propietaria_nombre: pointData.compania_propietaria_nombre || pointData.company_name || null,
            compania_alojada_nombre: pointData.compania_alojada_nombre || null,
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
            compañia: piso.compañia || piso.compania_propietaria || pointData.compania_propietaria || pointData.compañia || null,
            compania_propietaria: piso.compania_propietaria || piso.compañia || pointData.compania_propietaria || pointData.compañia || null,
            compania_alojada: piso.compania_alojada || pointData.compania_alojada || null,
            compania_alojada_fecha: normalizeDate(piso.compania_alojada_fecha || pointData.compania_alojada_fecha),
            compania_propietaria_nombre: piso.compania_propietaria_nombre || pointData.compania_propietaria_nombre || pointData.company_name || null,
            compania_alojada_nombre: piso.compania_alojada_nombre || pointData.compania_alojada_nombre || null
          };
        });

        console.log('🏢 [GET POINT] Total pisos en respuesta:', pointData.pisos.length);
        console.log('🔍 [GET POINT] ¿Debería mostrar navegación?', pointData.pisos.length > 1);

        return res.status(200).json(pointData);
      }

      // GET /api/points - Obtener todos los puntos
      const { rows } = await pool.query(
        `SELECT p.*, 
                COALESCE(p.pisos_adicionales, '[]'::jsonb) as pisos,
             cp.nombre as compania_propietaria_nombre,
             ca.nombre as compania_alojada_nombre,
             COALESCE(cp.nombre, legacy.nombre) as company_name,
                jsonb_array_length(COALESCE(p.inventario, '[]'::jsonb)) as items_count
         FROM points p
        LEFT JOIN companies cp ON p.compania_propietaria = cp.id
        LEFT JOIN companies ca ON p.compania_alojada = ca.id
        LEFT JOIN companies legacy ON p.compañia = legacy.id
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
            compañia: pointData.compania_propietaria || pointData.compañia || null,
            compania_propietaria: pointData.compania_propietaria || pointData.compañia || null,
            compania_alojada: pointData.compania_alojada || null,
            compania_alojada_fecha: normalizeDate(pointData.compania_alojada_fecha),
            compania_propietaria_nombre: pointData.compania_propietaria_nombre || pointData.company_name || null,
            compania_alojada_nombre: pointData.compania_alojada_nombre || null,
            inventario,
            fotos,
            documentos
          }];
        }

        pointData.pisos = pointData.pisos.map((piso) => ({
          ...piso,
          compania_propietaria: piso.compania_propietaria || piso.compañia || pointData.compania_propietaria || pointData.compañia || null,
          compania_alojada: piso.compania_alojada || pointData.compania_alojada || null,
          compania_alojada_fecha: normalizeDate(piso.compania_alojada_fecha || pointData.compania_alojada_fecha),
          compania_propietaria_nombre: piso.compania_propietaria_nombre || pointData.compania_propietaria_nombre || pointData.company_name || null,
          compania_alojada_nombre: piso.compania_alojada_nombre || pointData.compania_alojada_nombre || null
        }));

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
      const { 
        nombre, 
        categoria, 
        companiaPropietaria,
        companiaAlojada,
        companiaAlojadaFecha,
        nrInventarioSAP,
        mijlocFix,
        coordenadas, 
        pisosAdicionales,
        inventario,
        fotos,
        documentos,
        // Backward compatibility
        compañia,
        pisos
      } = req.body;
      
      console.log('📝 [POINTS] === INICIO CREACIÓN ===');
      console.log('📦 [POINTS] Datos recibidos:', {
        nombre,
        categoria,
        companiaPropietaria,
        companiaAlojada,
        companiaAlojadaFecha,
        nrInventarioSAP,
        mijlocFix,
        coordenadas,
        pisosAdicionales_count: Array.isArray(pisosAdicionales) ? pisosAdicionales.length : 0,
        inventario_count: Array.isArray(inventario) ? inventario.length : 0,
        fotos_count: Array.isArray(fotos) ? fotos.length : 0,
        documentos_count: Array.isArray(documentos) ? documentos.length : 0
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

      console.log('✅ [POINTS] Columna "compañia" verificada');

      // Si hay compañía, verificar que existe
      const ownerCompanyId = companiaPropietaria || compañia || null;
      const hostedCompanyId = companiaAlojada || null;
      const companyIdsToValidate = [ownerCompanyId, hostedCompanyId].filter(Boolean);

      if (companyIdsToValidate.length > 0) {
        const { rows: companyCheck } = await pool.query(
          `SELECT id, nombre FROM companies WHERE id = ANY($1::uuid[])`,
          [companyIdsToValidate]
        );
        const validIds = new Set(companyCheck.map((row) => row.id));
        const missing = companyIdsToValidate.find((id) => !validIds.has(id));
        if (missing) {
          console.warn(`⚠️ [POINTS] Compañía no encontrada: ${missing}`);
          return res.status(400).json({ error: 'La compañía seleccionada no existe' });
        }
      }

      console.log('💾 [POINTS] Insertando en base de datos...');
      console.log('📦 [POINTS] Payload recibido:', { nombre, categoria, compañia, coordenadas, pisos_count: pisos?.length });

      // Si viene 'pisos', usar nuevo formato; si no, crear piso único con datos antiguos
      console.log('💾 [POINTS] Insertando en base de datos...');
      console.log('📊 [POINTS] Datos finales:', {
        nombre: nombre.trim(),
        categoria: categoria?.trim() || null,
        compania_propietaria: companiaPropietaria || compañia || null,
        compania_alojada: companiaAlojada || null,
        compania_alojada_fecha: normalizeDate(companiaAlojadaFecha),
        nr_inventario_sap: nrInventarioSAP?.trim() || null,
        mijloc_fix: mijlocFix || false,
        pisosAdicionales_count: Array.isArray(pisosAdicionales) ? pisosAdicionales.length : (Array.isArray(pisos) ? pisos.length : 0),
        inventario_count: Array.isArray(inventario) ? inventario.length : 0
      });

      // Determinar pisos_adicionales (nueva estructura) o pisos (backward compatibility)
      const pisosAdicionalesDataRaw = Array.isArray(pisosAdicionales) ? pisosAdicionales : (Array.isArray(pisos) ? pisos : []);
      const pisosAdicionalesData = pisosAdicionalesDataRaw.map((piso) => ({
        ...piso,
        compania_alojada_fecha: normalizeDate(piso?.compania_alojada_fecha)
      }));

      const { rows } = await pool.query(
        `INSERT INTO points (
          nombre, 
          categoria, 
          compania_propietaria, 
          compania_alojada, 
          compania_alojada_fecha,
          nr_inventario_sap,
          mijloc_fix,
          coordenadas, 
          inventario,
          fotos,
          documentos,
          pisos_adicionales
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          nombre.trim(),
          categoria?.trim() || null,
          companiaPropietaria || compañia || null,  // Backward compatibility
          companiaAlojada || null,
          normalizeDate(companiaAlojadaFecha),
          nrInventarioSAP?.trim() || null,
          mijlocFix || false,
          JSON.stringify(coordenadas),
          JSON.stringify(inventario || []),
          JSON.stringify(fotos || []),
          JSON.stringify(documentos || []),
          JSON.stringify(pisosAdicionalesData)
        ]
      );

      const newPoint = rows[0];
      console.log('✅ [POINTS] Punto creado exitosamente:', {
        id: newPoint.id,
        nombre: newPoint.nombre,
        compania_propietaria: newPoint.compania_propietaria,
        compania_alojada: newPoint.compania_alojada,
        compania_alojada_fecha: newPoint.compania_alojada_fecha,
        mijloc_fix: newPoint.mijloc_fix,
        pisos_adicionales_count: Array.isArray(newPoint.pisos_adicionales) ? newPoint.pisos_adicionales.length : 0
      });

      // Obtener punto con datos de compañías
      const { rows: fullPoint } = await pool.query(`
        SELECT 
          p.*,
          cp.nombre as compania_propietaria_nombre,
          ca.nombre as compania_alojada_nombre
        FROM points p
        LEFT JOIN companies cp ON p.compania_propietaria = cp.id
        LEFT JOIN companies ca ON p.compania_alojada = ca.id
        WHERE p.id = $1
      `, [newPoint.id]);

      return res.status(201).json(fullPoint[0]);
    }

    // PUT /api/points?id=xxx - Actualizar punto
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { 
        nombre, 
        categoria, 
        companiaPropietaria,
        companiaAlojada,
        companiaAlojadaFecha,
        nrInventarioSAP,
        mijlocFix,
        coordenadas, 
        pisosAdicionales,
        inventario,
        fotos,
        documentos,
        // Backward compatibility
        compañia,
        pisos
      } = req.body;

      console.log(`📝 [POINTS] Actualizando punto: ${id}`);
      console.log('📦 [POINTS] Datos para actualizar:', { 
        nombre, 
        categoria, 
        companiaPropietaria,
        companiaAlojada,
        companiaAlojadaFecha,
        mijlocFix,
        pisosAdicionales_count: Array.isArray(pisosAdicionales) ? pisosAdicionales.length : (Array.isArray(pisos) ? pisos.length : undefined)
      });

      if (!id) {
        return res.status(400).json({ error: 'ID de punto requerido' });
      }

      if (nombre !== undefined && !nombre?.trim()) {
        return res.status(400).json({ 
          error: 'El nombre del punto es obligatorio' 
        });
      }

      // Determinar pisos_adicionales
      const pisosAdicionalesDataRaw = Array.isArray(pisosAdicionales) ? pisosAdicionales : (Array.isArray(pisos) ? pisos : null);
      const pisosAdicionalesData = Array.isArray(pisosAdicionalesDataRaw)
        ? pisosAdicionalesDataRaw.map((piso) => ({
            ...piso,
            compania_alojada_fecha: normalizeDate(piso?.compania_alojada_fecha)
          }))
        : null;

      const { rows } = await pool.query(
        `UPDATE points 
         SET nombre = COALESCE($1, nombre),
             categoria = COALESCE($2, categoria),
             compania_propietaria = COALESCE($3, compania_propietaria),
             compania_alojada = COALESCE($4, compania_alojada),
             compania_alojada_fecha = COALESCE($5, compania_alojada_fecha),
             nr_inventario_sap = COALESCE($6, nr_inventario_sap),
             mijloc_fix = COALESCE($7, mijloc_fix),
             coordenadas = COALESCE($8, coordenadas),
             inventario = COALESCE($9, inventario),
             fotos = COALESCE($10, fotos),
             documentos = COALESCE($11, documentos),
             pisos_adicionales = COALESCE($12, pisos_adicionales),
             updated_at = NOW()
         WHERE id = $13
         RETURNING *`,
        [
          nombre?.trim() || null,
          categoria?.trim() || null,
          companiaPropietaria || compañia || null,  // Backward compatibility
          companiaAlojada || null,
          normalizeDate(companiaAlojadaFecha),
          nrInventarioSAP?.trim() || null,
          mijlocFix !== undefined ? mijlocFix : null,
          coordenadas ? JSON.stringify(coordenadas) : null,
          inventario ? JSON.stringify(inventario) : null,
          fotos ? JSON.stringify(fotos) : null,
          documentos ? JSON.stringify(documentos) : null,
          pisosAdicionalesData ? JSON.stringify(pisosAdicionalesData) : null,
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
          cp.nombre as compania_propietaria_nombre,
          ca.nombre as compania_alojada_nombre,
          COALESCE(cp.nombre, legacy.nombre) as company_name
        FROM points p
        LEFT JOIN companies cp ON p.compania_propietaria = cp.id
        LEFT JOIN companies ca ON p.compania_alojada = ca.id
        LEFT JOIN companies legacy ON p.compañia = legacy.id
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
