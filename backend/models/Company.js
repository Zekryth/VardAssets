import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la compañía es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  personaContacto: {
    type: String,
    required: [true, 'La persona de contacto es requerida'],
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true,
    match: [/^[+]?[\d\s\-()]+$/, 'Por favor ingresa un teléfono válido']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
companySchema.index({ nombre: 'text', personaContacto: 'text' });

export default mongoose.model('Company', companySchema);