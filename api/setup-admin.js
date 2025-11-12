import { getPool } from './_lib/db.js';
import { handleCors } from './_lib/cors.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  console.log('🔧 /api/setup-admin - Inicializando admin...');
  
  if (handleCors(req, res)) return;

  // Seguridad: Solo permitir con secret key
  const { secret } = req.query;
  
  if (secret !== 'vard-setup-2024') {
    console.warn('⚠️ Intento de acceso sin secret key');
    return res.status(403).json({ error: 'Forbidden - Secret key requerida' });
  }

  const pool = getPool();

  try {
    // 1. Verificar si ya existe usuario admin
    console.log('🔍 Verificando si existe usuario admin...');
    const { rows: existing } = await pool.query(
      "SELECT * FROM users WHERE username = 'admin' OR email = 'admin@vardassets.com'"
    );

    if (existing.length > 0) {
      console.log('✅ Usuario admin ya existe');
      
      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare('123456', existing[0].password);
      
      return res.status(200).json({ 
        message: 'Usuario admin ya existe',
        user: {
          id: existing[0].id,
          email: existing[0].email,
          username: existing[0].username,
          role: existing[0].role
        },
        passwordCorrect: isPasswordValid,
        note: isPasswordValid 
          ? 'Puedes hacer login con: admin / 123456' 
          : 'La contraseña NO es 123456, puede que sea otra'
      });
    }

    // 2. Crear usuario admin
    console.log('📝 Creando usuario admin...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, password, username, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, username, role`,
      ['admin@vardassets.com', hashedPassword, 'admin', 'admin']
    );

    console.log('✅ Usuario admin creado exitosamente:', rows[0].id);

    return res.status(201).json({
      success: true,
      message: '✅ Usuario admin creado exitosamente',
      user: rows[0],
      credentials: {
        username: 'admin',
        password: '123456',
        email: 'admin@vardassets.com'
      },
      nextStep: 'Ve a /login e inicia sesión con: admin / 123456'
    });

  } catch (error) {
    console.error('❌ Error en setup-admin:', error);
    
    if (error.code === '23505') { // Duplicate key
      return res.status(409).json({ 
        error: 'Usuario admin ya existe (duplicate key)',
        message: 'Intenta hacer login con: admin / 123456'
      });
    }

    return res.status(500).json({ 
      error: 'Error creando usuario admin',
      details: error.message,
      code: error.code
    });
  }
}
