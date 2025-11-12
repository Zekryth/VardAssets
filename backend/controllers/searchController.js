import { Point, Company, Object as ObjModel } from '../models/index.js';
import { Op } from 'sequelize';

const sanitizeQ = (q) => {
  if (!q || typeof q !== 'string') return ''
  const t = q.trim()
  return t.length > 64 ? t.slice(0, 64) : t
}

export const search = async (req, res) => {
  try {
    const q = sanitizeQ(req.query.q)
    if (!q || q.length < 2) {
      return res.json({ points: [], companies: [], objects: [] })
    }

    // Usar ILIKE para búsqueda case-insensitive en PostgreSQL
    const searchPattern = `%${q}%`;

    const [points, companies, objects] = await Promise.all([
      Point.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: searchPattern } },
            { categoria: { [Op.iLike]: searchPattern } }
          ],
          activo: true
        },
        attributes: ['id', 'nombre', 'categoria', 'coordenadas', 'compañia'],
        limit: 5
      }),
      Company.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: searchPattern } },
            { personaContacto: { [Op.iLike]: searchPattern } }
          ]
        },
        attributes: ['id', 'nombre'],
        limit: 5
      }),
      ObjModel.findAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.iLike]: searchPattern } },
            { categoria: { [Op.iLike]: searchPattern } },
            { numeroInventario: { [Op.iLike]: searchPattern } },
            { nickname: { [Op.iLike]: searchPattern } }
          ]
        },
        attributes: ['id', 'nombre', 'numeroInventario', 'categoria', 'icono'],
        limit: 5
      })
    ])

    return res.json({ points, companies, objects })
  } catch (err) {
    console.error('Search error:', err)
    return res.status(500).json({ message: 'Error en búsqueda' })
  }
}

export default { search }
