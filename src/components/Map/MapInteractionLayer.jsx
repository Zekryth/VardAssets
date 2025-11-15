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
    
    console.log('🗺️ [MAP CLICK] === INICIO ===')
    console.log('   clientX/Y (window coords):', e.clientX, e.clientY)
    
    // Get overlay position
    const rect = el.getBoundingClientRect()
    console.log('📐 [MAP CLICK] Overlay rect:', {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    })
    
    // Calculate coordinates relative to overlay
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top
    
    console.log('📍 [MAP CLICK] Relative to overlay:', { relativeX, relativeY })
    
    // Convert to board coordinates (screenToBoard expects screen coords already relative)
    const boardCoords = screenToBoard(e.clientX, e.clientY)
    console.log('🎯 [MAP CLICK] Board coordinates:', boardCoords)
    
    if (!Number.isFinite(boardCoords.x) || !Number.isFinite(boardCoords.y)) {
      console.warn('⚠️ Invalid coordinates:', boardCoords)
      return
    }
    
    // Create temporary visual marker for debugging
    const marker = document.createElement('div')
    marker.style.cssText = `
      position: absolute;
      left: ${relativeX}px;
      top: ${relativeY}px;
      width: 20px;
      height: 20px;
      background: red;
      border: 3px solid white;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `
    el.appendChild(marker)
    console.log('🔴 [DEBUG] Red marker placed at:', { relativeX, relativeY })
    
    // Remove marker after 3 seconds
    setTimeout(() => {
      marker.remove()
      console.log('🔴 [DEBUG] Red marker removed')
    }, 3000)
    
    setCoords(boardCoords)
    setCreateOpen(true)
    setOpenTick(t => t + 1) // resetea inputs de archivo
    e.stopPropagation()
  }

  const handleConfirm = async (payload) => {
    try {
      // payload: { nombre, categoria, companiaId, inventario[], fotos[], documentos[] }
      console.log('💾 [CREATE POINT] === SAVING POINT ===')
      console.log('📋 [CREATE POINT] Form data:', payload)
      console.log('🎯 [CREATE POINT] Board coordinates to save:', coords)
      
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
      
      console.log('📤 [CREATE POINT] Complete payload:', body)
      console.log('🎯 [CREATE POINT] Coordinates in payload:', body.coordenadas)
      
      const created = await pointService.createPoint(body)
      const pointId = created?.data?._id || created?.data?.id || created?.id
      const savedCoords = created?.data?.coordenadas
      
      console.log('✅ [CREATE POINT] Point created successfully')
      console.log('   ID:', pointId)
      console.log('   Coordinates saved in DB:', savedCoords)
      console.log('   Expected:', coords)
      
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
