export const MAP_CONFIG = {
  GRID_SIZE: 10,
  // UPDATED: base tile size (px). Ajusta para que el cuadrado sea más grande
  TILE_SIZE: 180,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 3,
  // UPDATED: marker sizing mode and size (px)
  MARKER_MODE: 'constant', // 'constant' | 'scaleWithZoom'
  MARKER_SIZE: 18,
};

export const tileUrl = (x, y) => `/assets/mapTiles/${x}_${y}.jpg`;

export const CATEGORIES = [
  'oficina',
  'almacen',
  'reuniones',
  'tecnologia',
  'exterior'
];