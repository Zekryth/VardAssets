import Point from '../models/Point.js'
import Company from '../models/Company.js'
import ObjModel from '../models/Object.js'

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

    // Prefer $text search when available; fallback to regex (case-insensitive)
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

    const [points, companies, objects] = await Promise.all([
      Point.find({ $or: [{ nombre: regex }, { categoria: regex }] })
        .select('nombre categoria coordenadas compañia')
        .populate({ path: 'compañia', select: 'nombre' })
        .limit(5)
        .lean(),
      Company.find({ $or: [{ nombre: regex }, { personaContacto: regex }] })
        .select('nombre')
        .limit(5)
        .lean(),
      ObjModel.find({ $or: [{ nombre: regex }, { categoria: regex }, { numeroInventario: regex }, { nickname: regex }] })
        .select('nombre numeroInventario categoria icono')
        .limit(5)
        .lean()
    ])

    return res.json({ points, companies, objects })
  } catch (err) {
    console.error('Search error:', err)
    return res.status(500).json({ message: 'Error en búsqueda' })
  }
}

export default { search }
