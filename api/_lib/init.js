import { getPool } from './db.js';
import bcrypt from 'bcrypt';

let initialized = false;

/**
 * Inicializa la base de datos automáticamente:
 * - Verifica/crea tabla users con todas sus columnas
 * - Crea usuario admin si no existe
 * - Crea todas las tablas necesarias (companies, points, objects, deleted_points)
 * - Es idempotente: se puede ejecutar múltiples veces sin efectos secundarios
 */
export async function initializeDatabase() {
  // Evitar re-inicialización en la misma sesión serverless
  if (initialized) {
    console.log('✅ Base de datos ya inicializada en esta sesión');
    return;
  }

  const pool = getPool();

  try {
    console.log('🔍 Iniciando verificación de estructura de base de datos...');

    // ========================================
    // PASO 1: VERIFICAR/CREAR TABLA USERS
    // ========================================
    
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    const tableExists = tableCheck.rows[0].exists;

    if (!tableExists) {
      // Caso 1: Tabla no existe → Crearla completa
      console.log('📝 Tabla users no existe. Creando estructura completa...');
      await pool.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          username VARCHAR(100) UNIQUE NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Tabla users creada exitosamente');
    } else {
      // Caso 2: Tabla existe → Verificar columna username
      console.log('✅ Tabla users existe. Verificando integridad de columnas...');
      
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'users' 
        AND column_name = 'username'
      `);

      if (columnCheck.rows.length === 0) {
        // Caso 2a: Falta columna username → Agregarla
        console.log('⚠️ Columna username no existe. Ejecutando ALTER TABLE...');
        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE
        `);
        console.log('✅ Columna username agregada exitosamente');
      } else {
        console.log('✅ Columna username verificada');
      }
    }

    // ========================================
    // PASO 2: VERIFICAR/CREAR USUARIO ADMIN
    // ========================================
    
    console.log('🔍 Verificando existencia de usuario administrador...');
    
    const { rows: adminCheck } = await pool.query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE username = 'admin' OR email = 'admin@vardassets.com'`
    );

    const adminExists = parseInt(adminCheck[0].count) > 0;

    if (!adminExists) {
      console.log('📝 Usuario admin no encontrado. Creando credenciales por defecto...');
      
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await pool.query(
        `INSERT INTO users (id, email, password, username, role, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
        ['admin@vardassets.com', hashedPassword, 'admin', 'admin']
      );

      console.log('✅ Usuario administrador creado:');
      console.log('   📧 Email: admin@vardassets.com');
      console.log('   👤 Username: admin');
      console.log('   🔑 Password: 123456');
      console.log('   🛡️ Role: admin');
    } else {
      console.log('✅ Usuario administrador ya existe');
    }

    // ========================================
    // PASO 3: CREAR TABLAS DE DOMINIO
    // ========================================
    
    console.log('🔍 Verificando tablas de dominio...');

    // Tabla: companies
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        persona_contacto VARCHAR(255),
        telefono VARCHAR(50),
        email VARCHAR(255),
        direccion TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla companies verificada/creada');

    // Tabla: objects
    await pool.query(`
      CREATE TABLE IF NOT EXISTS objects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        categoria VARCHAR(100) DEFAULT 'General',
        unidad VARCHAR(50) DEFAULT 'unidad',
        descripcion TEXT,
        precio DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla objects verificada/creada');

    // Tabla: points (con foreign key a companies)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS points (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        compañia UUID REFERENCES companies(id) ON DELETE SET NULL,
        coordenadas JSONB NOT NULL,
        inventario JSONB DEFAULT '[]'::jsonb,
        fotos JSONB DEFAULT '[]'::jsonb,
        documentos JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Migraciones incrementales de points (compatibilidad con versión actual API)
    await pool.query(`ALTER TABLE points ADD COLUMN IF NOT EXISTS categoria VARCHAR(255)`);
    await pool.query(`ALTER TABLE points ADD COLUMN IF NOT EXISTS compania_propietaria UUID`);
    await pool.query(`ALTER TABLE points ADD COLUMN IF NOT EXISTS compania_alojada UUID`);
    await pool.query(`ALTER TABLE points ADD COLUMN IF NOT EXISTS nr_inventario_sap VARCHAR(255)`);
    await pool.query(`ALTER TABLE points ADD COLUMN IF NOT EXISTS mijloc_fix BOOLEAN DEFAULT FALSE`);
    await pool.query(`ALTER TABLE points ADD COLUMN IF NOT EXISTS pisos_adicionales JSONB DEFAULT '[]'::jsonb`);

    // Backfill: si existía columna antigua "compañia", úsala como propietaria por defecto
    await pool.query(`
      UPDATE points
      SET compania_propietaria = COALESCE(compania_propietaria, compañia)
      WHERE compania_propietaria IS NULL
    `);

    console.log('✅ Tabla points verificada/creada');

    // Tabla: deleted_points (papelera)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deleted_points (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        original_id UUID NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        compañia UUID,
        coordenadas JSONB NOT NULL,
        inventario JSONB DEFAULT '[]'::jsonb,
        fotos JSONB DEFAULT '[]'::jsonb,
        documentos JSONB DEFAULT '[]'::jsonb,
        deleted_by JSONB,
        deleted_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla deleted_points verificada/creada');

    // ========================================
    // PASO 4: MARCAR COMO INICIALIZADO
    // ========================================
    
    initialized = true;
    console.log('🎉 Inicialización de base de datos completada exitosamente');
    console.log('📊 Estado: Todas las tablas verificadas/creadas');
    console.log('👤 Admin: Listo para login con admin/123456');

  } catch (error) {
    // Manejar errores específicos
    if (error.code === '23505') {
      // Duplicate key - El admin ya existe
      console.log('✅ Usuario admin ya existe (clave duplicada detectada)');
      initialized = true;
      return;
    }

    // Error crítico - Registrar detalles completos
    console.error('❌ Error crítico en inicialización de base de datos:');
    console.error('   📝 Mensaje:', error.message);
    console.error('   🔢 Código:', error.code);
    console.error('   📍 Detalle:', error.detail);
    console.error('   📚 Stack:', error.stack);
    
    // No marcar como inicializado para reintentar en próxima ejecución
    initialized = false;
    
    // Re-lanzar error para que sea manejado por el handler
    throw error;
  }
}
