/**
 * MapViewContext.jsx
 *
 * Contexto para transformar coordenadas entre el espacio de pantalla y el espacio del tablero/mapa.
 * Proporciona utilidades y estado para la visualización y manipulación del mapa.
 */
import React, { createContext, useContext } from 'react'

// Provides coordinate transforms between screen (client) and board (map) space
// value: { screenToBoard(x,y):{x,y}, boardToScreen(x,y):{x,y}, container: HTMLElement|null, tileSize:number, gridOffX:number, gridOffY:number, ready?: boolean }
const MapViewContext = createContext({ screenToBoard: (x,y)=>({x,y}), boardToScreen: (x,y)=>({x,y}), container: null, tileSize: 512, gridOffX: 0, gridOffY: 0, ready: false, minX: 0, minY: 0, maxX: 0, maxY: 0 })

export function MapViewProvider({ value, children }) {
  return <MapViewContext.Provider value={value}>{children}</MapViewContext.Provider>
}

export function useMapView() {
  return useContext(MapViewContext)
}
