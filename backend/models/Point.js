import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Point = sequelize.define('Point', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    
    // === INFORMACIÓN DE PLANTA BAJA (Punto Principal) ===
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre del punto para búsqueda (ej: 234150) - Planta Baja',
      validate: {
        notEmpty: { msg: 'El nombre del punto es requerido' },
        len: { args: [1, 100], msg: 'El nombre no puede exceder 100 caracteres' }
      }
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Categoría de la Planta Baja (ej: Container tip birou)'
    },
    compania_propietaria: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Compañía propietaria del punto/container'
    },
    compania_alojada: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Compañía alojada en el punto (puede ser diferente de propietaria)'
    },
    nr_inventario_sap: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Número de inventario SAP (opcional)'
    },
    mijloc_fix: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si el punto es fijo (⭐ Mijloc Fix)'
    },
    
    // Backward compatibility - mantener compañia antigua
    compañia: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'DEPRECATED: Usar compania_propietaria'
    },
    
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    coordenadas: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Coordenadas del punto en el mapa {x, y}',
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
    
    // === DATOS DE PLANTA BAJA ===
    inventario: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Inventario de la Planta Baja'
    },
    fotos: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Fotos de la Planta Baja'
    },
    documentos: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Documentos de la Planta Baja'
    },
    
    // === PISOS ADICIONALES ===
    pisos_adicionales: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array de pisos adicionales con estructura: {numero, nombre_punto, nombre_piso, categoria, compania_propietaria, compania_alojada, mijloc_fix, inventario, fotos, documentos}',
      get() {
        const rawValue = this.getDataValue('pisos_adicionales');
        
        // Si es string JSON, parsearlo
        if (typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            console.error('❌ [Point Model] Error parseando pisos_adicionales:', e);
            return [];
          }
        }
        
        // Si ya es array, retornarlo
        if (Array.isArray(rawValue)) {
          return rawValue;
        }
        
        // Si es null o undefined, retornar array vacío
        return [];
      },
      set(value) {
        // Validar que sea array
        if (!Array.isArray(value)) {
          console.warn('⚠️ [Point Model] pisos_adicionales debe ser array, recibido:', typeof value);
          this.setDataValue('pisos_adicionales', []);
          return;
        }
        
        this.setDataValue('pisos_adicionales', value);
      },
      validate: {
        isValidPisosAdicionales(value) {
          if (!Array.isArray(value)) {
            throw new Error('pisos_adicionales debe ser un array');
          }
          
          value.forEach((piso, index) => {
            if (!piso.numero || typeof piso.numero !== 'number') {
              throw new Error(`Piso ${index + 1}: número inválido`);
            }
            if (!piso.nombre_punto || typeof piso.nombre_punto !== 'string') {
              throw new Error(`Piso ${index + 1}: nombre_punto es requerido`);
            }
            if (!piso.nombre_piso || typeof piso.nombre_piso !== 'string') {
              throw new Error(`Piso ${index + 1}: nombre_piso es requerido`);
            }
            if (piso.inventario && !Array.isArray(piso.inventario)) {
              throw new Error(`Piso ${index + 1}: inventario debe ser un array`);
            }
            if (piso.fotos && !Array.isArray(piso.fotos)) {
              throw new Error(`Piso ${index + 1}: fotos debe ser un array`);
            }
            if (piso.documentos && !Array.isArray(piso.documentos)) {
              throw new Error(`Piso ${index + 1}: documentos debe ser un array`);
            }
          });
        }
      }
    },
    
    // Backward compatibility - mantener pisos antiguo
    pisos: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'DEPRECATED: Usar pisos_adicionales'
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
        name: 'idx_point_compania_propietaria',
        fields: ['compania_propietaria']
      },
      {
        name: 'idx_point_compania_alojada',
        fields: ['compania_alojada']
      },
      {
        name: 'idx_point_mijloc_fix',
        fields: ['mijloc_fix']
      },
      {
        name: 'idx_point_active',
        fields: ['activo']
      },
      {
        name: 'idx_point_nombre',
        fields: ['nombre']
      },
      {
        name: 'idx_point_pisos_adicionales',
        fields: ['pisos_adicionales'],
        using: 'gin'
      }
    ]
  });

  return Point;
};
