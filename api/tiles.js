/**
 * /api/tiles - API endpoints para gestionar tiles del mapa
 * 
 * Endpoints:
 * - GET /api/tiles/:tileX/:tileY/:zoom - Obtener tile específico
 * - POST /api/tiles/:tileX/:tileY/:zoom - Crear/actualizar tile con imagen
 * - GET /api/tiles?minX&maxX&minY&maxY&zoom - Obtener tiles en área
 */

import { query } from './_lib/db.js'
import { authenticateToken } from './_lib/auth.js'
import { handleError } from './_lib/errors.js'
import { initCors } from './_lib/cors.js'
import { put } from '@vercel/blob'
import busboy from 'busboy'

export const config = {
  api: {
    bodyParser: false // Deshabilitar para manejar multipart/form-data con busboy
  }
}

export default async function handler(req, res) {
  // CORS
  initCors(req, res)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Extraer parámetros de ruta
    const urlParts = req.url.split('?')[0].split('/').filter(Boolean)
    
    // GET /api/tiles/:tileX/:tileY/:zoom - Obtener tile específico
    if (req.method === 'GET' && urlParts.length === 4) {
      const tileX = parseInt(urlParts[1])
      const tileY = parseInt(urlParts[2])
      const zoom = parseInt(urlParts[3])

      if (isNaN(tileX) || isNaN(tileY) || isNaN(zoom)) {
        return res.status(400).json({ error: 'Invalid tile coordinates' })
      }

      const result = await query(
        `SELECT * FROM map_tiles 
         WHERE tile_x = $1 AND tile_y = $2 AND zoom_level = $3`,
        [tileX, tileY, zoom]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Tile not found',
          tile_x: tileX,
          tile_y: tileY,
          zoom_level: zoom
        })
      }

      return res.status(200).json(result.rows[0])
    }

    // GET /api/tiles?minX=0&maxX=5&minY=0&maxY=5&zoom=1 - Obtener área de tiles
    if (req.method === 'GET' && urlParts.length === 2) {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const minX = parseInt(url.searchParams.get('minX') || '0')
      const maxX = parseInt(url.searchParams.get('maxX') || '10')
      const minY = parseInt(url.searchParams.get('minY') || '0')
      const maxY = parseInt(url.searchParams.get('maxY') || '10')
      const zoom = parseInt(url.searchParams.get('zoom') || '1')

      const result = await query(
        `SELECT * FROM map_tiles 
         WHERE tile_x >= $1 AND tile_x <= $2 
           AND tile_y >= $3 AND tile_y <= $4 
           AND zoom_level = $5
         ORDER BY tile_y, tile_x`,
        [minX, maxX, minY, maxY, zoom]
      )

      return res.status(200).json({
        tiles: result.rows,
        count: result.rows.length,
        query: { minX, maxX, minY, maxY, zoom }
      })
    }

    // POST /api/tiles/:tileX/:tileY/:zoom - Crear/actualizar tile
    if (req.method === 'POST' && urlParts.length === 4) {
      // Autenticar
      const user = await authenticateToken(req)
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const tileX = parseInt(urlParts[1])
      const tileY = parseInt(urlParts[2])
      const zoom = parseInt(urlParts[3])

      if (isNaN(tileX) || isNaN(tileY) || isNaN(zoom)) {
        return res.status(400).json({ error: 'Invalid tile coordinates' })
      }

      // Parse multipart/form-data con busboy
      const formData = await parseFormData(req)
      
      const file = formData.file
      const width = parseInt(formData.width || '512')
      const height = parseInt(formData.height || '512')

      // Subir imagen a Vercel Blob si existe
      let imageUrl = null
      let imageFilename = null

      if (file) {
        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        const filename = `vard-assets/map-tiles/${tileX}-${tileY}-z${zoom}-${timestamp}.${extension}`

        console.log('📤 Uploading tile to Vercel Blob:', filename)

        const blob = await put(filename, file.buffer, {
          access: 'public',
          contentType: file.type
        })

        imageUrl = blob.url
        imageFilename = file.name

        console.log('✅ Tile uploaded:', blob.url)
      }

      // Insertar o actualizar
      const result = await query(
        `INSERT INTO map_tiles 
          (tile_x, tile_y, zoom_level, width, height, background_image_url, background_image_filename, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (tile_x, tile_y, zoom_level) 
         DO UPDATE SET
           width = EXCLUDED.width,
           height = EXCLUDED.height,
           background_image_url = COALESCE(EXCLUDED.background_image_url, map_tiles.background_image_url),
           background_image_filename = COALESCE(EXCLUDED.background_image_filename, map_tiles.background_image_filename),
           uploaded_by = EXCLUDED.uploaded_by,
           updated_at = NOW()
         RETURNING *`,
        [tileX, tileY, zoom, width, height, imageUrl, imageFilename, user.id]
      )

      return res.status(200).json({
        message: 'Tile created/updated successfully',
        tile: result.rows[0]
      })
    }

    // Método no permitido
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['GET', 'POST']
    })

  } catch (error) {
    console.error('Error in /api/tiles:', error)
    return handleError(res, error)
  }
}

/**
 * Helper: Parsear FormData con busboy
 */
async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers })
    
    const fields = {}
    const files = {}

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info
      const chunks = []

      file.on('data', (data) => chunks.push(data))
      
      file.on('end', () => {
        files[name] = {
          name: filename,
          type: mimeType,
          encoding,
          buffer: Buffer.concat(chunks),
          size: Buffer.concat(chunks).length
        }
      })
    })

    bb.on('field', (name, value) => {
      fields[name] = value
    })

    bb.on('finish', () => {
      resolve({ ...fields, file: files.file || files.image })
    })

    bb.on('error', reject)

    req.pipe(bb)
  })
}
