import { uploadToR2, deleteFromR2ByUrl, listFilesInR2 } from './_lib/r2.js';
import { handleCors } from './_lib/cors.js';
import { getPool } from './_lib/db.js';
import { authenticateToken } from './_lib/auth.js';
import { initializeDatabase } from './_lib/init.js';
import busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

export default async function handler(req, res) {
  console.log('📥 [UPLOAD] Request:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  await initializeDatabase();
  const pool = getPool();

  try {
    // ========================================
    // POST - Subir archivo
    // ========================================
    if (req.method === 'POST') {
      console.log('📝 [UPLOAD] === INICIO SUBIDA ===');

      // Parsear FormData
      const formData = await parseFormData(req);
      
      const file = formData.file;
      const type = formData.type || 'general'; // 'fotos', 'documentos', 'videos', 'tiles'
      const pointId = formData.pointId || 'unknown';
      const tileX = formData.tileX ? parseInt(formData.tileX) : null;
      const tileY = formData.tileY ? parseInt(formData.tileY) : null;
      const zoomLevel = formData.zoomLevel ? parseInt(formData.zoomLevel) : 1;

      if (!file) {
        console.warn('⚠️ [UPLOAD] No se recibió archivo');
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }

      console.log('📄 [UPLOAD] Archivo recibido:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        category: type,
        pointId
      });

      // Validar tamaño (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        console.warn('⚠️ [UPLOAD] Archivo muy grande:', file.size);
        return res.status(400).json({ 
          error: 'El archivo es demasiado grande. Máximo 50 MB' 
        });
      }

      // Validar tipo de archivo
      const allowedTypes = {
        fotos: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        documentos: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'
        ],
        videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
      };

      const validTypes = allowedTypes[type] || [...allowedTypes.fotos, ...allowedTypes.documentos, ...allowedTypes.videos];

      if (!validTypes.includes(file.type)) {
        console.warn('⚠️ [UPLOAD] Tipo de archivo no permitido:', file.type);
        return res.status(400).json({ 
          error: `Tipo de archivo no permitido: ${file.type}`,
          allowedTypes: validTypes
        });
      }

      // Generar nombre único
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 50);
      
      // Si es un tile, usar path específico
      const filename = tileX !== null && tileY !== null
        ? `vard-assets/map-tiles/${tileX}-${tileY}-z${zoomLevel}-${timestamp}.${extension}`
        : `vard-assets/${type}/${pointId}/${timestamp}-${randomString}-${sanitizedName}`;

      console.log('💾 [UPLOAD] Uploading to Cloudflare R2:', filename);

      // Upload to Cloudflare R2
      const result = await uploadToR2(filename, file.buffer, file.type);

      console.log('✅ [UPLOAD] File uploaded successfully:', {
        url: result.url,
        key: result.key,
        size: file.size
      });

      // Create blob-compatible response for backward compatibility
      const blob = {
        url: result.url,
        pathname: result.key,
        size: file.size,
        downloadUrl: result.url
      };

      // Si es un tile, guardar en base de datos
      if (tileX !== null && tileY !== null) {
        console.log('💾 [UPLOAD] Guardando tile en BD:', { tileX, tileY, zoomLevel });
        
        try {
          const user = authenticateToken(req);
          const userId = user?.id || 1; // Default a admin si no hay auth

          await pool.query(
            `INSERT INTO map_tiles 
              (tile_x, tile_y, zoom_level, width, height, background_image_url, background_image_filename, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (tile_x, tile_y, zoom_level)
             DO UPDATE SET
               background_image_url = EXCLUDED.background_image_url,
               background_image_filename = EXCLUDED.background_image_filename,
               uploaded_by = EXCLUDED.uploaded_by,
               updated_at = NOW()
             RETURNING *`,
            [tileX, tileY, zoomLevel, 512, 512, blob.url, file.name, userId]
          );

          console.log('✅ [UPLOAD] Tile guardado en BD exitosamente');
        } catch (dbError) {
          console.error('❌ [UPLOAD] Error guardando tile en BD:', dbError);
          // No fallar la respuesta, el archivo ya está en Blob
        }
      }

      return res.status(201).json({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        downloadUrl: blob.downloadUrl,
        contentType: file.type,
        filename: sanitizedName
      });
    }

    // ========================================
    // GET - Listar archivos de un punto
    // ========================================
    if (req.method === 'GET') {
      const { pointId, type } = req.query;

      if (!pointId) {
        return res.status(400).json({ error: 'pointId es requerido' });
      }

      console.log(`🔍 [UPLOAD] Listando archivos: pointId=${pointId}, type=${type || 'all'}`);

      const prefix = type 
        ? `vard-assets/${type}/${pointId}/`
        : `vard-assets/${pointId}/`;

      const files = await listFilesInR2(prefix);

      console.log(`✅ [UPLOAD] Files found: ${files.length}`);

      return res.status(200).json({
        files: files.map(file => ({
          url: file.url,
          pathname: file.key,
          size: file.size,
          uploadedAt: file.lastModified,
          downloadUrl: file.url
        })),
        total: files.length
      });
    }

    // ========================================
    // DELETE - Eliminar archivo
    // ========================================
    if (req.method === 'DELETE') {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'URL del archivo es requerida' });
      }

      console.log('🗑️ [UPLOAD] Deleting file:', url);

      await deleteFromR2ByUrl(url);

      console.log('✅ [UPLOAD] File deleted successfully');

      return res.status(200).json({ 
        message: 'Archivo eliminado exitosamente',
        url 
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('💥 [UPLOAD] Error:', error);
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Error al procesar el archivo',
      details: error.message 
    });
  }
}

// ========================================
// Helper: Parsear FormData en Serverless
// ========================================
async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    
    const fields = {};
    const files = {};

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];

      file.on('data', (data) => chunks.push(data));
      
      file.on('end', () => {
        files[name] = {
          name: filename,
          type: mimeType,
          encoding,
          buffer: Buffer.concat(chunks),
          size: Buffer.concat(chunks).length
        };
      });
    });

    bb.on('field', (name, value) => {
      fields[name] = value;
    });

    bb.on('finish', () => {
      resolve({ ...fields, file: files.file });
    });

    bb.on('error', reject);

    req.pipe(bb);
  });
}
