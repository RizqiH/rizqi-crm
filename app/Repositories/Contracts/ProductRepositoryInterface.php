<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    public function getActiveProducts(): Collection;

    public function searchProducts(array $filters): LengthAwarePaginator;

    public function getProductsByType(string $type): Collection;

    public function getProductWithRelations(int $id): ?Product;
}
