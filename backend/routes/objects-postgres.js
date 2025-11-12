import express from 'express';
import { Object } from '../models/index.js';

const router = express.Router();

// GET /api/objects - Obtener todos los objetos
router.get('/', async (req, res) => {
  try {
    const { limit, offset, categoria } = req.query;
    const options = {
      where: { activo: true },
      order: [['nombre', 'ASC']]
    };
    
    if (categoria) options.where.categoria = categoria;
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    
    const objects = await Object.findAll(options);
    res.json(objects);
  } catch (error) {
    console.error('Error obteniendo objetos:', error);
    res.status(500).json({ message: 'Error obteniendo objetos', error: error.message });
  }
});

// GET /api/objects/:id - Obtener un objeto por ID
router.get('/:id', async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);
    if (!object || !object.activo) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }
    res.json(object);
  } catch (error) {
    console.error('Error obteniendo objeto:', error);
    res.status(500).json({ message: 'Error obteniendo objeto', error: error.message });
  }
});

// POST /api/objects - Crear un nuevo objeto
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/objects - Body:', JSON.stringify(req.body));
    
    const { nombre, categoria, unidad, precio, descripcion, icono } = req.body;
    
    // Validación
    if (!nombre || nombre.trim() === '') {
      console.warn('⚠️ Validación fallida: nombre vacío');
      return res.status(400).json({ 
        message: 'El nombre del objeto es obligatorio' 
      });
    }
    
    const newObject = await Object.create({
      nombre: nombre.trim(),
      categoria: categoria?.trim() || 'General',
      unidad: unidad?.trim() || 'unidad',
      precio: precio || 0,
      descripcion: descripcion?.trim() || null,
      icono: icono || null,
      activo: true
    });
    
    console.log('✅ Objeto creado en Neon:', { id: newObject.id, nombre: newObject.nombre });
    res.status(201).json(newObject);
  } catch (error) {
    console.error('❌ Error creando objeto:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(400).json({ 
      message: 'No se pudo crear el objeto', 
      error: error.message,
      details: error.name 
    });
  }
});

// PATCH /api/objects/:id - Actualizar un objeto
router.patch('/:id', async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);
    if (!object) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }
    
    await object.update(req.body);
    console.log('✅ Objeto actualizado en Neon:', req.params.id);
    res.json(object);
  } catch (error) {
    console.error('Error actualizando objeto:', error);
    res.status(400).json({ message: 'Error actualizando objeto', error: error.message });
  }
});

// DELETE /api/objects/:id - Eliminar un objeto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const object = await Object.findByPk(req.params.id);
    if (!object) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }
    
    await object.update({ activo: false });
    console.log('✅ Objeto marcado como inactivo en Neon:', req.params.id);
    res.json({ message: 'Objeto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando objeto:', error);
    res.status(500).json({ message: 'Error eliminando objeto', error: error.message });
  }
});

export default router;
