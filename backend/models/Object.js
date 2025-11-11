import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Object = sequelize.define('Object', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del objeto es requerido' },
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
    icono: {
      type: DataTypes.STRING,
      defaultValue: '📦'
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    numeroInventario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El número de inventario es requerido' }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [0, 500], msg: 'La descripción no puede exceder 500 caracteres' }
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'objects',
    timestamps: true,
    indexes: [
      {
        name: 'idx_object_category',
        fields: ['categoria']
      },
      {
        name: 'idx_object_inventory_number',
        fields: ['numeroInventario'],
        unique: true
      },
      {
        name: 'idx_object_active',
        fields: ['activo']
      }
    ]
  });

  return Object;
};
