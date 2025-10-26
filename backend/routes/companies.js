import { Router } from 'express';
import Company from '../models/Company.js'

const router = Router();

// GET /api/companies -> list companies with optional search and pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', page = '1', limit = '10' } = req.query || {}
    const pageNum = Math.max(parseInt(page, 10) || 1, 1)
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
    const skip = (pageNum - 1) * limitNum

    const q = (search || '').trim()
    const filter = q
      ? { $or: [
          { nombre: { $regex: q, $options: 'i' } },
          { personaContacto: { $regex: q, $options: 'i' } },
          { telefono: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]}
      : {}

    const [companies, total] = await Promise.all([
      Company.find(filter).sort({ nombre: 1 }).skip(skip).limit(limitNum),
      Company.countDocuments(filter)
    ])

    const pages = Math.max(Math.ceil(total / limitNum), 1)
    return res.json({ companies, page: pageNum, limit: limitNum, total, pages })
  } catch (err) {
    console.error('Error fetching companies', err)
    return res.status(500).json({ message: 'Error al obtener compañías' })
  }
});

// POST /api/companies -> create a company
router.post('/', async (req, res) => {
  try {
    const { nombre, personaContacto, telefono, email } = req.body || {}
    if (!nombre || !personaContacto || !telefono) {
      return res.status(400).json({ message: 'Faltan campos requeridos (nombre, personaContacto, telefono)' })
    }
    const company = await Company.create({ nombre, personaContacto, telefono, email })
    return res.status(201).json({ company })
  } catch (err) {
    console.error('Error creating company', err)
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({ message: 'Error al crear la compañía' })
  }
})

// PATCH /api/companies/:id -> update a company
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const update = req.body || {}
    const company = await Company.findByIdAndUpdate(id, update, { new: true })
    if (!company) return res.status(404).json({ message: 'Compañía no encontrada' })
    return res.json({ company })
  } catch (err) {
    console.error('Error updating company', err)
    if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message })
    return res.status(500).json({ message: 'Error al actualizar la compañía' })
  }
})

// DELETE /api/companies/:id -> delete a company
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const company = await Company.findByIdAndDelete(id)
    if (!company) return res.status(404).json({ message: 'Compañía no encontrada' })
    return res.json({ ok: true })
  } catch (err) {
    console.error('Error deleting company', err)
    return res.status(500).json({ message: 'Error al borrar la compañía' })
  }
})

export default router;
