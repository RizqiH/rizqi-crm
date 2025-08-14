<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Lead;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing leads, products, and users
        $leads = Lead::all();
        $products = Product::all();
        $salesUsers = User::where('role', 'sales')->get();

        if ($leads->isEmpty() || $products->isEmpty() || $salesUsers->isEmpty()) {
            return;
        }

        $projects = [
            [
                'title' => 'Fiber Internet Installation - PT. Contoh Teknologi',
                'description' => 'Installation of high-speed fiber internet for corporate office',
                'status' => 'pending',
                'estimated_value' => 15000000,
                'expected_start_date' => now()->addDays(5)->toDateString(),
                'expected_completion_date' => now()->addDays(20)->toDateString(),
                'lead_id' => $leads->where('email', 'john.doe@example.com')->first()?->id ?? $leads->first()->id,
                'product_id' => $products->first()->id,
                'assigned_to' => $salesUsers->first()->id,
                'notes' => 'High priority project for corporate client',
            ],
            [
                'title' => 'Premium Internet Package - CV. Digital Solutions',
                'description' => 'Setup premium internet package for digital agency',
                'status' => 'in_progress',
                'estimated_value' => 8000000,
                'expected_start_date' => now()->subDays(3)->toDateString(),
                'expected_completion_date' => now()->addDays(10)->toDateString(),
                'lead_id' => $leads->where('email', 'jane.smith@example.com')->first()?->id ?? $leads->skip(1)->first()->id,
                'product_id' => $products->skip(1)->first()->id,
                'assigned_to' => $salesUsers->first()->id,
                'notes' => 'Client ready to proceed, installation in progress',
            ],
            [
                'title' => 'Corporate Internet Solution - PT. Maju Bersama',
                'description' => 'Comprehensive internet solution for growing company',
                'status' => 'waiting_approval',
                'estimated_value' => 25000000,
                'expected_start_date' => now()->addDays(7)->toDateString(),
                'expected_completion_date' => now()->addDays(30)->toDateString(),
                'lead_id' => $leads->where('email', 'ahmad.sutanto@perusahaan.com')->first()?->id ?? $leads->skip(2)->first()->id,
                'product_id' => $products->skip(2)->first()->id,
                'assigned_to' => $salesUsers->count() > 1 ? $salesUsers->skip(1)->first()->id : $salesUsers->first()->id,
                'notes' => 'Large corporate deal, requires manager approval',
            ],
            [
                'title' => 'Startup Internet Package - Startup Digital',
                'description' => 'Reliable internet solution for startup company',
                'status' => 'completed',
                'estimated_value' => 5000000,
                'expected_start_date' => now()->subDays(15)->toDateString(),
                'expected_completion_date' => now()->subDays(5)->toDateString(),
                'lead_id' => $leads->where('email', 'siti.nur@startup.id')->first()?->id ?? $leads->skip(3)->first()->id,
                'product_id' => $products->skip(3)->first()->id,
                'assigned_to' => $salesUsers->count() > 1 ? $salesUsers->skip(1)->first()->id : $salesUsers->first()->id,
                'notes' => 'Successfully completed installation for startup',
            ]
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
