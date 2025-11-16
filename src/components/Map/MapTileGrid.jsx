import React from 'react'
import { MAP_CONFIG, getTileGrid, tileToCoordinates } from '../../utils/mapTileCalculator'

/**
 * MapTileGrid Component
 * 
 * Muestra un grid visual de tiles sobre el mapa con bordes para identificarlos.
 * Permite hacer clic en cada tile para gestionar su imagen.
 */
export default function MapTileGrid({ zoomLevel = 1, onTileClick }) {
  const { tilesX, tilesY } = getTileGrid(zoomLevel)
  
  const tiles = []
  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      tiles.push({ x, y })
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {tiles.map(tile => {
        const coords = tileToCoordinates(tile.x, tile.y, zoomLevel)
        
        return (
          <div
            key={`tile-grid-${tile.x}-${tile.y}`}
            className="absolute border border-blue-300 dark:border-blue-500 pointer-events-auto cursor-pointer hover:bg-blue-100 hover:bg-opacity-30 dark:hover:bg-blue-900 dark:hover:bg-opacity-30 transition-colors group"
            style={{
              left: coords.x,
              top: coords.y,
              width: coords.width,
              height: coords.height
            }}
            onClick={() => onTileClick?.(tile.x, tile.y)}
            title={`Tile (${tile.x}, ${tile.y}) - Click para gestionar imagen`}
          >
            {/* Label del tile (visible en hover) */}
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ({tile.x}, {tile.y})
            </div>
          </div>
        )
      })}
    </div>
  )
}
