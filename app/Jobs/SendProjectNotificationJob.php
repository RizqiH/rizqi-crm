<?php

namespace App\Jobs;

use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectSubmittedForApproval;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendProjectNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private Project $project,
        private User $manager,
        private string $notificationType
    ) {}

    public function handle(): void
    {
        switch ($this->notificationType) {
            case 'submit_for_approval':
                $this->manager->notify(new ProjectSubmittedForApproval($this->project, auth()->user()));
                break;
            // Add other notification types as needed
        }
    }
}
