import React, { useEffect, useState } from 'react'
import { getVisibleTiles, tileToCoordinates } from '../../utils/mapTileCalculator'

/**
 * MapTileLayer Component
 * 
 * Renderiza los tiles del mapa con sus imágenes de fondo
 * Se actualiza automáticamente cuando cambia el viewport o el zoom
 */
export default function MapTileLayer({ zoomLevel = 1, viewport }) {
  const [tiles, setTiles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!viewport) return

    // Calcular tiles visibles
    const visibleTiles = getVisibleTiles(viewport, zoomLevel)
    
    if (visibleTiles.length === 0) {
      setTiles([])
      return
    }

    // Fetch tiles
    fetchTiles(visibleTiles)
  }, [viewport, zoomLevel])

  const fetchTiles = async (visibleTiles) => {
    setLoading(true)

    try {
      // Calcular rango de tiles
      const tileXs = visibleTiles.map(t => t.tile_x)
      const tileYs = visibleTiles.map(t => t.tile_y)
      
      const minX = Math.min(...tileXs)
      const maxX = Math.max(...tileXs)
      const minY = Math.min(...tileYs)
      const maxY = Math.max(...tileYs)

      // Fetch del backend
      const params = new URLSearchParams({
        minX: minX.toString(),
        maxX: maxX.toString(),
        minY: minY.toString(),
        maxY: maxY.toString(),
        zoom: zoomLevel.toString()
      })

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/tiles?${params.toString()}`
      )

      if (!response.ok) {
        console.error('Error fetching tiles:', response.statusText)
        setTiles([])
        return
      }

      const data = await response.json()
      
      // Mapear tiles con coordenadas calculadas
      const tilesWithCoords = data.tiles.map(tile => ({
        ...tile,
        coords: tileToCoordinates(tile.tile_x, tile.tile_y, tile.zoom_level)
      }))

      setTiles(tilesWithCoords)

    } catch (error) {
      console.error('Error loading tiles:', error)
      setTiles([])
    } finally {
      setLoading(false)
    }
  }

  if (!viewport) return null

  return (
    <>
      {tiles.map(tile => (
        <div
          key={`tile-${tile.tile_x}-${tile.tile_y}-${tile.zoom_level}`}
          style={{
            position: 'absolute',
            left: tile.coords.x,
            top: tile.coords.y,
            width: tile.coords.width,
            height: tile.coords.height,
            backgroundImage: tile.background_image_url 
              ? `url(${tile.background_image_url})` 
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: import.meta.env.DEV ? '1px dashed rgba(255,255,255,0.2)' : undefined,
            pointerEvents: 'none',
            zIndex: 0
          }}
          className="tile-bg"
        >
          {/* Debug info en modo desarrollo */}
          {import.meta.env.DEV && (
            <div 
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                textShadow: '0 0 2px rgba(0,0,0,0.8)',
                pointerEvents: 'none',
                fontFamily: 'monospace'
              }}
            >
              {tile.tile_x},{tile.tile_y}
            </div>
          )}
        </div>
      ))}

      {/* Indicador de carga */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '6px',
            fontSize: '12px',
            zIndex: 1000
          }}
        >
          Cargando tiles...
        </div>
      )}
    </>
  )
}
