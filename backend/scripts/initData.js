import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Company from '../models/Company.js';
import Object from '../models/Object.js';
import Point from '../models/Point.js';

dotenv.config();

/**
 * Script de inicialización de datos de ejemplo para VardAssets
 */
const initData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VardAssets');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Company.deleteMany({});
    await Object.deleteMany({});
    await Point.deleteMany({});
    console.log('🗑️  Datos existentes eliminados');

    // Crear usuario administrador
    const adminUser = await User.create({
      nombre: 'Administrador VardAssets',
      email: 'admin@VardAssets.com',
      password: '123456',
      rol: 'admin'
    });
    console.log('👤 Usuario administrador creado');

    // Crear usuario regular
    const regularUser = await User.create({
      nombre: 'Usuario Regular',
      email: 'usuario@VardAssets.com',
      password: '123456',
      rol: 'usuario'
    });
    console.log('👤 Usuario regular creado');

    // Crear compañías de ejemplo
    const companies = await Company.create([
      {
        nombre: 'ACME Corporation',
        personaContacto: 'John Doe',
        telefono: '+1-555-0101',
        email: 'contact@acme.com'
      },
      {
        nombre: 'Globex Industries',
        personaContacto: 'Jane Smith',
        telefono: '+1-555-0102',
        email: 'info@globex.com'
      }
    ]);
    console.log('🏢 Compañías de ejemplo creadas');

    // Crear objetos globales de ejemplo
    const objects = await Object.create([
      {
        nombre: 'Silla Ejecutiva',
        categoria: 'Mobiliario',
        icono: '💺',
        numeroInventario: 'MOB-001',
        nickname: 'Silla Presidencial'
      },
      {
        nombre: 'Mesa de Reuniones',
        categoria: 'Mobiliario',
        icono: '🪑',
        numeroInventario: 'MOB-002',
        nickname: 'Mesa Board'
      },
      {
        nombre: 'Aire Acondicionado',
        categoria: 'Climatización',
        icono: '❄️',
        numeroInventario: 'CLI-001',
        nickname: 'AC Principal'
      }
    ]);
    console.log('📦 Objetos de inventario creados');

    // Crear puntos en el mapa
    const points = await Point.create([
      {
        nombre: 'Oficina Principal',
        categoria: 'oficina',
        fecha: new Date('2024-01-15'),
        compañia: companies[0]._id,
        coordenadas: { x: 2, y: 3 },
        inventario: [
          { objeto: objects[0]._id, cantidad: 4 },
          { objeto: objects[1]._id, cantidad: 1 }
        ]
      },
      {
        nombre: 'Sala de Reuniones A',
        categoria: 'reuniones',
        fecha: new Date('2024-01-20'),
        compañia: companies[0]._id,
        coordenadas: { x: 4, y: 2 },
        inventario: [
          { objeto: objects[0]._id, cantidad: 8 }
        ]
      }
    ]);
    console.log('📍 Puntos del mapa creados');

    console.log('\n🎉 Datos de inicialización completados!');
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Admin: admin@VardAssets.com / 123456');
    console.log('   Usuario: usuario@VardAssets.com / 123456');

  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📊 Conexión a MongoDB cerrada');
  }
};

// Ejecutar el script
initData();