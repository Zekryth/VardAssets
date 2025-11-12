import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DeletedPoint = sequelize.define('DeletedPoint', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    originalId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID del punto original antes de eliminarse'
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    compañia: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    coordenadas: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { x: 0, y: 0 }
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
    meta: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    deletedBy: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Usuario que eliminó el punto'
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'deleted_points',
    timestamps: true,
    indexes: [
      {
        name: 'idx_deleted_point_original',
        fields: ['originalId']
      },
      {
        name: 'idx_deleted_point_deleted_at',
        fields: ['deletedAt'],
        order: [['deletedAt', 'DESC']]
      },
      {
        name: 'idx_deleted_point_company',
        fields: ['compañia']
      }
    ]
  });

  DeletedPoint.associate = (models) => {
    DeletedPoint.belongsTo(models.Company, {
      foreignKey: 'compañia',
      as: 'company'
    });
  };

  return DeletedPoint;
};
