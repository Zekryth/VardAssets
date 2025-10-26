import { Router } from 'express';
import multer from 'multer'
import Point from '../models/Point.js'
import Company from '../models/Company.js'
import ObjectModel from '../models/Object.js'
import DeletedPoint from '../models/DeletedPoint.js'
import { auth, adminAuth } from '../middleware/auth.js'

const router = Router();
const upload = multer({ storage: multer.memoryStorage() })

// GET /api/points -> list points, optionally filter by company/category
router.get('/', async (req, res) => {
  try {
    const { companyId = '', category = '' } = req.query || {}
    const filter = {}
    if (companyId) filter['compañia'] = companyId
    if (category) filter['categoria'] = category
    const points = await Point.find(filter).populate('compañia').populate('inventario.objeto')
    return res.json({ points })
  } catch (err) {
    console.error('list points error', err)
    return res.status(500).json({ message: 'Error al obtener puntos' })
  }
})

// POST /api/points -> create point
router.post('/', async (req, res) => {
  try {
    const { nombre, categoria, compañia, coordenadas, inventario = [] } = req.body || {}
    if (!nombre || !categoria || !compañia || !coordenadas || typeof coordenadas.x !== 'number' || typeof coordenadas.y !== 'number') {
      return res.status(400).json({ message: 'Campos requeridos faltantes' })
    }
    // Validate references exist
    const comp = await Company.findById(compañia)
    if (!comp) return res.status(400).json({ message: 'Compañía inválida' })
    // Validate objects in inventario
    const inv = []
    for (const it of Array.isArray(inventario) ? inventario : []) {
      if (!it?.objeto || !it?.cantidad) continue
      const obj = await ObjectModel.findById(it.objeto)
      if (obj) inv.push({ objeto: obj._id, cantidad: Math.max(1, Number(it.cantidad) || 1) })
    }
    const created = await Point.create({ nombre, categoria, compañia, coordenadas, inventario: inv })
    const populated = await Point.findById(created._id).populate('compañia').populate('inventario.objeto')
    return res.status(201).json({ point: populated })
  } catch (err) {
    console.error('create point error', err)
    if (err?.code === 11000) return res.status(400).json({ message: 'Ya existe un punto en esas coordenadas' })
    return res.status(500).json({ message: 'Error al crear el punto' })
  }
})

// PATCH /api/points/:id -> update point
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const update = req.body || {}
    if (update.inventario) {
      const inv = []
      for (const it of Array.isArray(update.inventario) ? update.inventario : []) {
        if (!it?.objeto || !it?.cantidad) continue
        inv.push({ objeto: it.objeto, cantidad: Math.max(1, Number(it.cantidad) || 1) })
      }
      update.inventario = inv
    }
    const pt = await Point.findByIdAndUpdate(id, update, { new: true })
    if (!pt) return res.status(404).json({ message: 'Punto no encontrado' })
    const populated = await Point.findById(pt._id).populate('compañia').populate('inventario.objeto')
    return res.json({ point: populated })
  } catch (err) {
    console.error('update point error', err)
    return res.status(500).json({ message: 'Error al actualizar el punto' })
  }
})

// DELETE /api/points/:id -> delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const pt = await Point.findById(id).populate('compa\u00f1ia').populate('inventario.objeto')
    if (!pt) return res.status(404).json({ message: 'Punto no encontrado' })
    // Archive into DeletedPoint (soft delete)
    const payload = {
      originalId: pt._id,
      nombre: pt.nombre,
      categoria: pt.categoria,
      compa\u00f1ia: pt.compa\u00f1ia?._id || pt.compa\u00f1ia,
      coordenadas: pt.coordenadas,
      inventario: (pt.inventario || []).map(it => ({ objeto: it.objeto?._id || it.objeto, cantidad: it.cantidad })),
      fotos: pt.fotos || [],
      documentos: pt.documentos || [],
  meta: { reason: req.body?.reason || 'map-action', context: req.body?.context || null },
  deletedBy: req.user?._id || null,
    }
    const dp = await DeletedPoint.create(payload)
    await Point.findByIdAndDelete(id)
    return res.json({ ok: true, deleted: dp })
  } catch (err) {
    console.error('delete point error', err)
    return res.status(500).json({ message: 'Error al borrar el punto' })
  }
})

// GET /api/points/deleted -> list soft-deleted points
router.get('/deleted/list', auth, adminAuth, async (req, res) => {
  try {
    const docs = await DeletedPoint.find().sort({ deletedAt: -1 }).populate('compa\u00f1ia').populate('deletedBy').populate('inventario.objeto')
    res.json({ deleted: docs })
  } catch (err) {
    console.error('list deleted error', err)
    res.status(500).json({ message: 'Error al obtener borrados' })
  }
})

// POST /api/points/deleted/:id/restore -> restore a deleted point
router.post('/deleted/:id/restore', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const dp = await DeletedPoint.findById(id).populate('compa\u00f1ia').populate('inventario.objeto')
    if (!dp) return res.status(404).json({ message: 'Registro no encontrado' })
    // Try re-create point; may fail if coordinates taken now
    const created = await Point.create({
      nombre: dp.nombre,
      categoria: dp.categoria,
      compa\u00f1ia: dp.compa\u00f1ia?._id || dp.compa\u00f1ia,
      coordenadas: dp.coordenadas,
      inventario: (dp.inventario || []).map(it => ({ objeto: it.objeto?._id || it.objeto, cantidad: it.cantidad })),
      fotos: dp.fotos || [],
      documentos: dp.documentos || [],
    })
    const populated = await Point.findById(created._id).populate('compa\u00f1ia').populate('inventario.objeto')
    await DeletedPoint.findByIdAndDelete(id)
    res.json({ point: populated })
  } catch (err) {
    console.error('restore error', err)
    if (err?.code === 11000) return res.status(400).json({ message: 'No se puede restaurar: ya existe un punto en esas coordenadas' })
    res.status(500).json({ message: 'Error al restaurar' })
  }
})

// DELETE /api/points/deleted/:id -> purge deleted record
router.delete('/deleted/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    await DeletedPoint.findByIdAndDelete(id)
    res.json({ ok: true })
  } catch (err) {
    console.error('purge error', err)
    res.status(500).json({ message: 'Error al eliminar permanentemente' })
  }
})

// POST /api/points/:id/files -> upload photos/documents
router.post('/:id/files', upload.fields([{ name: 'fotos' }, { name: 'documentos' }]), async (req, res) => {
  try {
    const { id } = req.params
    const pt = await Point.findById(id)
    if (!pt) return res.status(404).json({ message: 'Punto no encontrado' })
    const fotos = Array.isArray(req.files?.fotos) ? req.files.fotos : []
    const documentos = Array.isArray(req.files?.documentos) ? req.files.documentos : []
    const addFotos = fotos.map(f => ({ url: `data:${f.mimetype};base64,${f.buffer.toString('base64')}`, nombre: f.originalname }))
    const addDocs = documentos.map(d => ({ url: `data:${d.mimetype};base64,${d.buffer.toString('base64')}`, nombre: d.originalname, tipo: d.mimetype }))
    pt.fotos = [...(pt.fotos || []), ...addFotos]
    pt.documentos = [...(pt.documentos || []), ...addDocs]
    await pt.save()
    const populated = await Point.findById(pt._id).populate('compañia').populate('inventario.objeto')
    return res.json({ point: populated })
  } catch (err) {
    console.error('upload files error', err)
    return res.status(500).json({ message: 'Error al subir archivos' })
  }
})

export default router;
