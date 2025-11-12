const { getPool } = require('./_lib/db');
const { authenticateToken } = require('./_lib/auth');
const { handleCors } = require('./_lib/cors');
const { handleError } = require('./_lib/errors');

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const pool = getPool();

  try {
    const user = authenticateToken(req);

    // GET /api/search?q=term - Búsqueda global
    if (req.method === 'GET') {
      const { q } = req.query;

      if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Término de búsqueda requerido' });
      }

      const searchTerm = `%${q.trim()}%`;

      // Búsqueda paralela en las 3 tablas
      const [companiesResult, pointsResult, objectsResult] = await Promise.all([
        pool.query(
          `SELECT id, nombre, persona_contacto, email, 'company' as type 
           FROM companies 
           WHERE nombre ILIKE $1 OR persona_contacto ILIKE $1 OR email ILIKE $1
           LIMIT 10`,
          [searchTerm]
        ),
        pool.query(
          `SELECT p.id, p.nombre, p.coordenadas, c.nombre as compañia, 'point' as type
           FROM points p
           LEFT JOIN companies c ON p.compañia = c.id
           WHERE p.nombre ILIKE $1
           LIMIT 10`,
          [searchTerm]
        ),
        pool.query(
          `SELECT id, nombre, categoria, unidad, precio, 'object' as type
           FROM objects
           WHERE nombre ILIKE $1 OR categoria ILIKE $1
           LIMIT 10`,
          [searchTerm]
        )
      ]);

      const results = [
        ...companiesResult.rows,
        ...pointsResult.rows,
        ...objectsResult.rows
      ];

      console.log(`✅ Búsqueda completada: ${results.length} resultados para "${q}"`);
      return res.status(200).json({
        query: q,
        results,
        count: results.length
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    return handleError(error, res);
  }
}
