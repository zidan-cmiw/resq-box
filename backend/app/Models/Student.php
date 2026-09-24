<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['name', 'classroom_id', 'mission_completed_ids', 'mitigation_scores'];

    protected $casts = [
        'mission_completed_ids' => 'array',
        'mitigation_scores' => 'array',
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}
