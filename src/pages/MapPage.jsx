/**
 * MapPage.jsx
 *
 * Página principal del mapa interactivo de la aplicación.
 * Orquesta la visualización del mapa, paneles de puntos, filtros, acciones de administrador y notificaciones.
 * Utiliza múltiples contextos y componentes para la experiencia de usuario en el mapa.
 */
import React, { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import MapComponent from '../components/Map/MapComponent.jsx'
import { MapActionModeProvider, useMapActionMode } from '../contexts/MapActionModeContext.jsx'
import AdminActionFab from '../components/Map/AdminActionFab.jsx'
import MapInteractionLayer from '../components/Map/MapInteractionLayer.jsx'
import { PointPanelsProvider, usePointPanels } from '../contexts/PointPanelsContext.jsx'
import FloatingPointPanel from '../components/PointPanel/FloatingPointPanel.jsx'
import PointPanelsDock from '../components/PointPanel/PointPanelsDock.jsx'
import { MapViewProvider } from '../contexts/MapViewContext.jsx'
import { ToastProvider, useToast } from '../components/System/ToastContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { tileService, deletedPointsService } from '../services/api'
import PointPanel from '../components/PointPanel/PointPanel.jsx'
import { pointService } from '../services/api'
import { useSearch } from '../contexts/SearchContext.jsx'
import FloatingFilters from '../components/Filters/FloatingFilters.jsx'
import { SlidersHorizontal } from 'lucide-react'
import { Skeleton, SkeletonText } from '../components/UI/Skeleton.jsx'

export default function MapPage() {
  const { isAdmin } = useAuth()
  const {
    query, setQuery,
    debouncedQuery,
    open, setOpen,
    activeIndex, moveActive,
    flatList,
    loading: searchLoading,
    triggerEnter, enterTick,
    selection, selectSuggestion, selectActive,
  } = useSearch()

  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const controlsRef = useRef(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const mapContainerRef = useRef(null)
  const [filters, setFilters] = useState(() => ({ companyId: '', category: '' }))
  // Undo buffer simple para borrados recientes (memoria)
  const [undo, setUndo] = useState(null)
  // Barra de búsqueda siempre visible ahora
  const searchInputRef = useRef(null)
  const searchWrapperRef = useRef(null)

  const fetchPoints = () => pointService.getPoints()
    .then(res => {
      setPoints(Array.isArray(res.data) ? res.data : (res.data?.points || []))
    })
    .catch(() => {})

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchPoints()
      .then(() => { if (!mounted) return })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // Atajos: '/' enfoca búsqueda si no estás en un input/textarea; ESC cierra sugerencias
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = document.activeElement?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable) {
          e.preventDefault()
          searchInputRef.current?.focus()
        }
      } else if (e.key === 'Escape') {
        setOpen?.(false)
        // Cerrar popover de filtros inline si existe alguno abierto
        const anyActive = document.querySelector('[data-filters-popover="open"]')
        if (anyActive) {
          (anyActive).__close?.()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handlePointSelect = (point) => {
    setSelectedPoint(point)
    setIsPanelOpen(true)
  }

  const handlePanelClose = () => {
    setIsPanelOpen(false)
    setSelectedPoint(null)
  }

  useEffect(() => {
    if (!enterTick) return
    if (selection?.type === 'point' && selection.item) {
      setOpen(false)
      return
    }
    if (selection?.type === 'company' && selection.item) {
      const id = selection.item._id || selection.item.id || ''
      if (id) {
        setFilters((f) => ({ ...f, companyId: id }))
      }
      setOpen(false)
      return
    }
    const q = (debouncedQuery || '').toLowerCase()
    if (!q) return
    const exact = points.find(p => (p?.nombre || '').toLowerCase() === q)
    if (exact) {
      // Abrir panel del punto exacto
      setSelectedPoint(exact)
      setIsPanelOpen(true)
      setOpen(false)
    }
  }, [enterTick])

  // Cerrar al hacer click fuera del FloatingSearch
  // Ya no necesitamos cerrar por click externo; solo cerramos sugerencias con Escape

  if (loading) {
    return (
      <div className="flex h-[100dvh]">
  <div className="relative flex-1 min-h-0 h-full bg-white dark:bg-surface flex flex-col">
          <div className="px-4 pt-4 md:px-6 md:pt-5 select-none">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center flex-1 rounded-xl border border-gray-800 dark:border-gray-700 bg-gray-900/60 dark:bg-surface-raised/60 backdrop-blur px-3 py-3 shadow-sm">
                <Skeleton className="h-4 w-4 rounded-full mr-3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-10 w-24 rounded-md hidden md:block" />
            </div>
          </div>
          <div className="flex-1 p-6 grid place-items-center">
            <div className="w-full max-w-sm space-y-6">
              <Skeleton className="h-52 w-full rounded-xl" />
              <SkeletonText lines={3} />
            </div>
          </div>
        </div>
        <aside className="hidden lg:flex w-[380px] xl:w-[420px] border-l border-gray-800 bg-white dark:bg-surface p-6">
          <div className="w-full space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <SkeletonText lines={5} />
          </div>
        </aside>
      </div>
    )
  }

  const getBounds = () => {
    const el = mapContainerRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { width: r.width, height: r.height }
  }

  return (
    <ToastProvider>
    <MapActionModeProvider>
    <div className="flex h-[100dvh]">
      {/* Center map area */}
  <div className="relative flex-1 min-h-0 h-full bg-white dark:bg-surface flex flex-col transition-colors duration-300">
        {/* Top toolbar */}
        <div className="relative z-20 px-4 pt-4 md:px-6 md:pt-5 select-none" ref={searchWrapperRef}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-surface-raised/80 backdrop-blur px-3 py-2 shadow-lg transition-colors duration-300" role="search" aria-label="Buscar puntos, objetos o compañías">
              <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery?.(e.target.value)}
                onFocus={() => { if ((debouncedQuery || '').length >= 2) setOpen?.(true) }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); moveActive?.(1) }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive?.(-1) }
                  else if (e.key === 'Enter') { e.preventDefault(); selectActive?.(); triggerEnter?.(); setOpen?.(false) }
                  else if (e.key === 'Escape') { setOpen?.(false) }
                }}
                placeholder="Buscar puntos, objetos o compañías (/ para enfocar)"
                className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none"
                aria-label="Buscar puntos, objetos o compañías"
              />
              {(debouncedQuery || '').length > 0 && (
                <button
                  onClick={() => { setQuery?.(''); setOpen?.(false) }}
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  Limpiar
                </button>
              )}
            </div>
            {/* Filtros integrados (desktop) */}
            <div className="hidden md:block relative">
              <FiltersInline
                filters={filters}
                setFilters={setFilters}
                companies={Array.from(
                  new Map(
                    points
                      .filter(Boolean)
                      .map(p => {
                        const c = p?.compañia
                        const id = c?._id || c?.id
                        return id ? [id, c] : [undefined, undefined]
                      })
                      .filter(([id, c]) => Boolean(id && c))
                  ).values()
                ).filter(Boolean)}
                categories={[...new Set(points.filter(Boolean).map(p => p?.categoria).filter(Boolean))]}
              />
            </div>
            {/* Botón compacto mobile */}
            <div className="md:hidden">
              <MobileFiltersButton
                filters={filters}
                setFilters={setFilters}
                companies={Array.from(
                  new Map(
                    points
                      .filter(Boolean)
                      .map(p => {
                        const c = p?.compañia
                        const id = c?._id || c?.id
                        return id ? [id, c] : [undefined, undefined]
                      })
                      .filter(([id, c]) => Boolean(id && c))
                  ).values()
                ).filter(Boolean)}
                categories={[...new Set(points.filter(Boolean).map(p => p?.categoria).filter(Boolean))]}
              />
            </div>
          </div>
          {/* Dropdown de sugerencias */}
          {open && (debouncedQuery || '').length >= 2 && flatList.length > 0 && (
            <div className="absolute left-4 md:left-6 top-full mt-2 w-[calc(100%-2rem)] md:w-[640px] max-w-[90vw] bg-white dark:bg-surface-raised border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden transition-colors" role="listbox" aria-label="Resultados de búsqueda" aria-activedescendant={activeIndex >=0 ? `search-opt-${activeIndex}`: undefined}>
              <div className="max-h-72 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
                {flatList.map((row, idx) => (
                  <button
                    key={`${row.type}-${row.item._id || row.item.nombre}`}
                    role="option"
                    id={`search-opt-${idx}`}
                    aria-selected={idx === activeIndex}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${idx === activeIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { selectSuggestion?.(row); triggerEnter?.(); setOpen?.(false) }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] uppercase">{row.type[0]}</span>
                    <span className="truncate">
                      {row.type === 'point' && `${row.item.nombre} — ${row.item.compañia?.nombre || ''}`}
                      {row.type === 'company' && `${row.item.nombre}`}
                      {row.type === 'object' && `${row.item.nombre}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map fills remaining space */}
        <div className="relative flex-1" ref={mapContainerRef}>
          <PointPanelsProvider getBounds={getBounds}>
            {/* MapViewProvider: exposes transforms based on a mutable ref updated by MapComponent callbacks */}
            <MapViewProvider value={createStableMapViewValue(mapContainerRef)}>
              <MapWithPanels
                mapContainerRef={mapContainerRef}
                points={points}
                fetchPoints={fetchPoints}
              />
              {/* Panels overlay */}
              <PanelsOverlay />
              {/* Controller reacts to search selection to open panels */}
              <PanelsController selection={selection} enterTick={enterTick} onCloseSearch={() => setOpen(false)} />
              {/* Interaction overlay + admin FAB (admin only) */}
              <MapInteractionLayer points={points} onChanged={fetchPoints} />
              <AdminActionFab isAdmin={isAdmin} />
              {/* Dock */}
              <PointPanelsDock />
            </MapViewProvider>
          </PointPanelsProvider>
        </div>

        {/* Eliminados filtros flotantes en desktop; retained mobile popover through MobileFiltersButton */}

        {/* Mobile/Tablet floating panel */}
        <div className="lg:hidden">
          <PointPanel
            point={selectedPoint}
            isOpen={isPanelOpen}
            onClose={handlePanelClose}
            onUpdate={() => {}}
            onDelete={() => {}}
            variant="floating"
          />
        </div>
      </div>

      {/* Right docked panel (desktop) — oculto, ahora usamos paneles flotantes */}
    </div>
    </MapActionModeProvider>
    </ToastProvider>
  )
}

function MapWithPanels({ points, mapContainerRef, fetchPoints }) {
  const { openPanel } = usePointPanels()
  const { mode, setMode, resetMode } = useMapActionMode()
  const { push } = useToast()

  // Atajos de teclado: A (agregar), M (mover), D (borrar), Esc (idle)
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return
      if (e.key?.toLowerCase() === 'a') setMode('adding')
      else if (e.key?.toLowerCase() === 'm') setMode('moving')
      else if (e.key?.toLowerCase() === 'd') setMode('deleting')
      else if (e.key === 'Escape') resetMode()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setMode, resetMode])
  return (
    <>
    <MapComponent
      onViewInfo={(info)=>updateStableMapView(mapContainerRef, info)}
      onContainer={(el)=>assignStableContainer(mapContainerRef, el)}
      points={points}
      onPointSelect={(p)=> {
        // Abrir panel siempre en idle (no hace falta modo 'editing')
        if (mode === 'idle') openPanel?.(p)
      }}
      isMoving={mode === 'moving'}
      onPointMove={async (pt, nx, ny) => {
        try {
          const id = pt?._id || pt?.id
          if (!id) return
          const res = await pointService.updatePoint(id, { coordenadas: { x: nx, y: ny } })
          await fetchPoints()
          const p = res.data?.point || res.data
          if (p) openPanel?.(p)
          push({ type: 'success', title: 'Punto movido', message: `${p?.nombre || 'Punto'} a (${nx}, ${ny})` })
        } catch (err) {
          console.error('move failed', err)
          push({ type: 'error', title: 'No se pudo mover', message: err?.response?.data?.message || err?.message })
        }
      }}
      onPointDelete={async (pt) => {
        try {
          const id = pt?._id || pt?.id
          if (!id) return
          // Prompt for reason (optional but encouraged)
          let reason = ''
          try {
            // eslint-disable-next-line no-alert
            reason = window.prompt('Motivo del borrado (opcional):', '') || ''
          } catch {}
          const context = { source: 'map', at: Date.now() }
          const res = await pointService.deletePoint(id, { reason, context })
          await fetchPoints()
          const deleted = res.data?.deleted
          if (deleted?._id) {
            push({ type: 'success', title: 'Punto borrado', message: `${pt.nombre}`, timeout: 3500, action: async () => {
              try { await deletedPointsService.restore(deleted._id); await fetchPoints() } catch {}
            } })
          } else {
            push({ type: 'success', title: 'Punto borrado', message: `${pt.nombre}` })
          }
        } catch (err) {
          console.error('delete failed', err)
          push({ type: 'error', title: 'No se pudo borrar', message: err?.response?.data?.message || err?.message })
        }
      }}
    />
    </>
  )
}

function PanelsOverlay() {
  const { panels } = usePointPanels()
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {panels.map(p => (
        <div key={p.id} className="pointer-events-auto">
          <FloatingPointPanel panel={p} />
        </div>
      ))}
    </div>
  )
}

function PanelsController({ selection, enterTick, onCloseSearch }) {
  const { openPanel } = usePointPanels()
  useEffect(() => {
    if (!enterTick) return
    if (selection?.type === 'point' && selection.item) {
      openPanel(selection.item)
      onCloseSearch?.()
    }
  }, [enterTick])
  return null
}

// MapView helpers: create a stable value object tied to a ref container
// Stable MapView provider value using a module-level ref captured by closures
let __mapViewRef = { scale: 1, offset: { x: 0, y: 0 }, container: null, tileSize: 512, gridOffX: 0, gridOffY: 0, ready: false, minX: 0, minY: 0, maxX: 0, maxY: 0 }
function createStableMapViewValue(containerRef) {
  return {
    screenToBoard: (x, y) => {
      const el = containerRef.current || __mapViewRef.container
      if (!el) return { x, y }
      const rect = el.getBoundingClientRect()
      const sx = x - rect.left
      const sy = y - rect.top
      const bx = (sx - __mapViewRef.offset.x) / __mapViewRef.scale
      const by = (sy - __mapViewRef.offset.y) / __mapViewRef.scale
      return { x: bx, y: by }
    },
    boardToScreen: (bx, by) => {
      const el = containerRef.current || __mapViewRef.container
      if (!el) return { x: bx, y: by }
      const rect = el.getBoundingClientRect()
      const sx = __mapViewRef.offset.x + bx * __mapViewRef.scale
      const sy = __mapViewRef.offset.y + by * __mapViewRef.scale
      return { x: sx + rect.left, y: sy + rect.top }
    },
    container: null,
    tileSize: __mapViewRef.tileSize,
    gridOffX: __mapViewRef.gridOffX,
    gridOffY: __mapViewRef.gridOffY,
    ready: __mapViewRef.ready,
    minX: __mapViewRef.minX,
    minY: __mapViewRef.minY,
    maxX: __mapViewRef.maxX,
    maxY: __mapViewRef.maxY
  }
}
function updateStableMapView(_containerRef, info) { __mapViewRef = { ...__mapViewRef, ...info, ready: true } }
function assignStableContainer(_containerRef, el) { __mapViewRef = { ...__mapViewRef, container: el } }

// Inline filter popover for desktop
function FiltersInline({ filters, setFilters, companies, categories }) {
  const [open, setOpen] = useState(false)
  const hasActive = Boolean(filters.companyId || filters.category)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => {
      if (!open) return
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const setField = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const clear = () => setFilters({ companyId: '', category: '' })
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1 h-10 px-3 rounded-md border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${hasActive ? 'bg-primary-600 border-primary-500 text-white hover:bg-primary-500' : 'bg-white dark:bg-surface-raised/60 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-raised'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SlidersHorizontal size={16} />
        <span className="hidden xl:inline">Filtros</span>
        {hasActive && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-primary-300 animate-pulse" />}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-72 bg-surface-raised/95 dark:bg-surface backdrop-blur border border-gray-700 rounded-xl shadow-2xl p-4 text-sm z-30"
          data-filters-popover="open"
          ref={el => { if (el) { el.__close = () => setOpen(false) } }}
          role="dialog"
          aria-label="Filtros"
        >
          <div className="font-medium text-gray-100 mb-3">Filtros</div>
          <div className="space-y-4 max-h-80 overflow-auto pr-1 custom-scroll">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Compañía</label>
              <select
                value={filters.companyId}
                onChange={(e) => setField('companyId', e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-950 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {companies.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => setField('category', e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-950 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800 dark:border-gray-700">
            <button onClick={clear} className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">Limpiar</button>
            <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary-600 hover:bg-primary-500 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileFiltersButton({ filters, setFilters, companies, categories }) {
  // Reutiliza FloatingFilters existente para mobile usando la API original
  return (
    <FloatingFilters
      value={filters}
      onChange={setFilters}
      companies={companies}
      categories={categories}
    />
  )
}