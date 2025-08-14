<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Project;
use App\Models\Customer;
use App\Models\CustomerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
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
            'services' => [
                'total' => CustomerService::count(),
                'active' => CustomerService::where('status', 'active')->count(),
            ]
        ];

        $recentLeads = Lead::with('assignedTo')
            ->latest()
            ->take(5)
            ->get();

        $pendingProjects = Project::with(['lead', 'product', 'assignedTo'])
            ->where('status', 'waiting_approval')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentLeads' => $recentLeads,
            'pendingProjects' => $pendingProjects,
        ]);
    }
}
