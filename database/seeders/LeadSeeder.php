<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get sales users
        $salesUsers = User::where('role', 'sales')->get();

        if ($salesUsers->isEmpty()) {
            return;
        }

        $leads = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'phone' => '081234567890',
                'company' => 'PT. Contoh Teknologi',
                'address' => 'Jl. Sudirman No. 1, Jakarta',
                'source' => 'website',
                'status' => 'new',
                'notes' => 'Interested in fiber internet package',
                'assigned_to' => $salesUsers->first()->id
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '081987654321',
                'company' => 'CV. Digital Solutions',
                'address' => 'Jl. Thamrin No. 5, Jakarta',
                'source' => 'referral',
                'status' => 'qualified',
                'notes' => 'Ready to subscribe to premium package',
                'assigned_to' => $salesUsers->first()->id
            ],
            [
                'name' => 'Ahmad Sutanto',
                'email' => 'ahmad.sutanto@perusahaan.com',
                'phone' => '085123456789',
                'company' => 'PT. Maju Bersama',
                'address' => 'Jl. Gatot Subroto No. 10, Jakarta',
                'source' => 'cold_call',
                'status' => 'new',
                'notes' => 'Looking for corporate internet solution',
                'assigned_to' => $salesUsers->count() > 1 ? $salesUsers->skip(1)->first()->id : $salesUsers->first()->id
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nur@startup.id',
                'phone' => '087654321098',
                'company' => 'Startup Digital',
                'address' => 'Jl. Kemang Raya No. 15, Jakarta',
                'source' => 'social_media',
                'status' => 'qualified',
                'notes' => 'Startup company needs reliable internet',
                'assigned_to' => $salesUsers->count() > 1 ? $salesUsers->skip(1)->first()->id : $salesUsers->first()->id
            ],
            [
                'name' => 'Budi Prasetyo',
                'email' => 'budi.prasetyo@hotel.com',
                'phone' => '089876543210',
                'company' => 'Hotel Grand Jakarta',
                'address' => 'Jl. MH Thamrin No. 20, Jakarta',
                'source' => 'referral',
                'status' => 'closed_won',
                'notes' => 'Hotel needs high-speed WiFi for guests',
                'assigned_to' => $salesUsers->first()->id
            ]
        ];

        foreach ($leads as $lead) {
            Lead::create($lead);
        }
    }
}
