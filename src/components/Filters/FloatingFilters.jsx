/**
 * FloatingFilters.jsx
 *
 * Componente de filtros flotantes para el mapa o listados.
 * Permite filtrar por compañía y categoría desde un panel flotante en la interfaz.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const FloatingFilters = ({ companies = [], categories = [], value, onChange }) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const hasActive = useMemo(() => {
    return Boolean(value?.companyId || value?.category)
  }, [value])

  const setField = (k, v) => {
    const next = { ...(value || {}), [k]: v }
    onChange?.(next)
  }

  const clear = () => onChange?.({ companyId: '', category: '' })

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
  <div ref={wrapperRef} className="relative z-20 transition-colors">
      {/* Toggle button (hidden when panel open) */}
      {!open && (
        <button
          type="button"
          className={`relative inline-flex items-center justify-center min-w-[44px] h-12 px-4 rounded-xl shadow border transition-colors duration-300 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${hasActive ? 'bg-primary-600 border-primary-500 text-white hover:bg-primary-500' : 'bg-white/95 border-gray-300 text-gray-700 hover:bg-white dark:bg-surface dark:border-gray-600 dark:text-gray-200 dark:hover:bg-surface-raised'}`}
          onClick={() => setOpen(true)}
          aria-label="Abrir filtros"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <SlidersHorizontal size={18} />
          <span className="ml-2 text-sm font-semibold">Filtros</span>
          {hasActive && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
          )}
        </button>
      )}

      {/* Panel (replaces the button) */}
      {open && (
        <div role="dialog" aria-label="Filtros de búsqueda" className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-surface/95 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 text-sm text-gray-700 dark:text-gray-200 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-800 dark:text-gray-200">Filtros</div>
            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" onClick={() => setOpen(false)} aria-label="Cerrar filtros">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1">Compañía</label>
              <select
                value={value?.companyId || ''}
                onChange={(e) => setField('companyId', e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {companies.map((c) => (
                  <option key={c._id || c.id || c.nombre} value={c._id || c.id || ''}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1">Categoría</label>
              <select
                value={value?.category || ''}
                onChange={(e) => setField('category', e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={clear}
                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-md bg-primary-600 hover:bg-primary-500 text-white transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingFilters
