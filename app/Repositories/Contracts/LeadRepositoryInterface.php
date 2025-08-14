<?php

namespace App\Repositories\Contracts;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface LeadRepositoryInterface extends BaseRepositoryInterface
{
    public function getLeadsByStatus(string $status): Collection;

    public function searchLeads(array $filters): LengthAwarePaginator;

    public function getLeadWithRelations(int $id): ?Lead;

    public function getLeadsAssignedTo(int $userId): Collection;

    public function getQualifiedLeads(): Collection;
}
