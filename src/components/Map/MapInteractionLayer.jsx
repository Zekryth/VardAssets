/**
 * MapInteractionLayer.jsx
 *
 * Capa de interacción sobre el mapa que captura eventos según el modo de acción (agregar, mover, etc.).
 * Permite crear nuevos puntos y gestiona la interacción avanzada del usuario sobre el mapa.
 */
import React, { useRef, useState } from 'react'
import { useMapActionMode } from '../../contexts/MapActionModeContext.jsx'
import { useMapView } from '../../contexts/MapViewContext.jsx'
import { pointService } from '../../services/api.js'
import CreatePointDialog from '../PointPanel/CreatePointDialog.jsx'
import { MAP_CONFIG } from '../../utils/constants.js'

// Esta capa está encima del mapa. Solo captura eventos cuando el modo lo requiere.
export default function MapInteractionLayer({ className = '', points = [], onChanged }) {
  const { mode } = useMapActionMode()
  const { screenToBoard } = useMapView()
  const overlayRef = useRef(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [openTick, setOpenTick] = useState(0) // para forzar reset de inputs de archivo

  const isAdding = mode === 'adding'

  const handleMapClick = (e) => {
    if (!isAdding || createOpen) return
    
    const el = overlayRef.current
    if (!el) return
    
    // Convert to board coordinates
    const boardCoords = screenToBoard(e.clientX, e.clientY)
    
    if (!Number.isFinite(boardCoords.x) || !Number.isFinite(boardCoords.y)) {
      console.warn('⚠️ [MAP CLICK] Invalid coordinates:', boardCoords)
      return
    }
    
    const checkX = Number.isFinite(boardCoords.legacyX) ? boardCoords.legacyX : boardCoords.x
    const checkY = Number.isFinite(boardCoords.legacyY) ? boardCoords.legacyY : boardCoords.y

    // Validate coordinates are within map bounds (legacy board-local frame)
    if (!MAP_CONFIG.isInsideMap(checkX, checkY)) {
      console.warn('⚠️ [MAP CLICK] Click outside map bounds:', boardCoords, 'Max:', {
        width: MAP_CONFIG.BOARD_WIDTH,
        height: MAP_CONFIG.BOARD_HEIGHT
      })
      alert(`❌ No puedes crear un punto fuera del mapa.\n\nCoordenadas: (${Math.round(checkX)}, ${Math.round(checkY)})\nLímites del mapa: ${MAP_CONFIG.BOARD_WIDTH} x ${MAP_CONFIG.BOARD_HEIGHT} px\n\nHaz click dentro del área blanca del mapa.`)
      return
    }
    
    console.log('🎯 [MAP CLICK] Creating point at:', boardCoords)
    
    setCoords(boardCoords)
    setCreateOpen(true)
    setOpenTick(t => t + 1)
    e.stopPropagation()
  }

  const handleConfirm = async (payload) => {
    try {
      const body = {
        nombre: payload?.nombre,
        categoria: payload?.categoria,
        companiaPropietaria: payload?.companiaPropietaria || payload?.compania_propietaria || payload?.compañia || payload?.compania || null,
        companiaAlojada: payload?.companiaAlojada || payload?.compania_alojada || null,
        nrInventarioSAP: payload?.nrInventarioSAP || payload?.nr_inventario_sap || null,
        mijlocFix: Boolean(payload?.mijlocFix),
        coordenadas: { x: coords.x, y: coords.y },
        inventario: Array.isArray(payload?.inventario)
          ? payload.inventario.map(it => ({ objeto: it?.objeto?._id || it?.objeto || it?.id, cantidad: Number(it?.cantidad) || 1 }))
          : [],
        fotos: payload?.fotos || [],
        documentos: payload?.documentos || [],
        pisosAdicionales: Array.isArray(payload?.pisosAdicionales) ? payload.pisosAdicionales : []
      }
      
      console.log('💾 [CREATE POINT] Saving:', payload.nombre, 'at', body.coordenadas)
      
      const created = await pointService.createPoint(body)
      const pointId = created?.data?._id || created?.data?.id || created?.id
      
      console.log('✅ [CREATE POINT] Point created:', pointId)
      
      // Refrescar puntos, cerrar diálogo y permanecer en adding para seguir creando
      onChanged?.()
      setCreateOpen(false)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al crear el punto'
      alert(msg)
      // Cierra el diálogo pero permanece en adding para reintentar en otra celda
      setCreateOpen(false)
    }
  }

  const handleCancel = () => {
    setCreateOpen(false) // no cambia el modo, sigues en adding
  }

  return (
    <div
      ref={overlayRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        // pointer-events: solo cuando adding
        pointerEvents: isAdding ? 'auto' : 'none'
      }}
      onClick={handleMapClick}
    >
      {/* Backdrop cuando el diálogo está abierto: bloquea clics de fondo */}
      {createOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', inset: 0, background: 'transparent', pointerEvents: 'auto' }}
        />
      )}

      {/* Indicador visual del área válida del mapa */}
      {isAdding && !createOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${MAP_CONFIG.BOARD_WIDTH}px`,
            height: `${MAP_CONFIG.BOARD_HEIGHT}px`,
            border: '3px solid rgba(59, 130, 246, 0.5)',
            boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
            pointerEvents: 'none',
            zIndex: 10
          }}
          title={`Área válida del mapa: ${MAP_CONFIG.BOARD_WIDTH} x ${MAP_CONFIG.BOARD_HEIGHT} px`}
        />
      )}

      {/* HUD sutil (no estorba): solo informativo, no bloquea */}
      {isAdding && !createOpen && (
        <div
          style={{
            position: 'absolute',
            top: 8, left: 8,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(17,24,39,.8)',
            color: '#e5e7eb',
            fontSize: 12,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          📍 Haz clic dentro del área azul para crear un punto
        </div>
      )}

      {createOpen && (
        <CreatePointDialog
          key={openTick}            // fuerza reset completo del formulario e inputs de archivo
          open
          coords={coords}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
