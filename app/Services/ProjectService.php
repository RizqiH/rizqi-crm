<?php

namespace App\Services;

use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\DTOs\ProjectDTO;
use App\DTOs\ProjectFilterDTO;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectSubmittedForApproval;
use App\Notifications\ProjectApproved;
use App\Notifications\ProjectRejected;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;
use Exception;

class ProjectService
{
    public function __construct(
        private ProjectRepositoryInterface $projectRepository
    ) {}

    public function getAllProjects(ProjectFilterDTO $filters): LengthAwarePaginator
    {
        return $this->projectRepository->getAllPaginated($filters);
    }

    public function getProjectById(int $id): ?Project
    {
        return $this->projectRepository->findByIdWithRelations($id);
    }

    public function createProject(ProjectDTO $projectDTO): Project
    {
        $validationErrors = $projectDTO->validate();
        if (!empty($validationErrors)) {
            throw new Exception('Validation failed: ' . implode(', ', $validationErrors));
        }

        $data = $projectDTO->toArray();

        // Set default status if not provided
        if (!isset($data['status'])) {
            $data['status'] = 'planning';
        }

        return $this->projectRepository->create($data);
    }

    public function updateProject(int $id, ProjectDTO $projectDTO): bool
    {
        $validationErrors = $projectDTO->validate();
        if (!empty($validationErrors)) {
            throw new Exception('Validation failed: ' . implode(', ', $validationErrors));
        }

        return $this->projectRepository->update($id, $projectDTO->toArray());
    }

    public function deleteProject(int $id): bool
    {
        return $this->projectRepository->delete($id);
    }

    public function submitForApproval(int $id): bool
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            throw new Exception('Project not found');
        }

        if ($project->status !== 'planning' && $project->status !== 'in_progress') {
            throw new Exception('Project cannot be submitted for approval in current status');
        }

        $updated = $this->projectRepository->update($id, ['status' => 'pending_approval']);

        if ($updated && $project->manager_id) {
            // Send notification to manager
            $manager = User::find($project->manager_id);
            $submitter = User::find($project->created_by ?? Auth::id());

            if ($manager && $submitter) {
                $manager->notify(new ProjectSubmittedForApproval($project, $submitter));
            }
        }

        return $updated;
    }

    public function approveProject(int $id, int $managerId): bool
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            throw new Exception('Project not found');
        }

        if ($project->status !== 'pending_approval') {
            throw new Exception('Project is not pending approval');
        }

        // Check if the manager is authorized (you can add role checking here)
        $updated = $this->projectRepository->update($id, [
            'status' => 'approved',
            'manager_id' => $managerId,
            'approved_at' => now()
        ]);

        if ($updated) {
            // Send notification to project creator
            $manager = User::find($managerId);
            $creator = User::find($project->created_by);

            if ($manager && $creator) {
                $creator->notify(new ProjectApproved($project, $manager));
            }
        }

        return $updated;
    }

    public function rejectProject(int $id, int $managerId, ?string $reason = null): bool
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            throw new Exception('Project not found');
        }

        if ($project->status !== 'pending_approval') {
            throw new Exception('Project is not pending approval');
        }

        $updateData = [
            'status' => 'rejected',
            'manager_id' => $managerId,
            'rejected_at' => now()
        ];

        if ($reason) {
            $updateData['rejection_reason'] = $reason;
        }

        $updated = $this->projectRepository->update($id, $updateData);

        if ($updated) {
            // Send notification to project creator
            $manager = User::find($managerId);
            $creator = User::find($project->created_by);

            if ($manager && $creator) {
                $creator->notify(new ProjectRejected($project, $manager, $reason));
            }
        }

        return $updated;
    }

    public function completeProject(int $id): bool
    {
        $project = $this->projectRepository->findById($id);

        if (!$project) {
            throw new Exception('Project not found');
        }

        if ($project->status !== 'approved') {
            throw new Exception('Only approved projects can be completed');
        }

        return $this->projectRepository->update($id, [
            'status' => 'completed',
            'completed_at' => now()
        ]);
    }

    public function getPendingApprovalProjects(): Collection
    {
        return $this->projectRepository->getPendingApproval();
    }

    public function getProjectsByManager(int $managerId): Collection
    {
        return $this->projectRepository->getByManager($managerId);
    }

    public function getProjectsByStatus(string $status): Collection
    {
        return $this->projectRepository->getByStatus($status);
    }

    public function getProjectStats(): array
    {
        $allProjects = $this->projectRepository->getAll();

        return [
            'total' => $allProjects->count(),
            'planning' => $allProjects->where('status', 'planning')->count(),
            'in_progress' => $allProjects->where('status', 'in_progress')->count(),
            'pending_approval' => $allProjects->where('status', 'pending_approval')->count(),
            'approved' => $allProjects->where('status', 'approved')->count(),
            'rejected' => $allProjects->where('status', 'rejected')->count(),
            'completed' => $allProjects->where('status', 'completed')->count(),
        ];
    }
}
