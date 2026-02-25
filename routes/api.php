<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AnalyticsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('analytics')->group(function () {
    Route::get('/dissemination', [AnalyticsController::class, 'getDisseminationMetrics']);
    Route::get('/geographic', [AnalyticsController::class, 'getGeographicInsights']);
    Route::get('/interests', [AnalyticsController::class, 'getInterestInsights']);
    Route::get('/learner/{email}', [AnalyticsController::class, 'getUnifiedLearnerProfile']);
});

// Quick DB count check
Route::get('/count', function () {
    return response()->json([
        'survey_responses' => \App\Models\SurveyResponse::count(),
        'surveys' => \App\Models\Survey::count(),
    ]);
});


// Browser-triggered full sync: wipes tables and re-fetches all live data
Route::get('/sync', function () {
    $apiKey = config('services.numu.api_key');
    $baseUrl = config('services.numu.base_url');

    if (!$apiKey || !$baseUrl) {
        return response()->json(['error' => 'API key or base URL not configured'], 500);
    }

    $client = \Illuminate\Support\Facades\Http::withHeaders(['x-api-key' => $apiKey])
        ->baseUrl($baseUrl);

    // 1. Wipe existing data
    \App\Models\SurveyResponse::truncate();
    \App\Models\Survey::truncate();

    // 2. Fetch & insert surveys
    $surveysResp = $client->get('/surveys');
    $surveys = $surveysResp->successful() ? ($surveysResp->json('data.surveys') ?? []) : [];
    foreach ($surveys as $s) {
        \App\Models\Survey::updateOrCreate(['id' => $s['id']], [
            'slug' => $s['slug'] ?? null,
            'title' => $s['title'] ?? 'Untitled',
            'description' => $s['description'] ?? null,
            'is_active' => $s['is_active'] ?? true,
            'allow_multiple_submissions' => $s['allow_multiple_submissions'] ?? false,
            'requires_auth' => $s['requires_auth'] ?? false,
            'published_at' => isset($s['published_at']) ? \Carbon\Carbon::parse($s['published_at']) : null,
            'expires_at' => isset($s['expires_at']) ? \Carbon\Carbon::parse($s['expires_at']) : null,
        ]);
    }

    // 3. Fetch all pages of responses
    $page = 1;
    $totalInserted = 0;
    do {
        $resp = $client->get('/responses', ['page' => $page]);
        if (!$resp->successful())
            break;

        $respData = $resp->json('data') ?? [];
        $records = $respData['responses'] ?? [];
        $pagination = $respData['pagination'] ?? [];

        if (empty($records))
            break;

        foreach ($records as $r) {
            \App\Models\SurveyResponse::updateOrCreate(['id' => $r['id']], [
                'survey_id' => $r['survey_id'],
                'respondent_email' => $r['respondent_email'] ?? null,
                'respondent_phone' => $r['respondent_phone'] ?? null,
                'respondent_name' => $r['respondent_name'] ?? null,
                'responses' => json_encode($r['responses'] ?? []),
                'submission_status' => $r['submission_status'] ?? 'completed',
                'utm_source' => $r['utm_source'] ?? null,
                'utm_medium' => $r['utm_medium'] ?? null,
                'utm_campaign' => $r['utm_campaign'] ?? null,
                'geo_country' => $r['geo_country'] ?? null,
                'geo_region' => $r['geo_region'] ?? null,
                'geo_city' => $r['geo_city'] ?? null,
                'ip_address' => $r['ip_address'] ?? null,
                'user_agent' => $r['user_agent'] ?? null,
                'created_at' => isset($r['created_at']) ? \Carbon\Carbon::parse($r['created_at']) : now(),
                'updated_at' => isset($r['updated_at']) ? \Carbon\Carbon::parse($r['updated_at']) : now(),
            ]);
            $totalInserted++;
        }

        $hasNextPage = $pagination['hasNextPage'] ?? false;
        $page++;
    } while ($hasNextPage);

    return response()->json([
        'status' => 'ok',
        'surveys' => count($surveys),
        'responses' => $totalInserted,
        'message' => "Synced {$totalInserted} responses across " . ($page - 1) . " page(s).",
    ]);
});


// Map raw access_channel values to human-readable sector labels
function mapSector(?string $raw): ?string
{
    if (!$raw)
        return null;
    return match (strtolower(trim($raw))) {
        'university', 'universities' => 'Universities',
        'syndicate', 'syndicates' => 'Syndicates',
        'public_sector', 'public sector', 'public' => 'Public Sector',
        'ngo', 'ngos' => 'NGOs',
        'employer', 'employers', 'company' => 'Employers',
        default => null,
    };
}

// A route for the frontend to fetch all raw survey data
Route::get('/responses', function () {
    $responses = \App\Models\SurveyResponse::all();

    $formatted = $responses->map(function ($r) {
        $responsesVal = $r->responses;
        $answers = is_array($responsesVal) ? $responsesVal : json_decode((string) $responsesVal, true);

        $track = null;
        $motivation = null;
        $challenge = null;
        $accessChannel = null;
        $universityName = null;
        $ageRange = null;
        $employmentStatus = null;

        if (is_array($answers)) {
            // Direct field extraction from known survey schema
            $accessChannel = $answers['access_channel'] ?? null;
            $universityName = $answers['university_name'] ?? null;
            $ageRange = $answers['age_range'] ?? null;
            $employmentStatus = $answers['employment_status'] ?? null;

            // training_track is the course/track
            if (isset($answers['training_track'])) {
                $raw = $answers['training_track'];
                $track = is_array($raw) ? implode(', ', $raw) : $raw;
            }

            // learning_reason maps to motivation
            if (isset($answers['learning_reason'])) {
                $raw = $answers['learning_reason'];
                $motivation = is_array($raw) ? implode(', ', $raw) : $raw;
            }

            // Derive challenges from skill self-assessments:
            // If the learner rated themselves "Basic" in a skill area, that is a challenge.
            $skillMap = [
                'digital_literacy_level' => 'Digital Literacy',
                'cybersecurity_level' => 'Cybersecurity',
                'ai_programming_level' => 'AI & Programming',
                'data_skills_level' => 'Data Skills',
            ];
            $challengeParts = [];
            foreach ($skillMap as $field => $label) {
                $level = strtolower(trim($answers[$field] ?? ''));
                if ($level === 'basic' || $level === 'beginner' || $level === 'none') {
                    $challengeParts[] = $label;
                }
            }
            if (!empty($challengeParts)) {
                $challenge = implode(', ', $challengeParts);
            }

            // Fallback: scan keys for track/motivation/challenge
            foreach ($answers as $key => $answer) {
                if (!$track && str_contains(strtolower($key), 'track')) {
                    $track = is_array($answer) ? implode(', ', $answer) : $answer;
                }
                if (!$motivation && str_contains(strtolower($key), 'motivation')) {
                    $motivation = is_array($answer) ? implode(', ', $answer) : $answer;
                }
                if (!$challenge && (str_contains(strtolower($key), 'challenge') || str_contains(strtolower($key), 'difficult'))) {
                    $challenge = is_array($answer) ? implode(', ', $answer) : $answer;
                }
            }
        }

        // Map access_channel to a sector label; fallback to utm_source
        $sector = mapSector($accessChannel) ?? mapSector($r->utm_source);

        return [
            'id' => $r->id,
            'email' => $r->respondent_email,
            'name' => $r->respondent_name,
            'phone' => $r->respondent_phone,
            'region' => $r->geo_region,
            'city' => $r->geo_city,
            'source' => $sector,   // e.g. "Universities", "NGOs"
            'utm_source_raw' => $r->utm_source,
            'university' => $universityName,
            'age_range' => $ageRange,
            'employment_status' => $employmentStatus,
            'track' => $track,
            'motivation' => $motivation,
            'challenge' => $challenge,
            'status' => $r->submission_status,
            'created_at' => $r->created_at,
        ];
    });

    return response()->json($formatted);
});

