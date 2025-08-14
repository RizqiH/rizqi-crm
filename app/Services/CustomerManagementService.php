<?php

namespace App\Services;

use App\DTOs\CustomerDTO;
use App\DTOs\CustomerFilterDTO;
use App\Models\Customer;
use App\Models\CustomerService as CustomerServiceModel;
use App\Models\Product;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerManagementService
{
    public function __construct(
        private CustomerRepositoryInterface $customerRepository
    ) {}

    public function getFilteredCustomers(CustomerFilterDTO $filters): LengthAwarePaginator
    {
        return $this->customerRepository->getFilteredCustomers($filters);
    }

    public function createCustomer(CustomerDTO $dto): Customer
    {
        return $this->customerRepository->createFromDTO($dto);
    }

    public function updateCustomer(Customer $customer, CustomerDTO $dto): Customer
    {
        return $this->customerRepository->updateFromDTO($customer, $dto);
    }

    public function getCustomerWithServices(int $customerId): ?Customer
    {
        return $this->customerRepository->getCustomerWithServices($customerId);
    }

    public function findByCustomerCode(string $customerCode): ?Customer
    {
        return $this->customerRepository->findByCustomerCode($customerCode);
    }

    public function addServiceToCustomer(Customer $customer, Product $product, array $serviceData = []): CustomerServiceModel
    {
        $serviceNumber = $this->generateServiceNumber();
        
        $customerService = new CustomerServiceModel([
            'customer_id' => $customer->id,
            'product_id' => $product->id,
            'service_number' => $serviceNumber,
            'status' => 'active',
            'activation_date' => now()->toDateString(),
            'monthly_fee' => $product->price,
            'installation_notes' => $serviceData['installation_notes'] ?? null,
            'technical_notes' => $serviceData['technical_notes'] ?? null,
        ]);

        $customerService->save();
        return $customerService;
    }

    public function removeServiceFromCustomer(CustomerServiceModel $service): bool
    {
        $service->update(['status' => 'terminated']);
        return true;
    }

    public function suspendService(CustomerServiceModel $service): bool
    {
        $service->update(['status' => 'suspended']);
        return true;
    }

    public function activateService(CustomerServiceModel $service): bool
    {
        $service->update(['status' => 'active']);
        return true;
    }

    public function getActiveCustomers(): Collection
    {
        return $this->customerRepository->getActiveCustomers();
    }

    public function searchCustomers(string $search): Collection
    {
        return $this->customerRepository->searchCustomers($search);
    }

    public function getCustomerStats(): array
    {
        $total = Customer::count();
        $active = $this->customerRepository->getCustomersByStatus('active')->count();
        $suspended = $this->customerRepository->getCustomersByStatus('suspended')->count();
        $terminated = $this->customerRepository->getCustomersByStatus('terminated')->count();

        return [
            'total' => $total,
            'active' => $active,
            'suspended' => $suspended,
            'terminated' => $terminated,
            'growth_rate' => $this->calculateGrowthRate(),
        ];
    }

    private function generateServiceNumber(): string
    {
        $prefix = 'SRV';
        $year = date('Y');
        $month = date('m');
        
        // Get last service number for this month
        $lastService = CustomerServiceModel::where('service_number', 'LIKE', "{$prefix}{$year}{$month}%")
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

    private function calculateGrowthRate(): float
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $currentCount = Customer::where('created_at', '>=', $currentMonth)->count();
        $lastCount = Customer::where('created_at', '>=', $lastMonth)
            ->where('created_at', '<', $currentMonth)
            ->count();

        if ($lastCount === 0) {
            return $currentCount > 0 ? 100.0 : 0.0;
        }

        return round((($currentCount - $lastCount) / $lastCount) * 100, 2);
    }
}
