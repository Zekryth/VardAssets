import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Point = sequelize.define('Point', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del punto es requerido' },
        len: { args: [1, 100], msg: 'El nombre no puede exceder 100 caracteres' }
      }
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La categoría es requerida' }
      }
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    compañia: {
      type: DataTypes.UUID,
      allowNull: true // Temporal: permitir null mientras migramos
    },
    coordenadas: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidCoordinates(value) {
          if (!value || typeof value.x !== 'number' || typeof value.y !== 'number') {
            throw new Error('Las coordenadas deben incluir x e y numéricos');
          }
          if (value.x < 0 || value.y < 0) {
            throw new Error('Las coordenadas no pueden ser negativas');
          }
        }
      }
    },
    inventario: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    fotos: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    documentos: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'points',
    timestamps: true,
    indexes: [
      {
        name: 'idx_point_coordinates',
        fields: ['coordenadas'],
        using: 'gin'
      },
      {
        name: 'idx_point_company',
        fields: ['compañia']
      },
      {
        name: 'idx_point_active',
        fields: ['activo']
      }
    ]
  });

  return Point;
};
