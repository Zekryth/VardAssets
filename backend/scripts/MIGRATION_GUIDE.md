# 🔧 Cómo ejecutar la migración SQL de pisos

## Opción 1: Usando el script Node.js (Recomendado)

### Paso 1: Obtener tu DATABASE_URL de Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto "VardAssets"
3. Ve a **Settings** → **Environment Variables**
4. Busca la variable `DATABASE_URL` o `POSTGRES_URL`
5. Copia el valor (ejemplo: `postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)

### Paso 2: Configurar localmente

Agrega la variable a tu archivo `.env.local`:

```bash
# .env.local
DATABASE_URL=postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Paso 3: Ejecutar migración

```powershell
node backend/scripts/run-migration.js
```

El script hará:
- ✅ Agregar columna `pisos` JSONB
- ✅ Migrar datos de `inventario/fotos/documentos` → piso 1
- ✅ Mostrar estadísticas y ejemplos
- ✅ **NO** eliminar columnas antiguas (para rollback)

---

## Opción 2: Neon Console (Alternativa)

Si prefieres hacerlo manualmente:

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido de `backend/scripts/migrate-pisos.sql`
5. Ejecuta el script

---

## ✅ Verificación después de la migración

Una vez ejecutada la migración, verifica que funcionó:

```sql
-- Ver estadísticas
SELECT 
    COUNT(*) as total_puntos,
    COUNT(CASE WHEN jsonb_array_length(pisos) > 0 THEN 1 END) as con_pisos,
    COUNT(CASE WHEN jsonb_array_length(pisos) > 1 THEN 1 END) as multiples_pisos
FROM points;

-- Ver ejemplos
SELECT 
    nombre,
    jsonb_array_length(pisos) as cant_pisos,
    pisos->0->>'nombre' as piso_1
FROM points
LIMIT 5;
```

---

## 🚨 Troubleshooting

### Error: "Variable DATABASE_URL no configurada"
→ Asegúrate de tener la variable en `.env.local` o `.env`

### Error: "connection refused"
→ Verifica que la URL incluya `?sslmode=require` al final

### Error: "column already exists"
→ La migración ya se ejecutó antes, está bien continuar

---

## 📝 Siguiente paso

Una vez migrados los datos, puedes:
1. Crear un punto nuevo con múltiples pisos
2. Editar un punto existente y agregar pisos
3. Ver la navegación con flechas ⬆️⬇️ en los paneles de visualización
