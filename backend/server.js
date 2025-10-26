import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import objectRoutes from './routes/objects.js';
import pointRoutes from './routes/points_fixed.js';
import searchRoutes from './routes/search.js';
import tilesRoutes from './routes/tiles.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mapshade', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/objects', objectRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/map/tiles', tilesRoutes);

// Servir archivos de tiles como estáticos
const tilesPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'mapTiles');
app.use('/tiles', express.static(tilesPath));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🚀 MapShade Backend funcionando correctamente', 
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});