<?php

namespace App\Http\Requests;

use App\DTOs\ProductDTO;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly',
            'speed_mbps' => 'nullable|integer|min:1',
            'is_active' => 'boolean'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'billing_cycle' => 'billing cycle',
            'speed_mbps' => 'speed (Mbps)',
            'is_active' => 'status'
        ];
    }

    /**
     * Convert request data to ProductDTO
     */
    public function toDTO(): ProductDTO
    {
        return ProductDTO::fromArray($this->validated());
    }
}
