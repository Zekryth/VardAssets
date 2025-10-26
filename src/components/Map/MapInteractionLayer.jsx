/**
 * MapInteractionLayer.jsx
 *
 * Capa de interacción sobre el mapa que captura eventos según el modo de acción (agregar, mover, etc.).
 * Permite crear nuevos puntos y gestiona la interacción avanzada del usuario sobre el mapa.
 */
import React, { useMemo, useRef, useState } from 'react'
import { useMapActionMode } from '../../contexts/MapActionModeContext.jsx'
import { useMapView } from '../../contexts/MapViewContext.jsx'
import { pointService } from '../../services/api.js'
import CreatePointDialog from '../PointPanel/CreatePointDialog.jsx'

// Esta capa está encima del mapa. Solo captura eventos cuando el modo lo requiere.
export default function MapInteractionLayer({ className = '', points = [], onChanged }) {
  const { mode } = useMapActionMode()
  const { view } = useMapView() // { scale, offset, tileSize, minX, minY, ...}
  const overlayRef = useRef(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [openTick, setOpenTick] = useState(0) // para forzar reset de inputs de archivo

  const isAdding = mode === 'adding'
  const isTiling = mode === 'tiling'

  const ready = useMemo(() => {
    return view &&
      typeof view.scale === 'number' &&
      view.offset && typeof view.offset.x === 'number' &&
      typeof view.tileSize === 'number' &&
      typeof view.minX === 'number' && typeof view.minY === 'number'
  }, [view])

  const screenToPixels = (clientX, clientY) => {
    const el = overlayRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const sx = clientX - rect.left
    const sy = clientY - rect.top
    const scale = view?.scale || 1
    const offset = view?.offset || { x: 0, y: 0 }
    const tileSize = view?.tileSize || 512
    const minX = view?.minX || 0
    const minY = view?.minY || 0
    const bx = (sx - offset.x) / (scale || 1)
    const by = (sy - offset.y) / (scale || 1)
    const px = Math.round(bx + minX * tileSize)
    const py = Math.round(by + minY * tileSize)
    if (!Number.isFinite(px) || !Number.isFinite(py)) return null
    return { x: px, y: py }
  }

  const handleMapClick = (e) => {
    if (!isAdding || createOpen) return
    if (!ready) {
      // fallback: permitir un primer clic aunque la vista tarde; intentamos calcular igualmente
      const pFallback = screenToPixels(e.clientX, e.clientY)
      if (!pFallback) return
      setCoords(pFallback)
      setCreateOpen(true)
      setOpenTick(t => t + 1)
      e.stopPropagation()
      return
    }
    const p = screenToPixels(e.clientX, e.clientY)
    if (!p) return
    setCoords(p)
    setCreateOpen(true)
    setOpenTick(t => t + 1) // resetea inputs de archivo
    e.stopPropagation()
  }

  const handleConfirm = async (payload) => {
    try {
      // payload: { nombre, categoria, companiaId, inventario[], files? }
      const body = {
        nombre: payload?.nombre,
        categoria: payload?.categoria,
        compañia: payload?.compañia || payload?.compania || null,
        coordenadas: { x: coords.x, y: coords.y },
        inventario: Array.isArray(payload?.inventario)
          ? payload.inventario.map(it => ({ objeto: it?.objeto?._id || it?.objeto || it?.id, cantidad: Number(it?.cantidad) || 1 }))
          : []
      }
      const created = await pointService.createPoint(body)
      const pointId = created?.data?._id || created?.id
      if (pointId && payload?.files && (payload.files.fotos?.length || payload.files.documentos?.length)) {
        await pointService.uploadFiles(pointId, {
          fotos: payload.files.fotos || [],
          documentos: payload.files.documentos || []
        })
      }
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
        // pointer-events: solo cuando adding; en tiling no interceptamos (el board maneja ctrl+click)
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
          {ready ? 'Agregar: haz clic en el mapa para crear' : 'Preparando vista…'}
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
