import { getPool } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const pool = getPool()

  try {
    // Verificar tabla
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'map_tiles'
      );
    `)

    // Contar tiles
    let tilesCount = 0
    let tiles = []
    
    if (tableCheck.rows[0].exists) {
      const countResult = await pool.query('SELECT COUNT(*) FROM map_tiles')
      tilesCount = parseInt(countResult.rows[0].count)
      
      const tilesResult = await pool.query('SELECT * FROM map_tiles ORDER BY tile_x, tile_y LIMIT 10')
      tiles = tilesResult.rows
    }

    // Verificar token
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN

    // Estructura de tabla
    let columns = []
    if (tableCheck.rows[0].exists) {
      const columnsResult = await pool.query(
        `SELECT column_name, data_type 
         FROM information_schema.columns 
         WHERE table_name = 'map_tiles'
         ORDER BY ordinal_position`
      )
      columns = columnsResult.rows
    }

    return res.status(200).json({
      database: {
        tableExists: tableCheck.rows[0].exists,
        tilesCount: tilesCount,
        columns: columns,
        sampleTiles: tiles
      },
      environment: {
        hasBlobToken: hasBlobToken,
        blobTokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Debug error:', error)
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    })
  }
}
