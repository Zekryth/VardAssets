import express from 'express'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { auth, adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Asegura rutas: POST /api/map/tiles, DELETE /api/map/tiles, HEAD /api/map/tiles, y estáticos en /tiles/{z}/{x}_{y}.png
// Usa multer para guardar en backend/mapTiles/{z}/{x}_{y}.ext
// (Si tu archivo ya tiene esto, no cambies nada)

// Estructura: backend/mapTiles/{z}/{x}_{y}.(png|jpg)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tilesRoot = path.resolve(__dirname, '..', 'mapTiles')
if (!fs.existsSync(tilesRoot)) fs.mkdirSync(tilesRoot, { recursive: true })

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg'])

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const z = String(req.body.z ?? '0')
    const dir = path.join(tilesRoot, z)
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const { x, y } = req.body
    const rawExt = (path.extname(file.originalname) || '.png').toLowerCase()
    const ext = rawExt === '.jpeg' ? '.jpg' : (rawExt === '.jpg' || rawExt === '.png' ? rawExt : '.png')
    cb(null, `${x}_${y}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) return cb(new Error('Solo PNG/JPG permitidos'))
    cb(null, true)
  },
})

// HEAD /api/map/tiles?x=&y=&z=0 -> 204 si existe, 404 si no
router.head('/', (req, res) => {
  const x = String(req.query.x ?? '')
  const y = String(req.query.y ?? '')
  const z = String(req.query.z ?? '0')
  if (!x || !y) return res.sendStatus(400)
  const dir = path.join(tilesRoot, z)
  let found = false
  for (const ext of ['.png', '.jpg']) {
    if (fs.existsSync(path.join(dir, `${x}_${y}${ext}`))) { found = true; break }
  }
  return res.sendStatus(found ? 204 : 404)
})

// (Compat) GET /api/map/tiles/exists?x=&y=&z=0 -> {exists:boolean}
router.get('/exists', (req, res) => {
  const x = String(req.query.x ?? '')
  const y = String(req.query.y ?? '')
  const z = String(req.query.z ?? '0')
  if (!x || !y) return res.status(400).json({ error: 'x,y requeridos' })
  const dir = path.join(tilesRoot, z)
  const exists = ['.png', '.jpg'].some(ext => fs.existsSync(path.join(dir, `${x}_${y}${ext}`)))
  return res.json({ exists })
})

// POST /api/map/tiles  (multipart: x,y,z,file) -> sube/reemplaza tile
router.post('/', auth, adminAuth, upload.single('file'), (req, res) => {
  const { x, y, z = 0 } = req.body
  if (!x || !y || !req.file) return res.status(400).json({ error: 'x,y y file requeridos' })
  const filename = path.basename(req.file.filename)
  const url = `/tiles/${z}/${filename}`
  return res.json({ ok: true, x: Number(x), y: Number(y), z: Number(z), url })
})

// DELETE /api/map/tiles?x=&y=&z=0  -> borra tile
router.delete('/', auth, adminAuth, (req, res) => {
  const x = String(req.query.x ?? '')
  const y = String(req.query.y ?? '')
  const z = String(req.query.z ?? '0')
  if (!x || !y) return res.status(400).json({ error: 'x,y requeridos' })
  const dir = path.join(tilesRoot, z)
  let removed = false
  for (const ext of ['.png', '.jpg']) {
    const fp = path.join(dir, `${x}_${y}${ext}`)
    if (fs.existsSync(fp)) { fs.unlinkSync(fp); removed = true }
  }
  return res.json({ ok: true, removed })
})

// (Asegúrate de tener definido tilesRoot y rutas POST/DELETE/HEAD)
// Añadir listado de tiles: GET /api/map/tiles/list?z=0 -> { tiles:[{x,y,url}] }
router.get('/list', (req, res) => {
  try {
    const z = String(req.query.z ?? '0')
    const dir = path.join(tilesRoot, z)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const files = fs.readdirSync(dir).filter(f => /\.(png|jpg)$/i.test(f))
    const tiles = []
    for (const f of files) {
      const m = /^(-?\d+)_(-?\d+)\.(png|jpg)$/i.exec(f)
      if (!m) continue
      const x = Number(m[1])
      const y = Number(m[2])
      tiles.push({ x, y, url: `/tiles/${z}/${f}` })
    }
    tiles.sort((a, b) => (a.y - b.y) || (a.x - b.x))
    return res.json({ tiles })
  } catch (e) {
    console.error('tiles/list error', e)
    return res.status(500).json({ error: 'list_failed' })
  }
})

export default router
