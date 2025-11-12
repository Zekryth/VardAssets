/**
 * Inventory.jsx
 *
 * Página de inventario para gestionar objetos y puntos de inventario.
 * Permite listar, buscar, crear, editar y eliminar objetos, así como asociarlos a puntos.
 * Incluye paginación, formularios y utiliza servicios de API y componentes de UI personalizados.
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Search, Plus, X, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { pointService, objectService } from '../services/api'
import Button from '../components/UI/Button.jsx'
import Input from '../components/UI/Input.jsx'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function Inventory() {
  const { t } = useTranslation()
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('items') // 'items' | 'companies'
  const [query, setQuery] = useState('')
  const [objects, setObjects] = useState([])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ nombre: '', categoria: '', numeroInventario: '', nickname: '', descripcion: '', icono: '📦', imagen: null })
  const [catalogMode, setCatalogMode] = useState(false)
  const [objQuery, setObjQuery] = useState('')
  const [objPage, setObjPage] = useState(1)
  const [objLimit, setObjLimit] = useState(12)
  const [objTotal, setObjTotal] = useState(0)
  const [objPages, setObjPages] = useState(1)
  const [editing, setEditing] = useState(null)

  // Load points once
  useEffect(() => {
    let mounted = true
    setLoading(true)
    pointService.getPoints()
      .then(res => {
        if (!mounted) return
        const list = Array.isArray(res.data) ? res.data : (res.data?.points || [])
        setPoints(list.filter(Boolean))
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // Load objects catalog (search + pagination)
  useEffect(() => {
    let mounted = true
    objectService.getObjects({ search: objQuery, page: objPage, limit: objLimit })
      .then(res => {
        if (!mounted) return
        const data = res.data || {}
        const list = Array.isArray(data) ? data : (data.objects || [])
        setObjects(list.filter(Boolean))
        if (typeof data.total === 'number') setObjTotal(data.total)
        if (typeof data.pages === 'number') setObjPages(data.pages)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [objQuery, objPage, objLimit])

  // Aggregate items across points, seeded by catalog (objects)
  const itemsAgg = useMemo(() => {
    const map = new Map()
    for (const o of objects) {
      const name = o?.nombre || '—'
      const icon = o?.icono || '📦'
      const image = o?.imagen || null
      if (!map.has(name)) map.set(name, { name, icon, image, count: 0 })
    }
    for (const p of points) {
      const inv = Array.isArray(p?.inventario) ? p.inventario : []
      for (const it of inv) {
        const name = it?.objeto?.nombre || '—'
        const icon = it?.objeto?.icono || '📦'
        const qty = Number(it?.cantidad) || 0
        if (!map.has(name)) map.set(name, { name, icon, image: null, count: 0 })
        map.get(name).count += qty
      }
    }
    return Array.from(map.values()).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [points, objects])

  // Companies aggregate
  const companiesAgg = useMemo(() => {
    const cmap = new Map()
    for (const p of points) {
      const c = p?.compañia
      if (!c || !(c._id || c.id)) continue
      const cId = c._id || c.id
      if (!cmap.has(cId)) cmap.set(cId, { id: cId, name: c.nombre || 'Sin nombre', items: new Map() })
      const inv = Array.isArray(p?.inventario) ? p.inventario : []
      for (const it of inv) {
        const name = it?.objeto?.nombre || '—'
        const icon = it?.objeto?.icono || '📦'
        const qty = Number(it?.cantidad) || 0
        const items = cmap.get(cId).items
        if (!items.has(name)) items.set(name, { name, icon, count: 0 })
        items.get(name).count += qty
      }
    }
    const arr = Array.from(cmap.values())
      .map(c => ({ ...c, items: Array.from(c.items.values()).sort((a,b)=> b.count - a.count || a.name.localeCompare(b.name)) }))
      .filter(c => c.items.length > 0)
      .sort((a,b) => a.name.localeCompare(b.name))
    return arr
  }, [points])

  const q = (query || '').toLowerCase().trim()
  const filteredItems = useMemo(() => {
    if (!q) return itemsAgg
    return itemsAgg.filter(x => x.name.toLowerCase().includes(q))
  }, [itemsAgg, q])
  const filteredCompanies = useMemo(() => {
    if (!q) return companiesAgg
    return companiesAgg
      .map(c => ({
        ...c,
        items: c.items.filter(it => c.name.toLowerCase().includes(q) || it.name.toLowerCase().includes(q))
      }))
      .filter(c => c.items.length > 0)
  }, [companiesAgg, q])

  return (
    <div className="flex flex-col h-[100dvh] relative">
      {/* Top bar with search and mode toggle */}
      <div className="px-4 pt-4 md:px-6 md:pt-5 select-none">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-surface-raised/80 backdrop-blur px-3 py-2 shadow-lg" role="search" aria-label="Buscar inventario">
            <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'items' ? t('search.object') : t('search.placeholder')}
              className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none"
              aria-label={t('inventory.title')}
            />
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true) }} className="gap-2 whitespace-nowrap"><Plus size={16} /> {t('inventory.addObject')}</Button>
          <div className="flex items-center rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('items')}
              className={`px-3 py-2 text-sm ${mode==='items' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-surface-raised/60 text-gray-700 dark:text-gray-200'}`}
              aria-pressed={mode==='items'}
            >Por objeto</button>
            <button
              type="button"
              onClick={() => setMode('companies')}
              className={`px-3 py-2 text-sm border-l border-gray-200 dark:border-gray-700 ${mode==='companies' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-surface-raised/60 text-gray-700 dark:text-gray-200'}`}
              aria-pressed={mode==='companies'}
            >Por compañía</button>
          </div>
        </div>
      </div>

  <div className="flex-1 overflow-auto p-4 md:p-6 pb-16">
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {mode === 'items' && (
              <div className="grid gap-2">
                {filteredItems.map(it => (
                  <div key={it.name} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-raised">
                    <div className="flex items-center gap-3">
                      {it.image ? (
                        <img src={it.image} alt={it.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <span className="text-2xl">{it.icon}</span>
                      )}
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{it.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{it.count}</span>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No hay resultados</div>
                )}
              </div>
            )}

            {mode === 'companies' && (
              <div className="space-y-4">
                {filteredCompanies.map(c => (
                  <div key={c.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 text-sm font-semibold text-gray-800 dark:text-gray-100">{c.name}</div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {c.items.map(it => (
                        <div key={it.name} className="flex items-center justify-between p-3 bg-white dark:bg-surface-raised">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{it.icon}</span>
                            <span className="text-sm text-gray-800 dark:text-gray-100">{it.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{it.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredCompanies.length === 0 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No hay resultados</div>
                )}
              </div>
            )}

            {/* Catalog mode: manage objects */}
            {catalogMode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-surface-raised/80 backdrop-blur px-3 py-2 shadow-sm">
                    <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                    <input value={objQuery} onChange={(e)=>{ setObjPage(1); setObjQuery(e.target.value) }} placeholder={t('search.object')} className="w-full bg-transparent text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {objects.map(o => (
                    <div key={o._id || o.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-raised">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {o.imagen ? (
                            <img src={o.imagen} alt={o.nombre} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <span className="text-2xl">{o.icono || '📦'}</span>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{o.nombre}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{o.categoria} · {o.numeroInventario}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setEditing(o); setForm({ nombre: o.nombre||'', categoria: o.categoria||'', numeroInventario: o.numeroInventario||'', nickname: o.nickname||'', descripcion: o.descripcion||'', icono: o.icono||'📦', imagen: null }); setOpen(true) }}><Pencil size={14} /> Editar</Button>
                          <Button variant="outline" size="sm" className="gap-1" onClick={async ()=>{
                            const ok = window.confirm(`¿Borrar el objeto "${o.nombre}"? Esta acción no se puede deshacer.`)
                            if (!ok) return
                            try { await objectService.deleteObject(o._id || o.id) } catch {}
                            // refresh
                            try {
                              const res = await objectService.getObjects({ search: objQuery, page: objPage, limit: objLimit })
                              const data = res.data || {}
                              const list = Array.isArray(data) ? data : (data.objects || [])
                              setObjects(list.filter(Boolean))
                            } catch {}
                          }}><Trash2 size={14} /> Borrar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{objTotal>0 ? `Mostrando ${(objPage-1)*objLimit+1}–${Math.min(objPage*objLimit, objTotal)} de ${objTotal}` : 'Sin resultados'}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={()=> setObjPage(p=> Math.max(1,p-1))} disabled={objPage<=1} className="gap-1"><ChevronLeft size={14} /> Anterior</Button>
                    <span className="text-xs">{objPage} / {Math.max(objPages,1)}</span>
                    <Button variant="outline" size="sm" onClick={()=> setObjPage(p=> Math.min(objPages, p+1))} disabled={objPage>=objPages} className="gap-1">Siguiente <ChevronRight size={14} /></Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toggle for Catalog mode (anchored inside Inventory) */}
      <div className="absolute bottom-4 left-4 z-30">
        <Button variant={catalogMode? 'solid' : 'outline'} onClick={()=> setCatalogMode(v=>!v)}>{catalogMode ? 'Ocultar catálogo' : 'Mostrar catálogo'}</Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setOpen(false); setEditing(null) }} />
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{editing ? 'Editar objeto' : 'Crear objeto'}</h3>
              <button onClick={()=> { setOpen(false); setEditing(null) }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={16} /></button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (submitting) return
                setSubmitting(true)
                setError('')
                try {
                  const fd = new FormData()
                  fd.append('nombre', form.nombre)
                  fd.append('categoria', form.categoria)
                  fd.append('numeroInventario', form.numeroInventario)
                  if (form.nickname) fd.append('nickname', form.nickname)
                  if (form.descripcion) fd.append('descripcion', form.descripcion)
                  if (form.icono) fd.append('icono', form.icono)
                  if (form.imagen) fd.append('imagen', form.imagen)
                  if (editing) {
                    await objectService.updateObject(editing._id || editing.id, fd)
                  } else {
                    await objectService.createObject(fd)
                  }
                  setOpen(false)
                  setEditing(null)
                  setForm({ nombre: '', categoria: '', numeroInventario: '', nickname: '', descripcion: '', icono: '📦', imagen: null })
                  setSuccess('Objeto guardado correctamente')
                  setTimeout(() => setSuccess(''), 2500)
                  // Refresh catalog so new/updated object appears
                  try {
                    const res = await objectService.getObjects({ search: objQuery, page: objPage, limit: objLimit })
                    const data = res.data || {}
                    const list = Array.isArray(data) ? data : (data.objects || [])
                    setObjects(list.filter(Boolean))
                  } catch {}
                } catch (err) {
                  setError(err?.response?.data?.message || 'No se pudo guardar el objeto')
                } finally {
                  setSubmitting(false)
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre</label>
                <Input value={form.nombre} onChange={e=>setForm(f=>({...f, nombre: e.target.value }))} placeholder="Nombre del objeto" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Categoría</label>
                <Input value={form.categoria} onChange={e=>setForm(f=>({...f, categoria: e.target.value }))} placeholder="Categoría (ej. silla, mesa)" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Número de inventario</label>
                <Input value={form.numeroInventario} onChange={e=>setForm(f=>({...f, numeroInventario: e.target.value }))} placeholder="Código/Número único" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Apodo</label>
                  <Input value={form.nickname} onChange={e=>setForm(f=>({...f, nickname: e.target.value }))} placeholder="Opcional" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Icono</label>
                  <Input value={form.icono} onChange={e=>setForm(f=>({...f, icono: e.target.value }))} placeholder="Ej. 📦" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Descripción</label>
                <Input value={form.descripcion} onChange={e=>setForm(f=>({...f, descripcion: e.target.value }))} placeholder="Breve descripción" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Imagen</label>
                <input type="file" accept="image/*" onChange={e=> setForm(f=> ({...f, imagen: e.target.files?.[0] || null }))} />
              </div>
              {error && <div className="text-xs text-danger-500">{error}</div>}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={()=> { setOpen(false); setEditing(null) }}>Cancelar</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Guardando…' : (editing ? 'Actualizar' : 'Crear')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg bg-emerald-600 text-white shadow-lg">{success}</div>
      )}
    </div>
  )
}
