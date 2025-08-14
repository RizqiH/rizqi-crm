<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Lead;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get leads that are closed_won and completed projects
        $wonLeads = Lead::where('status', 'closed_won')->get();
        $products = Product::all();

        if ($wonLeads->isEmpty() || $products->isEmpty()) {
            return;
        }

        // Create customers from won leads
        foreach ($wonLeads as $lead) {
            $customer = Customer::create([
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'company' => $lead->company,
                'billing_address' => $lead->address,
                'installation_address' => $lead->address,
                'status' => 'active',
                'registration_date' => now()->toDateString(),
                'customer_code' => 'SMART' . now()->format('Ymd') . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT),
                'lead_id' => $lead->id,
                'notes' => 'Converted from lead: ' . $lead->notes,
            ]);

            // Add services for each customer
            $randomProducts = $products->random(rand(1, 2));
            
            foreach ($randomProducts as $product) {
                CustomerService::create([
                    'customer_id' => $customer->id,
                    'product_id' => $product->id,
                    'service_number' => $this->generateServiceNumber(),
                    'status' => 'active',
                    'activation_date' => now()->subDays(rand(1, 30))->toDateString(),
                    'monthly_fee' => $product->price,
                    'installation_notes' => 'Standard installation completed',
                    'technical_notes' => 'All systems operational',
                ]);
            }
        }

        // Create additional sample customers
        $additionalCustomers = [
            [
                'name' => 'Andi Wijaya',
                'email' => 'andi.wijaya@company.com',
                'phone' => '081111222333',
                'company' => 'PT. Mitra Sukses',
                'billing_address' => 'Jl. Kuningan No. 25, Jakarta',
                'installation_address' => 'Jl. Kuningan No. 25, Jakarta',
                'status' => 'active',
                'registration_date' => now()->subDays(15)->toDateString(),
                'customer_code' => 'SMART' . now()->format('Ymd') . str_pad(rand(300, 699), 3, '0', STR_PAD_LEFT),
                'notes' => 'Long term corporate client',
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya.sari@cafe.com',
                'phone' => '082333444555',
                'company' => 'Cafe Digital',
                'billing_address' => 'Jl. Senopati No. 12, Jakarta',
                'installation_address' => 'Jl. Senopati No. 12, Jakarta',
                'status' => 'active',
                'registration_date' => now()->subDays(45)->toDateString(),
                'customer_code' => 'SMART' . now()->format('Ymd') . str_pad(rand(700, 999), 3, '0', STR_PAD_LEFT),
                'notes' => 'Cafe with high bandwidth needs',
            ]
        ];

        foreach ($additionalCustomers as $customerData) {
            $customer = Customer::create($customerData);

            // Add random services
            $randomProducts = $products->random(rand(1, 2));
            
            foreach ($randomProducts as $product) {
                CustomerService::create([
                    'customer_id' => $customer->id,
                    'product_id' => $product->id,
                    'service_number' => $this->generateServiceNumber(),
                    'status' => rand(1, 10) > 2 ? 'active' : 'suspended', // 80% active, 20% suspended
                    'activation_date' => now()->subDays(rand(1, 60))->toDateString(),
                    'monthly_fee' => $product->price,
                    'installation_notes' => 'Professional installation',
                    'technical_notes' => 'Performance monitoring active',
                ]);
            }
        }
    }

    private function generateServiceNumber(): string
    {
        $prefix = 'SRV';
        $year = date('Y');
        $month = date('m');
        
        // Get last service number for this month
        $lastService = CustomerService::where('service_number', 'LIKE', "{$prefix}{$year}{$month}%")
            ->orderBy('service_number', 'desc')
            ->first();

        if ($lastService) {
            // Extract sequence number and increment
            $lastSequence = intval(substr($lastService->service_number, -4));
            $sequence = str_pad($lastSequence + 1, 4, '0', STR_PAD_LEFT);
        } else {
            // First service of the month
            $sequence = '0001';
        }

        return "{$prefix}{$year}{$month}{$sequence}";
    }
}
