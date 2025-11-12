import express from 'express';
import cors from 'cors';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import winston from 'winston';

// Configurar dotenv para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configurar Winston Logger para seguridad
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname, 'logs', 'security.log'), level: 'warn' }),
    new winston.transports.File({ filename: path.join(__dirname, 'logs', 'combined.log') }),
  ],
});

// En desarrollo, también loguear a consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users-postgres.js';
import companyRoutes from './routes/companies-postgres.js';
import objectRoutes from './routes/objects-postgres.js';
import pointRoutes from './routes/points-postgres.js';
import searchRoutes from './routes/search.js';
import tilesRoutes from './routes/tiles.js';


const app = express();

// 🛡️ SEGURIDAD: Helmet - Headers de seguridad HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://ep-proud-bread-agcgtmlo-pooler.c-2.eu-central-1.aws.neon.tech"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 🛡️ SEGURIDAD: Rate Limiting para prevenir ataques de fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: { 
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit excedido en login', {
      ip: req.ip,
      email: req.body?.email,
      userAgent: req.headers['user-agent']
    });
    res.status(429).json({
      error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.'
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP
  message: { 
    error: 'Demasiadas peticiones. Intenta de nuevo más tarde.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🛡️ SEGURIDAD: CORS configurado según ambiente
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://vard-assets.vercel.app',
      process.env.CORS_ORIGIN
    ].filter(Boolean)
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.CORS_ORIGIN
    ].filter(Boolean);

console.log('🌐 CORS permitido para:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, Postman, Vercel serverless, etc)
    if (!origin) {
      console.log('✅ CORS: Request sin origin (permitido)');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Origin permitido -', origin);
      callback(null, true);
    } else {
      console.warn('⚠️ CORS: Origin bloqueado -', origin);
      logger.warn('CORS bloqueado', { origin });
      callback(new Error(`CORS: Origin no permitido: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// 🛡️ SEGURIDAD: Sanitización de inputs (prevenir NoSQL injection)
app.use(mongoSanitize());

// Middleware estándar
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Aplicar rate limiter general a todas las rutas API
app.use('/api/', apiLimiter);

// Importar modelos desde archivo central
import { sequelize } from './models/index.js';

// Test database connection y sincronizar modelos
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a Neon PostgreSQL (Alemania)');
    
    await sequelize.sync({ alter: true });
    console.log('📊 Modelos sincronizados con PostgreSQL');
    console.log('📋 Tablas disponibles:', Object.keys(sequelize.models));
  } catch (err) {
    console.error('❌ Error con la base de datos:', err);
    process.exit(1);
  }
}

// Rutas
app.use('/api/auth/login', loginLimiter); // Rate limit específico para login
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/objects', objectRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/map/tiles', tilesRoutes);

console.log('✅ Rutas registradas:');
console.log('   📍 /api/auth');
console.log('   📍 /api/users');
console.log('   📍 /api/companies');
console.log('   📍 /api/objects');
console.log('   📍 /api/points');
console.log('   📍 /api/search');
console.log('   📍 /api/map/tiles');
app.use('/api/points', pointRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/map/tiles', tilesRoutes);

// Servir archivos de tiles como estáticos
const tilesPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'mapTiles');
app.use('/tiles', express.static(tilesPath));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🚀 VardAssets Backend funcionando correctamente', 
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Manejo de errores mejorado con logging
app.use((err, req, res, next) => {
  logger.error('Error en servidor', {
    error: err.message,
    stack: err.stack,
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent']
  });
  
  // No exponer detalles del error en producción
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor' 
    : err.message;
  
  res.status(err.status || 500).json({ 
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Inicializar base de datos y luego levantar el servidor
const PORT = process.env.PORT || 5000;

async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🎯 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();