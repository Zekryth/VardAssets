/**
 * /api/tiles/[tileX]/[tileY]/[zoom] - Endpoint para gestionar un tile específico
 * 
 * GET - Obtener información de un tile
 * DELETE - Eliminar imagen de un tile
 */

import { getPool } from '../../../_lib/db.js'
import { authenticateToken } from '../../../_lib/auth.js'
import { handleCors } from '../../../_lib/cors.js'
import { handleError } from '../../../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const pool = getPool()
  const { tileX, tileY, zoom } = req.query
  const zoomLevel = parseInt(zoom) || 1

  try {
    // GET: Obtener tile específico
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM map_tiles WHERE tile_x = $1 AND tile_y = $2 AND zoom_level = $3',
        [parseInt(tileX), parseInt(tileY), zoomLevel]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Tile no encontrado',
          tile_x: parseInt(tileX),
          tile_y: parseInt(tileY),
          zoom_level: zoomLevel
        })
      }

      console.log('✅ Tile found:', result.rows[0])
      return res.status(200).json(result.rows[0])
    }

    // DELETE: Eliminar imagen de tile
    if (req.method === 'DELETE') {
      const user = authenticateToken(req)
      if (!user) {
        return res.status(401).json({ message: 'No autorizado' })
      }

      const result = await pool.query(
        `UPDATE map_tiles
         SET background_image_url = NULL,
             background_image_filename = NULL,
             updated_at = NOW()
         WHERE tile_x = $1 AND tile_y = $2 AND zoom_level = $3
         RETURNING *`,
        [parseInt(tileX), parseInt(tileY), zoomLevel]
      )

      console.log('✅ Tile image deleted:', result.rows[0])
      return res.status(200).json({ 
        message: 'Imagen de tile eliminada',
        tile: result.rows[0]
      })
    }

    return res.status(405).json({ message: 'Método no permitido' })

  } catch (error) {
    return handleError(res, error)
  }
}
