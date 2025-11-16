/**
 * mapTileCalculator.js
 * 
 * Utilidades para calcular tiles/trozos del mapa basado en coordenadas
 * y gestionar la grilla del mapa modular.
 */

/**
 * Configuración del mapa
 */
export const MAP_CONFIG = {
  TILE_SIZE: 512,        // Tamaño de cada tile en píxeles
  MAP_WIDTH: 5000,       // Ancho total del mapa en píxeles
  MAP_HEIGHT: 5000,      // Alto total del mapa en píxeles
  ZOOM_LEVELS: [1, 2, 4] // Niveles de zoom disponibles
}

/**
 * Calcula el tile correspondiente a unas coordenadas
 * 
 * @param {number} x - Coordenada X en píxeles
 * @param {number} y - Coordenada Y en píxeles
 * @param {number} zoomLevel - Nivel de zoom (default: 1)
 * @returns {Object} - { tile_x, tile_y, zoom_level }
 * 
 * @example
 * coordinatesToTile(1024, 768, 1)
 * // => { tile_x: 2, tile_y: 1, zoom_level: 1 }
 */
export function coordinatesToTile(x, y, zoomLevel = 1) {
  const tileSize = MAP_CONFIG.TILE_SIZE * zoomLevel
  
  return {
    tile_x: Math.floor(x / tileSize),
    tile_y: Math.floor(y / tileSize),
    zoom_level: zoomLevel
  }
}

/**
 * Calcula las coordenadas del origen de un tile
 * 
 * @param {number} tileX - Coordenada X del tile
 * @param {number} tileY - Coordenada Y del tile
 * @param {number} zoomLevel - Nivel de zoom
 * @returns {Object} - { x, y, width, height }
 * 
 * @example
 * tileToCoordinates(2, 1, 1)
 * // => { x: 1024, y: 512, width: 512, height: 512 }
 */
export function tileToCoordinates(tileX, tileY, zoomLevel = 1) {
  const tileSize = MAP_CONFIG.TILE_SIZE * zoomLevel
  
  return {
    x: tileX * tileSize,
    y: tileY * tileSize,
    width: tileSize,
    height: tileSize
  }
}

/**
 * Calcula cuántos tiles hay en el mapa
 * 
 * @param {number} zoomLevel - Nivel de zoom
 * @returns {Object} - { tilesX, tilesY, totalTiles }
 * 
 * @example
 * getTileGrid(1)
 * // => { tilesX: 10, tilesY: 10, totalTiles: 100 }
 */
export function getTileGrid(zoomLevel = 1) {
  const tileSize = MAP_CONFIG.TILE_SIZE * zoomLevel
  
  const tilesX = Math.ceil(MAP_CONFIG.MAP_WIDTH / tileSize)
  const tilesY = Math.ceil(MAP_CONFIG.MAP_HEIGHT / tileSize)
  
  return {
    tilesX,
    tilesY,
    totalTiles: tilesX * tilesY
  }
}

/**
 * Verifica si un punto está dentro de un tile
 * 
 * @param {number} pointX - Coordenada X del punto
 * @param {number} pointY - Coordenada Y del punto
 * @param {number} tileX - Coordenada X del tile
 * @param {number} tileY - Coordenada Y del tile
 * @param {number} zoomLevel - Nivel de zoom
 * @returns {boolean}
 */
export function isPointInTile(pointX, pointY, tileX, tileY, zoomLevel = 1) {
  const tileCoords = tileToCoordinates(tileX, tileY, zoomLevel)
  
  return (
    pointX >= tileCoords.x &&
    pointX < tileCoords.x + tileCoords.width &&
    pointY >= tileCoords.y &&
    pointY < tileCoords.y + tileCoords.height
  )
}

/**
 * Obtiene todos los tiles que están en el viewport actual
 * 
 * @param {Object} viewport - { x, y, width, height }
 * @param {number} zoomLevel - Nivel de zoom
 * @returns {Array<Object>} - Array de tiles { tile_x, tile_y }
 */
export function getVisibleTiles(viewport, zoomLevel = 1) {
  const tileSize = MAP_CONFIG.TILE_SIZE * zoomLevel
  
  const minTileX = Math.max(0, Math.floor(viewport.x / tileSize))
  const minTileY = Math.max(0, Math.floor(viewport.y / tileSize))
  const maxTileX = Math.floor((viewport.x + viewport.width) / tileSize)
  const maxTileY = Math.floor((viewport.y + viewport.height) / tileSize)
  
  const tiles = []
  for (let ty = minTileY; ty <= maxTileY; ty++) {
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      tiles.push({ tile_x: tx, tile_y: ty })
    }
  }
  
  return tiles
}

/**
 * Formatea el nombre de un tile para UI
 * 
 * @param {number} tileX - Coordenada X del tile
 * @param {number} tileY - Coordenada Y del tile
 * @returns {string}
 */
export function formatTileName(tileX, tileY) {
  return `Tile (${tileX}, ${tileY})`
}

export default {
  MAP_CONFIG,
  coordinatesToTile,
  tileToCoordinates,
  getTileGrid,
  isPointInTile,
  getVisibleTiles,
  formatTileName
}
