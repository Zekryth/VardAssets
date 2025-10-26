import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Controlador para login de usuarios
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos.' 
      });
    }

    const user = await User.findOne({ email, activo: true });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas.' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas.' 
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'mapshade_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: '¡Bienvenido a MapShade!',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor.',
      error: error.message 
    });
  }
};

/**
 * Controlador para verificar token
 */
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al verificar token.',
      error: error.message 
    });
  }
};