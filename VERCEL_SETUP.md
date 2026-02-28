# 🔧 VardAssets - Environment Configuration

## 🏗️ Architecture

VardAssets uses:
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Hosting**: Vercel

---

## 📋 Required Environment Variables

### Vercel Dashboard → Settings → Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres.[ref]:[pass]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `CF_ACCOUNT_ID` | Cloudflare account ID | `3445db556e399f285b82f672e9a921f7` |
| `R2_ACCESS_KEY_ID` | R2 API access key | `b881dbc17de3e2572fde68eabd4a0ffa` |
| `R2_SECRET_ACCESS_KEY` | R2 API secret key | `dxi00l4EMQ92Ps_HAI6Zy2...` |
| `R2_BUCKET_NAME` | R2 bucket name | `vardassets-files` |
| `R2_PUBLIC_URL` | R2 public bucket URL | `https://pub-xxxx.r2.dev` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |

---

## 🗄️ Database Setup (Supabase)

### 1. Get Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → Database → Connection string
4. Copy the **Transaction Pooler** URI (port 6543)
5. Replace `[YOUR-PASSWORD]` with your database password

### 2. Create Tables

Run this SQL in Supabase SQL Editor:

```sql
-- See /backend/scripts/MIGRATION_GUIDE.md for full schema
-- Or run the auto-initialization by calling any API endpoint
```

---

## 📦 File Storage Setup (Cloudflare R2)

### 1. Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. R2 Object Storage → Create bucket
3. Name: `vardassets-files`
4. Location: Europe (or your region)

### 2. Enable Public Access

1. Select bucket → Settings → Public access
2. Enable "Allow public access"
3. Copy the public URL (`https://pub-xxx.r2.dev`)

### 3. Create API Token

1. R2 → Manage R2 API Tokens → Create API Token
2. Permissions: Object Read & Write
3. Specify bucket: `vardassets-files`
4. Copy Access Key ID and Secret Access Key

---

## ✅ Verification

After configuration, test:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Tiles debug (shows R2 config)
curl https://your-app.vercel.app/api/tiles/debug
```

Expected response should show:
- `hasR2Credentials: true`
- `r2Bucket: "vardassets-files"`
- `databaseUrl: "configured"`

---

## 🔒 Security Notes

- ✅ All secrets are stored only in Vercel environment variables
- ✅ `.env.local` is in `.gitignore`
- ✅ R2 credentials are never exposed to frontend
- ✅ Supabase service role key (if used) is server-side only

---

Last updated: **2026-02-28**
