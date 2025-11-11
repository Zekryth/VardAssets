import express from 'express';
import { User } from '../server.js';

const router = express.Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error obteniendo usuarios', error: error.message });
  }
});

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error obteniendo usuario', error: error.message });
  }
});

// POST /api/users - Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    console.log('✅ Usuario creado en Neon:', newUser.id);
    res.status(201).json(newUser.toJSON());
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(400).json({ message: 'Error creando usuario', error: error.message });
  }
});

// PATCH /api/users/:id - Actualizar un usuario
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    await user.update(req.body);
    console.log('✅ Usuario actualizado en Neon:', req.params.id);
    res.json(user.toJSON());
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(400).json({ message: 'Error actualizando usuario', error: error.message });
  }
});

// DELETE /api/users/:id - Eliminar un usuario (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    await user.update({ activo: false });
    console.log('✅ Usuario marcado como inactivo en Neon:', req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error eliminando usuario', error: error.message });
  }
});

export default router;
