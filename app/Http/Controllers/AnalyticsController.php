<?php

namespace App\Http\Controllers;

use App\Models\SurveyResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    /**
     * Get dissemination metrics grouped by UTM parameters.
     */
    public function getDisseminationMetrics(Request $request)
    {
        $surveyId = $request->query('survey_id');

        $responsesQuery = SurveyResponse::when($surveyId, function ($query, $id) {
            return $query->where('survey_id', $id);
        });

        $metrics = [
            'total_responses' => (clone $responsesQuery)->count(),
            'by_source' => (clone $responsesQuery)->selectRaw('utm_source, count(*) as count')->groupBy('utm_source')->pluck('count', 'utm_source')->toArray(),
            'by_medium' => (clone $responsesQuery)->selectRaw('utm_medium, count(*) as count')->groupBy('utm_medium')->pluck('count', 'utm_medium')->toArray(),
            'by_campaign' => (clone $responsesQuery)->selectRaw('utm_campaign, count(*) as count')->groupBy('utm_campaign')->pluck('count', 'utm_campaign')->toArray(),
            'top_channels' => (clone $responsesQuery)
                ->selectRaw('COALESCE(utm_source, "unknown") || " / " || COALESCE(utm_medium, "unknown") as channel, count(*) as count')
                ->groupByRaw('COALESCE(utm_source, "unknown") || " / " || COALESCE(utm_medium, "unknown")')
                ->orderByDesc('count')
                ->limit(5)
                ->pluck('count', 'channel')
                ->toArray(),
        ];

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }

    /**
     * Get geographic distribution of the respondents.
     */
    public function getGeographicInsights(Request $request)
    {
        $surveyId = $request->query('survey_id');

        $responsesQuery = SurveyResponse::when($surveyId, function ($query, $id) {
            return $query->where('survey_id', $id);
        });

        $metrics = [
            'total_responses' => (clone $responsesQuery)->count(),
            'by_region' => (clone $responsesQuery)->selectRaw('geo_region, count(*) as count')->groupBy('geo_region')->pluck('count', 'geo_region')->toArray(),
            'by_city' => (clone $responsesQuery)->selectRaw('geo_city, count(*) as count')->groupBy('geo_city')->pluck('count', 'geo_city')->toArray(),
            'by_country' => (clone $responsesQuery)->selectRaw('geo_country, count(*) as count')->groupBy('geo_country')->pluck('count', 'geo_country')->toArray()
        ];

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }

    /**
     * Get generic interest insights from the survey responses.
     */
    public function getInterestInsights(Request $request)
    {
        $surveyId = $request->query('survey_id');

        // Eloquent get() retrieves fully cast models, but for analyzing JSON it's often best to work with collections post-query in SQLite
        $responses = SurveyResponse::when($surveyId, function ($query, $id) {
            return $query->where('survey_id', $id);
        })->get(['responses']);

        $tracksCount = [];
        $motivationsCount = [];

        foreach ($responses as $item) {
            $answers = $item->responses ?? [];

            foreach ($answers as $key => $answer) {
                $keyLower = strtolower($key);

                if (str_contains($keyLower, 'track')) {
                    $val = is_array($answer) ? implode(', ', $answer) : $answer;
                    $tracksCount[$val] = ($tracksCount[$val] ?? 0) + 1;
                }

                if (str_contains($keyLower, 'motivation')) {
                    $val = is_array($answer) ? implode(', ', $answer) : $answer;
                    $motivationsCount[$val] = ($motivationsCount[$val] ?? 0) + 1;
                }
            }
        }

        arsort($tracksCount);
        arsort($motivationsCount);

        return response()->json([
            'success' => true,
            'data' => [
                'by_track' => $tracksCount,
                'by_motivation' => $motivationsCount
            ],
        ]);
    }

    /**
     * Look up a unified learner profile across surveys based on email.
     */
    public function getUnifiedLearnerProfile($email)
    {
        $learnerResponses = SurveyResponse::where('respondent_email', $email)
            ->orderByDesc('created_at')
            ->get();

        if ($learnerResponses->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No profile found for the given email.',
            ], 404);
        }

        $latestResponse = $learnerResponses->first();

        $profile = [
            'email' => $email,
            'name' => $latestResponse->respondent_name ?? null,
            'phone' => $latestResponse->respondent_phone ?? null,
            'total_submissions' => $learnerResponses->count(),
            'surveys_taken' => $learnerResponses->pluck('survey_id')->unique()->values(),
            'latest_location' => [
                'country' => $latestResponse->geo_country ?? null,
                'region' => $latestResponse->geo_region ?? null,
                'city' => $latestResponse->geo_city ?? null,
            ],
            'timeline' => $learnerResponses->map(function ($item) {
                return [
                    'survey_id' => $item->survey_id,
                    'submitted_at' => $item->created_at,
                    'status' => $item->submission_status,
                    'source' => $item->utm_source ?? 'organic'
                ];
            })->values()
        ];

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }
}
