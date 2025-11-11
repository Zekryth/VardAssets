import express from 'express';
import { Company } from '../server.js';

const router = express.Router();

// GET /api/companies - Obtener todas las compañías
router.get('/', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const options = {
      where: { activo: true },
      order: [['nombre', 'ASC']]
    };
    
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    
    const companies = await Company.findAll(options);
    res.json(companies);
  } catch (error) {
    console.error('Error obteniendo compañías:', error);
    res.status(500).json({ message: 'Error obteniendo compañías', error: error.message });
  }
});

// GET /api/companies/:id - Obtener una compañía por ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company || !company.activo) {
      return res.status(404).json({ message: 'Compañía no encontrada' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error obteniendo compañía:', error);
    res.status(500).json({ message: 'Error obteniendo compañía', error: error.message });
  }
});

// POST /api/companies - Crear una nueva compañía
router.post('/', async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    console.log('✅ Compañía creada en Neon:', newCompany.id);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creando compañía:', error);
    res.status(400).json({ message: 'Error creando compañía', error: error.message });
  }
});

// PATCH /api/companies/:id - Actualizar una compañía
router.patch('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Compañía no encontrada' });
    }
    
    await company.update(req.body);
    console.log('✅ Compañía actualizada en Neon:', req.params.id);
    res.json(company);
  } catch (error) {
    console.error('Error actualizando compañía:', error);
    res.status(400).json({ message: 'Error actualizando compañía', error: error.message });
  }
});

// DELETE /api/companies/:id - Eliminar una compañía (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Compañía no encontrada' });
    }
    
    await company.update({ activo: false });
    console.log('✅ Compañía marcada como inactiva en Neon:', req.params.id);
    res.json({ message: 'Compañía eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando compañía:', error);
    res.status(500).json({ message: 'Error eliminando compañía', error: error.message });
  }
});

export default router;
