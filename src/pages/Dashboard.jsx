import React, { useEffect, useState } from 'react'
import { deletedPointsService, fileService, companyService } from '../services/api'
import { Image, FileText, File, FileSpreadsheet, Download, RotateCcw, Trash2 } from 'lucide-react'

// Helper para unir clases
const cx = (...classes) => classes.filter(Boolean).join(' ')

// Tabs disponibles en el Dashboard

export default function Dashboard() {
  const { t } = useTranslation();
  const TABS = [
    { key: 'borrador', label: t('dashboard.tab_borrador'), enabled: true },
    { key: 'estadisticas', label: t('dashboard.tab_estadisticas'), enabled: false },
    { key: 'auditoria', label: t('dashboard.tab_auditoria'), enabled: false },
  ];

  const [activeTab, setActiveTab] = useState('borrador')
  
  // Estado para la sección Borrador
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [query, setQuery] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [sort, setSort] = useState('date_desc')
  const [preview, setPreview] = useState(null) // { type: 'fotos'|'documentos', item }

  const load = () => {
    setLoading(true)
    setErr('')
    deletedPointsService.list()
      .then(r => setItems(r.data?.deleted || []))
      .catch(e => setErr(e?.response?.data?.message || e?.message || 'Error cargando borrados'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const restore = async (id) => {
    try { await deletedPointsService.restore(id); load() } catch {}
  }
  const purge = async (id) => {
    if (!confirm('¿Eliminar para siempre este registro?')) return
    try { await deletedPointsService.purge(id); load() } catch {}
  }

  const companies = Array.from(new Map(items.map(i => [i.compañia?._id || i.compañia?.id, i.compañia]).filter(([id,c]) => id && c)).values())

  const filtered = items.filter(i => {
    const q = query.trim().toLowerCase()
    const matchQ = !q || (i.nombre || '').toLowerCase().includes(q) || (i.categoria || '').toLowerCase().includes(q)
    const matchC = !companyId || (i.compañia?._id === companyId || i.compañia?.id === companyId)
    return matchQ && matchC
  }).sort((a,b) => {
    if (sort === 'date_desc') return new Date(b.deletedAt) - new Date(a.deletedAt)
    if (sort === 'date_asc') return new Date(a.deletedAt) - new Date(b.deletedAt)
    if (sort === 'name_asc') return (a.nombre||'').localeCompare(b.nombre||'')
    if (sort === 'name_desc') return (b.nombre||'').localeCompare(a.nombre||'')
    return 0
  })

  return (
    <div className="p-6">
      {/* Header principal */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Navegación por tabs */}
      <div className="mb-6" role="tablist" aria-label="Secciones del Dashboard">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          {TABS.map(tab => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              disabled={!tab.enabled}
              onClick={() => tab.enabled && setActiveTab(tab.key)}
              className={cx(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-2',
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : tab.enabled
                  ? 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700'
                  : 'border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed'
              )}
            >
              {tab.label}
              {!tab.enabled && <span className="ml-2 text-xs">({t('dashboard.coming_soon')})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido dinámico según tab activo */}
      {activeTab === 'borrador' && (
        <BorradorSection
          items={items}
          loading={loading}
          err={err}
          query={query}
          setQuery={setQuery}
          companyId={companyId}
          setCompanyId={setCompanyId}
          sort={sort}
          setSort={setSort}
          preview={preview}
          setPreview={setPreview}
          load={load}
          restore={restore}
          purge={purge}
          filtered={filtered}
          companies={companies}
        />
      )}

      {activeTab === 'doc-historico' && (
  {/* DocHistoricoSection removed */}
      )}

      {activeTab === 'estadisticas' && (
        <div role="tabpanel" id="panel-estadisticas" className="py-12 text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg font-medium">{t('dashboard.tab_estadisticas')}</p>
          <p className="text-sm">{t('dashboard.section_coming_soon')}</p>
        </div>
      )}

      {activeTab === 'auditoria' && (
        <div role="tabpanel" id="panel-auditoria" className="py-12 text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-lg font-medium">{t('dashboard.tab_auditoria')}</p>
          <p className="text-sm">{t('dashboard.section_coming_soon')}</p>
        </div>
      )}
    </div>
  )
}

// Componente de la sección Borrador
import { useTranslation } from 'react-i18next';

function BorradorSection({ items, loading, err, query, setQuery, companyId, setCompanyId, sort, setSort, preview, setPreview, load, restore, purge, filtered, companies }) {
  const { t } = useTranslation();
  return (
    <section role="tabpanel" id="panel-borrador">
      <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{t('dashboard.deleted_history')}</h2>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={t('dashboard.search_placeholder')} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
        <select value={companyId} onChange={(e)=>setCompanyId(e.target.value)} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          <option value="">{t('dashboard.all_companies')}</option>
          {companies.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.nombre}</option>)}
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
          <option value="date_desc">{t('dashboard.sort_recent')}</option>
          <option value="date_asc">{t('dashboard.sort_oldest')}</option>
          <option value="name_asc">{t('dashboard.sort_name_az')}</option>
          <option value="name_desc">{t('dashboard.sort_name_za')}</option>
        </select>
        <button onClick={load} className="ml-auto px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{t('dashboard.reload')}</button>
      </div>
      {err && <div className="mb-2 text-sm text-red-600 dark:text-red-400">{err}</div>}
      {loading ? (
        <div className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.no_deleted')}</div>
      ) : (
        <div className="overflow-auto rounded border border-gray-200 dark:border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="text-left px-3 py-2">{t('dashboard.col_name')}</th>
                <th className="text-left px-3 py-2">{t('dashboard.col_company')}</th>
                <th className="text-left px-3 py-2">{t('dashboard.col_coords')}</th>
                <th className="text-left px-3 py-2">{t('dashboard.col_reason')}</th>
                <th className="text-left px-3 py-2">{t('dashboard.col_deleted_by')}</th>
                <th className="text-left px-3 py-2">{t('dashboard.col_date')}</th>
                <th className="text-right px-3 py-2">{t('dashboard.col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(it => (
                <tr key={it._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                  <td className="px-3 py-2 font-medium">{it.nombre}</td>
                  <td className="px-3 py-2">{it.compañia?.nombre || t('dashboard.dash')}</td>
                  <td className="px-3 py-2">{it.coordenadas?.x},{it.coordenadas?.y}</td>
                  <td className="px-3 py-2 max-w-[240px] truncate" title={it.meta?.reason || ''}>{it.meta?.reason || t('dashboard.dash')}</td>
                  <td className="px-3 py-2">{it.deletedBy?.nombre || it.deletedBy?.email || t('dashboard.dash')}</td>
                  <td className="px-3 py-2">{it.deletedAt ? new Date(it.deletedAt).toLocaleString() : t('dashboard.dash')}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" onClick={() => setPreview({ type: 'fotos', item: it })}>{t('dashboard.view')}</button>
                    <button className="px-2 py-1 rounded bg-primary-600 text-white mr-2 hover:bg-primary-700 transition-colors" onClick={() => restore(it._id)}>{t('dashboard.restore')}</button>
                    <button className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors" onClick={() => purge(it._id)}>{t('dashboard.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal onClick={() => setPreview(null)}>
          <div className="w-[min(92vw,860px)] max-h-[90vh] rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <div className="font-semibold">{preview.item?.nombre} — {preview.item?.compañia?.nombre || t('dashboard.dash')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">X:{preview.item?.coordenadas?.x} Y:{preview.item?.coordenadas?.y}</div>
              </div>
              <button className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setPreview(null)}>{t('dashboard.close')}</button>
            </div>
            <div className="p-4 space-y-4 overflow-auto max-h-[calc(90vh-48px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded p-3">
                  <div className="text-xs uppercase text-gray-500">{t('dashboard.col_reason')}</div>
                  <div className="mt-1">{preview.item?.meta?.reason || t('dashboard.dash')}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded p-3">
                  <div className="text-xs uppercase text-gray-500">{t('dashboard.col_deleted_by')}</div>
                  <div className="mt-1">{preview.item?.deletedBy?.nombre || preview.item?.deletedBy?.email || t('dashboard.dash')}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded p-3">
                  <div className="text-xs uppercase text-gray-500">{t('dashboard.col_date')}</div>
                  <div className="mt-1">{preview.item?.deletedAt ? new Date(preview.item.deletedAt).toLocaleString() : t('dashboard.dash')}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">{t('dashboard.photos')}</div>
                {Array.isArray(preview.item?.fotos) && preview.item.fotos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {preview.item.fotos.map((f, i) => (
                      <img key={i} src={f.url} alt={f.nombre || `foto-${i}`} className="w-full h-24 object-cover rounded" />
                    ))}
                  </div>
                ) : <div className="text-xs text-gray-500">{t('dashboard.no_photos')}</div>}
              </div>
              <div>
                <div className="text-sm font-medium mb-2">{t('dashboard.documents')}</div>
                {Array.isArray(preview.item?.documentos) && preview.item.documentos.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {preview.item.documentos.map((d, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5">
                        <span className="truncate">{d.nombre}</span>
                        <a className="text-primary-600 hover:underline" href={d.url} download>{t('dashboard.download')}</a>
                      </li>
                    ))}
                  </ul>
                ) : <div className="text-xs text-gray-500">{t('dashboard.no_documents')}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
