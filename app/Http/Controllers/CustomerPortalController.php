<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Inertia\Inertia;

class CustomerPortalController extends Controller
{
    public function login()
    {
        return Inertia::render('CustomerPortal/Login');
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'customer_code' => 'required',
            'email' => 'required|email'
        ]);

        $customer = Customer::where('customer_code', $request->customer_code)
                          ->where('email', $request->email)
                          ->first();

        if (!$customer) {
            return back()->withErrors(['credentials' => 'Invalid customer code or email']);
        }

        session(['customer_id' => $customer->id]);

        return redirect()->route('customer-portal.dashboard');
    }

    public function dashboard()
    {
        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect()->route('customer-portal.login');
        }

        $customer = Customer::with(['services.product', 'lead'])
                          ->find($customerId);

        if (!$customer) {
            session()->forget('customer_id');
            return redirect()->route('customer-portal.login');
        }

        // Calculate statistics
        $stats = [
            'active_services' => $customer->services()->where('status', 'active')->count(),
            'total_monthly_cost' => $customer->services()->where('status', 'active')->sum('monthly_fee'),
            'account_age_days' => 30, // Placeholder - you can calculate this properly later
            'services_count' => $customer->services->count()
        ];

        return Inertia::render('CustomerPortal/Dashboard', [
            'customer' => $customer,
            'stats' => $stats
        ]);
    }

    public function services()
    {
        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect()->route('customer-portal.login');
        }

        $customer = Customer::with(['services.product'])->find($customerId);

        return Inertia::render('CustomerPortal/Services', [
            'customer' => $customer,
            'services' => $customer->services
        ]);
    }

    public function billing()
    {
        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect()->route('customer-portal.login');
        }

        $customer = Customer::with(['services.product'])->find($customerId);

        // Calculate billing information
        $activeServices = $customer->services()->where('status', 'active')->with('product')->get();
        $monthlyTotal = $activeServices->sum('monthly_fee');

        $billingHistory = $activeServices->map(function ($service) {
            return [
                'service_name' => $service->product->name,
                'service_number' => $service->service_number,
                'monthly_fee' => $service->monthly_fee,
                'activation_date' => $service->activation_date,
                'status' => $service->status
            ];
        });

        return Inertia::render('CustomerPortal/Billing', [
            'customer' => $customer,
            'monthlyTotal' => $monthlyTotal,
            'billingHistory' => $billingHistory
        ]);
    }

    public function support()
    {
        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect()->route('customer-portal.login');
        }

        $customer = Customer::find($customerId);

        return Inertia::render('CustomerPortal/Support', [
            'customer' => $customer
        ]);
    }

    public function submitSupportTicket(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'priority' => 'required|in:low,medium,high,urgent'
        ]);

        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect()->route('customer-portal.login');
        }

        // Here you would create a support ticket in your database
        // For now, we'll just return success

        return back()->with('success', 'Support ticket submitted successfully. We will contact you soon.');
    }

    public function logout()
    {
        session()->forget('customer_id');
        return redirect()->route('customer-portal.login')->with('success', 'Logged out successfully');
    }
}
