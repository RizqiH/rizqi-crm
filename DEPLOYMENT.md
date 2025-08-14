# 🚀 Deployment Guide ke Wasmer

## Prerequisites

1. **Buat akun Wasmer**: https://wasmer.io/
2. **Repository GitHub**: Pastikan kode sudah di push ke GitHub
3. **Wasmer CLI**: Install di komputer lokal

## Step 1: Setup Wasmer CLI

```bash
# Install Wasmer CLI
curl https://get.wasmer.io -sSfL | sh

# Login ke Wasmer
wasmer login
```

## Step 2: Setup GitHub Repository

1. Push kode ke GitHub repository
2. Di GitHub repository settings, tambahkan secret:
   - `WASMER_TOKEN`: Token dari Wasmer account

## Step 3: Setup Environment Variables

Buat file `.env.production` dengan konfigurasi production:

```env
APP_NAME="DWP Smart Management"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_URL=https://your-app.wasmer.app

DB_CONNECTION=sqlite
DB_DATABASE=/tmp/database.sqlite

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
MAIL_MAILER=log
```

## Step 4: Manual Deployment

```bash
# Jalankan script deployment
./deploy.sh

# Deploy ke Wasmer
wasmer deploy --publish-package
```

## Step 5: Automatic Deployment

GitHub Actions akan otomatis deploy ketika push ke branch `main` atau `master`.

## File yang Sudah Dibuat

- ✅ `wasmer.toml` - Konfigurasi Wasmer
- ✅ `Dockerfile` - Container configuration  
- ✅ `.github/workflows/deploy-wasmer.yml` - GitHub Actions
- ✅ `deploy.sh` - Script deployment manual

## Database Setup

Untuk production, gunakan SQLite atau setup PostgreSQL external:

```bash
# Generate migration files untuk production
php artisan migrate --force
php artisan db:seed --force
```

## Domain Custom

Setelah deploy, Anda bisa:
1. Set custom domain di Wasmer dashboard
2. Update `APP_URL` di environment variables

## Monitoring

- Wasmer dashboard menyediakan monitoring
- Logs tersedia melalui Wasmer CLI: `wasmer logs`

## Troubleshooting

1. **Build gagal**: Check logs di GitHub Actions
2. **App tidak jalan**: Periksa environment variables
3. **Database error**: Pastikan migrations sudah jalan

---

🎉 **Ready to deploy!** Push kode ke GitHub atau jalankan `./deploy.sh` untuk manual deployment.
