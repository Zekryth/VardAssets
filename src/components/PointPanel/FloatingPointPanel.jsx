/**
 * FloatingPointPanel.jsx
 *
 * Panel flotante para mostrar información y acciones de un punto seleccionado en el mapa.
 * Permite mover, minimizar, cerrar y cambiar el tamaño del panel.
 */
import React, { useCallback, useEffect, useRef } from 'react'
import { Minus, X, GripVertical, Loader2 } from 'lucide-react'
import PointPanelContent from './PointPanelContent'
import { usePointPanels } from '../../contexts/PointPanelsContext'

const cx = (...p) => p.filter(Boolean).join(' ')

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="h-full flex flex-col p-4 space-y-4 animate-pulse">
      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-4">
        {/* Main card */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
        
        {/* Spinner overlay */}
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading data...</span>
        </div>
      </div>
    </div>
  )
}

export default function FloatingPointPanel({ panel }) {
  const { id, x, y, w, h, minimized, title, z, point, loading } = panel
  const { movePanel, resizePanel, toggleMinimize, closePanel, bringToFront, refreshPanel } = usePointPanels()
  const panelRef = useRef(null)
  const dragRef = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 })
  const resizeRef = useRef({ active: false, sx: 0, sy: 0, ow: 0, oh: 0 })

  // Bring to front on mousedown anywhere
  const onMouseDown = () => bringToFront(id)

  // Drag only from title bar
  const startDrag = useCallback((sx, sy) => {
    dragRef.current = { active: true, sx, sy, ox: x, oy: y }
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragUp, { once: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { once: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y])

  const onTitleDown = (e) => {
    e.preventDefault()
    // Evitar drag cuando se hace clic en los botones de la derecha
    if (e.target.closest('[data-panel-action]')) return
    bringToFront(id)
    startDrag(e.clientX, e.clientY)
  }
  const onDragMove = (e) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.sx
    const dy = e.clientY - dragRef.current.sy
    movePanel(id, { x: dragRef.current.ox + dx, y: dragRef.current.oy + dy })
  }
  const onDragUp = () => {
    dragRef.current.active = false
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('touchmove', onTouchMove)
  }

  // Touch support
  const onTitleTouchStart = (e) => {
    if (e.touches.length !== 1) return
    if (e.target.closest('[data-panel-action]')) return
    bringToFront(id)
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
  }
  const onTouchMove = (e) => {
    if (!dragRef.current.active) return
    if (e.touches.length !== 1) return
    e.preventDefault()
    const t = e.touches[0]
    const dx = t.clientX - dragRef.current.sx
    const dy = t.clientY - dragRef.current.sy
    movePanel(id, { x: dragRef.current.ox + dx, y: dragRef.current.oy + dy })
  }
  const onTouchEnd = () => {
    dragRef.current.active = false
    window.removeEventListener('touchmove', onTouchMove)
  }

  // Resize from bottom-right handle
  const onHandleDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    bringToFront(id)
    resizeRef.current = { active: true, sx: e.clientX, sy: e.clientY, ow: w, oh: h }
    window.addEventListener('mousemove', onResizeMove)
    window.addEventListener('mouseup', onResizeUp, { once: true })
  }
  const onResizeMove = (e) => {
    if (!resizeRef.current.active) return
    const dw = e.clientX - resizeRef.current.sx
    const dh = e.clientY - resizeRef.current.sy
    resizePanel(id, { w: resizeRef.current.ow + dw, h: resizeRef.current.oh + dh })
  }
  const onResizeUp = () => {
    resizeRef.current.active = false
    window.removeEventListener('mousemove', onResizeMove)
  }

  useEffect(() => () => {
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mousemove', onResizeMove)
  }, [])

  return (
    <div
      role="dialog"
      aria-labelledby={`panel-title-${id}`}
      className={cx(
        'absolute rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl transform-gpu transition-[opacity,transform] duration-200 will-change-transform select-none',
        minimized ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100',
      )}
      style={{ left: x, top: y, width: w, height: h, zIndex: z }}
      ref={panelRef}
      onMouseDown={onMouseDown}
    >
      {/* Title bar */}
      <div className="h-10 flex items-center justify-between px-3 rounded-t-xl bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 overflow-hidden cursor-move select-none"
          onMouseDown={onTitleDown}
          onTouchStart={onTitleTouchStart}
        >
          <GripVertical size={16} className="text-gray-400" />
          <h3 id={`panel-title-${id}`} className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate max-w-[20ch]">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button data-panel-action aria-pressed={minimized} onClick={() => toggleMinimize(id)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Minimizar">
            <Minus size={16} />
          </button>
          <button data-panel-action onClick={() => closePanel(id)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600" title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="h-[calc(100%-2.5rem)] flex flex-col bg-white/60 dark:bg-gray-900/60">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <PointPanelContent 
            point={point}
            onEdit={(pt) => {
              console.log('TODO: Implementar edición de punto desde panel flotante', pt);
              // Aquí iría la lógica para abrir un diálogo de edición
            }}
            onDelete={async (pointId) => {
              console.log('TODO: Implementar eliminación de punto desde panel flotante', pointId);
              // Aquí iría la lógica para eliminar el punto
              // Por ahora solo cerramos el panel
              closePanel(id);
            }}
          />
        )}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onHandleDown}
        className="absolute right-1.5 bottom-1.5 h-4 w-4 cursor-nwse-resize text-gray-400"
        aria-label="Resize panel"
        title="Redimensionar"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" className="opacity-60">
          <path d="M6 10h4v1H6zm2-3h4v1H8zM10 4h4v1h-4z" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
