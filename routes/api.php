<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjectController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/customer-portal/login', [AuthController::class, 'customerLogin']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        // Leads API
        Route::apiResource('leads', LeadController::class);
        Route::patch('/leads/{lead}/assign', [LeadController::class, 'assign']);

        // Products API
        Route::apiResource('products', ProductController::class);

        // Projects API
        Route::apiResource('projects', ProjectController::class);
        Route::patch('/projects/{project}/approve', [ProjectController::class, 'approve']);
        Route::patch('/projects/{project}/reject', [ProjectController::class, 'reject']);

        // Customers API
        Route::apiResource('customers', CustomerController::class);
        Route::get('/customers/{customer}/services', [CustomerController::class, 'services']);
        Route::post('/customers/{customer}/services', [CustomerController::class, 'addService']);

        // Reports API (Manager/Admin only)
        Route::middleware('role:manager,admin')->group(function () {
            Route::get('/reports/dashboard', [App\Http\Controllers\Api\ReportController::class, 'dashboard']);
            Route::get('/reports/leads', [App\Http\Controllers\Api\ReportController::class, 'leads']);
            Route::get('/reports/revenue', [App\Http\Controllers\Api\ReportController::class, 'revenue']);
        });
    });

    // Customer Portal API
    Route::prefix('customer-portal')->middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Api\CustomerPortalController::class, 'dashboard']);
        Route::get('/services', [App\Http\Controllers\Api\CustomerPortalController::class, 'services']);
        Route::get('/billing', [App\Http\Controllers\Api\CustomerPortalController::class, 'billing']);
        Route::get('/tickets', [App\Http\Controllers\Api\CustomerPortalController::class, 'tickets']);
        Route::post('/tickets', [App\Http\Controllers\Api\CustomerPortalController::class, 'createTicket']);
    });
});
