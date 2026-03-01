import pg from 'pg';
const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    // Priority: Supabase Integration > Manual > Legacy
    const connectionString = 
      process.env.SUPABASE_POSTGRES_URL ||
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL;
    
    console.log('🔗 Using database URL starting with:', connectionString?.substring(0, 50) + '...');

    if (!connectionString) {
      const error = new Error('DATABASE_URL not configured. Set SUPABASE_DATABASE_URL, DATABASE_URL, or POSTGRES_URL');
      error.code = 'DB_URL_MISSING';
      throw error;
    }

    // Detect if using Supabase
    const isSupabase = connectionString.includes('supabase');
    
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: isSupabase ? 5 : 10, // Supabase free tier has connection limits
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: isSupabase ? 5000 : 2000,
    });

    pool.on('error', (err) => {
      console.error('❌ Unexpected PostgreSQL pool error:', err);
    });

    console.log(`📦 Database pool initialized (${isSupabase ? 'Supabase' : 'PostgreSQL'})`);
  }
  return pool;
}
