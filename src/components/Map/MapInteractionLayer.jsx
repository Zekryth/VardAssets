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
    
    // Use screenToBoard from context to get board coordinates
    const boardCoords = screenToBoard(e.clientX, e.clientY)
    console.log('🗺️ [MAP CLICK] Board coordinates:', boardCoords)
    
    if (!Number.isFinite(boardCoords.x) || !Number.isFinite(boardCoords.y)) {
      console.warn('⚠️ Invalid coordinates:', boardCoords)
      return
    }
    
    setCoords(boardCoords)
    setCreateOpen(true)
    setOpenTick(t => t + 1) // resetea inputs de archivo
    e.stopPropagation()
  }

  const handleConfirm = async (payload) => {
    try {
      // payload: { nombre, categoria, companiaId, inventario[], fotos[], documentos[] }
      console.log('🎯 [CREATE POINT] Board coordinates:', coords)
      
      const body = {
        nombre: payload?.nombre,
        categoria: payload?.categoria,
        compañia: payload?.compañia || payload?.compania || null,
        coordenadas: { x: coords.x, y: coords.y },
        inventario: Array.isArray(payload?.inventario)
          ? payload.inventario.map(it => ({ objeto: it?.objeto?._id || it?.objeto || it?.id, cantidad: Number(it?.cantidad) || 1 }))
          : [],
        fotos: payload?.fotos || [],
        documentos: payload?.documentos || []
      }
      
      console.log('📤 [CREATE POINT] Sending to API:', body)
      
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

      {/* HUD sutil (no estorba): solo informativo, no bloquea */}
      {isAdding && !createOpen && (
        <div
          style={{
            position: 'absolute',
            top: 8, left: 8,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(17,24,39,.6)',
            color: '#e5e7eb',
            fontSize: 12,
            pointerEvents: 'none'
          }}
        >
          Agregar: haz clic en el mapa para crear
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
