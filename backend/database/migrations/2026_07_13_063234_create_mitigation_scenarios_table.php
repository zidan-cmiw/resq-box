<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mitigation_scenarios', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('level');
            $table->string('disaster_type');
            $table->string('title');
            $table->json('correct_order');
            $table->json('actions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mitigation_scenarios');
    }
};
