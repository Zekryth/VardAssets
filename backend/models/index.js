import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Conexión a PostgreSQL
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

// Importar definiciones de modelos
import pointModelDefinition from './Point.js';
import companyModelDefinition from './Company.js';
import objectModelDefinition from './Object.js';
import userModelDefinition from './User.js';
import deletedPointModelDefinition from './DeletedPoint.js';

// Inicializar modelos
const Point = pointModelDefinition(sequelize);
const Company = companyModelDefinition(sequelize);
const ObjectModel = objectModelDefinition(sequelize);
const User = userModelDefinition(sequelize);
const DeletedPoint = deletedPointModelDefinition(sequelize);

// Configurar asociaciones
const models = { Point, Company, Object: ObjectModel, User, DeletedPoint };
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Exportar modelos y sequelize
export { sequelize, Point, Company, ObjectModel as Object, User, DeletedPoint };
