<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NumuSurveyApiService;
use App\Models\Survey;
use App\Models\SurveyResponse;

class SyncNumuData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'numu:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize survey templates and responses from the NUMU API into the local database.';

    /**
     * Execute the console command.
     */
    public function handle(NumuSurveyApiService $apiService)
    {
        $this->info('Starting NUMU Data Sync...');

        // 1. Fetch Surveys
        $this->info('Fetching survey templates...');
        $surveys = $apiService->getSurveys();

        $syncedSurveysCount = 0;

        foreach ($surveys as $surveyData) {
            Survey::updateOrCreate(
                ['id' => $surveyData['id']],
                [
                    'slug' => $surveyData['slug'] ?? null,
                    'title' => $surveyData['title'] ?? 'Untitled Survey',
                    'description' => $surveyData['description'] ?? null,
                    'is_active' => $surveyData['is_active'] ?? true,
                    'allow_multiple_submissions' => $surveyData['allow_multiple_submissions'] ?? false,
                    'requires_auth' => $surveyData['requires_auth'] ?? false,
                    'published_at' => isset($surveyData['published_at']) ? \Carbon\Carbon::parse($surveyData['published_at']) : null,
                    'expires_at' => isset($surveyData['expires_at']) ? \Carbon\Carbon::parse($surveyData['expires_at']) : null,
                ]
            );
            $syncedSurveysCount++;
        }

        $this->info("Successfully synced {$syncedSurveysCount} survey templates.");

        // 2. Fetch Responses
        $this->info('Fetching survey responses...');
        // We traverse all responses from the mock API.
        $responses = $apiService->getAllResponses();

        $syncedResponsesCount = 0;

        $this->withProgressBar($responses, function ($responseData) use (&$syncedResponsesCount) {
            SurveyResponse::updateOrCreate(
                ['id' => $responseData['id']],
                [
                    'survey_id' => $responseData['survey_id'],
                    'respondent_email' => $responseData['respondent_email'] ?? null,
                    'respondent_phone' => $responseData['respondent_phone'] ?? null,
                    'respondent_name' => $responseData['respondent_name'] ?? null,
                    'responses' => $responseData['responses'] ?? null,
                    'submission_status' => $responseData['submission_status'] ?? 'completed',
                    'utm_source' => $responseData['utm_source'] ?? null,
                    'utm_medium' => $responseData['utm_medium'] ?? null,
                    'utm_campaign' => $responseData['utm_campaign'] ?? null,
                    'geo_country' => $responseData['geo_country'] ?? null,
                    'geo_region' => $responseData['geo_region'] ?? null,
                    'geo_city' => $responseData['geo_city'] ?? null,
                    'ip_address' => $responseData['ip_address'] ?? null,
                    'user_agent' => $responseData['user_agent'] ?? null,
                    'created_at' => isset($responseData['created_at']) ? \Carbon\Carbon::parse($responseData['created_at']) : null,
                    'updated_at' => isset($responseData['updated_at']) ? \Carbon\Carbon::parse($responseData['updated_at']) : null,
                ]
            );
            $syncedResponsesCount++;
        });

        $this->newLine();
        $this->info("Successfully synced {$syncedResponsesCount} survey responses.");
        $this->info('NUMU Data Sync Complete!');

        return Command::SUCCESS;
    }
}
