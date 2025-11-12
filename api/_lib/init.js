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

    // PASO 1: Crear tabla users si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla users verificada/creada');

    // PASO 2: Verificar si existe usuario admin
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

    console.error('❌ Error en inicialización:', error);
    console.error('   Mensaje:', error.message);
    console.error('   Code:', error.code);
    console.error('   Stack:', error.stack);
    
    // No lanzar error para no bloquear la aplicación
    // pero marcar como no inicializado para reintentar
    initialized = false;
  }
}
