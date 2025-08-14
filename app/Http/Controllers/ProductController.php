<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\DTOs\ProductFilterDTO;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = ProductFilterDTO::fromRequest($request->only(['search', 'type', 'status']));
        $products = $this->productService->getAllProducts($filters);

        // Format pagination data explicitly for Inertia
        $paginatedProducts = [
            'data' => $products->items(),
            'links' => $products->linkCollection()->toArray(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'from' => $products->firstItem(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'to' => $products->lastItem(),
                'total' => $products->total(),
            ]
        ];

        return Inertia::render('Products/Index', [
            'products' => $paginatedProducts,
            'filters' => $filters->toArray()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->productService->createProduct($request->toDTO());

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        $productWithRelations = $this->productService->getProductById($product->id);

        return Inertia::render('Products/Show', [
            'product' => $productWithRelations
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->productService->updateProduct($product->id, $request->toDTO());

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->productService->deleteProduct($product->id);

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
