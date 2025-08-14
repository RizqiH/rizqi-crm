<?php

namespace App\Repositories;

use App\Models\Lead;
use App\Repositories\Contracts\LeadRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LeadRepository extends BaseRepository implements LeadRepositoryInterface
{
    public function __construct(Lead $model)
    {
        parent::__construct($model);
    }

    public function getLeadsByStatus(string $status): Collection
    {
        return $this->where('status', $status)->get();
    }

    public function searchLeads(array $filters): LengthAwarePaginator
    {
        $this->resetQuery();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $this->query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('company', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $this->where('status', $filters['status']);
        }

        if (!empty($filters['assigned_to'])) {
            $this->where('assigned_to', $filters['assigned_to']);
        }

        return $this->with(['assignedTo'])
                   ->orderBy('created_at', 'desc')
                   ->paginate(10);
    }

    public function getLeadWithRelations(int $id): ?Lead
    {
        return $this->with(['assignedTo', 'projects.product', 'customer.services.product'])
                   ->find($id);
    }

    public function getLeadsAssignedTo(int $userId): Collection
    {
        return $this->where('assigned_to', $userId)->get();
    }

    public function getQualifiedLeads(): Collection
    {
        return $this->whereIn('status', ['qualified', 'proposal', 'negotiation'])
                   ->get(['id', 'name', 'company']);
    }
}
