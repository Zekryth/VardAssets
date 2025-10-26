import express from 'express';
import { createUser, getUsers, updateUser } from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

/**
 * @route   POST /api/users
 * @desc    Crear nuevo usuario (solo admin)
 * @access  Private/Admin
 */
router.post('/', adminAuth, createUser);

/**
 * @route   GET /api/users
 * @desc    Obtener lista de todos los usuarios (solo admin)
 * @access  Private/Admin
 */
router.get('/', adminAuth, getUsers);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Private/Admin
 */
router.put('/:id', adminAuth, updateUser);

export default router;