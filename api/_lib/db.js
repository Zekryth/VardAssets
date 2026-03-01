import pg from 'pg';
const { Pool } = pg;

// Disable SSL certificate validation for Supabase pooler
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
    const isSupabase = connectionString.includes('supabase') || connectionString.includes('pooler');
    
    // For Supabase pooler, we need to handle SSL properly
    const sslConfig = isSupabase 
      ? { rejectUnauthorized: false, require: true }
      : false;
    
    pool = new Pool({
      connectionString,
      ssl: sslConfig,
      max: isSupabase ? 5 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('❌ Unexpected PostgreSQL pool error:', err);
    });

    console.log(`📦 Database pool initialized (${isSupabase ? 'Supabase' : 'PostgreSQL'})`);
  }
  return pool;
}
