import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware para verificar JWT token
 */
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    // DEV: aceptar tokens de demo generados por el frontend (sin JWT real)
    // Nota: esto es únicamente para entornos de desarrollo/local.
    if (token === 'admin-token-2024' || token === 'user-token-2024') {
      const isAdmin = token === 'admin-token-2024'
      req.user = {
        _id: isAdmin ? 'demo-admin' : 'demo-user',
        id: isAdmin ? 'demo-admin' : 'demo-user',
        nombre: isAdmin ? 'Administrator VardAssets' : 'User VardAssets',
        email: isAdmin ? 'admin@VardAssets.com' : 'user@VardAssets.com',
        rol: isAdmin ? 'admin' : 'usuario',
        activo: true,
      }
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'VardAssets_secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.activo) {
      return res.status(401).json({ 
        message: 'Token inválido o usuario inactivo.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Token inválido.',
      error: error.message 
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 */
export const adminAuth = (req, res, next) => {
  const role = req.user?.rol
  if (role !== 'admin') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren privilegios de administrador.' 
    });
  }
  next();
};