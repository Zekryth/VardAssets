/**
 * MapSquare.jsx
 *
 * Componente para renderizar un cuadrante (tile) individual del mapa.
 * Permite detectar clics y resalta si contiene puntos.
 */
import React from 'react';
import { MAP_CONFIG } from '../../utils/constants';

const MapSquare = ({ x, y, size, points = [], onPointSelect }) => {
  const hasPoints = points.length > 0;

  const handleSquareClick = () => {
    if (hasPoints && onPointSelect) {
      onPointSelect(points[0]);
    }
  };

  const tileSize = MAP_CONFIG.TILE_SIZE || size

  return (
    <div
      className="absolute transition-all"
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        left: `${x * tileSize}px`,
        top: `${y * tileSize}px`,
        backgroundColor: 'transparent',
      }}
      onClick={handleSquareClick}
    />
  );
};

export default MapSquare;