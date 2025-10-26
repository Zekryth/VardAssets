import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del punto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  compañia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'La compañía asociada es requerida']
  },
  coordenadas: {
    x: {
      type: Number,
      required: [true, 'La coordenada X es requerida'],
      min: [0, 'La coordenada X no puede ser negativa']
    },
    y: {
      type: Number,
      required: [true, 'La coordenada Y es requerida'],
      min: [0, 'La coordenada Y no puede ser negativa']
    }
  },
  inventario: [{
    objeto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Object',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    fechaAsignacion: {
      type: Date,
      default: Date.now
    }
  }],
  fotos: [{
    url: String,
    nombre: String,
    fechaSubida: {
      type: Date,
      default: Date.now
    }
  }],
  documentos: [{
    url: String,
    nombre: String,
    tipo: String,
    fechaSubida: {
      type: Date,
      default: Date.now
    }
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice compuesto para coordenadas únicas
pointSchema.index({ 'coordenadas.x': 1, 'coordenadas.y': 1 }, { unique: true });
pointSchema.index({ compañia: 1 });
pointSchema.index({ categoria: 1 });
// UPDATED: índice de texto para búsquedas por nombre/categoría
pointSchema.index({ nombre: 'text', categoria: 'text' });

export default mongoose.model('Point', pointSchema);