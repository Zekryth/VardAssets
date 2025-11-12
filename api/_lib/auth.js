const jwt = require('jsonwebtoken');

function authenticateToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    throw new Error('NO_TOKEN');
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    throw new Error('INVALID_TOKEN');
  }
}

function requireAdmin(user) {
  if (user.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
}

module.exports = { authenticateToken, requireAdmin };
