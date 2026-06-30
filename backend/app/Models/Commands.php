<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commands extends Model
{
    /** @use HasFactory<\Database\Factories\CommandsFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'status',
        'total',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'command_product', 'command_id', 'product_id')
            ->withPivot('quantity', 'unit_price')
            ->withTimestamps();
    }
}
