<?php

namespace App\Http\Controllers;

use App\Services\LeadService;
use App\DTOs\LeadFilterDTO;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class LeadController extends Controller
{
    public function __construct(
        private LeadService $leadService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = LeadFilterDTO::fromRequest($request->only(['search', 'status', 'assigned_to']));
        $leads = $this->leadService->getAllLeads($filters);

        $users = User::where('role', 'sales')->get(['id', 'name']);

        // Format pagination data explicitly for Inertia
        $paginatedLeads = [
            'data' => $leads->items(),
            'links' => $leads->linkCollection()->toArray(),
            'meta' => [
                'current_page' => $leads->currentPage(),
                'from' => $leads->firstItem(),
                'last_page' => $leads->lastPage(),
                'per_page' => $leads->perPage(),
                'to' => $leads->lastItem(),
                'total' => $leads->total(),
            ]
        ];

        return Inertia::render('Leads/Index', [
            'leads' => $paginatedLeads,
            'users' => $users,
            'filters' => $filters->toArray()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $users = User::where('role', 'sales')->get(['id', 'name']);

        return Inertia::render('Leads/Create', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $this->leadService->createLead($request->toDTO());

        return redirect()->route('leads.index')
            ->with('success', 'Lead created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead): Response
    {
        $leadWithRelations = $this->leadService->getLeadById($lead->id);

        return Inertia::render('Leads/Show', [
            'lead' => $leadWithRelations
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lead $lead): Response
    {
        $users = User::where('role', 'sales')->get(['id', 'name']);

        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, Lead $lead): RedirectResponse
    {
        $this->leadService->updateLead($lead->id, $request->toDTO());

        return redirect()->route('leads.index')
            ->with('success', 'Lead updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead): RedirectResponse
    {
        $this->leadService->deleteLead($lead->id);

        return redirect()->route('leads.index')
            ->with('success', 'Lead deleted successfully.');
    }
}
