<?php

echo "🚀 Memulai setup DWP Smart Management Application...\n";

// Set working directory
chdir(__DIR__);

// Bootstrap path
$bootstrapPath = __DIR__ . '/bootstrap/app.php';

// Verify bootstrap file exists
if (!file_exists($bootstrapPath)) {
    echo "❌ Error: bootstrap/app.php tidak ditemukan!\n";
    exit(1);
}

// Create production .env if not exists
if (!file_exists('.env')) {
    $envContent = 'APP_NAME="DWP Smart Management"
APP_ENV=production
APP_KEY=base64:fDyyY5fLH0n78AB+OCJAxG8qN9KR7e3Crsjp0NVJZE0=
APP_DEBUG=false
APP_URL=https://dwp-smart-app.wasmer.app

DB_CONNECTION=pgsql
DB_HOST=turntable.proxy.rlwy.net
DB_PORT=37284
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=tdfJbvddfxeYPMuaLPCWhTHpmZnVZvZk

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync
MAIL_MAILER=log
LOG_LEVEL=error
LOG_CHANNEL=single';

    file_put_contents('.env', $envContent);
}

// Ensure storage directories exist
$storageDirs = [
    'storage/app',
    'storage/framework/cache/data',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache'
];

foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Verify vendor directory exists
if (!is_dir('vendor')) {
    echo "❌ Error: vendor directory tidak ditemukan! Jalankan 'composer install' terlebih dahulu.\n";
    exit(1);
}

echo "📦 Loading Laravel dependencies...\n";
require_once 'vendor/autoload.php';

// Bootstrap Laravel
echo "⚡ Bootstrapping Laravel application...\n";
$app = require_once $bootstrapPath;

// Run essential Laravel commands
try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    echo "🧹 Clearing application caches...\n";
    $kernel->call('config:cache');
    $kernel->call('route:cache');
    $kernel->call('view:cache');

    echo "🗄️  Running database migrations...\n";
    $kernel->call('migrate', ['--force' => true]);

    echo "✅ Laravel application berhasil diinisialisasi!\n";
    echo "🎉 Setup selesai! Aplikasi siap untuk dijalankan.\n";

} catch (Exception $e) {
    echo "⚠️  Warning selama inisialisasi: " . $e->getMessage() . "\n";
    echo "ℹ️  Aplikasi tetap dapat dijalankan, namun beberapa fitur mungkin tidak berfungsi optimal.\n";
}

