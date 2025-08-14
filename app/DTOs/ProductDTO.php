<?php

namespace App\DTOs;

class ProductDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
        public readonly string $type,
        public readonly float $price,
        public readonly string $billing_cycle,
        public readonly ?int $speed_mbps = null,
        public readonly bool $is_active = true
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'] ?? null,
            type: $data['type'],
            price: (float) $data['price'],
            billing_cycle: $data['billing_cycle'],
            speed_mbps: isset($data['speed_mbps']) ? (int) $data['speed_mbps'] : null,
            is_active: (bool) ($data['is_active'] ?? true)
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'price' => $this->price,
            'billing_cycle' => $this->billing_cycle,
            'speed_mbps' => $this->speed_mbps,
            'is_active' => $this->is_active,
        ];
    }

    public function validate(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly',
            'speed_mbps' => 'nullable|integer|min:1',
            'is_active' => 'boolean'
        ];

        return $rules;
    }
}
