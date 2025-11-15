/**
 * Script para crear usuario admin
 * Uso: node scripts/create-admin.js
 */

import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
  try {
    console.log('🔍 Verificando si existe usuario admin...');
    
    // Verificar si ya existe
    const { rows: existing } = await pool.query(
      "SELECT * FROM users WHERE username = 'admin' OR email = 'admin@vardAssets.com'"
    );

    if (existing.length > 0) {
      console.log('✅ Usuario admin ya existe:', existing[0].email);
      console.log('📧 Email:', existing[0].email);
      console.log('👤 Username:', existing[0].username);
      console.log('🔑 Role:', existing[0].role);
      return;
    }

    // Crear contraseña hasheada
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Crear usuario admin
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, password, username, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, username, role`,
      ['admin@vardAssets.com', hashedPassword, 'admin', 'admin']
    );

    console.log('✅ Usuario admin creado exitosamente:');
    console.log('📧 Email: admin@vardAssets.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: 123456');
    console.log('🎭 Role: admin');
    console.log('\n💡 Puedes hacer login con:');
    console.log('   - Email: admin@vardAssets.com');
    console.log('   - Username: admin');
    console.log('   - Password: 123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '23505') {
      console.log('⚠️ El usuario ya existe (violación de unique constraint)');
    }
  } finally {
    await pool.end();
  }
}

createAdmin();
