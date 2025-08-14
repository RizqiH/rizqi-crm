<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use App\Models\Product;

class CacheService
{
    private const CACHE_TTL = 3600; // 1 hour

    public function getDashboardStats(): array
    {
        return Cache::remember('dashboard.stats', self::CACHE_TTL, function () {
            return [
                'leads' => [
                    'total' => Lead::count(),
                    'new' => Lead::where('status', 'new')->count(),
                    'qualified' => Lead::where('status', 'qualified')->count(),
                    'closed_won' => Lead::where('status', 'closed_won')->count(),
                ],
                'projects' => [
                    'total' => Project::count(),
                    'pending' => Project::where('status', 'pending')->count(),
                    'in_progress' => Project::where('status', 'in_progress')->count(),
                    'waiting_approval' => Project::where('status', 'waiting_approval')->count(),
                ],
                'customers' => [
                    'total' => Customer::count(),
                    'active' => Customer::where('status', 'active')->count(),
                    'suspended' => Customer::where('status', 'suspended')->count(),
                ],
                'products' => [
                    'total' => Product::count(),
                    'active' => Product::where('is_active', true)->count(),
                ]
            ];
        });
    }

    public function getRevenueStats(): array
    {
        return Cache::remember('revenue.stats', self::CACHE_TTL, function () {
            $monthlyRevenue = Customer::join('customer_services', 'customers.id', '=', 'customer_services.customer_id')
                ->where('customer_services.status', 'active')
                ->sum('customer_services.monthly_fee');

            return [
                'monthly_revenue' => $monthlyRevenue,
                'yearly_revenue' => $monthlyRevenue * 12,
                'avg_customer_value' => Customer::count() > 0 ? $monthlyRevenue / Customer::count() : 0,
            ];
        });
    }

    public function clearDashboardCache(): void
    {
        Cache::forget('dashboard.stats');
        Cache::forget('revenue.stats');
    }

    public function clearAllCache(): void
    {
        Cache::flush();
    }
}
