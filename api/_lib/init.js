import { getPool } from './db.js';

let initialized = false;

/**
 * Verifica la conexión a la base de datos
 * Las tablas ya deben existir en Supabase
 */
export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  const pool = getPool();

  try {
    // Simple connection test
    const result = await pool.query('SELECT 1 as test');
    if (result.rows[0].test === 1) {
      initialized = true;
      console.log('✅ Database connection verified');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}
