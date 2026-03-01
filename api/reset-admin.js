import bcrypt from 'bcrypt';
import { getPool } from './_lib/db.js';
import { handleCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pool = getPool();

  try {
    // Generate new password hash for "1234"
    const newPassword = '1234';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin user password
    const result = await pool.query(
      `UPDATE users 
       SET password = $1, updated_at = NOW()
       WHERE email = 'admin@vardassets.com'
       RETURNING id, email, username, role`,
      [hashedPassword]
    );

    if (result.rows.length === 0) {
      // Admin doesn't exist, create it
      const insertResult = await pool.query(
        `INSERT INTO users (email, password, username, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, email, username, role`,
        ['admin@vardassets.com', hashedPassword, 'admin', 'admin']
      );

      return res.status(200).json({
        status: 'CREATED',
        message: 'Admin user created',
        user: insertResult.rows[0],
        credentials: {
          email: 'admin@vardassets.com',
          password: newPassword
        }
      });
    }

    return res.status(200).json({
      status: 'RESET',
      message: 'Admin password reset successful',
      user: result.rows[0],
      credentials: {
        email: 'admin@vardassets.com',
        password: newPassword
      }
    });

  } catch (error) {
    console.error('Reset admin error:', error);
    return res.status(500).json({
      error: error.message,
      code: error.code
    });
  }
}
