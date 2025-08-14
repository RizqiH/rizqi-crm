<?php

namespace App\DTOs;

class ProjectDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $description,
        public readonly int $leadId,
        public readonly int $productId,
        public readonly ?string $status = null,
        public readonly ?int $managerId = null,
        public readonly ?string $estimatedValue = null,
        public readonly ?string $startDate = null,
        public readonly ?string $endDate = null,
        public readonly ?string $notes = null,
        public readonly ?int $id = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'],
            leadId: (int) $data['lead_id'],
            productId: (int) $data['product_id'],
            status: $data['status'] ?? null,
            managerId: isset($data['manager_id']) ? (int) $data['manager_id'] : null,
            estimatedValue: $data['estimated_value'] ?? null,
            startDate: $data['start_date'] ?? null,
            endDate: $data['end_date'] ?? null,
            notes: $data['notes'] ?? null,
            id: isset($data['id']) ? (int) $data['id'] : null
        );
    }

    public function toArray(): array
    {
        $data = [
            'title' => $this->name, // Map name to title for database
            'description' => $this->description,
            'lead_id' => $this->leadId,
            'product_id' => $this->productId,
            'assigned_to' => $this->managerId ?? 1, // Default to first user if not provided
            'status' => $this->status ?? 'pending', // Default status untuk project baru
            'estimated_value' => $this->estimatedValue,
            'expected_start_date' => $this->startDate,
            'expected_completion_date' => $this->endDate,
            'notes' => $this->notes,
        ];

        if ($this->id !== null) {
            $data['id'] = $this->id;
        }

        return array_filter($data, fn($value) => $value !== null);
    }

    public function validate(): array
    {
        $errors = [];

        if (empty($this->name)) {
            $errors['name'] = 'Project name is required';
        }

        if (empty($this->description)) {
            $errors['description'] = 'Project description is required';
        }

        if ($this->leadId <= 0) {
            $errors['lead_id'] = 'Valid lead ID is required';
        }

        if ($this->productId <= 0) {
            $errors['product_id'] = 'Valid product ID is required';
        }

        if ($this->status && !in_array($this->status, ['pending', 'in_progress', 'waiting_approval', 'approved', 'rejected', 'completed'])) {
            $errors['status'] = 'Invalid project status';
        }

        if ($this->startDate && $this->endDate) {
            if (strtotime($this->startDate) >= strtotime($this->endDate)) {
                $errors['end_date'] = 'End date must be after start date';
            }
        }

        return $errors;
    }

    public function isPendingApproval(): bool
    {
        return ($this->status ?? 'pending') === 'waiting_approval';
    }

    public function isApproved(): bool
    {
        return ($this->status ?? 'pending') === 'approved';
    }

    public function isCompleted(): bool
    {
        return ($this->status ?? 'pending') === 'completed';
    }
}
