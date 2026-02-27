import React, { useEffect, useRef, useState } from 'react'
import { getTileGrid, tileToCoordinates } from '../../utils/mapTileCalculator'
import api from '../../services/api'

/**
 * MapTileLayer Component
 * 
 * Renderiza los tiles del mapa con sus imágenes de fondo desde la base de datos.
 * Se actualiza automáticamente cuando cambia el viewport o el zoom.
 */
export default function MapTileLayer({ zoomLevel = 1, viewport, refreshTrigger }) {
  const [tiles, setTiles] = useState([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef(null)

  useEffect(() => {
    fetchTiles()
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [zoomLevel, refreshTrigger])

  const fetchTiles = async () => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)

    try {
      const { tilesX, tilesY } = getTileGrid(zoomLevel)
      
      // Fetch tiles del backend
      const response = await api.get(`/tiles?minX=0&maxX=${tilesX - 1}&minY=0&maxY=${tilesY - 1}&zoom=${zoomLevel}`, {
        signal: controller.signal
      })
      
      const tilesData = Array.isArray(response.data) ? response.data : response.data.tiles || []
      
      if (import.meta.env.DEV) {
        console.log('📍 Tiles cargados:', tilesData.length)
      }
      setTiles(tilesData)

    } catch (error) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return
      console.error('❌ Error loading tiles:', error)
      setTiles([])
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  if (!viewport) return null

  return (
    <>
      {/* Tiles con imágenes de fondo */}
      {tiles.map(tile => {
        // Solo renderizar tiles que tienen imagen
        if (!tile.background_image_url) return null
        
        const coords = tileToCoordinates(tile.tile_x, tile.tile_y, tile.zoom_level || zoomLevel)
        
        return (
          <div
            key={`tile-layer-${tile.tile_x}-${tile.tile_y}-${tile.zoom_level}`}
            className="absolute tile-bg"
            style={{
              left: coords.x,
              top: coords.y,
              width: coords.width,
              height: coords.height,
              backgroundImage: `url(${tile.background_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.9
            }}
          >
            {/* Debug info en modo desarrollo */}
            {import.meta.env.DEV && (
              <div 
                className="absolute top-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded"
                style={{
                  fontSize: '10px',
                  pointerEvents: 'none',
                  fontFamily: 'monospace'
                }}
              >
                {tile.tile_x},{tile.tile_y}
              </div>
            )}
          </div>
        )
      })}

      {/* Loading indicator */}
      {loading && (
        <div className="fixed bottom-20 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50">
          🔄 Loading tiles...
        </div>
      )}
    </>
  )
}
