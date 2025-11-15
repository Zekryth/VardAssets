/**
 * Script para ejecutar la migración de pisos en Neon PostgreSQL
 * 
 * Uso:
 *   node backend/scripts/run-migration.js
 * 
 * Requiere DATABASE_URL en variables de entorno
 */

import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env.local o .env
const envPath = path.join(__dirname, '../../.env.local');
const envPathFallback = path.join(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  console.log('📦 Cargando variables de entorno desde .env.local\n');
  dotenv.config({ path: envPath });
} else if (fs.existsSync(envPathFallback)) {
  console.log('📦 Cargando variables de entorno desde .env\n');
  dotenv.config({ path: envPathFallback });
} else {
  console.log('⚠️  No se encontró .env.local ni .env\n');
}

async function runMigration() {
  console.log('🚀 [MIGRATION] Iniciando migración de pisos...\n');

  // Verificar DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: Variable DATABASE_URL no configurada');
    console.error('   Configúrala en tu archivo .env o .env.local:');
    console.error('   DATABASE_URL=postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require\n');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Probar conexión
    console.log('🔌 Conectando a Neon PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión establecida\n');

    // Leer script SQL
    const sqlPath = path.join(__dirname, 'migrate-pisos.sql');
    console.log('📄 Leyendo script:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('✅ Script cargado\n');

    // Separar queries (el script tiene múltiples statements)
    console.log('⚙️  Ejecutando migración...\n');
    
    // Paso 1: Agregar columna pisos
    console.log('1️⃣  Agregando columna pisos...');
    await pool.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'points' AND column_name = 'pisos'
          ) THEN
              ALTER TABLE points 
              ADD COLUMN pisos JSONB DEFAULT '[{"numero": 1, "nombre": "Planta Baja", "inventario": [], "fotos": [], "documentos": []}]'::jsonb;
              
              RAISE NOTICE 'Columna pisos agregada exitosamente';
          ELSE
              RAISE NOTICE 'Columna pisos ya existe, omitiendo creación';
          END IF;
      END $$;
    `);
    console.log('   ✅ Columna pisos verificada\n');

    // Paso 2: Migrar datos existentes
    console.log('2️⃣  Migrando datos existentes al piso 1...');
    const migrateResult = await pool.query(`
      UPDATE points 
      SET pisos = jsonb_build_array(
          jsonb_build_object(
              'numero', 1,
              'nombre', 'Planta Baja',
              'inventario', COALESCE(inventario, '[]'::jsonb),
              'fotos', COALESCE(fotos, '[]'::jsonb),
              'documentos', COALESCE(documentos, '[]'::jsonb)
          )
      )
      WHERE pisos IS NULL 
         OR pisos = '[]'::jsonb
         OR jsonb_array_length(pisos) = 0
      RETURNING id, nombre;
    `);
    console.log(`   ✅ ${migrateResult.rowCount} puntos migrados\n`);

    if (migrateResult.rowCount > 0) {
      console.log('   📋 Puntos migrados:');
      migrateResult.rows.forEach(row => {
        console.log(`      - ${row.nombre} (ID: ${row.id})`);
      });
      console.log('');
    }

    // Paso 3: Verificar migración
    console.log('3️⃣  Verificando migración...');
    const verifyResult = await pool.query(`
      SELECT 
          COUNT(*) as total_puntos,
          COUNT(CASE WHEN pisos IS NOT NULL AND jsonb_array_length(pisos) > 0 THEN 1 END) as puntos_con_pisos,
          COUNT(CASE WHEN jsonb_array_length(pisos) > 1 THEN 1 END) as puntos_con_multiples_pisos
      FROM points;
    `);

    const stats = verifyResult.rows[0];
    console.log('   📊 Estadísticas:');
    console.log(`      Total de puntos: ${stats.total_puntos}`);
    console.log(`      Puntos con pisos: ${stats.puntos_con_pisos}`);
    console.log(`      Puntos con múltiples pisos: ${stats.puntos_con_multiples_pisos}\n`);

    // Paso 4: Mostrar ejemplos
    console.log('4️⃣  Ejemplos de datos migrados:');
    const examplesResult = await pool.query(`
      SELECT 
          id,
          nombre,
          jsonb_array_length(pisos) as cantidad_pisos,
          pisos->0->>'nombre' as piso_1_nombre,
          jsonb_array_length(COALESCE(pisos->0->'inventario', '[]'::jsonb)) as piso_1_items,
          jsonb_array_length(COALESCE(pisos->0->'fotos', '[]'::jsonb)) as piso_1_fotos,
          jsonb_array_length(COALESCE(pisos->0->'documentos', '[]'::jsonb)) as piso_1_docs
      FROM points
      WHERE pisos IS NOT NULL AND jsonb_array_length(pisos) > 0
      LIMIT 5;
    `);

    if (examplesResult.rows.length > 0) {
      console.log('');
      examplesResult.rows.forEach(row => {
        console.log(`   📍 ${row.nombre}`);
        console.log(`      ID: ${row.id}`);
        console.log(`      Pisos: ${row.cantidad_pisos}`);
        console.log(`      ${row.piso_1_nombre}: ${row.piso_1_items} items, ${row.piso_1_fotos} fotos, ${row.piso_1_docs} docs`);
        console.log('');
      });
    } else {
      console.log('   ⚠️  No hay puntos en la base de datos\n');
    }

    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE\n');
    console.log('📝 NOTAS:');
    console.log('   - Las columnas antiguas (inventario, fotos, documentos) NO fueron eliminadas');
    console.log('   - Esto permite rollback en caso de problemas');
    console.log('   - Una vez verificado que todo funciona, puedes eliminarlas con:');
    console.log('     ALTER TABLE points DROP COLUMN inventario;');
    console.log('     ALTER TABLE points DROP COLUMN fotos;');
    console.log('     ALTER TABLE points DROP COLUMN documentos;\n');

  } catch (error) {
    console.error('\n❌ ERROR durante la migración:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar migración
runMigration().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
