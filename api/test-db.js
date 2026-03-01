import pg from 'pg';

export default async function handler(req, res) {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    return res.status(500).json({ 
      error: 'DATABASE_URL not set',
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('SUPABASE'))
    });
  }

  // Parse URL to show details (hide password)
  let urlInfo = {};
  try {
    const url = new URL(connectionString);
    urlInfo = {
      protocol: url.protocol,
      username: url.username,
      host: url.hostname,
      port: url.port,
      database: url.pathname.slice(1),
      passwordLength: url.password?.length
    };
  } catch (e) {
    urlInfo = { parseError: e.message };
  }

  // Try to connect
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT current_user, current_database(), version()');
    client.release();
    await pool.end();

    return res.status(200).json({
      status: 'SUCCESS',
      urlInfo,
      database: {
        user: result.rows[0].current_user,
        database: result.rows[0].current_database,
        version: result.rows[0].version.substring(0, 50) + '...'
      }
    });
  } catch (error) {
    await pool.end().catch(() => {});
    return res.status(500).json({
      status: 'FAILED',
      urlInfo,
      error: {
        message: error.message,
        code: error.code,
        detail: error.detail
      }
    });
  }
}
