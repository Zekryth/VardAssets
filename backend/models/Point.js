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
    pisos: {
      type: DataTypes.JSONB,
      defaultValue: [
        {
          numero: 1,
          nombre: 'Planta Baja',
          inventario: [],
          fotos: [],
          documentos: []
        }
      ],
      validate: {
        isValidPisos(value) {
          if (!Array.isArray(value)) {
            throw new Error('Pisos debe ser un array');
          }
          if (value.length === 0) {
            throw new Error('Debe haber al menos un piso');
          }
          value.forEach((piso, index) => {
            if (!piso.numero || typeof piso.numero !== 'number') {
              throw new Error(`Piso ${index}: número inválido`);
            }
            if (!piso.nombre || typeof piso.nombre !== 'string') {
              throw new Error(`Piso ${index}: nombre inválido`);
            }
            if (!Array.isArray(piso.inventario)) {
              throw new Error(`Piso ${index}: inventario debe ser un array`);
            }
            if (!Array.isArray(piso.fotos)) {
              throw new Error(`Piso ${index}: fotos debe ser un array`);
            }
            if (!Array.isArray(piso.documentos)) {
              throw new Error(`Piso ${index}: documentos debe ser un array`);
            }
          });
        }
      }
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
