import express from 'express';
import { Point, DeletedPoint, Company, Object as ObjectModel } from '../models/index.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/points - Obtener todos los puntos
router.get('/', async (req, res) => {
  try {
    const points = await Point.findAll({
      where: { activo: true },
      order: [['fecha', 'DESC']]
    });
    res.json(points);
  } catch (error) {
    console.error('Error obteniendo puntos:', error);
    res.status(500).json({ message: 'Error obteniendo puntos', error: error.message });
  }
});

// GET /api/points/:id - Obtener un punto por ID
router.get('/:id', async (req, res) => {
  try {
    const point = await Point.findByPk(req.params.id);
    if (!point || !point.activo) {
      return res.status(404).json({ message: 'Punto no encontrado' });
    }
    res.json(point);
  } catch (error) {
    console.error('Error obteniendo punto:', error);
    res.status(500).json({ message: 'Error obteniendo punto', error: error.message });
  }
});

// POST /api/points - Crear un nuevo punto
router.post('/', async (req, res) => {
  try {
    const newPoint = await Point.create(req.body);
    console.log('✅ Punto creado en Neon:', newPoint.id);
    res.status(201).json(newPoint);
  } catch (error) {
    console.error('Error creando punto:', error);
    res.status(400).json({ message: 'Error creando punto', error: error.message });
  }
});

// PUT /api/points/:id - Actualizar un punto
router.put('/:id', async (req, res) => {
  try {
    const point = await Point.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({ message: 'Punto no encontrado' });
    }
    
    await point.update(req.body);
    console.log('✅ Punto actualizado en Neon:', req.params.id);
    res.json(point);
  } catch (error) {
    console.error('Error actualizando punto:', error);
    res.status(400).json({ message: 'Error actualizando punto', error: error.message });
  }
});

// DELETE /api/points/:id - Eliminar un punto (soft delete con archivo)
router.delete('/:id', auth, async (req, res) => {
  try {
    const point = await Point.findByPk(req.params.id);
    if (!point || !point.activo) {
      return res.status(404).json({ message: 'Punto no encontrado' });
    }
    
    // Archivar en DeletedPoint antes de eliminar
    const deletedPointData = {
      originalId: point.id,
      nombre: point.nombre,
      categoria: point.categoria,
      compañia: point.compañia,
      coordenadas: point.coordenadas,
      inventario: point.inventario || [],
      fotos: point.fotos || [],
      documentos: point.documentos || [],
      meta: { 
        reason: req.body?.reason || 'user-action', 
        context: req.body?.context || null 
      },
      deletedBy: req.user ? { 
        id: req.user.id, 
        email: req.user.email 
      } : null,
      deletedAt: new Date()
    };
    
    const archived = await DeletedPoint.create(deletedPointData);
    await point.destroy();
    
    console.log('✅ Punto archivado y eliminado en Neon:', req.params.id);
    res.json({ message: 'Punto eliminado correctamente', deleted: archived });
  } catch (error) {
    console.error('Error eliminando punto:', error);
    res.status(500).json({ message: 'Error eliminando punto', error: error.message });
  }
});

// GET /api/points/deleted/list - Listar puntos eliminados
router.get('/deleted/list', auth, adminAuth, async (req, res) => {
  try {
    const deletedPoints = await DeletedPoint.findAll({
      order: [['deletedAt', 'DESC']],
      include: [
        {
          model: Company,
          as: 'company',
          required: false
        }
      ]
    });
    res.json({ deleted: deletedPoints });
  } catch (error) {
    console.error('Error obteniendo puntos eliminados:', error);
    res.status(500).json({ message: 'Error obteniendo puntos eliminados', error: error.message });
  }
});

// POST /api/points/deleted/:id/restore - Restaurar punto eliminado
router.post('/deleted/:id/restore', auth, adminAuth, async (req, res) => {
  try {
    const deletedPoint = await DeletedPoint.findByPk(req.params.id);
    if (!deletedPoint) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    
    // Recrear el punto original
    const restoredPoint = await Point.create({
      nombre: deletedPoint.nombre,
      categoria: deletedPoint.categoria,
      compañia: deletedPoint.compañia,
      coordenadas: deletedPoint.coordenadas,
      inventario: deletedPoint.inventario || [],
      fotos: deletedPoint.fotos || [],
      documentos: deletedPoint.documentos || [],
      activo: true
    });
    
    // Eliminar de la tabla de eliminados
    await deletedPoint.destroy();
    
    console.log('✅ Punto restaurado en Neon:', restoredPoint.id);
    res.json({ point: restoredPoint });
  } catch (error) {
    console.error('Error restaurando punto:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'No se puede restaurar: ya existe un punto en esas coordenadas' 
      });
    }
    res.status(500).json({ message: 'Error restaurando punto', error: error.message });
  }
});

// DELETE /api/points/deleted/:id - Eliminar permanentemente un punto archivado
router.delete('/deleted/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedPoint = await DeletedPoint.findByPk(req.params.id);
    if (!deletedPoint) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    
    await deletedPoint.destroy();
    console.log('✅ Punto eliminado permanentemente en Neon:', req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error eliminando permanentemente:', error);
    res.status(500).json({ message: 'Error eliminando permanentemente', error: error.message });
  }
});

export default router;
