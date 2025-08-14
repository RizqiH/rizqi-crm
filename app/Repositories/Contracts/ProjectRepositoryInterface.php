<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use App\DTOs\ProjectFilterDTO;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProjectRepositoryInterface
{
    public function findById(int $id): ?Project;

    public function findByIdWithRelations(int $id): ?Project;

    public function getAllPaginated(ProjectFilterDTO $filters): LengthAwarePaginator;

    public function getAll(): Collection;

    public function create(array $data): Project;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function getByStatus(string $status): Collection;

    public function getPendingApproval(): Collection;

    public function getByManager(int $managerId): Collection;
}
