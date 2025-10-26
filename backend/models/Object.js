import mongoose from 'mongoose';

const objectSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del objeto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  icono: {
    type: String,
    default: '📦'
  },
  imagen: {
    type: String
  },
  numeroInventario: {
    type: String,
    required: [true, 'El número de inventario es requerido'],
    unique: true,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas
objectSchema.index({ nombre: 'text', categoria: 'text', nickname: 'text', numeroInventario: 'text' });
objectSchema.index({ categoria: 1 });
objectSchema.index({ numeroInventario: 1 }, { unique: true });

export default mongoose.model('Object', objectSchema);