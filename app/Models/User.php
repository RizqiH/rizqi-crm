<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function assignedLeads(): HasMany
    {
        return $this->hasMany(Lead::class, 'assigned_to');
    }

    public function assignedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'assigned_to');
    }

    public function approvedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'approved_by');
    }

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if user has role access with hierarchy.
     * Admin can access manager, sales, support
     * Manager can access sales, support
     * Sales can access support
     */
    public function hasRoleAccess(string $requiredRole): bool
    {
        $roleHierarchy = [
            'admin' => ['admin', 'manager', 'sales', 'support'],
            'manager' => ['manager', 'sales', 'support'],
            'sales' => ['sales', 'support'],
            'support' => ['support']
        ];

        return isset($roleHierarchy[$this->role]) &&
               in_array($requiredRole, $roleHierarchy[$this->role]);
    }

    /**
     * Check if user can access any of the given roles with hierarchy.
     */
    public function hasAnyRoleAccess(array $requiredRoles): bool
    {
        foreach ($requiredRoles as $role) {
            if ($this->hasRoleAccess($role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->getPermissions()->contains($permission);
    }

    /**
     * Get all permissions for the user's role.
     */
    public function getPermissions(): \Illuminate\Support\Collection
    {
        $permissions = [
            'admin' => [
                'users.view', 'users.create', 'users.edit', 'users.delete',
                'products.view', 'products.create', 'products.edit', 'products.delete',
                'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
                'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
                'projects.approve', 'projects.reject',
                'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
                'customers.manage-services',
                'reports.view', 'reports.export'
            ],
            'manager' => [
                'products.view', 'products.create', 'products.edit',
                'leads.view', 'leads.create', 'leads.edit',
                'projects.view', 'projects.create', 'projects.edit',
                'projects.approve', 'projects.reject',
                'customers.view', 'customers.create', 'customers.edit',
                'customers.manage-services',
                'reports.view'
            ],
            'sales' => [
                'products.view',
                'leads.view', 'leads.create', 'leads.edit',
                'projects.view', 'projects.create', 'projects.edit',
                'customers.view', 'customers.create', 'customers.edit',
                'customers.manage-services'
            ],
            'support' => [
                'products.view',
                'leads.view',
                'projects.view',
                'customers.view', 'customers.edit',
                'customers.manage-services'
            ]
        ];

        return collect($permissions[$this->role] ?? []);
    }

    /**
     * Check if user is sales.
     */
    public function isSales(): bool
    {
        return $this->role === 'sales';
    }

    /**
     * Check if user is support.
     */
    public function isSupport(): bool
    {
        return $this->role === 'support';
    }
}
