<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Survey;
use App\Models\SurveyResponse;
use Tests\TestCase;

class AnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    protected string $surveyId;

    protected function setUp(): void
    {
        parent::setUp();

        $survey = Survey::create([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'slug' => 'test-survey',
            'title' => 'Test Survey'
        ]);

        $this->surveyId = $survey->id;
    }

    /**
     * Test dissemination metrics endpoint.
     */
    public function test_dissemination_metrics()
    {
        SurveyResponse::create(['id' => \Illuminate\Support\Str::uuid()->toString(), 'survey_id' => $this->surveyId, 'utm_source' => 'facebook', 'utm_medium' => 'cpc', 'utm_campaign' => 'spring']);
        SurveyResponse::create(['id' => \Illuminate\Support\Str::uuid()->toString(), 'survey_id' => $this->surveyId, 'utm_source' => 'facebook', 'utm_medium' => 'cpc', 'utm_campaign' => 'spring']);
        SurveyResponse::create(['id' => \Illuminate\Support\Str::uuid()->toString(), 'survey_id' => $this->surveyId, 'utm_source' => 'google', 'utm_medium' => 'organic', 'utm_campaign' => 'none']);

        $response = $this->get('/api/analytics/dissemination');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_responses' => 3,
                    'by_source' => [
                        'facebook' => 2,
                        'google' => 1
                    ]
                ]
            ]);
    }

    /**
     * Test geographic insights endpoint.
     */
    public function test_geographic_insights()
    {
        SurveyResponse::create(['id' => \Illuminate\Support\Str::uuid()->toString(), 'survey_id' => $this->surveyId, 'geo_country' => 'Lebanon', 'geo_region' => 'Beirut', 'geo_city' => 'Beirut']);
        SurveyResponse::create(['id' => \Illuminate\Support\Str::uuid()->toString(), 'survey_id' => $this->surveyId, 'geo_country' => 'Lebanon', 'geo_region' => 'Mount Lebanon', 'geo_city' => 'Jounieh']);
        SurveyResponse::create(['id' => \Illuminate\Support\Str::uuid()->toString(), 'survey_id' => $this->surveyId, 'geo_country' => 'Lebanon', 'geo_region' => 'Beirut', 'geo_city' => 'Beirut']);

        $response = $this->get('/api/analytics/geographic');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_responses' => 3,
                    'by_region' => [
                        'Beirut' => 2,
                        'Mount Lebanon' => 1
                    ]
                ]
            ]);
    }
}
