<?php

namespace App\DTOs;

class CustomerDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly string $name = '',
        public readonly string $email = '',
        public readonly ?string $phone = null,
        public readonly ?string $company = null,
        public readonly string $billingAddress = '',
        public readonly ?string $installationAddress = null,
        public readonly string $status = 'active',
        public readonly string $registrationDate = '',
        public readonly ?int $leadId = null,
        public readonly ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            name: $data['name'] ?? '',
            email: $data['email'] ?? '',
            phone: $data['phone'] ?? null,
            company: $data['company'] ?? null,
            billingAddress: $data['billing_address'] ?? '',
            installationAddress: $data['installation_address'] ?? null,
            status: $data['status'] ?? 'active',
            registrationDate: $data['registration_date'] ?? '',
            leadId: $data['lead_id'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'billing_address' => $this->billingAddress,
            'installation_address' => $this->installationAddress,
            'status' => $this->status,
            'registration_date' => $this->registrationDate,
            'lead_id' => $this->leadId,
            'notes' => $this->notes,
        ];
    }
}
