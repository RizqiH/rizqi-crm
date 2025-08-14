<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerService extends Model
{
    protected $fillable = [
        'customer_id',
        'product_id',
        'service_number',
        'status',
        'activation_date',
        'expiry_date',
        'monthly_fee',
        'installation_notes',
        'technical_notes'
    ];

    protected $casts = [
        'activation_date' => 'date',
        'expiry_date' => 'date',
        'monthly_fee' => 'decimal:2'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function generateServiceNumber(): string
    {
        $prefix = 'SVC';
        $date = now()->format('Ym');
        $lastService = static::whereMonth('created_at', now()->month)
                           ->whereYear('created_at', now()->year)
                           ->latest('id')
                           ->first();
        $sequence = $lastService ? (intval(substr($lastService->service_number, -4)) + 1) : 1;

        return $prefix . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
