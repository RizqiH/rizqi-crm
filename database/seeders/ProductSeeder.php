<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Internet Home 10 Mbps',
                'description' => 'Internet package for home users with 10 Mbps speed',
                'type' => 'internet',
                'price' => 199000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => 10,
                'is_active' => true
            ],
            [
                'name' => 'Internet Home 20 Mbps',
                'description' => 'Internet package for home users with 20 Mbps speed',
                'type' => 'internet',
                'price' => 299000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => 20,
                'is_active' => true
            ],
            [
                'name' => 'Internet Business 50 Mbps',
                'description' => 'Internet package for business users with 50 Mbps speed',
                'type' => 'internet',
                'price' => 599000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => 50,
                'is_active' => true
            ],
            [
                'name' => 'Internet Business 100 Mbps',
                'description' => 'High-speed internet for business with 100 Mbps speed',
                'type' => 'internet',
                'price' => 999000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => 100,
                'is_active' => true
            ],
            [
                'name' => 'Cable TV Basic',
                'description' => 'Basic cable TV package with 50+ channels',
                'type' => 'cable_tv',
                'price' => 150000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => null,
                'is_active' => true
            ],
            [
                'name' => 'Cable TV Premium',
                'description' => 'Premium cable TV package with 120+ channels',
                'type' => 'cable_tv',
                'price' => 250000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => null,
                'is_active' => true
            ],
            [
                'name' => 'VoIP Business Line',
                'description' => 'Business VoIP phone line service',
                'type' => 'voip',
                'price' => 75000,
                'billing_cycle' => 'monthly',
                'speed_mbps' => null,
                'is_active' => true
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
