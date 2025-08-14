<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectSubmittedForApproval extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Project $project,
        private User $submitter
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Project Awaiting Your Approval')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new project has been submitted for your approval.')
            ->line('**Project:** ' . $this->project->name)
            ->line('**Submitted by:** ' . $this->submitter->name)
            ->line('**Estimated Value:** $' . number_format((float)$this->project->estimated_value, 2))
            ->line('**Description:** ' . $this->project->description)
            ->action('Review Project', url('/projects/' . $this->project->id))
            ->line('Please review and approve or reject this project at your earliest convenience.')
            ->salutation('Best regards, PT. Smart CRM System');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'project_submitted',
            'project_id' => $this->project->id,
            'project_name' => $this->project->name,
            'submitter_name' => $this->submitter->name,
            'estimated_value' => $this->project->estimated_value,
            'message' => "New project '{$this->project->name}' submitted by {$this->submitter->name} awaiting approval"
        ];
    }
}
