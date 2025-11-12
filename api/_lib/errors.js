function handleError(error, res) {
  console.error('❌ Error:', error);

  if (error.message === 'NO_TOKEN') {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  if (error.message === 'INVALID_TOKEN') {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
  if (error.message === 'FORBIDDEN') {
    return res.status(403).json({ error: 'No tienes permisos para esta acción' });
  }
  
  if (error.code === '23505') { // Unique violation
    return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
  }
  
  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json({ error: 'Referencia inválida a otro registro' });
  }

  return res.status(500).json({ 
    error: 'Error del servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}

module.exports = { handleError };
