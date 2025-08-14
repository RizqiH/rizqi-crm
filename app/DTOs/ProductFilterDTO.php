<?php

namespace App\DTOs;

class ProductFilterDTO
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $type = null,
        public readonly ?string $status = null
    ) {}

    public static function fromRequest(array $request): self
    {
        return new self(
            search: $request['search'] ?? null,
            type: $request['type'] ?? null,
            status: $request['status'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'type' => $this->type,
            'status' => $this->status,
        ];
    }

    public function hasFilters(): bool
    {
        return !empty($this->search) || !empty($this->type) || !empty($this->status);
    }
}
