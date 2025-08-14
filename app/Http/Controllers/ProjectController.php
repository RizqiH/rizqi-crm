<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use App\DTOs\ProjectFilterDTO;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Lead;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = ProjectFilterDTO::fromRequest($request->all());
        $projects = $this->projectService->getAllProjects($filters);

        // Format pagination data explicitly for Inertia
        $paginatedProjects = [
            'data' => $projects->items(),
            'links' => $projects->linkCollection()->toArray(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'from' => $projects->firstItem(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'to' => $projects->lastItem(),
                'total' => $projects->total(),
            ]
        ];

        return Inertia::render('Projects/Index', [
            'projects' => $paginatedProjects,
            'filters' => $filters->toArray(),
            'leads' => Lead::select('id', 'name', 'company')->get(),
            'products' => Product::select('id', 'name')->get(),
            'users' => User::where('role', 'manager')->get(['id', 'name'])
        ]);
    }

    /**
     * Show pending approval projects for managers.
     */
    public function pendingApproval(): Response
    {
        // Double check: Only manager and admin can view pending approvals
        $user = Auth::user();
        if (!in_array($user->role, ['manager', 'admin'])) {
            abort(403, 'Only managers and admins can view pending approvals.');
        }

        $projects = $this->projectService->getPendingApprovalProjects();

        return Inertia::render('Projects/PendingApproval', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $leads = Lead::select('id', 'name', 'company')->get();
        $products = Product::select('id', 'name', 'price')->get();
        $managers = User::where('role', 'manager')->select('id', 'name')->get();

        $selectedLead = null;
        if ($request->has('lead_id')) {
            $selectedLead = Lead::find($request->get('lead_id'));
        }

        return Inertia::render('Projects/Create', [
            'leads' => $leads,
            'products' => $products,
            'managers' => $managers,
            'selectedLead' => $selectedLead
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->projectService->createProject($request->toDTO());

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        $projectWithRelations = $this->projectService->getProjectById($project->id);

        return Inertia::render('Projects/Show', [
            'project' => $projectWithRelations
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {
        $leads = Lead::select('id', 'name', 'company')->get();
        $products = Product::select('id', 'name', 'price')->get();
        $managers = User::where('role', 'manager')->select('id', 'name')->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'leads' => $leads,
            'products' => $products,
            'managers' => $managers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->projectService->updateProject($project->id, $request->toDTO());

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->projectService->deleteProject($project->id);

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * Submit project for manager approval.
     */
    public function submitForApproval(Project $project): RedirectResponse
    {
        try {
            $this->projectService->submitForApproval($project->id);
            return redirect()->route('projects.show', $project->id)
                ->with('success', 'Project submitted for approval successfully.');
        } catch (\Exception $e) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Approve a project (manager only).
     */
    public function approve(Request $request, Project $project): RedirectResponse
    {
        // Double check: Only manager and admin can approve
        $user = Auth::user();
        if (!in_array($user->role, ['manager', 'admin'])) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', 'Only managers and admins can approve projects.');
        }

        try {
            $managerId = Auth::id();
            $this->projectService->approveProject($project->id, $managerId);

            return redirect()->route('projects.show', $project->id)
                ->with('success', 'Project approved successfully.');
        } catch (\Exception $e) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Reject a project (manager only).
     */
    public function reject(Request $request, Project $project): RedirectResponse
    {
        // Double check: Only manager and admin can reject
        $user = Auth::user();
        if (!in_array($user->role, ['manager', 'admin'])) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', 'Only managers and admins can reject projects.');
        }

        $request->validate([
            'reason' => 'nullable|string|max:1000'
        ]);

        try {
            $managerId = Auth::id();
            $this->projectService->rejectProject(
                $project->id,
                $managerId,
                $request->get('reason')
            );

            return redirect()->route('projects.show', $project->id)
                ->with('success', 'Project rejected.');
        } catch (\Exception $e) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Mark project as completed.
     */
    public function complete(Project $project): RedirectResponse
    {
        try {
            $this->projectService->completeProject($project->id);
            return redirect()->route('projects.show', $project->id)
                ->with('success', 'Project marked as completed.');
        } catch (\Exception $e) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', $e->getMessage());
        }
    }
}
