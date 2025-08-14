<?php

namespace App\Services;

use App\Models\SupportTicket;
use App\Models\Customer;
use App\Repositories\SupportTicketRepository;
use App\DTOs\SupportTicketDTO;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SupportTicketService
{
    public function __construct(
        private SupportTicketRepository $ticketRepository
    ) {}

    public function createTicket(SupportTicketDTO $ticketDTO): SupportTicket
    {
        return $this->ticketRepository->create($ticketDTO);
    }

    public function updateTicket(SupportTicket $ticket, SupportTicketDTO $ticketDTO): SupportTicket
    {
        return $this->ticketRepository->update($ticket, $ticketDTO);
    }

    public function getCustomerTickets(Customer $customer, array $filters = []): LengthAwarePaginator
    {
        return $this->ticketRepository->getByCustomer($customer, $filters);
    }

    public function getAllTickets(array $filters = []): LengthAwarePaginator
    {
        return $this->ticketRepository->getAllPaginated($filters);
    }

    public function assignTicket(SupportTicket $ticket, int $userId): SupportTicket
    {
        return $this->ticketRepository->assign($ticket, $userId);
    }

    public function resolveTicket(SupportTicket $ticket, string $resolutionNotes): SupportTicket
    {
        return $this->ticketRepository->resolve($ticket, $resolutionNotes);
    }

    public function closeTicket(SupportTicket $ticket): SupportTicket
    {
        return $this->ticketRepository->close($ticket);
    }

    public function getTicketStats(): array
    {
        return [
            'total' => SupportTicket::count(),
            'open' => SupportTicket::where('status', 'open')->count(),
            'in_progress' => SupportTicket::where('status', 'in_progress')->count(),
            'resolved' => SupportTicket::where('status', 'resolved')->count(),
            'closed' => SupportTicket::where('status', 'closed')->count(),
            'high_priority' => SupportTicket::whereIn('priority', ['high', 'urgent'])->whereNotIn('status', ['resolved', 'closed'])->count(),
            'avg_resolution_time' => $this->getAverageResolutionTime()
        ];
    }

    private function getAverageResolutionTime(): float
    {
        $resolvedTickets = SupportTicket::whereNotNull('resolved_at')->get();
        
        if ($resolvedTickets->isEmpty()) {
            return 0;
        }

        $totalTime = $resolvedTickets->sum(function ($ticket) {
            return $ticket->created_at->diffInHours($ticket->resolved_at);
        });

        return round($totalTime / $resolvedTickets->count(), 2);
    }

    public function escalateTicket(SupportTicket $ticket): SupportTicket
    {
        $newPriority = match ($ticket->priority) {
            'low' => 'medium',
            'medium' => 'high',
            'high' => 'urgent',
            'urgent' => 'urgent'
        };

        $ticketDTO = new SupportTicketDTO(
            customerId: $ticket->customer_id,
            subject: $ticket->subject,
            description: $ticket->description,
            priority: $newPriority,
            status: $ticket->status,
            category: $ticket->category
        );

        return $this->ticketRepository->update($ticket, $ticketDTO);
    }
}
