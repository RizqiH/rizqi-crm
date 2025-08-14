<?php

namespace App\Repositories;

use App\DTOs\CustomerDTO;
use App\DTOs\CustomerFilterDTO;
use App\Models\Customer;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerRepository extends BaseRepository implements CustomerRepositoryInterface
{
    public function __construct(Customer $model)
    {
        parent::__construct($model);
    }

    public function findByCustomerCode(string $customerCode): ?Customer
    {
        return $this->model->where('customer_code', $customerCode)->first();
    }

    public function getFilteredCustomers(CustomerFilterDTO $filters): LengthAwarePaginator
    {
        $query = $this->model->with(['lead', 'services.product']);

        // Apply search filter
        if ($filters->search) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'ILIKE', "%{$filters->search}%")
                  ->orWhere('email', 'ILIKE', "%{$filters->search}%")
                  ->orWhere('customer_code', 'ILIKE', "%{$filters->search}%")
                  ->orWhere('company', 'ILIKE', "%{$filters->search}%");
            });
        }

        // Apply status filter
        if ($filters->status) {
            $query->where('status', $filters->status);
        }

        // Apply company filter
        if ($filters->company) {
            $query->where('company', 'ILIKE', "%{$filters->company}%");
        }

        // Apply sorting
        $query->orderBy($filters->sortBy, $filters->sortDirection);

        return $query->paginate($filters->perPage);
    }

    public function createFromDTO(CustomerDTO $dto): Customer
    {
        $data = $dto->toArray();
        unset($data['id']); // Remove id for creation
        
        // Generate customer code if not provided
        if (empty($data['customer_code'])) {
            $data['customer_code'] = $this->generateCustomerCode();
        }

        return $this->create($data);
    }

    public function updateFromDTO(Customer $customer, CustomerDTO $dto): Customer
    {
        $data = $dto->toArray();
        unset($data['id']); // Remove id for update
        
        $customer->update($data);
        return $customer->fresh();
    }

    public function getCustomerWithServices(int $customerId): ?Customer
    {
        return $this->model->with(['services.product', 'lead'])->find($customerId);
    }

    public function getActiveCustomers(): Collection
    {
        return $this->model->where('status', 'active')->get();
    }

    public function getCustomersByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }

    public function searchCustomers(string $search): Collection
    {
        return $this->model->where(function ($query) use ($search) {
            $query->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('email', 'ILIKE', "%{$search}%")
                  ->orWhere('customer_code', 'ILIKE', "%{$search}%")
                  ->orWhere('company', 'ILIKE', "%{$search}%");
        })->limit(10)->get();
    }

    private function generateCustomerCode(): string
    {
        $prefix = 'CST';
        $year = date('Y');
        $month = date('m');
        
        // Get last customer code for this month
        $lastCustomer = $this->model
            ->where('customer_code', 'LIKE', "{$prefix}{$year}{$month}%")
            ->orderBy('customer_code', 'desc')
            ->first();

        if ($lastCustomer) {
            // Extract sequence number and increment
            $lastSequence = intval(substr($lastCustomer->customer_code, -4));
            $sequence = str_pad($lastSequence + 1, 4, '0', STR_PAD_LEFT);
        } else {
            // First customer of the month
            $sequence = '0001';
        }

        return "{$prefix}{$year}{$month}{$sequence}";
    }
}
