<?php

namespace App\DTOs;

class LeadDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $phone,
        public readonly ?string $company,
        public readonly ?string $address,
        public readonly ?string $source,
        public readonly string $status,
        public readonly ?string $notes,
        public readonly ?int $assigned_to = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            phone: $data['phone'] ?? null,
            company: $data['company'] ?? null,
            address: $data['address'] ?? null,
            source: $data['source'] ?? null,
            status: $data['status'],
            notes: $data['notes'] ?? null,
            assigned_to: isset($data['assigned_to']) ? (int) $data['assigned_to'] : null
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'address' => $this->address,
            'source' => $this->source,
            'status' => $this->status,
            'notes' => $this->notes,
            'assigned_to' => $this->assigned_to,
        ];
    }
}
