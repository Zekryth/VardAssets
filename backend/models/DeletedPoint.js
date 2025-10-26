import mongoose from 'mongoose'

const deletedPointSchema = new mongoose.Schema({
  originalId: { type: mongoose.Schema.Types.ObjectId, index: true },
  nombre: String,
  categoria: String,
  compañia: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  coordenadas: { x: Number, y: Number },
  inventario: [{ objeto: { type: mongoose.Schema.Types.ObjectId, ref: 'Object' }, cantidad: Number }],
  fotos: [{ url: String, nombre: String, fechaSubida: Date }],
  documentos: [{ url: String, nombre: String, tipo: String, fechaSubida: Date }],
  meta: { type: Object, default: {} },
  deletedBy: { type: mongoose.Schema.Types.Mixed, default: null },
  deletedAt: { type: Date, default: Date.now }
}, { timestamps: true })


deletedPointSchema.index({ deletedAt: -1 })

export default mongoose.model('DeletedPoint', deletedPointSchema)
