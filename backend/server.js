import express from 'express';
import cors from 'cors';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Configurar dotenv para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users-postgres.js'; // UPDATED: PostgreSQL
import companyRoutes from './routes/companies-postgres.js'; // UPDATED: PostgreSQL
import objectRoutes from './routes/objects-postgres.js'; // UPDATED: PostgreSQL
import pointRoutes from './routes/points-postgres.js'; // UPDATED: PostgreSQL endpoints
import searchRoutes from './routes/search.js';
import tilesRoutes from './routes/tiles.js';


const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a PostgreSQL (Neon)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a Neon PostgreSQL (Alemania)'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err));

// Importar modelos
import pointModelDefinition from './models/Point.js';
import companyModelDefinition from './models/Company.js';
import objectModelDefinition from './models/Object.js';
import userModelDefinition from './models/User.js';

// Inicializar modelos
const Point = pointModelDefinition(sequelize);
const Company = companyModelDefinition(sequelize);
const ObjectModel = objectModelDefinition(sequelize);
const User = userModelDefinition(sequelize);

// Sincronizar modelos con la base de datos (crear tablas si no existen)
sequelize.sync({ alter: true })
  .then(() => console.log('📊 Modelos sincronizados con PostgreSQL'))
  .catch(err => console.error('❌ Error sincronizando modelos:', err));

// Exportar modelos para uso en controladores
export { Point, Company, ObjectModel as Object, User };


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