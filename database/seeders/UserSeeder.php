<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@smart.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now()
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@smart.com',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'email_verified_at' => now()
            ],
            [
                'name' => 'Sales User 1',
                'email' => 'sales1@smart.com',
                'password' => Hash::make('password'),
                'role' => 'sales',
                'email_verified_at' => now()
            ],
            [
                'name' => 'Sales User 2',
                'email' => 'sales2@smart.com',
                'password' => Hash::make('password'),
                'role' => 'sales',
                'email_verified_at' => now()
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
