/**
 * MapModule.jsx
 *
 * Módulo de mapa basado en Leaflet para renderizar tiles e interactuar con puntos.
 * Permite a administradores expandir el mapa y gestiona la visualización de marcadores y cuadrantes.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as L from 'leaflet'
import { tileService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext.jsx'

// MapModule: Leaflet CRS.Simple with modular image tiles and admin expansion HUD
// Props:
// - points?: Array<{ _id: string, nombre: string, compañia?: { nombre?: string }, categoria?: string, coordenadas: { x:number, y:number } }>
// - onPointSelect?: (point) => void
// - tileSize?: number (default 256)
// - z?: number (default 0)
export default function MapModule({ points = [], onPointSelect, tileSize = 256, z = 0 }) {
  const { isAdmin } = useAuth()
  const admin = typeof isAdmin === 'function' ? isAdmin() : false
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const gridLayerRef = useRef(null)
  const markersLayerRef = useRef(null)
  const [tiles, setTiles] = useState([])
  const [loadingTiles, setLoadingTiles] = useState(false)
  const [err, setErr] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const missRef = useRef(new Map())

  const bbox = useMemo(() => {
    if (!tiles.length) return null
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const t of tiles) {
      if (typeof t.x !== 'number' || typeof t.y !== 'number') continue
      minX = Math.min(minX, t.x)
      maxX = Math.max(maxX, t.x)
      minY = Math.min(minY, t.y)
      maxY = Math.max(maxY, t.y)
    }
    if (!isFinite(minX)) return null
    return { minX, maxX, minY, maxY }
  }, [tiles])

  const dims = useMemo(() => {
    if (!bbox) return { cols: 10, rows: 10, offX: 0, offY: 0 }
    const cols = (bbox.maxX - bbox.minX + 1)
    const rows = (bbox.maxY - bbox.minY + 1)
    return { cols, rows, offX: bbox.minX, offY: bbox.minY }
  }, [bbox])

  const fetchTiles = async () => {
    setLoadingTiles(true)
    setErr('')
    try {
      const res = await tileService.list(z)
      setTiles(res.data?.tiles || [])
    } catch (e) {
      console.error('list tiles error', e)
      setErr('No se pudo cargar tiles')
    } finally {
      setLoadingTiles(false)
    }
  }

  useEffect(() => { fetchTiles() }, [z])

  // Initialize Leaflet map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const ts = tileSize
    // Build map
    const map = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      inertia: true,
      zoomControl: false,
      attributionControl: false,
      minZoom: -2,
      maxZoom: 2,
    })
    mapRef.current = map

    // Persist view
    const persist = () => {
      try {
        const z = map.getZoom()
        const c = map.getCenter()
        localStorage.setItem('mapshade:zoom', String(z))
        localStorage.setItem('mapshade:center', JSON.stringify([c.lat, c.lng]))
      } catch {}
    }
    map.on('moveend', persist)
    map.on('zoomend', persist)

    // Click to upload (admin)
    if (admin) {
      map.on('click', async (e) => {
        if (!admin) return
        const p = map.project(e.latlng, 0)
        const x = Math.floor(p.x / ts) + (dims.offX || 0)
        const y = Math.floor(p.y / ts) + (dims.offY || 0)
        const file = await pickFile()
        if (!file) return
        await tileService.upload(x, y, file, z)
        await fetchTiles()
        setRefreshKey(Date.now())
      })
    }

    return () => {
      try { map.remove() } catch {}
      mapRef.current = null
      gridLayerRef.current = null
      markersLayerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef])

  // Create or update grid layer when dims or refreshKey changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const ts = tileSize
    // Set bounds to current dims
    const W = (dims.cols || 10) * ts
    const H = (dims.rows || 10) * ts
    const bounds = L.latLngBounds(map.unproject([0, H], 0), map.unproject([W, 0], 0))
    map.setMaxBounds(bounds.pad(0.1))
    // Initialize or refresh grid layer
    if (gridLayerRef.current) {
      try { gridLayerRef.current.remove() } catch {}
      gridLayerRef.current = null
    }
    const MISS_TTL = 5 * 60 * 1000
    const miss = missRef.current
    const offX = dims.offX || 0
    const offY = dims.offY || 0
    const GL = L.gridLayer
    const layer = GL({ tileSize: ts, className: 'grid-layer' })
    layer.createTile = (c) => {
      const el = L.DomUtil.create('div')
      el.style.cssText = `width:${ts}px;height:${ts}px;box-sizing:border-box;border-right:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12);background:#fff;`
      const tx = c.x + offX
      const ty = c.y + offY
      const base = `/tiles/${z}/${tx}_${ty}`
      const k = `${tx}_${ty}`
      const now = Date.now()
      if ((now - (miss.get(k) || 0)) < MISS_TTL) return el
      const setImg = (u) => { el.style.backgroundImage = `url("${u}")`; el.style.backgroundSize = 'cover' }
      const tryJpg = () => { const j = new Image(); j.onload = () => setImg(`${base}.jpg?rk=${refreshKey}`); j.onerror = () => miss.set(k, Date.now()); j.src = `${base}.jpg?rk=${refreshKey}` }
      const p = new Image(); p.onload = () => setImg(`${base}.png?rk=${refreshKey}`); p.onerror = tryJpg; p.src = `${base}.png?rk=${refreshKey}`
      return el
    }
    layer.addTo(map)
    gridLayerRef.current = layer

    // Fit or restore view
    try {
      const zStr = localStorage.getItem('mapshade:zoom')
      const cStr = localStorage.getItem('mapshade:center')
      if (zStr && cStr) {
        const zV = Number(zStr)
        const cV = JSON.parse(cStr)
        if (Array.isArray(cV) && cV.length === 2 && Number.isFinite(zV)) {
          map.setView(cV, zV)
        } else {
          map.fitBounds(bounds)
        }
      } else {
        map.fitBounds(bounds)
      }
    } catch { map.fitBounds(bounds) }

  }, [dims.cols, dims.rows, dims.offX, dims.offY, tileSize, z, refreshKey])

  // Markers layer sync (basic implementation)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (markersLayerRef.current) {
      try { markersLayerRef.current.clearLayers() } catch {}
    } else {
      markersLayerRef.current = L.layerGroup().addTo(map)
    }
    const grp = markersLayerRef.current
    const ts = tileSize
    const offX = dims.offX || 0
    const offY = dims.offY || 0
    for (const p of points || []) {
      const x = (p?.coordenadas?.x ?? 0) - offX
      const y = (p?.coordenadas?.y ?? 0) - offY
      // Convert grid coords to pixel center
      const px = x * ts + ts / 2
      const py = y * ts + ts / 2
      const latlng = map.unproject([px, py], 0)
      const marker = L.marker(latlng, { title: p?.nombre || '' })
      if (p?.nombre) marker.bindTooltip(`${p.nombre} — ${p?.compañia?.nombre || ''}`, { direction: 'top', opacity: 0.9 })
      marker.on('click', () => onPointSelect?.(p))
      if (admin) {
        marker.on('contextmenu', (e) => {
          // Placeholder: surface context menu via custom event/callback
          // e.originalEvent contains clientX/clientY for positioning
          // You can wire this to open an app-level menu
        })
      }
      marker.addTo(grp)
    }
  }, [points, dims.offX, dims.offY, tileSize, admin, onPointSelect])

  const pickFile = () => new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.png,.jpg,.jpeg'
    input.onchange = () => resolve(input.files?.[0] || null)
    input.click()
  })

  // HUD handlers
  const addTile = async (x, y) => {
    const file = await pickFile()
    if (!file) return
    await tileService.upload(x, y, file, z)
    await fetchTiles()
    setRefreshKey(Date.now())
  }

  // Render container + HUD overlay
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {admin && (
        !bbox ? (
          <div className="absolute inset-0 pointer-events-none z-10">
            <button
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg"
              title="Agregar primer tile (0,0)"
              onClick={() => addTile(0, 0)}
            >
              +
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute left-1/2 top-6 -translate-x-1/2 flex gap-2 pointer-events-auto">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow" onClick={() => addTile(bbox.minX, bbox.minY - 1)}>+ Arriba</button>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow" onClick={() => addTile(bbox.maxX + 1, bbox.minY)}>+ Derecha</button>
            </div>
            <div className="absolute left-1/2 bottom-6 -translate-x-1/2 pointer-events-auto">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow" onClick={() => addTile(bbox.minX, bbox.maxY + 1)}>+ Abajo</button>
            </div>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow" onClick={() => addTile(bbox.minX - 1, bbox.minY)}>+ Izquierda</button>
            </div>
            {loadingTiles && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-300 bg-gray-900/70 px-2 py-1 rounded">Cargando…</div>
            )}
            {err && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs text-red-300 bg-red-900/40 px-2 py-1 rounded">{err}</div>
            )}
          </div>
        )
      )}
    </div>
  )
}
