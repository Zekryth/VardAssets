/**
 * CreatePointDialog.jsx
 *
 * Diálogo/modal para crear un nuevo punto en el mapa.
 * Permite ingresar nombre, categoría, compañía, inventario y adjuntar archivos (fotos/documentos).
 * Gestiona el estado del formulario y validaciones.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { companyService, objectService } from '../../services/api'
import PhotoUpload from './PhotoUpload'
import DocumentUpload from './DocumentUpload'

const cx = (...p) => p.filter(Boolean).join(' ')

export default function CreatePointDialog({ open, coords, onCancel, onConfirm }) {
  // form state
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [companiaId, setCompaniaId] = useState('')
  const [inventario, setInventario] = useState([]) // [{ objeto, cantidad }]
  const [fotos, setFotos] = useState([]) // URLs de fotos subidas
  const [documentos, setDocumentos] = useState([]) // URLs/metadata de documentos subidos
  const [files, setFiles] = useState({ fotos: [], documentos: [] })
  const [openTick, setOpenTick] = useState(0) // fuerza remount de inputs file

  // ux state
  const [companyFilter, setCompanyFilter] = useState('')
  const [objectsFilter, setObjectsFilter] = useState('')
  const [touched, setTouched] = useState({ nombre: false, categoria: false })

  // focus/aria
  const modalRef = useRef(null)

  // data sources
  const [companies, setCompanies] = useState([])
  const [objects, setObjects] = useState([])

  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  // Reset fuerte cada vez que se abre
  useEffect(() => {
    if (!open) return
    // limpiar formulario
    setNombre('')
    setCategoria('')
    setCompaniaId('')
    setInventario([])
    setFotos([])
    setDocumentos([])
    setFiles({ fotos: [], documentos: [] })
    setErrMsg('')
    setOpenTick(t => t + 1)
    setCompanyFilter('')
    setObjectsFilter('')
    setTouched({ nombre: false, categoria: false })

    // cargar catálogos
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        const [cRes, oRes] = await Promise.all([
          companyService?.getCompanies
            ? companyService.getCompanies({ params: { limit: 1000 } })
            : Promise.resolve({ data: [] }),
          objectService?.getObjects
            ? objectService.getObjects({ params: { limit: 1000 } })
            : Promise.resolve({ data: [] })
        ])
        if (ignore) return
        const cList = Array.isArray(cRes?.data?.data)
          ? cRes.data.data
          : Array.isArray(cRes?.data)
          ? cRes.data
          : Array.isArray(cRes)
          ? cRes
          : []
        const oList = Array.isArray(oRes?.data)
          ? oRes.data
          : Array.isArray(oRes)
          ? oRes
          : []
        setCompanies(cList.filter(Boolean))
        setObjects(oList.filter(Boolean))
      } catch (e) {
        setErrMsg(e?.response?.data?.message || e?.message || 'Error cargando catálogos')
        setCompanies([])
        setObjects([])
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => {
      ignore = true
    }
  }, [open])

  // Focus trap + autofocus first field
  useEffect(() => {
    if (!open) return
    const el = modalRef.current
    if (!el) return
    // autofocus
    const first = el.querySelector('input, select, button, textarea, [tabindex]:not([tabindex="-1"])')
    if (first && typeof first.focus === 'function') {
      first.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCancel?.()
        return
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          el.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        if (focusables.length === 0) return
        const firstEl = focusables[0]
        const lastEl = focusables[focusables.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === firstEl || !el.contains(document.activeElement)) {
            e.preventDefault()
            lastEl.focus()
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }
    }
    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  const handleAddInvRow = () => {
    setInventario((rows) => [...rows, { objeto: '', cantidad: 1 }])
  }

  const handleInvChange = (idx, patch) => {
    setInventario((rows) =>
      rows.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    )
  }

  const handleRemoveInvRow = (idx) => {
    setInventario((rows) => rows.filter((_, i) => i !== idx))
  }

  const canSave = Boolean(nombre && categoria)
  const nombreError = !nombre && touched.nombre ? 'Requerido' : ''
  const categoriaError = !categoria && touched.categoria ? 'Requerido' : ''

  const companiesOptions = useMemo(() => {
    return (Array.isArray(companies) ? companies : []).map((c) => ({
      id: c?._id || c?.id || '',
      name: c?.nombre || c?.name || ''
    }))
  }, [companies])

  const objectsOptions = useMemo(() => {
    return (Array.isArray(objects) ? objects : []).map((o) => ({
      id: o?._id || o?.id || '',
      name: o?.nombre || o?.name || '',
      categoria: o?.categoria || o?.category || ''
    }))
  }, [objects])

  const companiesFiltered = useMemo(() => {
    const q = companyFilter.trim().toLowerCase()
    if (!q) return companiesOptions
    return companiesOptions.filter((c) => c.name.toLowerCase().includes(q))
  }, [companiesOptions, companyFilter])

  const objectsFiltered = useMemo(() => {
    const q = objectsFilter.trim().toLowerCase()
    if (!q) return objectsOptions
    return objectsOptions.filter((o) =>
      o.name.toLowerCase().includes(q) || (o.categoria || '').toLowerCase().includes(q)
    )
  }, [objectsOptions, objectsFilter])

  const submit = () => {
    if (!canSave) return
    // normalizar inventario a { objeto, cantidad }
    const inv = (inventario || [])
      .map((r) => ({
        objeto: r?.objeto?._id || r?.objeto?.id || r?.objeto || '',
        cantidad: Number(r?.cantidad) || 1
      }))
      .filter((r) => r.objeto)
    onConfirm?.({
      nombre,
      categoria,
      compañia: companiaId || null,
      inventario: inv,
      fotos,
      documentos
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cpd-title"
      aria-describedby={errMsg ? 'cpd-err' : undefined}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        inset: 0,
        display: open ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,.35)',
        zIndex: 40
      }}
    >
      <div ref={modalRef} className="w-[640px] max-w-[92vw] rounded-xl bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 shadow-2xl outline-none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 id="cpd-title" className="font-semibold text-lg">Crear punto</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              X: {coords?.x ?? '-'} · Y: {coords?.y ?? '-'}
            </div>
          </div>
          <button
            className="px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={onCancel}
            aria-label="Cerrar"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {errMsg ? (
          <div id="cpd-err" className="px-5 py-2 text-sm text-red-600 dark:text-red-400 border-b border-gray-200 dark:border-gray-800" aria-live="polite">
            {errMsg}
          </div>
        ) : null}

        <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Nombre <span className="text-red-600 dark:text-red-400">*</span></label>
              <input
                className="w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                placeholder="Nombre del punto"
              />
              {nombreError ? (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">{nombreError}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Categoría <span className="text-red-600 dark:text-red-400">*</span></label>
              <input
                className="w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, categoria: true }))}
                placeholder="silla, mesa, ..." />
              {categoriaError ? (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">{categoriaError}</div>
              ) : null}
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Compañía</label>
              <input
                type="text"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                placeholder="Buscar compañía…"
                className="mb-2 w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
              />
              <select
                className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                value={companiaId}
                onChange={(e) => setCompaniaId(e.target.value)}
                disabled={loading}
              >
                <option value="">Sin compañía</option>
                {companiesFiltered.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {loading ? (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Cargando catálogos…</div>
              ) : null}
            </div>
          </div>

          {/* Inventario inicial */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Inventario inicial</label>
              <button
                type="button"
                className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
                onClick={handleAddInvRow}
              >
                + Agregar ítem
              </button>
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={objectsFilter}
                onChange={(e) => setObjectsFilter(e.target.value)}
                placeholder="Buscar objetos…"
                className="w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {inventario.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">Sin ítems. Usa “Agregar ítem”.</div>
            ) : (
              <div className="space-y-2">
                {inventario.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-8">
                      <select
                        className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                        value={row?.objeto?._id || row?.objeto || ''}
                        onChange={(e) =>
                          handleInvChange(idx, { objeto: e.target.value })
                        }
                        disabled={loading}
                      >
                        <option value="">Seleccione objeto…</option>
                        {objectsFiltered.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name} {o.categoria ? `· ${o.categoria}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min={1}
                        className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                        value={row?.cantidad ?? 1}
                        onChange={(e) =>
                          handleInvChange(idx, { cantidad: Number(e.target.value) || 1 })
                        }
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        className="px-2 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
                        onClick={() => handleRemoveInvRow(idx)}
                        title="Quitar"
                        aria-label="Quitar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Archivos */}
          <div className="space-y-6">
            <PhotoUpload
              pointId="temp"
              photos={fotos}
              onPhotosChange={setFotos}
            />
            
            <DocumentUpload
              pointId="temp"
              documents={documentos}
              onDocumentsChange={setDocumentos}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
          <button className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={cx(
              'px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50',
              !canSave && 'cursor-not-allowed'
            )}
            disabled={!canSave}
            onClick={submit}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}
