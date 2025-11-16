/**
 * CreatePointDialog.jsx
 *
 * Diálogo/modal para crear un nuevo punto en el mapa con soporte de múltiples pisos.
 * Permite ingresar nombre, categoría, compañía, y gestionar pisos con inventario y archivos independientes.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, ChevronDown, Plus, Trash2, Building2, Building } from 'lucide-react'
import { companyService, objectService } from '../../services/api'
import PhotoUpload from './PhotoUpload'
import DocumentUpload from './DocumentUpload'

const cx = (...p) => p.filter(Boolean).join(' ')

export default function CreatePointDialog({ open, coords, onCancel, onConfirm }) {
  // === INFORMACIÓN DE PLANTA BAJA (Punto Principal) ===
  const [nombrePunto, setNombrePunto] = useState('')
  const [categoriaPunto, setCategoriaPunto] = useState('')
  const [companiaPropietaria, setCompaniaPropietaria] = useState(null)
  const [companiaAlojada, setCompaniaAlojada] = useState(null)
  const [nrInventarioSAP, setNrInventarioSAP] = useState('')
  const [showSAPField, setShowSAPField] = useState(false)
  const [mijlocFix, setMijlocFix] = useState(false)
  
  // Inventario, fotos, documentos de Planta Baja
  const [inventarioPlantaBaja, setInventarioPlantaBaja] = useState([])
  const [fotosPlantaBaja, setFotosPlantaBaja] = useState([])
  const [documentosPlantaBaja, setDocumentosPlantaBaja] = useState([])

  // === PISOS ADICIONALES ===
  const [showPisosAdicionales, setShowPisosAdicionales] = useState(false)
  const [pisosAdicionales, setPisosAdicionales] = useState([])
  const [pisoActual, setPisoActual] = useState(0)

  // Estados para tabs
  const [plantaBajaTab, setPlantaBajaTab] = useState('inventario')
  const [pisoTab, setPisoTab] = useState('inventario')

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
    // limpiar formulario de Planta Baja
    setNombrePunto('')
    setCategoriaPunto('')
    setCompaniaPropietaria(null)
    setCompaniaAlojada(null)
    setNrInventarioSAP('')
    setShowSAPField(false)
    setMijlocFix(false)
    setInventarioPlantaBaja([])
    setFotosPlantaBaja([])
    setDocumentosPlantaBaja([])
    
    // limpiar formulario de pisos adicionales
    setShowPisosAdicionales(false)
    setPisosAdicionales([])
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
  const currentPiso = pisosAdicionales[pisoActual] || {}
  
  // Handlers de Pisos
  // === FUNCIONES PARA PISOS ADICIONALES ===
  const handleAddPiso = () => {
    setPisosAdicionales(prev => [
      ...prev,
      {
        numero: prev.length + 1,
        nombre_punto: '',
        nombre_piso: `Etajul ${prev.length + 1}`,
        categoria: '',
        compania_propietaria: null,
        compania_alojada: null,
        mijloc_fix: false,
        inventario: [],
        fotos: [],
        documentos: []
      }
    ])
    setPisoActual(pisosAdicionales.length) // Cambiar al nuevo piso
  }

  const handleRemovePiso = (index) => {
    if (confirm(`¿Eliminar ${pisosAdicionales[index]?.nombre_piso || `Piso ${index + 1}`}?`)) {
      setPisosAdicionales(prev => prev.filter((_, i) => i !== index))
      if (pisoActual >= pisosAdicionales.length - 1) {
        setPisoActual(Math.max(0, pisosAdicionales.length - 2))
      }
    }
  }

  const updatePisoActual = (field, value) => {
    setPisosAdicionales(prevPisos => {
      const updated = [...prevPisos]
      updated[pisoActual] = {
        ...updated[pisoActual],
        [field]: value
      }
      return updated
    })
  }

  // === FUNCIONES AUXILIARES PARA INVENTARIO DE PLANTA BAJA ===
  const addInventoryRowPlantaBaja = () => {
    setInventarioPlantaBaja(prev => [...prev, { objeto: null, cantidad: 1, unidad: '' }])
  }

  const removeInventoryRowPlantaBaja = (index) => {
    setInventarioPlantaBaja(prev => prev.filter((_, i) => i !== index))
  }

  const updateInventoryRowPlantaBaja = (index, field, value) => {
    setInventarioPlantaBaja(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // === FUNCIONES AUXILIARES PARA INVENTARIO DE PISOS ADICIONALES ===
  const addInventoryRowPiso = () => {
    updatePisoActual('inventario', [...(currentPiso.inventario || []), { objeto: null, cantidad: 1, unidad: '' }])
  }

  const removeInventoryRowPiso = (index) => {
    updatePisoActual('inventario', (currentPiso.inventario || []).filter((_, i) => i !== index))
  }

  const updateInventoryRowPiso = (index, field, value) => {
    const updated = [...(currentPiso.inventario || [])]
    updated[index] = { ...updated[index], [field]: value }
    updatePisoActual('inventario', updated)
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

  const canSave = Boolean(nombrePunto?.trim())
  const nombrePuntoError = !nombrePunto && touched.nombrePunto ? 'Requerido' : ''

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
    // Validar nombre del PUNTO (Planta Baja)
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
    
    // Validar pisos adicionales si existen
    if (showPisosAdicionales && pisosAdicionales.length > 0) {
      for (let i = 0; i < pisosAdicionales.length; i++) {
        const piso = pisosAdicionales[i]
        if (!piso.nombre_punto?.trim()) {
          alert(`❌ El piso ${i + 1} debe tener un nombre de punto para búsqueda`)
          return
        }
      }
    }
    
    // Normalizar pisos adicionales
    const pisosNormalized = pisosAdicionales.map((piso, index) => ({
      numero: index + 1,
      nombre_punto: piso.nombre_punto?.trim() || `Piso ${index + 1}`,
      nombre_piso: piso.nombre_piso?.trim() || `Etajul ${index + 1}`,
      categoria: piso.categoria?.trim() || '',
      compania_propietaria: piso.compania_propietaria || null,
      compania_alojada: piso.compania_alojada || null,
      mijloc_fix: piso.mijloc_fix || false,
      inventario: (piso.inventario || [])
        .map(r => ({
          objeto: r?.objeto?._id || r?.objeto?.id || r?.objeto || '',
          cantidad: Number(r?.cantidad) || 1,
          unidad: r?.unidad || ''
        }))
        .filter(r => r.objeto),
      fotos: piso.fotos || [],
      documentos: piso.documentos || []
    }))
    
    const payload = {
      // === PLANTA BAJA (Punto Principal) ===
      nombre: nombrePunto.trim(),
      categoria: categoriaPunto?.trim() || null,
      companiaPropietaria: companiaPropietaria || null,
      companiaAlojada: companiaAlojada || null,
      nrInventarioSAP: nrInventarioSAP?.trim() || null,
      mijlocFix: mijlocFix,
      coordenadas: coords,
      
      // Datos de Planta Baja
      inventario: inventarioPlantaBaja
        .map(r => ({
          objeto: r?.objeto?._id || r?.objeto?.id || r?.objeto || '',
          cantidad: Number(r?.cantidad) || 1,
          unidad: r?.unidad || ''
        }))
        .filter(r => r.objeto),
      fotos: fotosPlantaBaja,
      documentos: documentosPlantaBaja,
      
      // === PISOS ADICIONALES ===
      pisosAdicionales: pisosNormalized
    }
    
    console.log('💾 [CREATE DIALOG] === PAYLOAD COMPLETO ===')
    console.log('📦 Planta Baja:', {
      nombre: payload.nombre,
      categoria: payload.categoria,
      companiaPropietaria: payload.companiaPropietaria,
      companiaAlojada: payload.companiaAlojada,
      mijlocFix: payload.mijlocFix,
      inventario_count: payload.inventario.length
    })
    console.log('🏗️ Pisos Adicionales:', payload.pisosAdicionales.length)
    if (payload.pisosAdicionales.length > 0) {
      payload.pisosAdicionales.forEach((piso, i) => {
        console.log(`  Piso ${i + 1}:`, {
          nombre_punto: piso.nombre_punto,
          nombre_piso: piso.nombre_piso,
          categoria: piso.categoria,
          mijloc_fix: piso.mijloc_fix
        })
      })
    }
    
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
      <div ref={modalRef} className="w-[720px] max-w-[95vw] rounded-xl bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 shadow-2xl outline-none">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 id="cpd-title" className="font-semibold text-lg">Crear Punto</h3>
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

        {errMsg && (
          <div id="cpd-err" className="px-5 py-2 text-sm text-red-600 dark:text-red-400 border-b border-gray-200 dark:border-gray-800" aria-live="polite">
            {errMsg}
          </div>
        )}

        <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* ==================== PLANTA BAJA ==================== */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-700">
            {/* Header con Mijloc Fix */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>INFORMACIÓN DEL PUNTO (Planta Baja)</span>
              </h3>
              
              <button
                type="button"
                onClick={() => setMijlocFix(!mijlocFix)}
                className={cx(
                  'px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all',
                  mijlocFix
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                )}
                title="Marcar como Mijloc Fix"
              >
                <span className="text-base">{mijlocFix ? '⭐' : '☆'}</span>
                <span>Mijloc Fix</span>
              </button>
            </div>
            
            {/* Campos de Planta Baja */}
            <div className="space-y-3">
              {/* Nombre del Punto */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Punto <span className="text-red-500">*</span>
                  <span className="text-gray-500 ml-2">(Nr. Container)</span>
                </label>
                <input
                  type="text"
                  value={nombrePunto}
                  onChange={(e) => {
                    setNombrePunto(e.target.value)
                    setTouched(t => ({ ...t, nombrePunto: true }))
                  }}
                  placeholder="Ej: 234150"
                  className={cx(
                    'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm',
                    nombrePuntoError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  )}
                />
                {nombrePuntoError && (
                  <p className="text-xs text-red-600 mt-1">{nombrePuntoError}</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={categoriaPunto}
                  onChange={(e) => setCategoriaPunto(e.target.value)}
                  placeholder="Ej: Container tip birou"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Compañía Propietaria */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Compañía Propietaria
                </label>
                {loading ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cargando compañías...</div>
                ) : (
                  <select
                    value={companiaPropietaria || ''}
                    onChange={(e) => setCompaniaPropietaria(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Sin compañía</option>
                    {companiesFiltered.map(company => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Compañía Alojada */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Compañía Alojada
                </label>
                {loading ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cargando compañías...</div>
                ) : (
                  <select
                    value={companiaAlojada || ''}
                    onChange={(e) => setCompaniaAlojada(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Sin compañía</option>
                    {companiesFiltered.map(company => (
                      <option key={company.value} value={company.value}>
                        {company.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Nr. Inv. SAP (colapsable) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowSAPField(!showSAPField)}
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-1"
                >
                  <span className="transform transition-transform" style={{ display: 'inline-block', transform: showSAPField ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    ▶
                  </span>
                  <span>Nr. Inv. SAP (opcional)</span>
                </button>
                
                {showSAPField && (
                  <input
                    type="text"
                    value={nrInventarioSAP}
                    onChange={(e) => setNrInventarioSAP(e.target.value)}
                    placeholder="Ej: SAP-12345"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                )}
              </div>
            </div>

            {/* Tabs de Planta Baja */}
            <div className="mt-4">
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
                <button
                  type="button"
                  onClick={() => setPlantaBajaTab('inventario')}
                  className={cx(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    plantaBajaTab === 'inventario'
                      ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                >
                  📦 Inventario
                </button>
                <button
                  type="button"
                  onClick={() => setPlantaBajaTab('fotos')}
                  className={cx(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    plantaBajaTab === 'fotos'
                      ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                >
                  📷 Fotos
                </button>
                <button
                  type="button"
                  onClick={() => setPlantaBajaTab('documentos')}
                  className={cx(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    plantaBajaTab === 'documentos'
                      ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                >
                  📄 Documentos
                </button>
              </div>

              {/* Tab Content - Inventario */}
              {plantaBajaTab === 'inventario' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-gray-700 dark:text-gray-300">
                      Inventario de Planta Baja
                    </label>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setInventarioPlantaBaja([...inventarioPlantaBaja, { objeto: '', cantidad: 1, unidad: '' }])}
                    >
                      + Agregar ítem
                    </button>
                  </div>
                  
                  {inventarioPlantaBaja.length > 0 && (
                    <div className="mb-2">
                      <input
                        type="text"
                        value={objectsFilter}
                        onChange={(e) => setObjectsFilter(e.target.value)}
                        placeholder="Buscar objetos…"
                        className="w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-xs"
                      />
                    </div>
                  )}
                  
                  {inventarioPlantaBaja.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400">Sin ítems. Usa "Agregar ítem".</div>
                  ) : (
                    <div className="space-y-2">
                      {inventarioPlantaBaja.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-8">
                            <select
                              className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-xs"
                              value={row?.objeto?._id || row?.objeto || ''}
                              onChange={(e) => {
                                const newInv = [...inventarioPlantaBaja]
                                newInv[idx] = { ...newInv[idx], objeto: e.target.value }
                                setInventarioPlantaBaja(newInv)
                              }}
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
                              className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-xs"
                              value={row?.cantidad ?? 1}
                              onChange={(e) => {
                                const newInv = [...inventarioPlantaBaja]
                                newInv[idx] = { ...newInv[idx], cantidad: Number(e.target.value) || 1 }
                                setInventarioPlantaBaja(newInv)
                              }}
                            />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <button
                              className="px-2 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
                              onClick={() => {
                                setInventarioPlantaBaja(inventarioPlantaBaja.filter((_, i) => i !== idx))
                              }}
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
              )}

              {/* Tab Content - Fotos */}
              {plantaBajaTab === 'fotos' && (
                <div>
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-2">
                    Fotos de Planta Baja
                  </label>
                  <PhotoUpload
                    pointId="temp-planta-baja"
                    photos={fotosPlantaBaja}
                    onPhotosChange={setFotosPlantaBaja}
                  />
                </div>
              )}

              {/* Tab Content - Documentos */}
              {plantaBajaTab === 'documentos' && (
                <div>
                  <label className="block text-xs text-gray-700 dark:text-gray-300 mb-2">
                    Documentos de Planta Baja
                  </label>
                  <DocumentUpload
                    pointId="temp-planta-baja"
                    documents={documentosPlantaBaja}
                    onDocumentsChange={setDocumentosPlantaBaja}
                  />
                </div>
              )}
            </div>
          </div>
          {/* ==================== PISOS ADICIONALES ==================== */}
          <div>
            <button
              type="button"
              onClick={() => setShowPisosAdicionales(!showPisosAdicionales)}
              className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700 transition-colors"
            >
              <span className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span>Agregar Pisos Adicionales</span>
                {pisosAdicionales.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {pisosAdicionales.length}
                  </span>
                )}
              </span>
              <span className="text-blue-600 dark:text-blue-400 transform transition-transform" style={{ display: 'inline-block', transform: showPisosAdicionales ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                ▶
              </span>
            </button>

            {showPisosAdicionales && (
              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                {/* Botón Agregar Piso */}
                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    onClick={handleAddPiso}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Piso
                  </button>
                </div>

                {pisosAdicionales.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                    No hay pisos adicionales. Usa "Agregar Piso" para crear uno.
                  </div>
                ) : (
                  <div>
                    {/* Navegación entre pisos */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setPisoActual(Math.max(0, pisoActual - 1))}
                        disabled={pisoActual === 0}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm"
                      >
                        <ChevronUp className="w-4 h-4" />
                        Anterior
                      </button>

                      <div className="text-center">
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {currentPiso?.nombre_piso || `Piso ${pisoActual + 1}`}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Piso {pisoActual + 1} de {pisosAdicionales.length}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPisoActual(Math.min(pisosAdicionales.length - 1, pisoActual + 1))}
                        disabled={pisoActual === pisosAdicionales.length - 1}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm"
                      >
                        Siguiente
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Contenido del Piso Actual */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-600">
                      {/* Header con Mijloc Fix */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300">
                          {currentPiso?.nombre_piso || `Piso ${pisoActual + 1}`}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updatePisoActual('mijloc_fix', !currentPiso?.mijloc_fix)}
                            className={cx(
                              'px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all',
                              currentPiso?.mijloc_fix
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            )}
                            title="Marcar como Mijloc Fix"
                          >
                            <span className="text-base">{currentPiso?.mijloc_fix ? '⭐' : '☆'}</span>
                            <span>Mijloc Fix</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleRemovePiso(pisoActual)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Campos del Piso */}
                      <div className="space-y-3">
                        {/* Nombre Punto */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre del Punto
                            <span className="text-gray-500 ml-2">(para búsqueda)</span>
                          </label>
                          <input
                            type="text"
                            value={currentPiso?.nombre_punto || ''}
                            onChange={(e) => updatePisoActual('nombre_punto', e.target.value)}
                            placeholder={`Ej: 234567 - etj ${currentPiso?.numero || pisoActual + 1}`}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        {/* Nombre Piso */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre del Piso
                            <span className="text-gray-500 ml-2">(descriptivo)</span>
                          </label>
                          <input
                            type="text"
                            value={currentPiso?.nombre_piso || ''}
                            onChange={(e) => updatePisoActual('nombre_piso', e.target.value)}
                            placeholder={`Etajul ${currentPiso?.numero || pisoActual + 1}`}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        {/* Categoría */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Categoría
                          </label>
                          <input
                            type="text"
                            value={currentPiso?.categoria || ''}
                            onChange={(e) => updatePisoActual('categoria', e.target.value)}
                            placeholder="Ej: Container tip magaize"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        {/* Compañía Propietaria */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Compañía Propietaria
                          </label>
                          {loading ? (
                            <div className="text-xs text-gray-500 dark:text-gray-400">Cargando compañías...</div>
                          ) : (
                            <select
                              value={currentPiso?.compania_propietaria || ''}
                              onChange={(e) => updatePisoActual('compania_propietaria', e.target.value || null)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Sin compañía</option>
                              {companiesFiltered.map(company => (
                                <option key={company.value} value={company.value}>
                                  {company.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Compañía Alojada */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Compañía Alojada
                          </label>
                          {loading ? (
                            <div className="text-xs text-gray-500 dark:text-gray-400">Cargando compañías...</div>
                          ) : (
                            <select
                              value={currentPiso?.compania_alojada || ''}
                              onChange={(e) => updatePisoActual('compania_alojada', e.target.value || null)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Sin compañía</option>
                              {companiesFiltered.map(company => (
                                <option key={company.value} value={company.value}>
                                  {company.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Tabs del Piso */}
                      <div className="mt-4">
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
                          <button
                            type="button"
                            onClick={() => setPisoTab('inventario')}
                            className={cx(
                              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                              pisoTab === 'inventario'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            )}
                          >
                            📦 Inventario
                          </button>
                          <button
                            type="button"
                            onClick={() => setPisoTab('fotos')}
                            className={cx(
                              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                              pisoTab === 'fotos'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            )}
                          >
                            📷 Fotos
                          </button>
                          <button
                            type="button"
                            onClick={() => setPisoTab('documentos')}
                            className={cx(
                              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                              pisoTab === 'documentos'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            )}
                          >
                            📄 Documentos
                          </button>
                        </div>

                        {/* Tab Content - Inventario */}
                        {pisoTab === 'inventario' && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-xs text-gray-700 dark:text-gray-300">
                                Inventario de {currentPiso?.nombre_piso || `Piso ${pisoActual + 1}`}
                              </label>
                              <button
                                type="button"
                                className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                  updatePisoActual('inventario', [
                                    ...(currentPiso?.inventario || []),
                                    { objeto: '', cantidad: 1, unidad: '' }
                                  ])
                                }}
                              >
                                + Agregar ítem
                              </button>
                            </div>
                            
                            {currentPiso?.inventario?.length > 0 && (
                              <div className="mb-2">
                                <input
                                  type="text"
                                  value={objectsFilter}
                                  onChange={(e) => setObjectsFilter(e.target.value)}
                                  placeholder="Buscar objetos…"
                                  className="w-full px-3 py-2 rounded border text-gray-900 placeholder-gray-400 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-xs"
                                />
                              </div>
                            )}
                            
                            {(!currentPiso?.inventario || currentPiso.inventario.length === 0) ? (
                              <div className="text-xs text-gray-500 dark:text-gray-400">Sin ítems. Usa "Agregar ítem".</div>
                            ) : (
                              <div className="space-y-2">
                                {currentPiso.inventario.map((row, idx) => (
                                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-8">
                                      <select
                                        className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-xs"
                                        value={row?.objeto?._id || row?.objeto || ''}
                                        onChange={(e) => {
                                          const newInv = [...(currentPiso.inventario || [])]
                                          newInv[idx] = { ...newInv[idx], objeto: e.target.value }
                                          updatePisoActual('inventario', newInv)
                                        }}
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
                                        className="w-full px-3 py-2 rounded border text-gray-900 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 text-xs"
                                        value={row?.cantidad ?? 1}
                                        onChange={(e) => {
                                          const newInv = [...(currentPiso.inventario || [])]
                                          newInv[idx] = { ...newInv[idx], cantidad: Number(e.target.value) || 1 }
                                          updatePisoActual('inventario', newInv)
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                      <button
                                        className="px-2 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
                                        onClick={() => {
                                          const newInv = (currentPiso.inventario || []).filter((_, i) => i !== idx)
                                          updatePisoActual('inventario', newInv)
                                        }}
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
                        )}

                        {/* Tab Content - Fotos */}
                        {pisoTab === 'fotos' && (
                          <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-2">
                              Fotos de {currentPiso?.nombre_piso || `Piso ${pisoActual + 1}`}
                            </label>
                            <PhotoUpload
                              pointId={`temp-piso-${pisoActual}`}
                              photos={currentPiso?.fotos || []}
                              onPhotosChange={(newPhotos) => updatePisoActual('fotos', newPhotos)}
                            />
                          </div>
                        )}

                        {/* Tab Content - Documentos */}
                        {pisoTab === 'documentos' && (
                          <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-2">
                              Documentos de {currentPiso?.nombre_piso || `Piso ${pisoActual + 1}`}
                            </label>
                            <DocumentUpload
                              pointId={`temp-piso-${pisoActual}`}
                              documents={currentPiso?.documentos || []}
                              onDocumentsChange={(newDocs) => updatePisoActual('documentos', newDocs)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
