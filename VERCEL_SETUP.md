# 🔧 Configuración de Vercel Blob Storage

## ⚠️ ACCIÓN REQUERIDA

Para habilitar la subida de archivos (fotos, documentos), debes configurar el token de Vercel Blob Storage en el Dashboard.

---

## 📋 Pasos para Configurar

### 1. Ve a Vercel Dashboard

```
https://vercel.com/dashboard
```

### 2. Selecciona tu proyecto

Click en **"vard-assets"** (o el nombre de tu proyecto)

### 3. Ir a Settings → Environment Variables

- Click en **"Settings"** (menú superior)
- Click en **"Environment Variables"** (menú lateral izquierdo)

### 4. Agregar nueva variable

Click en **"Add New"** y llena:

- **Key:** `BLOB_READ_WRITE_TOKEN`
- **Value:** `vercel_blob_rw_vuKTbRgZaqQLWm7E_VnZDZhsAlr6VFETk5OSzRJdva1v2SP`
- **Environments:**
  - ✅ Production
  - ✅ Preview
  - ✅ Development

### 5. Guardar

Click en **"Save"**

### 6. Re-deploy

Después de guardar la variable, debes hacer un re-deploy para que se aplique:

**Opción A: Desde Git (Automático)**
```bash
git commit --allow-empty -m "chore: trigger redeploy for BLOB_READ_WRITE_TOKEN"
git push origin main
```

**Opción B: Desde Vercel Dashboard (Manual)**
1. Ve a **"Deployments"**
2. Click en los **3 puntos** del último deployment
3. Click **"Redeploy"**
4. Confirma

---

## ✅ Verificación

Después del deployment (espera 2 minutos):

1. Ve a: https://vard-assets.vercel.app/map
2. Crea un punto
3. Click **"Subir Fotos"**
4. Selecciona una imagen
5. **Debe subirse exitosamente sin errores**

### Logs esperados en Vercel:

```
✅ [UPLOAD] Archivo subido exitosamente: {
  url: 'https://xxxxx.public.blob.vercel-storage.com/...',
  pathname: 'vard-assets/fotos/...',
  size: 1024000
}
```

### Si hay error:

```
❌ BlobError: No token found
```

Significa que la variable no se configuró correctamente. Repite los pasos.

---

## 🔒 Seguridad

**IMPORTANTE:** 
- ✅ El token está configurado solo en Vercel (no en el código)
- ✅ `.env` y `.env.local` están en `.gitignore`
- ✅ El token nunca se sube al repositorio público
- ✅ Solo las funciones de Vercel tienen acceso

---

## 📊 Siguiente Paso

Después de configurar el token:

1. ✅ Elimina este archivo: `git rm VERCEL_SETUP.md`
2. ✅ Commit: `git commit -m "docs: remove setup instructions after configuration"`
3. ✅ Push: `git push origin main`

---

Token configurado el: **2025-11-16**
