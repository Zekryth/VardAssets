import User from '../models/User.js';

/**
 * Controlador para crear nuevo usuario (solo admin)
 */
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El email ya está registrado.' 
      });
    }

    const user = new User({
      nombre,
      email,
      password,
      rol: rol || 'usuario'
    });

    await user.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente.',
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        activo: user.activo
      }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ 
      message: 'Error al crear usuario.',
      error: error.message 
    });
  }
};

/**
 * Controlador para listar todos los usuarios (solo admin)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      total: users.length,
      users
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      message: 'Error al obtener usuarios.',
      error: error.message 
    });
  }
};

/**
 * Controlador para actualizar usuario
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado.' 
      });
    }

    res.json({
      message: 'Usuario actualizado exitosamente.',
      user
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ 
      message: 'Error al actualizar usuario.',
      error: error.message 
    });
  }
};