/**
 * MapPage.jsx
 *
 * Página principal del mapa interactivo de la aplicación.
 * Orquesta la visualización del mapa, paneles de puntos, filtros, acciones de administrador y notificaciones.
 * Utiliza múltiples contextos y componentes para la experiencia de usuario en el mapa.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { companyService, pointService } from '../services/api'
import { useSearch } from '../contexts/SearchContext.jsx'
import { SlidersHorizontal } from 'lucide-react'
import { Skeleton, SkeletonText } from '../components/UI/Skeleton.jsx'

export default function MapPage() {
  const { isAdmin } = useAuth()
  const {
    query, setQuery,
    committedQuery,
    loading: searchLoading,
    error: searchError,
    open, setOpen,
    activeIndex, moveActive,
    flatList,
    triggerEnter, enterTick,
    selection, selectSuggestion, selectActive,
  } = useSearch()

  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const mapContainerRef = useRef(null)
  const [companies, setCompanies] = useState([])
  const [filters, setFilters] = useState(() => ({ companyId: '', category: '' }))
  const [searchPanelOpen, setSearchPanelOpen] = useState(false)
  const searchInputRef = useRef(null)
  const searchPanelRef = useRef(null)
  const searchListId = 'map-search-listbox'

  const fetchPoints = useCallback(() => pointService.getPoints()
    .then(res => {
      setPoints(Array.isArray(res.data) ? res.data : (res.data?.points || []))
    })
    .catch(() => {}), [])

  const fetchCompanies = useCallback(() => companyService.getCompanies({ params: { page: 1, limit: 1000 } })
    .then((res) => {
      const data = res?.data
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.companies)
        ? data.companies
        : []
      setCompanies(list.filter(Boolean))
    })
    .catch(() => setCompanies([])), [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([fetchPoints(), fetchCompanies()])
      .then(() => { if (!mounted) return })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [fetchPoints, fetchCompanies])

  const companyOptions = useMemo(() => {
    return (Array.isArray(companies) ? companies : [])
      .map((company) => ({
        id: company?._id || company?.id || '',
        nombre: company?.nombre || company?.name || ''
      }))
      .filter((company) => company.id && company.nombre)
  }, [companies])

  const categoryOptions = useMemo(() => {
    return [...new Set((points || []).map((point) => point?.categoria).filter(Boolean))]
  }, [points])

  const filteredPoints = useMemo(() => {
    const companyId = String(filters?.companyId || '').trim()
    const category = String(filters?.category || '').trim().toLowerCase()
    const text = String(committedQuery || '').trim().toLowerCase()

    return (points || []).filter((point) => {
      if (!point) return false

      const floors = Array.isArray(point?.pisos) ? point.pisos : []

      const companyCandidates = [
        point?.compania_propietaria,
        point?.compania_alojada,
        point?.compañia,
        point?.company_id,
        ...floors.flatMap((floor) => [
          floor?.compania_propietaria,
          floor?.compania_alojada,
          floor?.compañia
        ])
      ]
        .map((value) => String(value || '').trim())
        .filter(Boolean)

      if (companyId && !companyCandidates.includes(companyId)) return false

      const pointCategory = String(point?.categoria || '').trim().toLowerCase()
      if (category && pointCategory !== category) return false

      if (text.length >= 2) {
        const haystack = [
          point?.nombre,
          point?.categoria,
          point?.company_name,
          point?.compania_propietaria_nombre,
          point?.compania_alojada_nombre,
          point?.compañia?.nombre,
          ...floors.flatMap((floor) => [
            floor?.nombre,
            floor?.categoria,
            floor?.compania_propietaria_nombre,
            floor?.compania_alojada_nombre
          ])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!haystack.includes(text)) return false
      }

      return true
    })
  }, [points, filters, committedQuery])

  // Atajos: '/' enfoca búsqueda si no estás en un input/textarea; ESC cierra sugerencias
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = document.activeElement?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable) {
          e.preventDefault()
          setSearchPanelOpen(true)
          searchInputRef.current?.focus()
        }
      } else if (e.key === 'Escape') {
        setOpen?.(false)
        setSearchPanelOpen(false)
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
    const q = (committedQuery || '').toLowerCase()
    if (!q) return
    const exact = points.find(p => (p?.nombre || '').toLowerCase() === q)
    if (exact) {
      // Abrir panel del punto exacto
      setSelectedPoint(exact)
      setIsPanelOpen(true)
      setOpen(false)
    }
  }, [enterTick, selection, committedQuery, points, setOpen])

  useEffect(() => {
    const onDoc = (e) => {
      if (!searchPanelOpen) return
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target)) {
        setSearchPanelOpen(false)
        setOpen?.(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [searchPanelOpen, setOpen])

  const mapViewValue = useMemo(() => createStableMapViewValue(mapContainerRef), [])
  const isComboboxOpen = searchPanelOpen && open && (committedQuery || '').length >= 2 && flatList.length > 0

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
  <div className="relative flex-1 min-h-0 h-full bg-white dark:bg-surface transition-colors duration-300">
        <div className="relative flex-1 h-full" ref={mapContainerRef}>
          <div className="absolute top-4 left-4 right-4 md:top-5 md:left-6 md:right-6 z-50 pointer-events-none select-none">
            <div className="flex items-start justify-between">
              <div className="relative pointer-events-auto" ref={searchPanelRef}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchPanelOpen((prev) => {
                      const next = !prev
                      if (next) requestAnimationFrame(() => searchInputRef.current?.focus())
                      else setOpen?.(false)
                      return next
                    })
                  }}
                  className="inline-flex items-center justify-center min-w-[44px] h-12 px-4 rounded-xl border bg-white dark:bg-surface border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  aria-label="Abrir búsqueda"
                  aria-expanded={searchPanelOpen}
                  aria-haspopup="dialog"
                >
                  <Search size={18} />
                </button>

                {searchPanelOpen && (
                  <div className="absolute left-0 mt-2 w-[min(32rem,calc(100vw-2rem))] md:w-[36rem] bg-white/95 dark:bg-surface/95 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4" role="dialog" aria-label="Buscar puntos, objetos o compañías">
                    <div className="flex items-center h-12 rounded-xl border border-gray-300/80 dark:border-gray-600 bg-white dark:bg-surface px-4 transition-colors focus-within:border-primary-500/80 focus-within:ring-2 focus-within:ring-primary-500/20">
                      <Search size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        role="combobox"
                        value={query}
                        onChange={(e) => { setQuery?.(e.target.value); setOpen?.(false) }}
                        onFocus={() => { if ((committedQuery || '').length >= 2 && flatList.length > 0) setOpen?.(true) }}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') { e.preventDefault(); moveActive?.(1) }
                          else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive?.(-1) }
                          else if (e.key === 'Enter') {
                            e.preventDefault()
                            if (open && flatList.length > 0) {
                              selectActive?.()
                            }
                            triggerEnter?.(query)
                            setOpen?.(false)
                          }
                          else if (e.key === 'Escape') { setOpen?.(false); setSearchPanelOpen(false) }
                        }}
                        placeholder="Escribir para buscar"
                        className="w-full bg-transparent text-base text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none"
                        aria-expanded={isComboboxOpen}
                        aria-controls={searchListId}
                        aria-autocomplete="list"
                        aria-activedescendant={isComboboxOpen && activeIndex >= 0 ? `search-opt-${activeIndex}` : undefined}
                        aria-label="Buscar puntos, objetos o compañías"
                      />
                      {(query || '').length > 0 && (
                        <button
                          onClick={() => { setQuery?.(''); triggerEnter?.(''); setOpen?.(false) }}
                          className="ml-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Limpiar búsqueda"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400" aria-live="polite">
                      {searchLoading
                        ? 'Cargando resultados…'
                        : searchError
                        ? 'Error al cargar resultados'
                        : `${flatList.length} resultados · Enter para buscar`}
                    </div>

                    {isComboboxOpen && (
                      <div id={searchListId} className="mt-2 bg-white dark:bg-surface-raised border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-colors" role="listbox" aria-label="Resultados de búsqueda">
                        <div className="max-h-72 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
                          {flatList.map((row, idx) => (
                            <button
                              key={`${row.type}-${row.item._id || row.item.nombre}`}
                              role="option"
                              id={`search-opt-${idx}`}
                              aria-selected={idx === activeIndex}
                              className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${idx === activeIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                const selectedText = row?.item?.nombre || query
                                setQuery?.(selectedText)
                                selectSuggestion?.(row)
                                triggerEnter?.(selectedText)
                                setOpen?.(false)
                              }}
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
                )}
              </div>

              <div className="shrink-0 pointer-events-auto">
                <FiltersInline
                  filters={filters}
                  setFilters={setFilters}
                  companies={companyOptions}
                  categories={categoryOptions}
                />
              </div>
            </div>
          </div>

          <PointPanelsProvider getBounds={getBounds}>
            {/* MapViewProvider: exposes transforms based on a mutable ref updated by MapComponent callbacks */}
            <MapViewProvider value={mapViewValue}>
              <MemoMapWithPanels
                mapContainerRef={mapContainerRef}
                points={filteredPoints}
                fetchPoints={fetchPoints}
              />
              {/* Panels overlay */}
              <PanelsOverlay />
              {/* Controller reacts to search selection to open panels */}
              <PanelsController selection={selection} enterTick={enterTick} onCloseSearch={() => setOpen(false)} />
              {/* Interaction overlay + admin FAB (admin only) */}
              <MapInteractionLayer onChanged={fetchPoints} />
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

const MemoMapWithPanels = React.memo(MapWithPanels)

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
      if (!el) {
        console.warn('⚠️ [SCREEN_TO_BOARD] No container available')
        return { x, y }
      }
      const rect = el.getBoundingClientRect()
      const sx = x - rect.left
      const sy = y - rect.top
      const bx = (sx - __mapViewRef.offset.x) / __mapViewRef.scale
      const by = (sy - __mapViewRef.offset.y) / __mapViewRef.scale
      const tileSize = __mapViewRef.tileSize || 512
      const minAbsX = (__mapViewRef.minX || 0) * tileSize
      const minAbsY = (__mapViewRef.minY || 0) * tileSize
      const maxAbsX = ((__mapViewRef.maxX || 0) + 1) * tileSize
      const maxAbsY = ((__mapViewRef.maxY || 0) + 1) * tileSize
      const centerAbsX = (minAbsX + maxAbsX) / 2
      const centerAbsY = (minAbsY + maxAbsY) / 2
      const absX = bx + minAbsX
      const absY = by + minAbsY
      return {
        x: absX,
        y: absY,
        centeredX: absX - centerAbsX,
        centeredY: absY - centerAbsY,
        legacyX: bx,
        legacyY: by
      }
    },
    boardToScreen: (bx, by) => {
      const el = containerRef.current || __mapViewRef.container
      if (!el) {
        console.warn('⚠️ [BOARD_TO_SCREEN] No container available')
        return { x: bx, y: by }
      }
      const rect = el.getBoundingClientRect()
      const tileSize = __mapViewRef.tileSize || 512
      const minAbsX = (__mapViewRef.minX || 0) * tileSize
      const minAbsY = (__mapViewRef.minY || 0) * tileSize
      const localX = bx - minAbsX
      const localY = by - minAbsY
      const sx = __mapViewRef.offset.x + localX * __mapViewRef.scale
      const sy = __mapViewRef.offset.y + localY * __mapViewRef.scale
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
        className={`inline-flex items-center justify-center min-w-[44px] h-12 px-4 rounded-xl border text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${hasActive ? 'bg-primary-600 border-primary-500 text-white hover:bg-primary-500 shadow-sm' : 'bg-white dark:bg-surface border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-raised'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal size={16} />
        {hasActive && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-primary-200 animate-pulse" />}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-surface backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 text-sm z-30"
          data-filters-popover="open"
          ref={el => { if (el) { el.__close = () => setOpen(false) } }}
          role="dialog"
          aria-label="Filtros"
        >
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Filtros</div>
          <div className="space-y-4 max-h-80 overflow-auto pr-1 custom-scroll">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Compañía (propietaria o alojada)</label>
              <select
                value={filters.companyId}
                onChange={(e) => setField('companyId', e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => setField('category', e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button onClick={clear} className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">Limpiar</button>
            <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md bg-primary-600 hover:bg-primary-500 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

