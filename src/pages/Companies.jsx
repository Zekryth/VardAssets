/**
 * Companies.jsx
 *
 * Página para la gestión de compañías/empresas en la aplicación.
 * Permite listar, buscar, crear, editar y eliminar compañías, con paginación y formulario modal.
 * Utiliza servicios de API y componentes de UI personalizados.
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Building2, Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { companyService } from '../services/api'
import Button from '../components/UI/Button.jsx'
import Input from '../components/UI/Input.jsx'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', personaContacto: '', telefono: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  const fetchCompanies = () => companyService.getCompanies({ params: { search: query, page, limit } })
    .then(res => {
      const data = res.data || {}
      const list = Array.isArray(data) ? data : (data.companies || [])
      setCompanies(list)
      if (typeof data.total === 'number') setTotal(data.total)
      if (typeof data.pages === 'number') setPages(data.pages)
    })
    .catch(() => {})

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchCompanies().finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // refetch when query/page/limit changes (debounce query lightly)
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      fetchCompanies().finally(() => setLoading(false))
    }, 200)
    return () => clearTimeout(t)
  }, [query, page, limit])

  const onChange = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const canSubmit = useMemo(() => form.nombre.trim() && form.personaContacto.trim() && form.telefono.trim(), [form])

  const onSubmit = async (e) => {
    e?.preventDefault?.()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        await companyService.updateCompany?.(editing._id || editing.id, {
          nombre: form.nombre.trim(),
          personaContacto: form.personaContacto.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim() || undefined
        })
      } else {
        await companyService.createCompany({
          nombre: form.nombre.trim(),
          personaContacto: form.personaContacto.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim() || undefined
        })
      }
      setOpen(false)
      setEditing(null)
      setForm({ nombre: '', personaContacto: '', telefono: '', email: '' })
      fetchCompanies()
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo crear la compañía')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="px-4 pt-4 md:px-6 md:pt-5 select-none">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Building2 size={18} />
            <h2 className="text-sm font-semibold">Compañías</h2>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-lg ml-auto">
            <div className="flex items-center flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-surface-raised/80 backdrop-blur px-3 py-2 shadow-sm" role="search" aria-label="Buscar compañías">
              <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setPage(1); setQuery(e.target.value) }}
                placeholder="Buscar por nombre, responsable, teléfono o email"
                className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none"
                aria-label="Buscar compañías"
              />
            </div>
            <Button onClick={() => setOpen(true)} className="gap-2 whitespace-nowrap"><Plus size={16} /> Agregar</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {companies.map(c => (
                <div key={c._id || c.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-raised flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.nombre}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{c.personaContacto} · {c.telefono}{c.email ? ` · ${c.email}` : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setEditing(c); setForm({ nombre: c.nombre||'', personaContacto: c.personaContacto||'', telefono: c.telefono||'', email: c.email||'' }); setOpen(true) }}>
                      <Pencil size={14} /> Editar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={async ()=>{
                      const ok = window.confirm(`¿Borrar la compañía "${c.nombre}"? Esta acción no se puede deshacer.`)
                      if (!ok) return
                      try { await companyService.deleteCompany?.(c._id || c.id) } catch {}
                      fetchCompanies()
                    }}>
                      <Trash2 size={14} /> Borrar
                    </Button>
                  </div>
                </div>
              ))}
              {companies.length === 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No hay compañías registradas</div>
              )}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {total > 0 ? `Mostrando ${(page-1)*limit + 1}–${Math.min(page*limit, total)} de ${total}` : 'Sin resultados'}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1} className="gap-1"><ChevronLeft size={14} /> Anterior</Button>
                <span className="text-xs text-gray-600 dark:text-gray-300">{page} / {Math.max(pages,1)}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page>=pages} className="gap-1">Siguiente <ChevronRight size={14} /></Button>
              </div>
            </div>
          </>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{editing ? 'Editar compañía' : 'Agregar compañía'}</h3>
              <button onClick={()=>{ setOpen(false); setEditing(null) }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={16} /></button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre</label>
                <Input value={form.nombre} onChange={e=>onChange('nombre', e.target.value)} placeholder="Nombre de la compañía" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Persona responsable</label>
                <Input value={form.personaContacto} onChange={e=>onChange('personaContacto', e.target.value)} placeholder="Persona de contacto" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Teléfono</label>
                <Input value={form.telefono} onChange={e=>onChange('telefono', e.target.value)} placeholder="Teléfono" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <Input type="email" value={form.email} onChange={e=>onChange('email', e.target.value)} placeholder="email@ejemplo.com" />
              </div>
              {error && <div className="text-xs text-danger-500">{error}</div>}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={()=>{ setOpen(false); setEditing(null) }}>Cancelar</Button>
                <Button type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Guardando…' : (editing ? 'Actualizar' : 'Guardar')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
