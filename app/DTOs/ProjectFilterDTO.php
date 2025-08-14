<?php

namespace App\DTOs;

class ProjectFilterDTO
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $status = null,
        public readonly ?int $leadId = null,
        public readonly ?int $productId = null,
        public readonly ?int $managerId = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            search: $data['search'] ?? null,
            status: $data['status'] ?? null,
            leadId: isset($data['lead_id']) ? (int) $data['lead_id'] : null,
            productId: isset($data['product_id']) ? (int) $data['product_id'] : null,
            managerId: isset($data['manager_id']) ? (int) $data['manager_id'] : null,
            dateFrom: $data['date_from'] ?? null,
            dateTo: $data['date_to'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'status' => $this->status,
            'lead_id' => $this->leadId,
            'product_id' => $this->productId,
            'manager_id' => $this->managerId,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
        ];
    }

    public function hasSearch(): bool
    {
        return !empty($this->search);
    }

    public function hasStatus(): bool
    {
        return !empty($this->status);
    }

    public function hasDateRange(): bool
    {
        return !empty($this->dateFrom) && !empty($this->dateTo);
    }
}
