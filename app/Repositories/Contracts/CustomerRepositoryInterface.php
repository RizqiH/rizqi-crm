<?php

namespace App\Repositories\Contracts;

use App\DTOs\CustomerDTO;
use App\DTOs\CustomerFilterDTO;
use App\Models\Customer;

interface CustomerRepositoryInterface extends BaseRepositoryInterface
{
    public function findByCustomerCode(string $customerCode): ?Customer;
    
    public function getFilteredCustomers(CustomerFilterDTO $filters): \Illuminate\Contracts\Pagination\LengthAwarePaginator;
    
    public function createFromDTO(CustomerDTO $dto): Customer;
    
    public function updateFromDTO(Customer $customer, CustomerDTO $dto): Customer;
    
    public function getCustomerWithServices(int $customerId): ?Customer;
    
    public function getActiveCustomers(): \Illuminate\Database\Eloquent\Collection;
    
    public function getCustomersByStatus(string $status): \Illuminate\Database\Eloquent\Collection;
    
    public function searchCustomers(string $search): \Illuminate\Database\Eloquent\Collection;
}
