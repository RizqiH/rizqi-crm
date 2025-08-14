<?php

namespace App\Http\Requests;

use App\DTOs\ProjectDTO;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'description' => 'required|string',
            'lead_id' => 'required|exists:leads,id',
            'product_id' => 'required|exists:products,id',
            'status' => 'required|in:pending,in_progress,waiting_approval,approved,rejected,completed',
            'manager_id' => 'nullable|exists:users,id',
            'estimated_value' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'lead_id' => 'lead',
            'product_id' => 'product',
            'manager_id' => 'manager',
            'estimated_value' => 'estimated value',
            'start_date' => 'start date',
            'end_date' => 'end date',
        ];
    }

    /**
     * Convert request to ProjectDTO
     */
    public function toDTO(): ProjectDTO
    {
        return ProjectDTO::fromArray($this->validated());
    }
}
