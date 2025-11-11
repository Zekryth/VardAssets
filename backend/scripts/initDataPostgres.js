import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { Sequelize } from 'sequelize';
import userModelDefinition from '../models/User.js';
import companyModelDefinition from '../models/Company.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

const User = userModelDefinition(sequelize);
const Company = companyModelDefinition(sequelize);

async function initData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a Neon PostgreSQL');

    await sequelize.sync({ alter: true });
    console.log('📊 Modelos sincronizados');

    // Crear usuario admin si no existe
    const adminEmail = 'admin@vardassets.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      await User.create({
        nombre: 'Administrador',
        email: adminEmail,
        password: 'admin123', // Cambia esto en producción
        rol: 'admin',
        activo: true
      });
      console.log('✅ Usuario admin creado:');
      console.log('   Email: admin@vardassets.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Usuario admin ya existe');
    }

    // Crear compañía de ejemplo si no existe
    const companyCount = await Company.count();
    if (companyCount === 0) {
      await Company.create({
        nombre: 'Compañía de Ejemplo',
        personaContacto: 'Juan Pérez',
        telefono: '+34 600 000 000',
        email: 'contacto@ejemplo.com',
        activo: true
      });
      console.log('✅ Compañía de ejemplo creada');
    }

    console.log('🎉 Datos iniciales configurados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initData();
