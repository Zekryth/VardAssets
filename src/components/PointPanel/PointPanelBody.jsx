/**
 * PointPanelBody.jsx
 *
 * Cuerpo del panel de punto, muestra y permite editar los detalles de un punto (nombre, categoría, inventario, archivos, etc.).
 * Gestiona formularios, carga de datos y acciones de guardado/eliminación.
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Building, Calendar, MapPin, Upload, FileText, Trash2, X } from 'lucide-react'
import { pointService, companyService, objectService, fileService } from '../../services/api'

export default function PointPanelBody({ point, activeTab, onChangeTab, onRefresh }) {
  const [edit, setEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => ({
    nombre: point?.nombre || '',
    categoria: point?.categoria || '',
    companiaId: point?.compañia?._id || point?.compañia?.id || '',
  }))
  const [companies, setCompanies] = useState([])
  const [objects, setObjects] = useState([])
  const [inv, setInv] = useState(() => (Array.isArray(point?.inventario) ? point.inventario.map(it => ({ objeto: it.objeto?._id || it.objeto?.id, objetoData: it.objeto, cantidad: it.cantidad })) : []))
  const [addedFotos, setAddedFotos] = useState([])
  const [addedDocs, setAddedDocs] = useState([])

  useEffect(() => {
    // Load companies and objects for editing
    companyService.getCompanies({ params: { page: 1, limit: 200 } }).then(r => setCompanies(r.data?.companies || r.data || [])).catch(() => {})
    objectService.getObjects({ page: 1, limit: 200 }).then(r => setObjects(r.data?.objects || r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    // When point changes, reset form
    setForm({ nombre: point?.nombre || '', categoria: point?.categoria || '', companiaId: point?.compañia?._id || point?.compañia?.id || '' })
    setInv(Array.isArray(point?.inventario) ? point.inventario.map(it => ({ objeto: it.objeto?._id || it.objeto?.id, objetoData: it.objeto, cantidad: it.cantidad })) : [])
    setAddedFotos([]); setAddedDocs([])
    setEdit(false)
  }, [point?._id])

  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const onSave = async () => {
    setErr(''); setOk('')
    if (!form.nombre?.trim() || !form.categoria?.trim() || !form.companiaId) {
      setErr('Completa nombre, categoría y compañía')
      return
    }
    setSaving(true)
    try {
      const id = point?._id || point?.id
      const payload = {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        compañia: form.companiaId,
        inventario: inv.filter(it => it.objeto && it.cantidad).map(it => ({ objeto: it.objeto, cantidad: Math.max(1, Number(it.cantidad) || 1) }))
      }
      const res = await pointService.updatePoint(id, payload)
      const p = res.data?.point || res.data
      
      // Upload files if any
      if ((addedFotos.length || addedDocs.length) && p?._id) {
        try { 
          await pointService.uploadFiles(p._id, { fotos: addedFotos, documentos: addedDocs })
        } catch (uploadErr) {
          console.error('Error uploading files:', uploadErr)
        }
      }
      
      // Refresh panel data from backend to show new files
      if (onRefresh) {
        await onRefresh()
      }
      
      setOk('Punto actualizado')
      setEdit(false)
      setAddedFotos([])
      setAddedDocs([])
    } catch (err) {
      console.error(err)
      setErr(err?.response?.data?.message || 'No se pudo actualizar el punto')
    } finally {
      setSaving(false)
    }
  }

  const addInvRow = () => setInv(prev => [...prev, { objeto: '', objetoData: null, cantidad: 1 }])
  const removeInvRow = (idx) => setInv(prev => prev.filter((_, i) => i !== idx))
  const setInvField = (idx, k, v) => setInv(prev => prev.map((it, i) => i === idx ? { ...it, [k]: v } : it))

  const handleDeleteFile = async (fileIndex, fileType) => {
    if (!window.confirm(`¿Borrar este ${fileType === 'foto' ? 'foto' : 'documento'}?`)) return
    setSaving(true)
    try {
      await fileService.deleteFile(point._id, fileIndex)
      if (onRefresh) await onRefresh()
      setOk(`${fileType === 'foto' ? 'Foto' : 'Documento'} borrado`)
      setTimeout(() => setOk(''), 3000)
    } catch (err) {
      console.error('Error borrando archivo:', err)
      setErr(err.response?.data?.message || 'Error al borrar archivo')
      setTimeout(() => setErr(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Panel del punto">
        <div className="flex">
          {['info', 'inventory', 'photos', 'documents'].map(tab => {
            const selected = activeTab === tab
            const tabId = `pp-tab-${tab}`
            return (
              <button
                key={tab}
                id={tabId}
                role="tab"
                aria-selected={selected}
                aria-controls={`pp-panel-${tab}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChangeTab(tab)}
                className={`flex-1 py-3 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 relative after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:w-0 after:transition-all after:bg-primary-500 ${selected ? 'text-primary-600 dark:text-primary-400 after:w-8' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {tab === 'info' && 'Información'}
                {tab === 'inventory' && 'Inventario'}
                {tab === 'photos' && 'Fotos'}
                {tab === 'documents' && 'Documentos'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {/* Header actions */}
        <div className="p-3 flex items-center gap-2 justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            {err && (
              <div className="px-3 py-2 text-sm rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">{err}</div>
            )}
            {ok && (
              <div className="px-3 py-2 text-sm rounded bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">{ok}</div>
            )}
          </div>
          {!edit ? (
            <button className="px-3 h-9 rounded-md bg-primary-600 text-white hover:bg-primary-500" onClick={() => setEdit(true)}>Editar</button>
          ) : (
            <div className="flex items-center gap-2">
              <button className="px-3 h-9 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { setEdit(false); setForm({ nombre: point?.nombre || '', categoria: point?.categoria || '', companiaId: point?.compañia?._id || point?.compañia?.id || '' }); setInv(Array.isArray(point?.inventario) ? point.inventario.map(it => ({ objeto: it.objeto?._id || it.objeto?.id, objetoData: it.objeto, cantidad: it.cantidad })) : []); setAddedDocs([]); setAddedFotos([]) }}>Cancelar</button>
              <button className={`px-3 h-9 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-500'}`} disabled={saving} onClick={onSave}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          )}
        </div>
        {activeTab === 'info' && (
          <div id="pp-panel-info" role="tabpanel" aria-labelledby="pp-tab-info" className="p-6 space-y-6 text-gray-800 dark:text-gray-200">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Información del Punto</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 dark:text-gray-500 mt-2" size={18} />
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Compañía</label>
                    {!edit ? (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{point.compañia?.nombre || 'N/A'}</p>
                    ) : (
                      <select className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm" value={form.companiaId} onChange={(e) => setForm(f => ({ ...f, companiaId: e.target.value }))}>
                        <option value="">Selecciona compañía</option>
                        {companies.map(c => (
                          <option key={c._id || c.id} value={c._id || c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 dark:text-gray-500 mt-2" size={18} />
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Coordenadas</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{point.coordenadas?.x}, {point.coordenadas?.y}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2" />
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Nombre</label>
                    {!edit ? (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{point.nombre}</p>
                    ) : (
                      <input className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm" value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} />
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2" />
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Categoría</label>
                    {!edit ? (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{point.categoria}</p>
                    ) : (
                      <input className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm" value={form.categoria} onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))} />
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 dark:text-gray-500 mt-2" size={18} />
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Fecha de creación</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{point.fecha ? new Date(point.fecha).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {point.compañia && (
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Contacto de la Compañía</h4>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><span className="text-gray-600 dark:text-gray-400">Persona:</span> {point.compañia.personaContacto}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Teléfono:</span> {point.compañia.telefono}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div id="pp-panel-inventory" role="tabpanel" aria-labelledby="pp-tab-inventory" className="p-6 text-gray-800 dark:text-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Inventario</h3>
            <div className="space-y-3">
              {(!edit ? point.inventario : inv)?.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{(item.objetoData?.icono || item.objeto?.icono) || '📦'}</span>
                    <div className="flex-1 min-w-0">
                      {!edit ? (
                        <>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{(item.objetoData?.nombre || item.objeto?.nombre) || 'Objeto'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Cantidad: {item.cantidad}</p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select className="flex-1 min-w-0 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm" value={item.objeto || ''} onChange={(e) => setInvField(index, 'objeto', e.target.value)}>
                            <option value="">Seleccione objeto</option>
                            {objects.map(o => (
                              <option key={o._id || o.id} value={o._id || o.id}>{o.nombre}</option>
                            ))}
                          </select>
                          <input type="number" min={1} className="w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm" value={item.cantidad} onChange={(e) => setInvField(index, 'cantidad', e.target.value)} />
                          <button className="text-red-600 hover:text-red-700 text-sm" onClick={() => removeInvRow(index)}>Quitar</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {((!edit ? point.inventario : inv)?.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No hay inventario en este punto</p>
                </div>
              )}
              {edit && (
                <button className="mt-2 px-3 h-9 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm" onClick={addInvRow}>Agregar ítem</button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div id="pp-panel-photos" role="tabpanel" aria-labelledby="pp-tab-photos" className="p-6 text-gray-800 dark:text-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Fotos del Punto</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(point.fotos || []).map((f, idx) => (
                  <div key={idx} className="relative group">
                    <img src={f.url} alt={f.nombre || `foto-${idx}`} className="w-full h-20 object-cover rounded" />
                    {!edit && (
                      <button
                        onClick={() => handleDeleteFile(idx, 'foto')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Borrar foto"
                        aria-label="Borrar foto"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    {!edit && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 truncate">
                        {f.nombre || `foto-${idx}`}
                      </div>
                    )}
                  </div>
                ))}
                {addedFotos.map((f, idx) => (
                  <div key={`new-${idx}`} className="w-full h-20 grid place-items-center text-xs border rounded bg-gray-50 dark:bg-gray-800/60">{f.name}</div>
                ))}
              </div>
              {edit && (
                <div className="flex items-center gap-2">
                  <input type="file" multiple accept="image/*" onChange={(e) => setAddedFotos(Array.from(e.target.files || []))} />
                  <span className="text-xs text-gray-500">Se subirán al guardar</span>
                </div>
              )}
              {!edit && (point.fotos || []).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No hay fotos en este punto</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div id="pp-panel-documents" role="tabpanel" aria-labelledby="pp-tab-documents" className="p-6 text-gray-800 dark:text-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Documentos</h3>
            <div className="space-y-3">
              <ul className="space-y-1 text-sm">
                {(point.documentos || []).map((d, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{d.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a className="text-primary-600 hover:underline" href={d.url} download>Descargar</a>
                      {!edit && (
                        <button
                          onClick={() => handleDeleteFile(idx, 'documento')}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                          title="Borrar documento"
                          aria-label="Borrar documento"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {addedDocs.map((d, idx) => (
                  <li key={`new-${idx}`} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs">
                    <span className="truncate">{d.name}</span>
                    <span>Pendiente de subir</span>
                  </li>
                ))}
              </ul>
              {edit && (
                <div className="flex items-center gap-2">
                  <input type="file" multiple onChange={(e) => setAddedDocs(Array.from(e.target.files || []))} />
                  <span className="text-xs text-gray-500">Se subirán al guardar</span>
                </div>
              )}
              {!edit && (point.documentos || []).length === 0 && addedDocs.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No hay documentos en este punto</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
