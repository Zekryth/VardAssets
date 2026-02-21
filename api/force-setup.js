import { getPool } from './_lib/db.js';
import { handleCors } from './_lib/cors.js';
import bcrypt from 'bcrypt';

/**
 * ⚠️ ENDPOINT TEMPORAL DE EMERGENCIA
 * 
 * Propósito: Recrear usuario admin con credenciales correctas
 * Uso: POST https://vard-assets.vercel.app/api/force-setup
 * Header requerido: x-admin-reset-token: <ADMIN_RESET_TOKEN>
 * 
 * Este endpoint:
 * 1. Elimina cualquier usuario admin existente
 * 2. Crea usuario admin nuevo con hash correcto
 * 3. Devuelve credenciales de confirmación
 * 
 * ⚠️ ELIMINAR DESPUÉS DE USAR
 */
export default async function handler(req, res) {
  console.log('🔧 [FORCE-SETUP] Endpoint temporal ejecutado');
  
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const providedToken = req.headers['x-admin-reset-token'];
  const expectedToken = process.env.ADMIN_RESET_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({ error: 'ADMIN_RESET_TOKEN no está configurado en entorno' });
  }

  if (!providedToken || providedToken !== expectedToken) {
    return res.status(403).json({ error: 'No autorizado para reset de admin' });
  }

  const pool = getPool();

  try {
    console.log('🗑️ [FORCE-SETUP] Eliminando usuarios admin existentes...');
    
    // Paso 1: Eliminar admin existente (si existe)
    const deleteResult = await pool.query(`
      DELETE FROM users 
      WHERE email = 'admin@vardassets.com' 
      OR username = 'admin'
      RETURNING id, email, username
    `);

    if (deleteResult.rows.length > 0) {
      console.log('✅ [FORCE-SETUP] Usuarios eliminados:', deleteResult.rows.length);
      deleteResult.rows.forEach(user => {
        console.log(`   - ${user.email} (${user.username})`);
      });
    } else {
      console.log('ℹ️ [FORCE-SETUP] No había usuarios admin previos');
    }

    // Paso 2: Crear hash de contraseña
    console.log('🔑 [FORCE-SETUP] Generando hash bcrypt para contraseña "123456"...');
    const plainPassword = '123456';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('✅ [FORCE-SETUP] Hash generado:', hashedPassword.substring(0, 20) + '...');

    // Paso 3: Insertar nuevo admin
    console.log('👤 [FORCE-SETUP] Creando usuario admin...');
    const insertResult = await pool.query(`
      INSERT INTO users (id, email, password, username, role, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, username, role, created_at
    `, ['admin@vardassets.com', hashedPassword, 'admin', 'admin']);

    const newUser = insertResult.rows[0];
    console.log('✅ [FORCE-SETUP] Usuario admin creado exitosamente:');
    console.log('   📧 Email:', newUser.email);
    console.log('   👤 Username:', newUser.username);
    console.log('   🛡️ Role:', newUser.role);
    console.log('   🆔 ID:', newUser.id);
    console.log('   📅 Created:', newUser.created_at);

    // Paso 4: Verificar que el hash funciona
    console.log('🧪 [FORCE-SETUP] Verificando hash...');
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('✅ [FORCE-SETUP] Verificación de hash:', isValid ? 'OK' : 'FALLÓ');

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: '✅ Usuario admin recreado exitosamente',
      credentials: {
        username: 'admin',
        password: '123456 (cámbiala inmediatamente al iniciar sesión)',
        email: 'admin@vardassets.com'
      },
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        created_at: newUser.created_at
      },
      hashVerification: isValid ? 'OK' : 'FAILED',
      instructions: [
        '1. Ve a https://vard-assets.vercel.app/login',
        '2. Username: admin',
        '3. Password: 123456',
        '4. Cambia la contraseña de admin inmediatamente',
        '5. Después de usarlo, elimina api/force-setup.js'
      ]
    });

  } catch (error) {
    console.error('❌ [FORCE-SETUP] Error:', error);
    return res.status(500).json({
      error: 'Error recreando usuario admin',
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  }
}
