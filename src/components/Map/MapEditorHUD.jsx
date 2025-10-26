/**
 * MapEditorHUD.jsx
 *
 * HUD (Head-Up Display) para edición avanzada del mapa.
 * Permite a administradores agregar tiles (cuadrantes) al mapa, mostrando controles en los bordes del área visible.
 * Gestiona la carga de imágenes y la actualización dinámica de tiles.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { tileService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext.jsx'

// HUD overlay to add tiles around existing bbox
// Contract:
// - Inputs: z (number), controls { invalidateTiles?: () => void }
// - Behavior: fetch existing tiles via /api/map/tiles/list, compute bbox (min/max x,y),
//   render + buttons on four sides to add new tiles by picking an image and uploading.
// - Success: after upload, refresh CE via controls.invalidateTiles and refetch list.
// - Errors: shows a small toast-style message if listing fails.
export default function MapEditorHUD({ z = 0, controls }) {
  const { isAdmin } = useAuth()
  const [tiles, setTiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const containerRef = useRef(null)

  const admin = typeof isAdmin === 'function' ? isAdmin() : !!(isAdmin?.user?.role === 'Admin')

  const fetchTiles = async () => {
    if (!admin) return
    setLoading(true)
    setErr('')
    try {
      const res = await tileService.list(z)
      setTiles(res.data?.tiles || [])
    } catch (e) {
      console.error('HUD list error', e)
      setErr('No se pudo cargar tiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTiles() }, [z, admin])

  const bbox = useMemo(() => {
    if (!tiles.length) return null
    const xs = tiles.map(t => t.x)
    const ys = tiles.map(t => t.y)
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
  }, [tiles])

  const pickFile = () => new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.png,.jpg,.jpeg'
    input.onchange = () => resolve(input.files?.[0] || null)
    input.click()
  })

  const addTile = async (x, y) => {
    const file = await pickFile()
    if (!file) return
    await tileService.upload(x, y, file, z)
    await fetchTiles()
    controls?.invalidateTiles?.()
  }

  if (!admin) return null

  // When there are no tiles yet, render a centered plus to seed first tile at (0,0)
  if (!bbox) {
    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10">
        <button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg"
          title="Agregar primer tile (0,0)"
          onClick={() => addTile(0, 0)}
        >
          <Plus size={20} />
        </button>
      </div>
    )
  }

  const cx = Math.floor((bbox.minX + bbox.maxX) / 2)
  const cy = Math.floor((bbox.minY + bbox.maxY) / 2)

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10">
      {/* Top row: add above all columns */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 flex gap-2 pointer-events-auto">
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow"
          title={`Agregar fila arriba (y=${bbox.minY - 1})`}
          onClick={() => addTile(bbox.minX, bbox.minY - 1)}
        >
          + Arriba
        </button>
      </div>
      {/* Right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto">
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow"
          title={`Agregar columna derecha (x=${bbox.maxX + 1})`}
          onClick={() => addTile(bbox.maxX + 1, cy)}
        >
          + Derecha
        </button>
      </div>
      {/* Bottom */}
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 pointer-events-auto">
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow"
          title={`Agregar fila abajo (y=${bbox.maxY + 1})`}
          onClick={() => addTile(bbox.minX, bbox.maxY + 1)}
        >
          + Abajo
        </button>
      </div>
      {/* Left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto">
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1 shadow"
          title={`Agregar columna izquierda (x=${bbox.minX - 1})`}
          onClick={() => addTile(bbox.minX - 1, cy)}
        >
          + Izquierda
        </button>
      </div>

      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-300 bg-gray-900/70 px-2 py-1 rounded">Cargando…</div>
      )}
      {err && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs text-red-300 bg-red-900/40 px-2 py-1 rounded">{err}</div>
      )}
    </div>
  )
}
