/**
 * CreatePointDialog.jsx
 *
 * Diálogo/modal para crear un nuevo punto en el mapa con soporte de múltiples pisos.
 * Permite ingresar nombre, categoría, compañía, y gestionar pisos con inventario y archivos independientes.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { companyService, objectService } from '../../services/api'
import PhotoUpload from './PhotoUpload'
import DocumentUpload from './DocumentUpload'

const cx = (...p) => p.filter(Boolean).join(' ')

export default function CreatePointDialog({ open, coords, onCancel, onConfirm }) {
  // Información del PUNTO (global)
  const [nombrePunto, setNombrePunto] = useState('')
  const [categoriaPunto, setCategoriaPunto] = useState('')
  const [companiaPunto, setCompaniaPunto] = useState(null)

  // Estado de pisos (cada piso tiene toda su información)
  const [pisos, setPisos] = useState([{
    numero: 1,
    nombre: 'Planta Baja',
    categoria: '',
    compañia: null,
    inventario: [],
    fotos: [],
    documentos: []
  }])
  const [pisoActual, setPisoActual] = useState(0)

  // ux state
  const [companyFilter, setCompanyFilter] = useState('')
  const [objectsFilter, setObjectsFilter] = useState('')
  const [touched, setTouched] = useState({ nombrePunto: false, nombre: false, categoria: false })

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
    // limpiar formulario del punto
    setNombrePunto('')
    setCategoriaPunto('')
    setCompaniaPunto(null)
    
    // limpiar formulario de pisos
    setPisos([{
      numero: 1,
      nombre: 'Planta Baja',
      categoria: '',
      compañia: null,
      inventario: [],
      fotos: [],
      documentos: []
    }])
    setPisoActual(0)
    setErrMsg('')
    setCompanyFilter('')
    setObjectsFilter('')
    setTouched({ nombrePunto: false, nombre: false, categoria: false })

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

  // Computed values
  const currentFloor = pisos[pisoActual]
  
  // Handlers de Pisos
  const handleAddFloor = () => {
    const newNumber = pisos.length + 1
    setPisos([
      ...pisos,
      {
        numero: newNumber,
        nombre: `Piso ${newNumber - 1}`,
        categoria: '',
        compañia: null,
        inventario: [],
        fotos: [],
        documentos: []
      }
    ])
    setPisoActual(pisos.length) // Cambiar al nuevo piso
  }

  const handleRemoveFloor = () => {
    if (pisos.length === 1) {
      alert('Debe haber al menos un piso')
      return
    }
    
    if (confirm(`¿Eliminar ${currentFloor.nombre}?`)) {
      const newPisos = pisos.filter((_, i) => i !== pisoActual)
      // Renumerar
      newPisos.forEach((piso, i) => {
        piso.numero = i + 1
      })
      setPisos(newPisos)
      // Ajustar índice actual
      if (pisoActual >= newPisos.length) {
        setPisoActual(newPisos.length - 1)
      }
    }
  }

  const updateCurrentFloor = (field, value) => {
    setPisos(prevPisos => {
      const newPisos = [...prevPisos]
      newPisos[pisoActual] = {
        ...newPisos[pisoActual],
        [field]: value
      }
      return newPisos
    })
  }

  const updateCurrentFloorName = (e) => {
    updateCurrentFloor('nombre', e.target.value)
  }

  // Handlers de Inventario del piso actual
  const handleAddInvRow = () => {
    const newInv = [...currentFloor.inventario, { objeto: '', cantidad: 1 }]
    updateCurrentFloor('inventario', newInv)
  }

  const handleInvChange = (idx, patch) => {
    const newInv = currentFloor.inventario.map((r, i) => 
      i === idx ? { ...r, ...patch } : r
    )
    updateCurrentFloor('inventario', newInv)
  }

  const handleRemoveInvRow = (idx) => {
    const newInv = currentFloor.inventario.filter((_, i) => i !== idx)
    updateCurrentFloor('inventario', newInv)
  }

  const canSave = Boolean(nombrePunto?.trim() && pisos[0]?.nombre)
  const nombrePuntoError = !nombrePunto && touched.nombrePunto ? 'Requerido' : ''
  const nombreError = !pisos[0]?.nombre && touched.nombre ? 'Requerido' : ''

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
    // Validar nombre del PUNTO
    if (!nombrePunto?.trim()) {
      alert('❌ El punto debe tener un nombre')
      setTouched(t => ({ ...t, nombrePunto: true }))
      return
    }
    
    // Validate coordinates
    if (!coords || typeof coords.x !== 'number' || typeof coords.y !== 'number') {
      console.error('❌ [CREATE DIALOG] Invalid coordinates:', coords)
      alert('Coordenadas inválidas. Por favor, cierra este diálogo y haz click en el mapa de nuevo.')
      return
    }
    
    // Validar que al menos el primer piso tenga nombre
    if (!pisos[0]?.nombre?.trim()) {
      alert('❌ El primer piso debe tener un nombre')
      setTouched(t => ({ ...t, nombre: true }))
      return
    }
    
    // Normalizar pisos: heredar categoría y compañía del punto si el piso no tiene
    const pisosNormalized = pisos.map(piso => ({
      numero: piso.numero,
      nombre: piso.nombre?.trim() || `Piso ${piso.numero}`,
      categoria: piso.categoria?.trim() || categoriaPunto?.trim() || '',
      compañia: piso.compañia || companiaPunto || null,
      inventario: (piso.inventario || [])
        .map(r => ({
          objeto: r?.objeto?._id || r?.objeto?.id || r?.objeto || '',
          cantidad: Number(r?.cantidad) || 1
        }))
        .filter(r => r.objeto),
      fotos: piso.fotos || [],
      documentos: piso.documentos || []
    }))
    
    const payload = {
      nombre: nombrePunto.trim(),        // ✅ Nombre del PUNTO (no del piso)
      categoria: categoriaPunto?.trim() || null,
      compañia: companiaPunto || null,
      coordenadas: coords,
      pisos: pisosNormalized
    }
    
    console.log('💾 [CREATE DIALOG] Payload completo:', {
      nombre: payload.nombre,
      categoria: payload.categoria,
      compañia: payload.compañia,
      coordenadas: payload.coordenadas,
      total_pisos: payload.pisos.length,
      pisos: payload.pisos
    })
    onConfirm?.(payload)
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
              📍 Coordenadas: X: {coords?.x ?? '-'} px · Y: {coords?.y ?? '-'} px
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
          
          {/* ==================== SECCIÓN 1: INFORMACIÓN DEL PUNTO ==================== */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-700">
            <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <span>🏢</span>
              <span>INFORMACIÓN DEL PUNTO</span>
            </h3>
            
            <div className="space-y-3">
              {/* Nombre del Punto */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Punto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombrePunto}
                  onChange={(e) => {
                    setNombrePunto(e.target.value)
                    setTouched(t => ({ ...t, nombrePunto: true }))
                  }}
                  placeholder="Ej: Edificio A, Container 123, Almacén Principal"
                  className={cx(
                    'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    nombrePuntoError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  )}
                />
                {nombrePuntoError && (
                  <p className="text-xs text-red-600 mt-1">{nombrePuntoError}</p>
                )}
              </div>

              {/* Categoría del Punto */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría del Punto
                </label>
                <input
                  type="text"
                  value={categoriaPunto}
                  onChange={(e) => setCategoriaPunto(e.target.value)}
                  placeholder="Ej: Almacén, Oficinas, Producción"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Esta categoría se aplicará a todos los pisos por defecto
                </p>
              </div>

              {/* Compañía del Punto */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Compañía del Punto
                </label>
                <input
                  type="text"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  placeholder="Buscar compañía..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                />
                <select
                  value={companiaPunto || ''}
                  onChange={(e) => setCompaniaPunto(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Sin compañía</option>
                  {companiesFiltered.map(company => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Esta compañía se aplicará a todos los pisos por defecto
                </p>
              </div>
            </div>
          </div>

          {/* ==================== SECCIÓN 2: GESTIÓN DE PISOS ==================== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                🏗️ Pisos ({pisos.length})
              </label>
              <button
                type="button"
                onClick={handleAddFloor}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Agregar Piso
              </button>
            </div>

            {/* Navegación entre Pisos */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setPisoActual(Math.max(0, pisoActual - 1))}
                  disabled={pisoActual === 0}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-medium text-sm"
                >
                  <ChevronUp className="w-4 h-4" />
                  Anterior
                </button>

                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {currentFloor.nombre}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Piso {pisoActual + 1} de {pisos.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPisoActual(Math.min(pisos.length - 1, pisoActual + 1))}
                  disabled={pisoActual === pisos.length - 1}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-medium text-sm"
                >
                  Siguiente
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Información del Piso Actual */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 border border-blue-200 dark:border-blue-700">
                
                {/* Nombre del Piso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Piso {pisoActual === 0 && <span className="text-red-600 dark:text-red-400">*</span>}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentFloor.nombre}
                      onChange={updateCurrentFloorName}
                      placeholder={`Piso ${pisoActual + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={pisoActual === 0}
                    />
                    
                    {pisos.length > 1 && (
                      <button
                        type="button"
                        onClick={handleRemoveFloor}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>

                {/* Categoría del Piso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={currentFloor.categoria || ''}
                    onChange={(e) => updateCurrentFloor('categoria', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ej: Almacén, Oficinas, Producción"
                  />
                </div>

                {/* Compañía del Piso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compañía
                  </label>
                  {loading ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400">Cargando compañías...</div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        placeholder="Buscar compañía…"
                        className="mb-2 w-full px-4 py-2 rounded-lg border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <select
                        value={currentFloor.compañia || ''}
                        onChange={(e) => updateCurrentFloor('compañia', e.target.value || null)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Sin compañía</option>
                        {companiesFiltered.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

              </div>
            </div>

            {/* Inventario del Piso Actual */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300">
                  📦 Inventario - {currentFloor.nombre}
                </label>
                <button
                  type="button"
                  className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
                  onClick={handleAddInvRow}
                >
                  + Agregar ítem
                </button>
              </div>
              
              {currentFloor.inventario.length > 0 && (
                <div className="mb-2">
                  <input
                    type="text"
                    value={objectsFilter}
                    onChange={(e) => setObjectsFilter(e.target.value)}
                    placeholder="Buscar objetos…"
                    className="w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-sm"
                  />
                </div>
              )}
              
              {currentFloor.inventario.length === 0 ? (
                <div className="text-xs text-gray-500 dark:text-gray-400">Sin ítems. Usa "Agregar ítem".</div>
              ) : (
                <div className="space-y-2">
                  {currentFloor.inventario.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-8">
                        <select
                          className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-sm"
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
                          className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-sm"
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

            {/* Archivos del Piso Actual */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  📷 Fotos - {currentFloor.nombre}
                </label>
                <PhotoUpload
                  pointId={`temp-floor-${pisoActual}`}
                  photos={currentFloor.fotos}
                  onPhotosChange={(newPhotos) => updateCurrentFloor('fotos', newPhotos)}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  📄 Documentos - {currentFloor.nombre}
                </label>
                <DocumentUpload
                  pointId={`temp-floor-${pisoActual}`}
                  documents={currentFloor.documentos}
                  onDocumentsChange={(newDocs) => updateCurrentFloor('documentos', newDocs)}
                />
              </div>
            </div>
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
