<?php

// Bootstrap path
$bootstrapPath = __DIR__ . '/bootstrap/app.php';

// Check if we're in the right directory
if (!file_exists($bootstrapPath)) {
    // Try to find the correct path
    $possiblePaths = [
        __DIR__ . '/bootstrap/app.php',
        '/app/bootstrap/app.php',
        getcwd() . '/bootstrap/app.php'
    ];

    foreach ($possiblePaths as $path) {
        if (file_exists($path)) {
            $bootstrapPath = $path;
            chdir(dirname(dirname($path)));
            break;
        }
    }
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

// Ensure vendor exists
if (!is_dir('vendor')) {
    echo "Error: vendor directory not found. Run 'composer install' first.\n";
    exit(1);
}

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once $bootstrapPath;

// Run essential Laravel commands
try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    // Clear caches
    $kernel->call('config:clear');
    $kernel->call('cache:clear');
    $kernel->call('view:clear');

    // Run migrations
    $kernel->call('migrate', ['--force' => true]);

    echo "✅ Laravel app initialized successfully!\n";

} catch (Exception $e) {
    echo "⚠️  Warning during initialization: " . $e->getMessage() . "\n";
}

// Start built-in server
$host = '0.0.0.0';
$port = $_ENV['PORT'] ?? 8080;

echo "🚀 Starting server at {$host}:{$port}\n";

// Use Laravel's serve command
$kernel->call('serve', [
    '--host' => $host,
    '--port' => $port,
    '--no-reload' => true
]);

