<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('survey_id')->constrained('surveys')->cascadeOnDelete();

            // Respondent Data
            $table->string('respondent_email')->index()->nullable();
            $table->string('respondent_phone')->nullable();
            $table->string('respondent_name')->nullable();

            // Core Response Data
            $table->json('responses')->nullable();
            $table->string('submission_status')->default('completed');

            // Demographics & UTMs
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('geo_country')->nullable();
            $table->string('geo_region')->nullable();
            $table->string('geo_city')->nullable();

            // Meta
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
    }
};
