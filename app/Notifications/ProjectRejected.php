<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectRejected extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Project $project,
        private User $manager,
        private ?string $reason = null
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Project Rejected - ' . $this->project->name)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Unfortunately, your project has been rejected by ' . $this->manager->name . '.')
            ->line('**Project:** ' . $this->project->name)
            ->line('**Rejected by:** ' . $this->manager->name);

        if ($this->reason) {
            $message->line('**Reason:** ' . $this->reason);
        }

        return $message
            ->action('View Project', url('/projects/' . $this->project->id))
            ->line('Please review the feedback and make necessary adjustments before resubmitting.')
            ->salutation('Best regards, PT. Smart CRM System');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'project_rejected',
            'project_id' => $this->project->id,
            'project_name' => $this->project->name,
            'manager_name' => $this->manager->name,
            'reason' => $this->reason,
            'message' => "Project '{$this->project->name}' has been rejected by {$this->manager->name}"
        ];
    }
}
