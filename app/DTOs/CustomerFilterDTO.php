<?php

namespace App\DTOs;

class CustomerFilterDTO
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $status = null,
        public readonly ?string $company = null,
        public readonly ?int $assignedTo = null,
        public readonly ?string $sortBy = 'created_at',
        public readonly string $sortDirection = 'desc',
        public readonly int $perPage = 15,
    ) {}

    public static function fromRequest(array $request): self
    {
        return new self(
            search: $request['search'] ?? null,
            status: $request['status'] ?? null,
            company: $request['company'] ?? null,
            assignedTo: isset($request['assigned_to']) ? (int) $request['assigned_to'] : null,
            sortBy: $request['sort_by'] ?? 'created_at',
            sortDirection: $request['sort_direction'] ?? 'desc',
            perPage: isset($request['per_page']) ? (int) $request['per_page'] : 15,
        );
    }

    public function hasFilters(): bool
    {
        return !empty($this->search) || 
               !empty($this->status) || 
               !empty($this->company) || 
               !empty($this->assignedTo);
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'status' => $this->status,
            'company' => $this->company,
            'assigned_to' => $this->assignedTo,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection,
            'per_page' => $this->perPage,
        ];
    }
}
