import pg from 'pg';
const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
      const error = new Error('DATABASE_URL/POSTGRES_URL no configurada');
      error.code = 'DB_URL_MISSING';
      throw error;
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('❌ Error inesperado en pool de PostgreSQL:', err);
    });
  }
  return pool;
}
