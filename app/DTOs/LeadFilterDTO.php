<?php

namespace App\DTOs;

class LeadFilterDTO
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $status = null,
        public readonly ?string $assigned_to = null
    ) {}

    public static function fromRequest(array $request): self
    {
        return new self(
            search: $request['search'] ?? null,
            status: $request['status'] ?? null,
            assigned_to: $request['assigned_to'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
        ];
    }

    public function hasFilters(): bool
    {
        return !empty($this->search) || !empty($this->status) || !empty($this->assigned_to);
    }
}
