<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoryInterface;
use App\DTOs\ProductDTO;
use App\DTOs\ProductFilterDTO;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository
    ) {}

    public function getAllProducts(ProductFilterDTO $filters): LengthAwarePaginator
    {
        return $this->productRepository->searchProducts($filters->toArray());
    }

    public function getActiveProducts(): Collection
    {
        return $this->productRepository->getActiveProducts();
    }

    public function getProductById(int $id)
    {
        return $this->productRepository->getProductWithRelations($id);
    }

    public function createProduct(ProductDTO $productData)
    {
        return $this->productRepository->create($productData->toArray());
    }

    public function updateProduct(int $id, ProductDTO $productData): bool
    {
        return $this->productRepository->update($id, $productData->toArray());
    }

    public function deleteProduct(int $id): bool
    {
        return $this->productRepository->delete($id);
    }

    public function getProductsByType(string $type): Collection
    {
        return $this->productRepository->getProductsByType($type);
    }
}
