import { Router } from 'express';
import multer from 'multer'
import Point from '../models/Point.js'
import Company from '../models/Company.js'
import ObjectModel from '../models/Object.js'
import DeletedPoint from '../models/DeletedPoint.js'
// ...existing code...
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

// DELETE /api/points/:id -> delete (soft delete with archive)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const pt = await Point.findById(id).populate('compañia').populate('inventario.objeto')
    if (!pt) return res.status(404).json({ message: 'Punto no encontrado' })
    
    console.log('Deleting point:', id, 'User:', req.user?._id, 'Body:', req.body)
    
    // ...existing code...
    // Archive into DeletedPoint (soft delete)
    const payload = {
      originalId: pt._id,
      nombre: pt.nombre,
      categoria: pt.categoria,
      compañia: pt.compañia?._id || null,
      coordenadas: pt.coordenadas,
      inventario: (pt.inventario || []).map(it => ({ 
        objeto: it.objeto?._id || it.objeto, 
        cantidad: it.cantidad 
      })),
      fotos: pt.fotos || [],
      documentos: pt.documentos || [],
      meta: { 
        reason: req.body?.reason || '', 
        context: req.body?.context || {} 
      },
      deletedBy: req.user?._id || null,
      deletedAt: new Date()
    }
    const dp = await DeletedPoint.create(payload)
  await Point.findByIdAndDelete(id)
  return res.json({ ok: true, deleted: dp })
  } catch (err) {
    console.error('delete point error', err)
    return res.status(500).json({ 
      message: err.message || 'Error al borrar el punto',
      details: err.toString()
    })
  }
})

// GET /api/points/deleted/list -> list soft-deleted points
router.get('/deleted/list', auth, adminAuth, async (req, res) => {
  try {
    const docs = await DeletedPoint.find().sort({ deletedAt: -1 }).populate('compañia').populate('deletedBy').populate('inventario.objeto')
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
    const dp = await DeletedPoint.findById(id).populate('compañia').populate('inventario.objeto')
    if (!dp) return res.status(404).json({ message: 'Registro no encontrado' })
    // Try re-create point; may fail if coordinates taken now
    const created = await Point.create({
      nombre: dp.nombre,
      categoria: dp.categoria,
      compañia: dp.compañia?._id || dp.compañia,
      coordenadas: dp.coordenadas,
      inventario: (dp.inventario || []).map(it => ({ objeto: it.objeto?._id || it.objeto, cantidad: it.cantidad })),
      fotos: dp.fotos || [],
      documentos: dp.documentos || [],
    })
    const populated = await Point.findById(created._id).populate('compañia').populate('inventario.objeto')
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

// DELETE /api/points/:pointId/files/:fileIndex -> soft delete a file (photo or document)
router.delete('/:pointId/files/:fileIndex', auth, async (req, res) => {
  try {
    const { pointId, fileIndex } = req.params
    const { fileType, reason, context } = req.body || {}
    
    console.log('Deleting file:', { pointId, fileIndex, fileType, user: req.user?._id })
    
    // Validate
    if (!['foto', 'documento'].includes(fileType)) {
      return res.status(400).json({ message: 'fileType debe ser "foto" o "documento"' })
    }
    
    const pt = await Point.findById(pointId).populate('compañia')
    if (!pt) return res.status(404).json({ message: 'Punto no encontrado' })
    
    const array = fileType === 'foto' ? pt.fotos : pt.documentos
    const idx = parseInt(fileIndex)
    
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      return res.status(404).json({ message: 'Archivo no encontrado en el índice especificado' })
    }
    
    const fileData = array[idx]
    
    // Calculate file size from base64 if available
    let tamaño = 0
    if (fileData.url?.startsWith('data:')) {
      const base64Data = fileData.url.split(',')[1] || ''
      tamaño = Math.floor((base64Data.length * 3) / 4) // approximate bytes from base64
    }
    
    // ...existing code...
    
    // Remove from array
    array.splice(idx, 1)
    if (fileType === 'foto') {
      pt.fotos = array
    } else {
      pt.documentos = array
    }
    await pt.save()
    return res.json({ ok: true })
  } catch (err) {
    console.error('delete file error', err)
    return res.status(500).json({ 
      message: err.message || 'Error al borrar archivo',
      details: err.toString()
    })
  }
})

// GET /api/files/deleted/list -> list deleted files
// ...existing code...

// POST /api/files/deleted/:id/restore -> restore a deleted file
// ...existing code...

// DELETE /api/files/deleted/:id -> purge deleted file permanently
// ...existing code...

export default router;
