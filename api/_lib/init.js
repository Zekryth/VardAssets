import { getPool } from './db.js';
import bcrypt from 'bcrypt';

let initialized = false;

export async function initializeDatabase() {
  if (initialized) {
    return; // Ya inicializado en esta sesión
  }

  const pool = getPool();

  try {
    console.log('🔍 Verificando inicialización de base de datos...');

    // Verificar si existe usuario admin
    const { rows } = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE username = 'admin' OR email = 'admin@vardassets.com'"
    );

    const adminExists = parseInt(rows[0].count) > 0;

    if (!adminExists) {
      console.log('📝 Usuario admin no existe. Creando automáticamente...');
      
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await pool.query(
        `INSERT INTO users (id, email, password, username, role, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
        ['admin@vardassets.com', hashedPassword, 'admin', 'admin']
      );

      console.log('✅ Usuario admin creado automáticamente');
      console.log('   Username: admin');
      console.log('   Password: 123456');
      console.log('   Email: admin@vardassets.com');
    } else {
      console.log('✅ Usuario admin ya existe');
    }

    initialized = true;

  } catch (error) {
    // Si es error de duplicate key, ignorar (ya existe)
    if (error.code === '23505') {
      console.log('✅ Usuario admin ya existe (duplicate key)');
      initialized = true;
      return;
    }

    console.error('❌ Error en inicialización:', error.message);
    // No lanzar error para no bloquear la aplicación
  }
}
