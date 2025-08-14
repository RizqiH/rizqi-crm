<?php

namespace App\Services;

use App\Repositories\Contracts\LeadRepositoryInterface;
use App\DTOs\LeadDTO;
use App\DTOs\LeadFilterDTO;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LeadService
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository
    ) {}

    public function getAllLeads(LeadFilterDTO $filters): LengthAwarePaginator
    {
        return $this->leadRepository->searchLeads($filters->toArray());
    }

    public function getLeadById(int $id)
    {
        return $this->leadRepository->getLeadWithRelations($id);
    }

    public function createLead(LeadDTO $leadData)
    {
        return $this->leadRepository->create($leadData->toArray());
    }

    public function updateLead(int $id, LeadDTO $leadData): bool
    {
        return $this->leadRepository->update($id, $leadData->toArray());
    }

    public function deleteLead(int $id): bool
    {
        return $this->leadRepository->delete($id);
    }

    public function getLeadsByStatus(string $status): Collection
    {
        return $this->leadRepository->getLeadsByStatus($status);
    }

    public function getQualifiedLeads(): Collection
    {
        return $this->leadRepository->getQualifiedLeads();
    }

    public function assignLead(int $leadId, int $userId): bool
    {
        return $this->leadRepository->update($leadId, ['assigned_to' => $userId]);
    }
}
