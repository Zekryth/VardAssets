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

  const bbox = useMemo(() => {
    if (!tiles.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    const xs = tiles.map(t => t.x), ys = tiles.map(t => t.y)
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
  }, [tiles])

  const cols = bbox.maxX - bbox.minX + 1
  const rows = bbox.maxY - bbox.minY + 1
  const boardW = cols * TILE_SIZE
  const boardH = rows * TILE_SIZE

  // Restore persisted view or center the board on first mount
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    onContainer?.(el)
    try {
      const saved = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null')
      if (saved && typeof saved.scale === 'number' && saved.offset && typeof saved.offset.x === 'number') {
        setScale(Math.min(2, Math.max(0.25, saved.scale)))
        setOffset({ x: saved.offset.x, y: saved.offset.y })
        onViewInfo?.({
          scale: saved.scale,
          offset: { x: saved.offset.x, y: saved.offset.y },
          tileSize: TILE_SIZE,
          gridOffX: bbox.minX || 0,
          gridOffY: bbox.minY || 0,
          minX: bbox.minX || 0,
          minY: bbox.minY || 0,
          maxX: bbox.maxX || 0,
          maxY: bbox.maxY || 0
        })
        return
      }
    } catch {}
    const r = el.getBoundingClientRect()
    setOffset({ x: (r.width - boardW * scale) / 2, y: (r.height - boardH * scale) / 2 })
    onViewInfo?.({
      scale,
      offset: { x: (r.width - boardW * scale) / 2, y: (r.height - boardH * scale) / 2 },
      tileSize: TILE_SIZE,
      gridOffX: bbox.minX || 0,
      gridOffY: bbox.minY || 0,
      minX: bbox.minX || 0,
      minY: bbox.minY || 0,
      maxX: bbox.maxX || 0,
      maxY: bbox.maxY || 0
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onWheel = (e) => {
    e.preventDefault()
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const prev = scale
    const next = Math.min(2, Math.max(0.25, scale * (e.deltaY > 0 ? 0.9 : 1.1)))
    const dx = mouseX - offset.x
    const dy = mouseY - offset.y
    const nx = mouseX - (dx * next) / prev
    const ny = mouseY - (dy * next) / prev
    setScale(next)
    const newOffset = { x: nx, y: ny }
    setOffset(newOffset)
    onViewInfo?.({
      scale: next,
      offset: newOffset,
      tileSize: TILE_SIZE,
      gridOffX: bbox.minX || 0,
      gridOffY: bbox.minY || 0,
      minX: bbox.minX || 0,
      minY: bbox.minY || 0,
      maxX: bbox.maxX || 0,
      maxY: bbox.maxY || 0
    })
    try { localStorage.setItem(VIEW_KEY, JSON.stringify({ scale: next, offset: newOffset })) } catch {}
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
    onViewInfo?.({
      scale,
      offset: newOffset,
      tileSize: TILE_SIZE,
      gridOffX: bbox.minX || 0,
      gridOffY: bbox.minY || 0,
      minX: bbox.minX || 0,
      minY: bbox.minY || 0,
      maxX: bbox.maxX || 0,
      maxY: bbox.maxY || 0
    })
  }
  const onPointerUp = () => {
    dragging.current = null
    window.removeEventListener('pointermove', onPointerMove)
    try { localStorage.setItem(VIEW_KEY, JSON.stringify({ scale, offset })) } catch {}
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
      title="Agregar sección"
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

  // NEW: emitir view info cuando cambie el bbox (tiles) o el offset/scale por efectos externos,
  // para que el contexto marque "ready" desde el inicio y no quedemos en "Inicializando..."
  useEffect(() => {
    if (!containerRef.current) return
    onViewInfo?.({
      scale,
      offset,
      tileSize: TILE_SIZE,
      gridOffX: bbox.minX || 0,
      gridOffY: bbox.minY || 0,
      minX: bbox.minX || 0,
      minY: bbox.minY || 0,
      maxX: bbox.maxX || 0,
      maxY: bbox.maxY || 0
    })
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
          viewport={{
            x: (bbox.minX || 0) * TILE_SIZE,
            y: (bbox.minY || 0) * TILE_SIZE,
            width: boardW,
            height: boardH
          }}
          refreshTrigger={tileRefreshTrigger}
        />

        {/* MapTileGrid - Grid visual de tiles (solo si está activado) */}
        {showTileGrid && (
          <MapTileGrid
            zoomLevel={1}
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
              title={`${pt?.nombre || 'Punto'}${pt?.compañia?.nombre ? ' — ' + pt.compañia.nombre : ''}`}
              aria-label={`${pt?.nombre || 'Punto'} — abrir panel`}
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
        <div style={{ position: 'absolute', left: 'calc(env(safe-area-inset-left) + 12px)', bottom: 'calc(env(safe-area-inset-bottom) + 12px)', color: '#9aa4b2', fontSize: 12 }}>
          Zoom: {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Toggle Grid Button */}
      {isAdmin && (
        <button
          onClick={() => setShowTileGrid(!showTileGrid)}
          className="absolute top-4 left-4 z-20 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          title={showTileGrid ? 'Ocultar grid de tiles' : 'Mostrar grid de tiles'}
        >
          {showTileGrid ? '🔲 Ocultar Grid' : '⬜ Mostrar Grid'}
        </button>
      )}

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
