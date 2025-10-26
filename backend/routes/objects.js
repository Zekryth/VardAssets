import { Router } from 'express';
import multer from 'multer'
import ObjectModel from '../models/Object.js'

const router = Router();
const upload = multer({ storage: multer.memoryStorage() })

// GET /api/objects -> list with search/pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query || {}
    const pageNum = Math.max(parseInt(page, 10) || 1, 1)
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
    const skip = (pageNum - 1) * limitNum
    const q = (search || '').trim()
    const filter = q ? {
      $or: [
        { nombre: { $regex: q, $options: 'i' } },
        { categoria: { $regex: q, $options: 'i' } },
        { nickname: { $regex: q, $options: 'i' } },
        { numeroInventario: { $regex: q, $options: 'i' } }
      ]
    } : {}
    const [objects, total] = await Promise.all([
      ObjectModel.find(filter).sort({ nombre: 1 }).skip(skip).limit(limitNum),
      ObjectModel.countDocuments(filter)
    ])
    return res.json({ objects, page: pageNum, limit: limitNum, total, pages: Math.max(Math.ceil(total/limitNum),1) })
  } catch (err) {
    console.error('Error fetching objects', err)
    return res.status(500).json({ message: 'Error al obtener objetos' })
  }
})

// POST /api/objects -> create with optional image upload
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, categoria, icono, numeroInventario, nickname, descripcion } = req.body || {}
    if (!nombre || !categoria || !numeroInventario) {
      return res.status(400).json({ message: 'Faltan campos requeridos (nombre, categoria, numeroInventario)' })
    }
    let imagenUrl
    if (req.file) {
      // TODO: Subir a almacenamiento (Cloudinary/S3). Por ahora, devolveremos un placeholder data URL.
      const base64 = req.file.buffer.toString('base64')
      imagenUrl = `data:${req.file.mimetype};base64,${base64}`
    }
    const obj = await ObjectModel.create({ nombre, categoria, icono, numeroInventario, nickname, descripcion, imagen: imagenUrl })
    return res.status(201).json({ object: obj })
  } catch (err) {
    console.error('Error creating object', err)
    if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message })
    return res.status(500).json({ message: 'Error al crear el objeto' })
  }
})

// PATCH /api/objects/:id -> update (accepts multipart for image changes)
router.patch('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body || {}
    const update = { ...body }
    if (req.file) {
      const base64 = req.file.buffer.toString('base64')
      update.imagen = `data:${req.file.mimetype};base64,${base64}`
    }
    const obj = await ObjectModel.findByIdAndUpdate(id, update, { new: true })
    if (!obj) return res.status(404).json({ message: 'Objeto no encontrado' })
    return res.json({ object: obj })
  } catch (err) {
    console.error('Error updating object', err)
    return res.status(500).json({ message: 'Error al actualizar el objeto' })
  }
})

// DELETE /api/objects/:id -> delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const obj = await ObjectModel.findByIdAndDelete(id)
    if (!obj) return res.status(404).json({ message: 'Objeto no encontrado' })
    return res.json({ ok: true })
  } catch (err) {
    console.error('Error deleting object', err)
    return res.status(500).json({ message: 'Error al borrar el objeto' })
  }
})

export default router;
