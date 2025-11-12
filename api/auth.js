import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from './_lib/db.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';
import { initializeDatabase } from './_lib/init.js';

export default async function handler(req, res) {
  console.log('📥 [AUTH] Request:', req.method, req.url);
  
  if (handleCors(req, res)) return;

  // ========================================
  // INICIALIZACIÓN AUTOMÁTICA DE BASE DE DATOS
  // ========================================
  try {
    await initializeDatabase();
  } catch (initError) {
    console.error('💥 [AUTH] Inicialización fallida:', initError.message);
    return res.status(500).json({ 
      error: 'Error inicializando base de datos',
      details: process.env.NODE_ENV === 'development' ? initError.message : undefined
    });
  }

  const pool = getPool();

  try {
    // POST /api/auth - Login
    if (req.method === 'POST' && !req.url?.includes('/register')) {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email/username y contraseña son obligatorios' 
        });
      }

      console.log('🔐 [AUTH] Intento de login:', email);

      // Buscar por email O username (case-insensitive)
      const { rows } = await pool.query(
        `SELECT * FROM users 
         WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)`,
        [email.trim()]
      );

      if (rows.length === 0) {
        console.warn('⚠️ [AUTH] Usuario no encontrado:', email);
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = rows[0];
      console.log('👤 [AUTH] Usuario encontrado:', user.username, '/', user.email);

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.warn('⚠️ [AUTH] Contraseña incorrecta para:', email);
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      console.log('🔑 [AUTH] Contraseña verificada correctamente');

      // Generar JWT con expiración de 7 días
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          username: user.username, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('✅ [AUTH] Login exitoso:', user.email, '- Token generado (expira en 7d)');

      return res.status(200).json({
        token,
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username, 
          role: user.role 
        }
      });
    }

    // POST /api/auth/register - Registro
    if (req.method === 'POST' && req.url?.includes('/register')) {
      console.log('📝 Registro de nuevo usuario');
      
      const { email, password, username, role } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, password y username requeridos' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await pool.query(
        `INSERT INTO users (id, email, password, username, role, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         RETURNING id, email, username, role, created_at`,
        [email.toLowerCase().trim(), hashedPassword, username, role || 'user']
      );

      console.log('✅ Usuario registrado:', rows[0].email);
      return res.status(201).json(rows[0]);
    }

    // GET /api/auth/verify - Verificar token
    if (req.method === 'GET') {
      console.log('🔍 Verificando token...');
      
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        console.warn('⚠️ Token no proporcionado en headers');
        return res.status(401).json({ 
          valid: false,
          error: 'Token no proporcionado' 
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token válido:', decoded.email);
        
        return res.status(200).json({ 
          valid: true, 
          user: decoded 
        });
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          console.warn('⚠️ Token expirado');
          return res.status(401).json({ 
            valid: false,
            error: 'Token expirado' 
          });
        }
        
        console.warn('⚠️ Token inválido:', error.message);
        return res.status(401).json({ 
          valid: false,
          error: 'Token inválido' 
        });
      }
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('💥 Error en /api/auth:', error);
    console.error('   Mensaje:', error.message);
    console.error('   Code:', error.code);
    console.error('   Stack:', error.stack);
    return handleError(error, res);
  }
}
