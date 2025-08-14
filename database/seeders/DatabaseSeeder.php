<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Note: Sample data seeders only run in development environment
     * for production safety.
     */
    public function run(): void
    {
        // Only seed sample data in development environment
        if (app()->environment(['local', 'development', 'testing'])) {
            $this->call([
                UserSeeder::class,
                ProductSeeder::class,
                LeadSeeder::class,
                ProjectSeeder::class,
                CustomerSeeder::class,
            ]);

            $this->command->info('✅ Sample data seeded for development environment.');
        } else {
            // In production, only create essential admin user if none exists
            if (\App\Models\User::where('role', 'admin')->count() === 0) {
                $this->call([UserSeeder::class]);
                $this->command->warn('⚠️  Only admin user seeded in production environment.');
            } else {
                $this->command->info('ℹ️  Production environment - no seeding required.');
            }
        }
    }
}
