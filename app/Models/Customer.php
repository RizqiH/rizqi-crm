<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'customer_code',
        'name',
        'email',
        'phone',
        'company',
        'billing_address',
        'installation_address',
        'status',
        'registration_date',
        'lead_id',
        'notes'
    ];

    protected $casts = [
        'registration_date' => 'date'
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(CustomerService::class);
    }

    public static function generateCustomerCode(): string
    {
        $prefix = 'SMART';
        $date = now()->format('Ymd');
        
        // Get the highest customer code for today
        $lastCustomer = static::where('customer_code', 'LIKE', $prefix . $date . '%')
            ->orderBy('customer_code', 'desc')
            ->first();
        
        $sequence = 1;
        if ($lastCustomer) {
            $lastSequence = intval(substr($lastCustomer->customer_code, -3));
            $sequence = $lastSequence + 1;
        }

        return $prefix . $date . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
