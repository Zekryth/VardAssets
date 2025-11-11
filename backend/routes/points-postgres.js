import express from 'express';
import { Point } from '../models/index.js';

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

// DELETE /api/points/:id - Eliminar un punto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const point = await Point.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({ message: 'Punto no encontrado' });
    }
    
    await point.update({ activo: false });
    console.log('✅ Punto marcado como inactivo en Neon:', req.params.id);
    res.json({ message: 'Punto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando punto:', error);
    res.status(500).json({ message: 'Error eliminando punto', error: error.message });
  }
});

export default router;
