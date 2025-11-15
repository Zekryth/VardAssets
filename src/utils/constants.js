export const MAP_CONFIG = {
  GRID_SIZE: 10,
  // UPDATED: base tile size (px). Ajusta para que el cuadrado sea más grande
  TILE_SIZE: 180,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 3,
  // UPDATED: marker sizing mode and size (px)
  MARKER_MODE: 'constant', // 'constant' | 'scaleWithZoom'
  MARKER_SIZE: 18,
  
  // Map boundaries (in pixels)
  // Adjust these values based on your actual map size
  // Default: 10x10 grid with 180px tiles = 1800x1800
  get BOARD_WIDTH() {
    return this.GRID_SIZE * this.TILE_SIZE; // 1800px
  },
  get BOARD_HEIGHT() {
    return this.GRID_SIZE * this.TILE_SIZE; // 1800px
  },
  
  // Validate if coordinates are within map bounds
  isInsideMap(x, y) {
    return x >= 0 && x <= this.BOARD_WIDTH && y >= 0 && y <= this.BOARD_HEIGHT;
  },
  
  // Clamp coordinates to map bounds
  clampToMap(x, y) {
    return {
      x: Math.max(0, Math.min(x, this.BOARD_WIDTH)),
      y: Math.max(0, Math.min(y, this.BOARD_HEIGHT))
    };
  }
};

export const tileUrl = (x, y) => `/assets/mapTiles/${x}_${y}.jpg`;

export const CATEGORIES = [
  'oficina',
  'almacen',
  'reuniones',
  'tecnologia',
  'exterior'
];