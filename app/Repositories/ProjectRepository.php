<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\DTOs\ProjectFilterDTO;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

class ProjectRepository extends BaseRepository implements ProjectRepositoryInterface
{
    public function __construct(Project $model)
    {
        parent::__construct($model);
    }

    public function findById(int $id): ?Project
    {
        return $this->model->find($id);
    }

    public function findByIdWithRelations(int $id): ?Project
    {
        return $this->model
            ->with(['lead', 'product', 'assignedTo', 'approvedBy'])
            ->find($id);
    }

    public function getAllPaginated(ProjectFilterDTO $filters): LengthAwarePaginator
    {
        $query = $this->model
            ->with(['lead', 'product', 'assignedTo', 'approvedBy'])
            ->select('projects.*');

        $this->applyFilters($query, $filters);

        return $query
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function getAll(): Collection
    {
        return $this->model
            ->with(['lead', 'product', 'assignedTo', 'approvedBy'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Project
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->where('id', $id)->delete();
    }

    public function getByStatus(string $status): Collection
    {
        return $this->model
            ->with(['lead', 'product', 'assignedTo', 'approvedBy'])
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getPendingApproval(): Collection
    {
        return $this->getByStatus('waiting_approval');
    }

    public function getByManager(int $managerId): Collection
    {
        return $this->model
            ->with(['lead', 'product'])
            ->where('assigned_to', $managerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    private function applyFilters(Builder $query, ProjectFilterDTO $filters): void
    {
        if ($filters->hasSearch()) {
            $search = $filters->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhereHas('lead', function ($leadQuery) use ($search) {
                      $leadQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('company', 'like', "%{$search}%");
                  })
                  ->orWhereHas('product', function ($productQuery) use ($search) {
                      $productQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($filters->hasStatus()) {
            $query->where('status', $filters->status);
        }

        if ($filters->leadId) {
            $query->where('lead_id', $filters->leadId);
        }

        if ($filters->productId) {
            $query->where('product_id', $filters->productId);
        }

        if ($filters->managerId) {
            $query->where('assigned_to', $filters->managerId);
        }

        if ($filters->hasDateRange()) {
            $query->whereBetween('created_at', [
                $filters->dateFrom . ' 00:00:00',
                $filters->dateTo . ' 23:59:59'
            ]);
        }
    }
}
