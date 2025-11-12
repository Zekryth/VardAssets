import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre de la compañía es requerido' },
        len: { args: [1, 100], msg: 'El nombre no puede exceder 100 caracteres' }
      }
    },
    personaContacto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: { args: /^[+]?[\d\s\-()]*$/, msg: 'Por favor ingresa un teléfono válido' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: { msg: 'Por favor ingresa un email válido' }
      },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : null);
      }
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'companies',
    timestamps: true,
    indexes: [
      {
        name: 'idx_company_name',
        fields: ['nombre']
      },
      {
        name: 'idx_company_active',
        fields: ['activo']
      }
    ]
  });

  return Company;
};
