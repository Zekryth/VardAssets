/**
 * /api/tiles/[tileX]/[tileY]/[zoom] - Endpoint para gestionar un tile específico
 * 
 * GET - Obtener información de un tile
 * DELETE - Eliminar imagen de un tile
 */

import { neon } from '@neondatabase/serverless'
import { getAuthUser } from '../../_lib/auth.js'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = neon(process.env.DATABASE_URL)
  const { tileX, tileY, zoom } = req.query
  const zoomLevel = parseInt(zoom) || 1

  try {
    // GET: Obtener tile específico
    if (req.method === 'GET') {
      const tile = await sql`
        SELECT * FROM map_tiles
        WHERE tile_x = ${parseInt(tileX)}
          AND tile_y = ${parseInt(tileY)}
          AND zoom_level = ${zoomLevel}
      `

      if (tile.length === 0) {
        return res.status(404).json({
          message: 'Tile no encontrado',
          tile_x: parseInt(tileX),
          tile_y: parseInt(tileY),
          zoom_level: zoomLevel
        })
      }

      return res.status(200).json(tile[0])
    }

    // DELETE: Eliminar imagen de tile
    if (req.method === 'DELETE') {
      const user = await getAuthUser(req, sql)
      if (!user) {
        return res.status(401).json({ message: 'No autorizado' })
      }

      const result = await sql`
        UPDATE map_tiles
        SET background_image_url = NULL,
            background_image_filename = NULL,
            updated_at = NOW()
        WHERE tile_x = ${parseInt(tileX)}
          AND tile_y = ${parseInt(tileY)}
          AND zoom_level = ${zoomLevel}
        RETURNING *
      `

      if (result.length === 0) {
        return res.status(404).json({ message: 'Tile no encontrado' })
      }

      console.log('✅ Imagen de tile eliminada:', tileX, tileY)

      return res.status(200).json({ 
        message: 'Imagen de tile eliminada',
        tile: result[0]
      })
    }

    return res.status(405).json({ message: 'Método no permitido' })

  } catch (error) {
    console.error('❌ Error en /api/tiles/[tileX]/[tileY]/[zoom]:', error)
    return res.status(500).json({ 
      message: 'Error del servidor', 
      error: error.message 
    })
  }
}
