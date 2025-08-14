<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'lead_id',
        'product_id',
        'assigned_to',
        'status',
        'estimated_value',
        'expected_start_date',
        'expected_completion_date',
        'notes',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'estimated_value' => 'decimal:2',
        'expected_start_date' => 'date',
        'expected_completion_date' => 'date',
        'approved_at' => 'datetime'
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
