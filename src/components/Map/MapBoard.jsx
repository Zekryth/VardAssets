/**
 * MapBoard.jsx
 *
 * Componente que renderiza el tablero del mapa y gestiona los tiles (cuadrantes) y puntos.
 * Permite interacción de usuario/admin para mover, seleccionar y eliminar puntos.
 * Utiliza almacenamiento local para persistir tiles y vista del mapa.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import MapTileLayer from './MapTileLayer'
import MapTileGrid from './MapTileGrid'
import TileImageManager from './TileImageManager'

const TILE_SIZE = 512 // px por cuadrante
const STORAGE_KEY = 'ms.tiles.v1'
const VIEW_KEY = 'ms.map.view.v1'

function useLocalTiles(defaultUrl) {
  const [tiles, setTiles] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved) && saved.length) return saved
    } catch {}
    return defaultUrl ? [{ x: 0, y: 0, url: defaultUrl }] : []
  })
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles)) } catch {} }, [tiles])
  return [tiles, setTiles]
}

export default function MapBoard({ initialImage = `${import.meta.env.BASE_URL}demo/ejemplo.png`, className, isAdmin = true, isTiling = false, onViewInfo, onContainer, points = [], onPointSelect, isMoving = false, onPointMove, isDeleting = false, onPointDelete }) {
  const [tiles, setTiles] = useLocalTiles(initialImage)
  const [scale, setScale] = useState(0.5)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showTileGrid, setShowTileGrid] = useState(false)
  const [selectedTile, setSelectedTile] = useState(null)
  const [tileRefreshTrigger, setTileRefreshTrigger] = useState(0)
  const dragging = useRef(null)
  const pointDrag = useRef(null)
  const containerRef = useRef(null)
  const MIN_SCALE = 0.25
  const MAX_SCALE = 2

  const bbox = useMemo(() => {
    if (!tiles.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    const xs = tiles.map(t => t.x), ys = tiles.map(t => t.y)
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
  }, [tiles])

  const cols = bbox.maxX - bbox.minX + 1
  const rows = bbox.maxY - bbox.minY + 1
  const boardW = cols * TILE_SIZE
  const boardH = rows * TILE_SIZE

  const emitViewInfo = (nextScale, nextOffset) => {
    onViewInfo?.({
      scale: nextScale,
      offset: nextOffset,
      tileSize: TILE_SIZE,
      gridOffX: bbox.minX || 0,
      gridOffY: bbox.minY || 0,
      minX: bbox.minX || 0,
      minY: bbox.minY || 0,
      maxX: bbox.maxX || 0,
      maxY: bbox.maxY || 0
    })
  }

  const persistView = (nextScale, nextOffset) => {
    try { localStorage.setItem(VIEW_KEY, JSON.stringify({ scale: nextScale, offset: nextOffset })) } catch {}
  }

  const applyZoomAt = (targetScale, anchorX, anchorY) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale))
    const dx = anchorX - offset.x
    const dy = anchorY - offset.y
    const nx = anchorX - (dx * next) / scale
    const ny = anchorY - (dy * next) / scale
    const newOffset = { x: nx, y: ny }
    setScale(next)
    setOffset(newOffset)
    emitViewInfo(next, newOffset)
    persistView(next, newOffset)
  }

  const fitBoardToViewport = () => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const fitScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.min(r.width / boardW, r.height / boardH) * 0.95))
    const newOffset = {
      x: (r.width - boardW * fitScale) / 2,
      y: (r.height - boardH * fitScale) / 2
    }
    setScale(fitScale)
    setOffset(newOffset)
    emitViewInfo(fitScale, newOffset)
    persistView(fitScale, newOffset)
  }

  // Restore persisted view or center the board on first mount
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    onContainer?.(el)
    try {
      const saved = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null')
      if (saved && typeof saved.scale === 'number' && saved.offset && typeof saved.offset.x === 'number') {
        setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, saved.scale)))
        setOffset({ x: saved.offset.x, y: saved.offset.y })
        emitViewInfo(saved.scale, { x: saved.offset.x, y: saved.offset.y })
        return
      }
    } catch {}
    const r = el.getBoundingClientRect()
    setOffset({ x: (r.width - boardW * scale) / 2, y: (r.height - boardH * scale) / 2 })
    emitViewInfo(scale, { x: (r.width - boardW * scale) / 2, y: (r.height - boardH * scale) / 2 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const preventCtrlWheelZoom = (e) => {
      if (e.ctrlKey) e.preventDefault()
    }
    const preventGesture = (e) => e.preventDefault()

    el.addEventListener('wheel', preventCtrlWheelZoom, { passive: false })
    el.addEventListener('gesturestart', preventGesture, { passive: false })
    el.addEventListener('gesturechange', preventGesture, { passive: false })
    el.addEventListener('gestureend', preventGesture, { passive: false })

    return () => {
      el.removeEventListener('wheel', preventCtrlWheelZoom)
      el.removeEventListener('gesturestart', preventGesture)
      el.removeEventListener('gesturechange', preventGesture)
      el.removeEventListener('gestureend', preventGesture)
    }
  }, [])

  const onWheel = (e) => {
    e.preventDefault()
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    applyZoomAt(scale * (e.deltaY > 0 ? 0.9 : 1.1), mouseX, mouseY)
  }

  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType !== 'touch') return
    // Block panning if a point drag is active
    if (pointDrag.current) return
    dragging.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    const { x, y, ox, oy } = dragging.current
    const newOffset = { x: ox + (e.clientX - x), y: oy + (e.clientY - y) }
    setOffset(newOffset)
    emitViewInfo(scale, newOffset)
  }
  const onPointerUp = () => {
    dragging.current = null
    window.removeEventListener('pointermove', onPointerMove)
    persistView(scale, offset)
  }

  const keyOf = (x, y) => `${x}_${y}`
  const addOrReplaceAt = (x, y) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.png,.jpg,.jpeg'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setTiles(prev => {
        const other = prev.filter(t => !(t.x === x && t.y === y))
        return [...other, { x, y, url }]
      })
    }
    input.click()
  }

  const removeAt = (x, y) => {
    setTiles(prev => prev.filter(t => !(t.x === x && t.y === y)))
  }

  const AddBtn = ({ style, onClick }) => (
    <button
      className="pointer-events-auto"
      onClick={onClick}
      title="Add section"
      style={{
        position: 'absolute',
        padding: '10px 18px',
        borderRadius: 9999,
        border: '2px solid #ff4d4f',
        background: 'rgba(13,18,28,.85)',
        color: '#fff', fontSize: 18,
        boxShadow: '0 6px 18px rgba(0,0,0,.25)',
        ...style
      }}
    >
      +
    </button>
  )

  const hudOffset = 28
  // Fast lookup for existing tiles
  const tileSet = useMemo(() => new Set(tiles.map(t => `${t.x}_${t.y}`)), [tiles])
  const hasTile = (x, y) => tileSet.has(`${x}_${y}`)

  const toScreen = (p) => ({ left: offset.x + p.left * scale, top: offset.y + p.top * scale, transform: 'translate(-50%, -50%)' })

  const screenToGrid = (clientX, clientY) => {
    const el = containerRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    const sx = clientX - rect.left
    const sy = clientY - rect.top
    const bx = (sx - offset.x) / scale
    const by = (sy - offset.y) / scale
    const gx = Math.floor(bx / TILE_SIZE) + (bbox.minX || 0)
    const gy = Math.floor(by / TILE_SIZE) + (bbox.minY || 0)
    return { x: gx, y: gy }
  }

  const tileViewport = useMemo(() => ({
    x: (bbox.minX || 0) * TILE_SIZE,
    y: (bbox.minY || 0) * TILE_SIZE,
    width: boardW,
    height: boardH
  }), [bbox.minX, bbox.minY, boardW, boardH])

  const controlsRight = isAdmin ? 96 : 16

  // NEW: emitir view info cuando cambie el bbox (tiles) o el offset/scale por efectos externos,
  // para que el contexto marque "ready" desde el inicio y no quedemos en "Inicializando..."
  useEffect(() => {
    if (!containerRef.current) return
    emitViewInfo(scale, offset)
  }, [bbox.minX, bbox.minY, bbox.maxX, bbox.maxY, scale, offset, onViewInfo])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden', touchAction: 'none', cursor: isAdmin && isTiling ? 'crosshair' : 'default' }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
    >
      <div
        style={{
          position: 'absolute', left: offset.x, top: offset.y,
          width: boardW, height: boardH,
          transform: `scale(${scale})`, transformOrigin: 'top left',
          backgroundColor: '#fff',
          backgroundImage:
            `linear-gradient(to right, rgba(0,0,0,.08) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(0,0,0,.08) 1px, transparent 1px)`,
          backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px, ${TILE_SIZE}px ${TILE_SIZE}px`,
          boxShadow: '0 0 0 9999px #000'
        }}
      >
        {/* MapTileLayer - Renderiza tiles con imágenes de fondo */}
        <MapTileLayer 
          zoomLevel={1} 
          viewport={tileViewport}
          refreshTrigger={tileRefreshTrigger}
        />

        {/* MapTileGrid - Grid visual de tiles (solo si está activado) */}
        {showTileGrid && (
          <MapTileGrid
            zoomLevel={1}
            tilesX={cols}
            tilesY={rows}
            offsetX={bbox.minX || 0}
            offsetY={bbox.minY || 0}
            centeredOrigin
            onTileClick={(tileX, tileY) => setSelectedTile({ tileX, tileY })}
          />
        )}
        
        {tiles.map(t => (
          <div
            key={keyOf(t.x, t.y)}
            onClick={(e) => {
              if (!(isAdmin && isTiling)) return
              e.stopPropagation()
              if (e.ctrlKey || e.metaKey) {
                // Ctrl+Click: borrar el cuadrante
                removeAt(t.x, t.y)
              } else {
                // Click normal: reemplazar/subir
                addOrReplaceAt(t.x, t.y)
              }
            }}
            style={{
              position: 'absolute',
              left: (t.x - bbox.minX) * TILE_SIZE,
              top: (t.y - bbox.minY) * TILE_SIZE,
              width: TILE_SIZE, height: TILE_SIZE,
              backgroundImage: `url("${t.url}")`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              cursor: isAdmin && isTiling ? 'pointer' : 'default'
            }}
            title={isAdmin && isTiling ? `(${t.x}, ${t.y}) — Click: reemplazar | Ctrl+Click: borrar` : `(${t.x}, ${t.y})`}
          />
        ))}
      </div>

      <div
        className="absolute bottom-4 z-30 pointer-events-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/85 backdrop-blur shadow-xl p-2 flex items-center gap-2"
        style={{ right: controlsRight }}
      >
        <button
          onClick={() => {
            const el = containerRef.current
            if (!el) return
            const r = el.getBoundingClientRect()
            applyZoomAt(scale * 1.15, r.width / 2, r.height / 2)
          }}
          className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Acercar"
          aria-label="Acercar"
        >
          +
        </button>
        <input
          type="range"
          min={Math.round(MIN_SCALE * 100)}
          max={Math.round(MAX_SCALE * 100)}
          value={Math.round(scale * 100)}
          onChange={(e) => {
            const el = containerRef.current
            if (!el) return
            const r = el.getBoundingClientRect()
            applyZoomAt(Number(e.target.value) / 100, r.width / 2, r.height / 2)
          }}
          className="w-24 accent-blue-600"
          aria-label="Control de zoom"
        />
        <span className="px-2 h-9 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 tabular-nums min-w-[54px] justify-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => {
            const el = containerRef.current
            if (!el) return
            const r = el.getBoundingClientRect()
            applyZoomAt(scale / 1.15, r.width / 2, r.height / 2)
          }}
          className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Alejar"
          aria-label="Alejar"
        >
          −
        </button>
        <button
          onClick={fitBoardToViewport}
          className="px-3 h-9 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
          title="Ajustar mapa"
          aria-label="Ajustar mapa"
        >
          Ajustar
        </button>
        {isAdmin && (
          <button
            onClick={() => setShowTileGrid(!showTileGrid)}
            className={`px-3 h-9 rounded-md text-xs font-semibold transition-colors ${showTileGrid
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title={showTileGrid ? 'Ocultar grid de tiles' : 'Mostrar grid de tiles'}
            aria-label={showTileGrid ? 'Ocultar grid de tiles' : 'Mostrar grid de tiles'}
          >
            {showTileGrid ? 'Ocultar grid' : 'Mostrar grid'}
          </button>
        )}
      </div>

      <div className="pointer-events-none" style={{ position: 'absolute', inset: 0 }}>
        {/* Point markers overlay */}
        {Array.isArray(points) && points.length > 0 && points.map((pt) => {
          const px = pt?.coordenadas?.x
          const py = pt?.coordenadas?.y
          if (typeof px !== 'number' || typeof py !== 'number') return null
          // Convert global pixel coords to board-local coords based on current min tile
          const leftBase = px - ((bbox.minX || 0) * TILE_SIZE)
          const topBase = py - ((bbox.minY || 0) * TILE_SIZE)
          return (
            <button
              key={pt._id || pt.id || `${px}-${py}-${pt?.nombre || ''}`}
              className={`absolute pointer-events-auto p-2 -m-2 group ${isMoving ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
              style={toScreen({ left: leftBase, top: topBase })}
              title={`${pt?.nombre || 'Point'}${pt?.compañia?.nombre ? ' — ' + pt.compañia.nombre : ''}`}
              aria-label={`${pt?.nombre || 'Point'} — open panel`}
              onClick={(e) => {
                e.stopPropagation()
                if (isDeleting) {
                  const name = pt?.nombre || 'punto'
                  if (confirm(`¿Borrar ${name}?`)) {
                    onPointDelete?.(pt)
                  }
                  return
                }
                if (!isMoving) onPointSelect?.(pt)
              }}
              onPointerDown={(e) => {
                if (!isMoving) return
                e.stopPropagation()
                // start dragging this point
                pointDrag.current = { point: pt }
                const onMove = (ev) => {
                  // Optional live preview could be implemented here
                }
                const onUp = (ev) => {
                  window.removeEventListener('pointermove', onMove)
                  window.removeEventListener('pointerup', onUp)
                  // Compute new global pixel coordinates
                  const el = containerRef.current
                  if (!el) { pointDrag.current = null; return }
                  const rect = el.getBoundingClientRect()
                  const sx = ev.clientX - rect.left
                  const sy = ev.clientY - rect.top
                  const bx = (sx - offset.x) / scale
                  const by = (sy - offset.y) / scale
                  const nx = Math.round(bx + (bbox.minX || 0) * TILE_SIZE)
                  const ny = Math.round(by + (bbox.minY || 0) * TILE_SIZE)
                  const ox = pt?.coordenadas?.x
                  const oy = pt?.coordenadas?.y
                  pointDrag.current = null
                  if (typeof nx === 'number' && typeof ny === 'number' && (nx !== ox || ny !== oy)) {
                    onPointMove?.(pt, nx, ny)
                  }
                }
                window.addEventListener('pointermove', onMove)
                window.addEventListener('pointerup', onUp, { once: true })
              }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-white shadow-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] transition-transform duration-150 group-hover:scale-110" />
            </button>
          )
        })}
        {isAdmin && isTiling && tiles.map(t => {
          const leftBase = (t.x - bbox.minX) * TILE_SIZE
          const topBase = (t.y - bbox.minY) * TILE_SIZE
          const items = []
          // Top
          if (!hasTile(t.x, t.y - 1)) {
            items.push(
              <AddBtn
                key={`top-${t.x}_${t.y}`}
                style={toScreen({ left: leftBase + TILE_SIZE / 2, top: topBase - hudOffset })}
                onClick={() => addOrReplaceAt(t.x, t.y - 1)}
              />
            )
          }
          // Bottom
          if (!hasTile(t.x, t.y + 1)) {
            items.push(
              <AddBtn
                key={`bottom-${t.x}_${t.y}`}
                style={toScreen({ left: leftBase + TILE_SIZE / 2, top: topBase + TILE_SIZE + hudOffset })}
                onClick={() => addOrReplaceAt(t.x, t.y + 1)}
              />
            )
          }
          // Left
          if (!hasTile(t.x - 1, t.y)) {
            items.push(
              <AddBtn
                key={`left-${t.x}_${t.y}`}
                style={toScreen({ left: leftBase - hudOffset, top: topBase + TILE_SIZE / 2 })}
                onClick={() => addOrReplaceAt(t.x - 1, t.y)}
              />
            )
          }
          // Right
          if (!hasTile(t.x + 1, t.y)) {
            items.push(
              <AddBtn
                key={`right-${t.x}_${t.y}`}
                style={toScreen({ left: leftBase + TILE_SIZE + hudOffset, top: topBase + TILE_SIZE / 2 })}
                onClick={() => addOrReplaceAt(t.x + 1, t.y)}
              />
            )
          }
          return items
        })}
      </div>

      {/* Tile Manager Modal */}
      {selectedTile && (
        <TileImageManager
          tileX={selectedTile.tileX}
          tileY={selectedTile.tileY}
          zoomLevel={1}
          onClose={() => setSelectedTile(null)}
          onUpdate={() => {
            setTileRefreshTrigger(prev => prev + 1)
            setSelectedTile(null)
          }}
        />
      )}
    </div>
  )
}
