<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CustomerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Redirect ke login jika belum login, ke dashboard jika sudah login
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products (Services) - Manager and Admin only
    Route::middleware(['role:manager,admin'])->group(function () {
        Route::resource('products', ProductController::class);
    });

    // Leads - Sales, Manager, Admin
    Route::middleware(['role:sales,manager,admin'])->group(function () {
        Route::resource('leads', LeadController::class);
    });

    // Projects - Basic CRUD (Sales, Manager, Admin)
    Route::middleware(['role:sales,manager,admin'])->group(function () {
        Route::resource('projects', ProjectController::class);
        Route::patch('/projects/{project}/submit-approval', [ProjectController::class, 'submitForApproval'])->name('projects.submit-approval');
        Route::patch('/projects/{project}/complete', [ProjectController::class, 'complete'])->name('projects.complete');
    });

    // Project Approval Routes (Manager, Admin only)
    Route::middleware(['role:manager,admin'])->group(function () {
        Route::get('/projects/pending/approval', [ProjectController::class, 'pendingApproval'])->name('projects.pending-approval');
        Route::patch('/projects/{project}/approve', [ProjectController::class, 'approve'])->name('projects.approve');
        Route::patch('/projects/{project}/reject', [ProjectController::class, 'reject'])->name('projects.reject');
    });

    // Customers - All authenticated users can access
    Route::resource('customers', CustomerController::class);
    Route::post('/customers/{customer}/services', [CustomerController::class, 'addService'])->name('customers.add-service');
    Route::delete('/customers/{customer}/services/{service}', [CustomerController::class, 'removeService'])->name('customers.remove-service');
    Route::patch('/customers/{customer}/services/{service}/suspend', [CustomerController::class, 'suspendService'])->name('customers.suspend-service');
    Route::patch('/customers/{customer}/services/{service}/activate', [CustomerController::class, 'activateService'])->name('customers.activate-service');


});

// Customer Portal (Public Access)
Route::prefix('customer-portal')->group(function () {
    Route::get('/login', [App\Http\Controllers\CustomerPortalController::class, 'login'])->name('customer-portal.login');
    Route::post('/authenticate', [App\Http\Controllers\CustomerPortalController::class, 'authenticate'])->name('customer-portal.authenticate');
    Route::get('/dashboard', [App\Http\Controllers\CustomerPortalController::class, 'dashboard'])->name('customer-portal.dashboard');
    Route::get('/services', [App\Http\Controllers\CustomerPortalController::class, 'services'])->name('customer-portal.services');
    Route::get('/billing', [App\Http\Controllers\CustomerPortalController::class, 'billing'])->name('customer-portal.billing');
    Route::get('/support', [App\Http\Controllers\CustomerPortalController::class, 'support'])->name('customer-portal.support');
    Route::post('/support/ticket', [App\Http\Controllers\CustomerPortalController::class, 'submitSupportTicket'])->name('customer-portal.support.ticket');
    Route::post('/logout', [App\Http\Controllers\CustomerPortalController::class, 'logout'])->name('customer-portal.logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
