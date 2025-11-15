import { put, list, del } from '@vercel/blob';
import { handleCors } from './_lib/cors.js';
import busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

export default async function handler(req, res) {
  console.log('📥 [UPLOAD] Request:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  try {
    // ========================================
    // POST - Subir archivo
    // ========================================
    if (req.method === 'POST') {
      console.log('📝 [UPLOAD] === INICIO SUBIDA ===');

      // Parsear FormData
      const formData = await parseFormData(req);
      
      const file = formData.file;
      const type = formData.type || 'general'; // 'fotos', 'documentos', 'videos'
      const pointId = formData.pointId || 'unknown';

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
      
      const filename = `vard-assets/${type}/${pointId}/${timestamp}-${randomString}-${sanitizedName}`;

      console.log('💾 [UPLOAD] Subiendo a Vercel Blob:', filename);

      // Subir a Vercel Blob
      const blob = await put(filename, file.buffer, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false,
      });

      console.log('✅ [UPLOAD] Archivo subido exitosamente:', {
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        downloadUrl: blob.downloadUrl
      });

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

      const { blobs } = await list({ prefix });

      console.log(`✅ [UPLOAD] Archivos encontrados: ${blobs.length}`);

      return res.status(200).json({
        files: blobs.map(blob => ({
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          downloadUrl: blob.downloadUrl
        })),
        total: blobs.length
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

      console.log('🗑️ [UPLOAD] Eliminando archivo:', url);

      await del(url);

      console.log('✅ [UPLOAD] Archivo eliminado exitosamente');

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
