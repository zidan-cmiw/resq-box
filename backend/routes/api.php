<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Student;
use App\Models\Classroom;
use App\Models\MitigationScenario;

// Protect API routes with rate limiting
Route::middleware(['throttle:60,1'])->group(function () {
    // Get classroom settings
    Route::get('/classrooms/{code}/settings', function ($code) {
        $classroom = Classroom::where('code', $code)->first();
        if (!$classroom) {
            return response()->json(['error' => 'Classroom not found'], 404);
        }
        return $classroom;
    });

    // Join a classroom
    Route::post('/students/join', function (Request $request) {
        $request->validate([
            'code' => 'required|string',
            'name' => 'required|string'
        ]);
        
        $classroom = Classroom::where('code', $request->code)->first();
        if (!$classroom) {
            return response()->json(['error' => 'Classroom not found'], 404);
        }
        
        // Find or create student
        $student = Student::firstOrCreate(
            ['classroom_id' => $classroom->id, 'name' => $request->name],
            ['mission_completed_ids' => [], 'mitigation_scores' => []]
        );
        
        return $student;
    });

    // Update mission progress
    Route::post('/students/{student}/mission', function (Request $request, Student $student) {
        $request->validate(['mission_id' => 'required|string']);
        
        $completedIds = $student->mission_completed_ids ?? [];
        if (!in_array($request->mission_id, $completedIds)) {
            $completedIds[] = $request->mission_id;
            $student->update(['mission_completed_ids' => $completedIds]);
        }
        
        return $student;
    });

    // Update mitigation progress
    Route::post('/students/{student}/mitigation', function (Request $request, Student $student) {
        $request->validate([
            'scenario_id' => 'required|string',
            'score' => 'required|numeric'
        ]);
        
        $scores = $student->mitigation_scores ?? [];
        $scores[$request->scenario_id] = $request->score;
        
        $student->update(['mitigation_scores' => $scores]);
        
        return $student;
    });

    // Get mitigations for a specific classroom
    Route::get('/classrooms/{id}/mitigations', function ($id) {
        return MitigationScenario::where('classroom_id', $id)->get();
    });
});
