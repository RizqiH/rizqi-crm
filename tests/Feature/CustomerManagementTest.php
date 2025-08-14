<?php

use App\Models\Customer;
use App\Models\User;
use App\Models\Lead;
use App\Services\CustomerManagementService;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($this->user);
});

test('can create customer', function () {
    $lead = Lead::factory()->create(['status' => 'closed_won']);
    
    $customerData = [
        'name' => 'Test Customer',
        'email' => 'test@customer.com',
        'phone' => '081234567890',
        'company' => 'Test Company',
        'billing_address' => 'Test Address',
        'installation_address' => 'Test Address',
        'status' => 'active',
        'lead_id' => $lead->id,
        'notes' => 'Test notes'
    ];

    $response = $this->post('/customers', $customerData);

    $response->assertRedirect('/customers');
    $this->assertDatabaseHas('customers', [
        'email' => 'test@customer.com',
        'name' => 'Test Customer'
    ]);
});

test('can view customer list', function () {
    Customer::factory()->count(5)->create();

    $response = $this->get('/customers');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('Customers/Index')
            ->has('customers.data', 5)
    );
});

test('can add service to customer', function () {
    $customer = Customer::factory()->create();
    $product = \App\Models\Product::factory()->create();

    $serviceData = [
        'product_id' => $product->id,
        'monthly_fee' => 100000,
        'activation_date' => now()->toDateString(),
        'installation_notes' => 'Test installation'
    ];

    $response = $this->post("/customers/{$customer->id}/services", $serviceData);

    $response->assertRedirect();
    $this->assertDatabaseHas('customer_services', [
        'customer_id' => $customer->id,
        'product_id' => $product->id
    ]);
});

test('can suspend customer service', function () {
    $customer = Customer::factory()->create();
    $service = \App\Models\CustomerService::factory()->create([
        'customer_id' => $customer->id,
        'status' => 'active'
    ]);

    $response = $this->patch("/customers/{$customer->id}/services/{$service->id}/suspend");

    $response->assertRedirect();
    $service->refresh();
    expect($service->status)->toBe('suspended');
});

test('customer management service works correctly', function () {
    $service = app(CustomerManagementService::class);
    $customer = Customer::factory()->create();
    
    $stats = $service->getCustomerStats();
    
    expect($stats)->toHaveKeys(['total', 'active', 'suspended']);
    expect($stats['total'])->toBeGreaterThanOrEqual(1);
});
