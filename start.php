<?php

// Create minimal .env for production
$envContent = '
APP_NAME="DWP Smart Management"
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
LOG_CHANNEL=single
';

file_put_contents(__DIR__ . '/.env', trim($envContent));

// Set up storage permissions
$storageDirs = ['logs', 'framework/cache', 'framework/sessions', 'framework/views'];
foreach ($storageDirs as $dir) {
    $path = __DIR__ . '/storage/' . $dir;
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

// Bootstrap Laravel
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

// Run migrations
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('migrate', ['--force' => true]);

// Start the server
$_SERVER['SERVER_NAME'] = '0.0.0.0';
$_SERVER['SERVER_PORT'] = '8080';
$_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$_SERVER['REQUEST_URI'] = $_SERVER['REQUEST_URI'] ?? '/';

// Handle the request
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::capture();
$response = $kernel->handle($request);
$response->send();

$kernel->terminate($request, $response);
