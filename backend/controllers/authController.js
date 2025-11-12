import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import winston from 'winston';

// Logger para eventos de autenticación
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/auth.log' }),
  ],
});

/**
 * Controlador para login de usuarios con seguridad mejorada
 */
export const login = async (req, res) => {
  const startTime = Date.now();
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    const { email, password } = req.body;

    // Validación de inputs
    if (!email || !password) {
      logger.warn('Intento de login sin credenciales', { 
        ip: clientIp,
        userAgent: req.headers['user-agent']
      });
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos.' 
      });
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario
    const user = await User.findOne({ 
      where: { email: normalizedEmail, activo: true } 
    });
    
    if (!user) {
      // Log de intento fallido sin revelar si el usuario existe
      logger.warn('Intento de login con email no existente', { 
        email: normalizedEmail,
        ip: clientIp,
        userAgent: req.headers['user-agent']
      });
      return res.status(401).json({ 
        message: 'Credenciales inválidas.' 
      });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Intento de login con password incorrecta', { 
        userId: user.id,
        email: normalizedEmail,
        ip: clientIp,
        userAgent: req.headers['user-agent']
      });
      return res.status(401).json({ 
        message: 'Credenciales inválidas.' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'VardAssets',
        audience: 'VardAssets-API'
      }
    );

    // Log de login exitoso
    logger.info('Login exitoso', { 
      userId: user.id,
      email: user.email,
      rol: user.rol,
      ip: clientIp,
      userAgent: req.headers['user-agent'],
      duration: Date.now() - startTime
    });

    res.json({
      message: '¡Bienvenido a VardAssets!',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    logger.error('Error en login', { 
      error: error.message,
      stack: error.stack,
      ip: clientIp,
      duration: Date.now() - startTime
    });
    
    res.status(500).json({ 
      message: 'Error interno del servidor.'
    });
  }
};

/**
 * Controlador para verificar token
 */
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al verificar token.',
      error: error.message 
    });
  }
};