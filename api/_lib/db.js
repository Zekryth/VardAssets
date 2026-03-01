import pg from 'pg';
const { Pool } = pg;

let pool;

/**
 * Get PostgreSQL connection pool
 * Uses DATABASE_URL environment variable
 */
export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      const error = new Error('DATABASE_URL environment variable is not configured');
      error.code = 'DB_URL_MISSING';
      throw error;
    }

    console.log('🔗 Connecting to database...');
    
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('❌ PostgreSQL pool error:', err.message);
    });

    console.log('📦 Database pool initialized');
  }
  return pool;
}
