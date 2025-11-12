export function handleError(error, res) {
  console.error('❌ Error:', {
    message: error.message,
    stack: error.stack,
    code: error.code
  });

  if (error.message === 'NO_TOKEN') {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  if (error.message === 'INVALID_TOKEN') {
    return res.status(401).json({ error: 'Token inválido' });
  }

  if (error.message === 'TOKEN_EXPIRED') {
    return res.status(401).json({ error: 'Token expirado' });
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

  if (error.code === '42P01') { // Table doesn't exist
    return res.status(500).json({ error: 'Tabla no encontrada en base de datos' });
  }

  return res.status(500).json({ 
    error: 'Error del servidor',
    details: error.message
  });
}
