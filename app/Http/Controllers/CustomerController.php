<?php

namespace App\Http\Controllers;

use App\DTOs\CustomerDTO;
use App\DTOs\CustomerFilterDTO;
use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Lead;
use App\Models\Product;
use App\Services\CustomerManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(
        private CustomerManagementService $customerService
    ) {}

    public function index(Request $request)
    {
        $filters = new CustomerFilterDTO(
            search: $request->get('search'),
            status: $request->get('status'),
            perPage: 10
        );

        $customers = $this->customerService->getFilteredCustomers($filters);

        // Format pagination data explicitly for Inertia
        $paginatedCustomers = [
            'data' => $customers->items(),
            'links' => $customers->linkCollection()->toArray(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'from' => $customers->firstItem(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'to' => $customers->lastItem(),
                'total' => $customers->total(),
            ]
        ];

        return Inertia::render('Customers/Index', [
            'customers' => $paginatedCustomers,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function create()
    {
        $leads = Lead::where('status', 'closed_won')->get(['id', 'name', 'email', 'phone', 'company', 'address']);

        return Inertia::render('Customers/Create', [
            'leads' => $leads
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'billing_address' => 'required|string',
            'installation_address' => 'nullable|string',
            'status' => 'required|in:active,suspended,terminated',
            'registration_date' => 'required|date',
            'lead_id' => 'nullable|exists:leads,id',
            'notes' => 'nullable|string'
        ]);

        $dto = new CustomerDTO(
            name: $validated['name'],
            email: $validated['email'],
            phone: $validated['phone'] ?? null,
            company: $validated['company'] ?? null,
            billingAddress: $validated['billing_address'],
            installationAddress: $validated['installation_address'] ?? null,
            status: $validated['status'],
            registrationDate: $validated['registration_date'],
            leadId: $validated['lead_id'] ?? null,
            notes: $validated['notes'] ?? null
        );

        $customer = $this->customerService->createCustomer($dto);

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customerWithServices = $this->customerService->getCustomerWithServices($customer->id);
        $products = Product::select('id', 'name', 'price')->get();

        return Inertia::render('Customers/Show', [
            'customer' => $customerWithServices,
            'products' => $products
        ]);
    }

    public function addService(Request $request, Customer $customer)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'monthly_fee' => 'required|numeric|min:0',
            'activation_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:activation_date',
            'installation_notes' => 'nullable|string|max:1000',
            'technical_notes' => 'nullable|string|max:1000'
        ]);

        $product = Product::findOrFail($request->product_id);

        $serviceData = [
            'installation_notes' => $request->installation_notes,
            'technical_notes' => $request->technical_notes,
        ];

        $this->customerService->addServiceToCustomer($customer, $product, $serviceData);

        return redirect()->back()->with('success', 'Service added successfully.');
    }

    public function removeService(Customer $customer, CustomerService $service)
    {
        if ($service->customer_id !== $customer->id) {
            abort(403, 'Unauthorized');
        }

        $this->customerService->removeServiceFromCustomer($service);

        return redirect()->back()->with('success', 'Service removed successfully.');
    }

    public function suspendService(Customer $customer, CustomerService $service)
    {
        if ($service->customer_id !== $customer->id) {
            abort(403, 'Unauthorized');
        }

        $this->customerService->suspendService($service);

        return redirect()->back()->with('success', 'Service suspended.');
    }

    public function activateService(Customer $customer, CustomerService $service)
    {
        if ($service->customer_id !== $customer->id) {
            abort(403, 'Unauthorized');
        }

        $this->customerService->activateService($service);

        return redirect()->back()->with('success', 'Service activated.');
    }

    public function edit(Customer $customer)
    {
        $leads = Lead::where('status', 'closed_won')->get(['id', 'name', 'email', 'phone', 'company', 'address']);

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
            'leads' => $leads
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'billing_address' => 'required|string',
            'installation_address' => 'nullable|string',
            'status' => 'required|in:active,suspended,terminated',
            'registration_date' => 'required|date',
            'lead_id' => 'nullable|exists:leads,id',
            'notes' => 'nullable|string'
        ]);

        $dto = new CustomerDTO(
            name: $validated['name'],
            email: $validated['email'],
            phone: $validated['phone'] ?? null,
            company: $validated['company'] ?? null,
            billingAddress: $validated['billing_address'],
            installationAddress: $validated['installation_address'] ?? null,
            status: $validated['status'],
            registrationDate: $validated['registration_date'],
            leadId: $validated['lead_id'] ?? null,
            notes: $validated['notes'] ?? null
        );

        $updatedCustomer = $this->customerService->updateCustomer($customer, $dto);

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
