<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MitigationScenario extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'classroom_id', 'level', 'disaster_type', 'title', 'correct_order', 'actions'];

    protected $casts = [
        'correct_order' => 'array',
        'actions' => 'array',
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}
