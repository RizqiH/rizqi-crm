<?php

namespace App\Http\Requests;

use App\DTOs\LeadDTO;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
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
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'source' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,qualified,proposal,negotiation,closed_won,closed_lost',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'assigned_to' => 'assigned user'
        ];
    }

    /**
     * Convert request data to LeadDTO
     */
    public function toDTO(): LeadDTO
    {
        return LeadDTO::fromArray($this->validated());
    }
}
