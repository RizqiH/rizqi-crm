<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'address',
        'source',
        'status',
        'notes',
        'assigned_to'
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }
}
