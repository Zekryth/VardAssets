/**
 * Companies.jsx
 *
 * Page for managing companies in the application.
 * List, search, create, edit and delete companies with pagination and modal form.
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
      const list = Array.isArray(data) ? data : (data.data || [])
      setCompanies(list)
      if (typeof data.total === 'number') setTotal(data.total)
      if (typeof data.pages === 'number') setPages(data.pages)
    })
    .catch(() => { })

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
      setError(err?.response?.data?.message || 'Could not create company')
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
            <h2 className="text-sm font-semibold">Companies</h2>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-lg ml-auto">
            <div className="flex items-center flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-surface-raised/80 backdrop-blur px-3 py-2 shadow-sm" role="search" aria-label="Search company">
              <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setPage(1); setQuery(e.target.value) }}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none"
                aria-label="Search company"
              />
            </div>
            <Button onClick={() => { setForm({ nombre: '', personaContacto: '', telefono: '', email: '' }); setEditing(null); setOpen(true); }} className="gap-2 whitespace-nowrap"><Plus size={16} /> Add Company</Button>
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
                    <div className="text-xs text-gray-600 dark:text-gray-400">{c.persona_contacto} · {c.telefono}{c.email ? ` · ${c.email}` : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setEditing(c); setForm({ nombre: c.nombre||'', personaContacto: c.persona_contacto||'', telefono: c.telefono||'', email: c.email||'' }); setOpen(true) }}>
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={async ()=>{
                      const ok = window.confirm(`Delete company "${c.nombre}"? This action cannot be undone.`)
                      if (!ok) return
                      try { await companyService.deleteCompany?.(c._id || c.id) } catch {}
                      fetchCompanies()
                    }}>
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {companies.length === 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No companies registered</div>
              )}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {total > 0 ? `Showing ${(page-1)*limit + 1}–${Math.min(page*limit, total)} of ${total}` : 'No results'}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1} className="gap-1"><ChevronLeft size={14} /> Previous</Button>
                <span className="text-xs text-gray-600 dark:text-gray-300">{page} / {Math.max(pages,1)}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page>=pages} className="gap-1">Next <ChevronRight size={14} /></Button>
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
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{editing ? 'Edit Company' : 'Add Company'}</h3>
              <button onClick={()=>{ setOpen(false); setEditing(null) }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={16} /></button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <Input value={form.nombre} onChange={e=>onChange('nombre', e.target.value)} placeholder="Company name" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Contact Person</label>
                <Input value={form.personaContacto} onChange={e=>onChange('personaContacto', e.target.value)} placeholder="Contact person" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                <Input value={form.telefono} onChange={e=>onChange('telefono', e.target.value)} placeholder="Phone" required />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <Input type="email" value={form.email} onChange={e=>onChange('email', e.target.value)} placeholder="email@example.com" />
              </div>
              {error && <div className="text-xs text-danger-500">{error}</div>}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={()=>{ setOpen(false); setEditing(null) }}>Cancel</Button>
                <Button type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Saving...' : (editing ? 'Update' : 'Save')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
