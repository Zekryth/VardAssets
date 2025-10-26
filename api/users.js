// /api/users.js
// Serverless API Route para usuarios (GET, POST, PUT)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

// Definir el esquema y modelo User (adaptado para serverless)
const userSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    // Listar usuarios (solo admin, simulado)
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ total: users.length, users });
  }
  if (req.method === 'POST') {
    // Crear usuario (solo admin, simulado)
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }
    const user = new User({ nombre, email, password, rol: rol || 'usuario' });
    await user.save();
    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo }
    });
  }
  if (req.method === 'PUT') {
    // Actualizar usuario (solo admin, simulado)
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ message: 'Falta el id del usuario.' });
    if (updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    return res.status(200).json({ message: 'Usuario actualizado exitosamente.', user });
  }
  return res.status(405).json({ message: 'Método no permitido' });
}
