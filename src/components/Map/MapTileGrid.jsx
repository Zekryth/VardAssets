import React from 'react'
import { MAP_CONFIG, getTileGrid, tileToCoordinates } from '../../utils/mapTileCalculator'

/**
 * MapTileGrid Component
 * 
 * Muestra un grid visual de tiles sobre el mapa con bordes para identificarlos.
 * Permite hacer clic en cada tile para gestionar su imagen.
 */
export default function MapTileGrid({
  zoomLevel = 1,
  onTileClick,
  tilesX: tilesXProp,
  tilesY: tilesYProp,
  offsetX = 0,
  offsetY = 0,
  centeredOrigin = false
}) {
  const grid = getTileGrid(zoomLevel)
  const tilesX = Number.isFinite(tilesXProp) ? tilesXProp : grid.tilesX
  const tilesY = Number.isFinite(tilesYProp) ? tilesYProp : grid.tilesY

  const centerX = Math.floor(tilesX / 2)
  const centerY = Math.floor(tilesY / 2)
  
  const tiles = []
  for (let row = 0; row < tilesY; row++) {
    for (let col = 0; col < tilesX; col++) {
      const absoluteX = offsetX + col
      const absoluteY = offsetY + row
      const displayX = centeredOrigin ? (col - centerX) : absoluteX
      const displayY = centeredOrigin ? (row - centerY) : absoluteY
      tiles.push({ col, row, absoluteX, absoluteY, displayX, displayY })
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {tiles.map(tile => {
        const coords = tileToCoordinates(tile.col, tile.row, zoomLevel)
        
        return (
          <div
            key={`tile-grid-${tile.absoluteX}-${tile.absoluteY}`}
            className="absolute border border-blue-300 dark:border-blue-500 pointer-events-auto cursor-pointer hover:bg-blue-100 hover:bg-opacity-30 dark:hover:bg-blue-900 dark:hover:bg-opacity-30 transition-colors group"
            style={{
              left: coords.x,
              top: coords.y,
              width: coords.width,
              height: coords.height
            }}
            onClick={() => onTileClick?.(tile.absoluteX, tile.absoluteY)}
            title={`Tile (${tile.displayX}, ${tile.displayY}) - Click para gestionar imagen`}
          >
            {/* Label del tile (visible en hover) */}
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ({tile.displayX}, {tile.displayY})
            </div>
          </div>
        )
      })}

      {centeredOrigin && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: centerX * MAP_CONFIG.TILE_SIZE * zoomLevel,
            top: centerY * MAP_CONFIG.TILE_SIZE * zoomLevel,
            width: MAP_CONFIG.TILE_SIZE * zoomLevel,
            height: MAP_CONFIG.TILE_SIZE * zoomLevel,
            border: '2px solid rgba(34, 197, 94, 0.8)'
          }}
          title="Origen (0,0)"
        />
      )}
    </div>
  )
}
