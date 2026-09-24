<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = ['name', 'code', 'unlocked_mission_category', 'unlocked_mitigation_level'];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function mitigationScenarios()
    {
        return $this->hasMany(MitigationScenario::class);
    }
}
