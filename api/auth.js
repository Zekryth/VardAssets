import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from './_lib/db.js';
import { handleCors } from './_lib/cors.js';
import { handleError } from './_lib/errors.js';

export default async function handler(req, res) {
  console.log('📥 Request a /api/auth:', req.method);
  
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    // POST /api/auth - Login
    if (req.method === 'POST' && !req.url.includes('/register')) {
      console.log('🔐 POST /api/auth - Login attempt');
      
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Buscar usuario
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase().trim()]
      );

      if (rows.length === 0) {
        console.warn('⚠️ Usuario no encontrado:', email);
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = rows[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.warn('⚠️ Contraseña incorrecta para:', email);
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Login exitoso:', email);

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
    if (req.method === 'POST' && req.url.includes('/register')) {
      console.log('📝 POST /api/auth/register');
      
      const { email, password, username, role } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, password y username son requeridos' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
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
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      return res.status(200).json({ valid: true, user: decoded });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
