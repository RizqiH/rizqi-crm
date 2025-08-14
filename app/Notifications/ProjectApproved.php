<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Project $project,
        private User $manager
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Project Approved - ' . $this->project->name)
            ->greeting('Congratulations ' . $notifiable->name . '!')
            ->line('Your project has been approved by ' . $this->manager->name . '.')
            ->line('**Project:** ' . $this->project->name)
            ->line('**Approved by:** ' . $this->manager->name)
            ->line('**Estimated Value:** $' . number_format((float)$this->project->estimated_value, 2))
            ->action('View Project', url('/projects/' . $this->project->id))
            ->line('You can now proceed with project execution.')
            ->salutation('Best regards, PT. Smart CRM System');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'project_approved',
            'project_id' => $this->project->id,
            'project_name' => $this->project->name,
            'manager_name' => $this->manager->name,
            'message' => "Project '{$this->project->name}' has been approved by {$this->manager->name}"
        ];
    }
}
