import { useEffect, useRef, useState } from 'react'
import { tileService } from '../../services/api'

export default function MapVueWrapper({
  isAdmin = false,
  cols,
  rows,
  offsetX,
  offsetY,
  onExposeControls
}) {
  const elRef = useRef(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Avisar si el CE no está cargado
  useEffect(() => {
    if (!customElements.get('mapshade-map')) {
      console.error('mapshade-map no cargado. Verifica <script type="module" src="/mf/mapshade-map.es.js"> en index.html')
    }
  }, [])

  // Pasar props al CE
  useEffect(() => { if (elRef.current) elRef.current.isAdmin = !!isAdmin }, [isAdmin])
  useEffect(() => { if (elRef.current) elRef.current.tileBaseUrl = '/tiles/0' }, [])
  useEffect(() => { if (elRef.current) elRef.current.refreshKey = refreshKey }, [refreshKey])
  useEffect(() => { if (elRef.current && Number.isFinite(cols)) elRef.current.cols = cols }, [cols])
  useEffect(() => { if (elRef.current && Number.isFinite(rows)) elRef.current.rows = rows }, [rows])
  useEffect(() => { if (elRef.current && Number.isFinite(offsetX)) elRef.current.offsetX = offsetX }, [offsetX])
  useEffect(() => { if (elRef.current && Number.isFinite(offsetY)) elRef.current.offsetY = offsetY }, [offsetY])

  // Exponer controles al padre
  useEffect(() => {
    onExposeControls?.({
      invalidateTiles: () => setRefreshKey(Date.now())
    })
  }, [onExposeControls])

  // Eventos del CE: click en celda -> subir tile
  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const onTile = async (e) => {
      if (!isAdmin) return
      const { x, y } = e.detail || {}
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.png,.jpg,.jpeg'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        await tileService.upload(x, y, file, 0)
        setRefreshKey(Date.now())
      }
      input.click()
    }
    const onReady = () => console.info('map-ready from <mapshade-map>')
    const onError = (e) => console.error('map-error', e.detail)
    el.addEventListener('tile-clicked', onTile)
    el.addEventListener('map-ready', onReady)
    el.addEventListener('map-error', onError)
    return () => {
      el.removeEventListener('tile-clicked', onTile)
      el.removeEventListener('map-ready', onReady)
      el.removeEventListener('map-error', onError)
    }
  }, [isAdmin])

  return (
    <mapshade-map
      ref={elRef}
      style={{ display: 'block', position: 'relative', width: '100%', height: '100%', zIndex: 0 }}
    />
  )
}
