/**
 * MapPointsOverlay.jsx
 *
 * Componente overlay para renderizar los puntos sobre el mapa.
 * Calcula posiciones en pantalla y permite interacción con los puntos.
 */
import React from 'react'
import { useMapView } from '../../contexts/MapViewContext'

export default function MapPointsOverlay({ points = [], onPointClick }) {
  const { boardToScreen } = useMapView()
  
  console.log('🗺️ [MAP OVERLAY] Rendering', points?.length || 0, 'points')
  
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {points.map((p) => {
        const x = p?.coordenadas?.x
        const y = p?.coordenadas?.y
        
        if (typeof x !== 'number' || typeof y !== 'number') {
          console.warn('⚠️ [MAP OVERLAY] Point with invalid coordinates:', {
            id: p?._id || p?.id,
            nombre: p?.nombre,
            coordenadas: p?.coordenadas
          })
          return null
        }
        
        const pos = boardToScreen(x, y)
        console.log(`📍 [MAP OVERLAY] ${p?.nombre}:`, {
          boardCoords: { x, y },
          screenPos: pos
        })
        
        const left = pos.x
        const top = pos.y
        return (
          <button
            key={p._id || p.id || `${x}-${y}-${p.nombre}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left, top }}
            title={p?.nombre || ''}
            onClick={(e) => { e.stopPropagation(); onPointClick?.(p) }}
          >
            <MarkerDot label={p?.nombre} company={p?.compañia?.nombre} />
          </button>
        )
      })}
    </div>
  )
}

function MarkerDot({ label, company }) {
  return (
    <div className="group relative">
      <div className="w-3 h-3 rounded-full bg-primary-500 ring-2 ring-white shadow" />
      {(label || company) && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 rounded bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 transition">
          {label}{company ? ` — ${company}` : ''}
        </div>
      )}
    </div>
  )
}
