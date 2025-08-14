<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function getActiveProducts(): Collection
    {
        return $this->where('is_active', true)->get();
    }

    public function searchProducts(array $filters): LengthAwarePaginator
    {
        $this->resetQuery();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $this->query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('type', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['type'])) {
            $this->where('type', $filters['type']);
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $this->where('is_active', $filters['status'] === 'active');
        }

        return $this->orderBy('created_at', 'desc')->paginate(10);
    }

    public function getProductsByType(string $type): Collection
    {
        return $this->where('type', $type)
                   ->where('is_active', true)
                   ->get();
    }

    public function getProductWithRelations(int $id): ?Product
    {
        return $this->with(['projects.lead', 'customerServices.customer'])
                   ->find($id);
    }
}
