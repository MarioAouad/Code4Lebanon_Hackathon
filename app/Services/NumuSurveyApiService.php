<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Client\PendingRequest;

class NumuSurveyApiService
{
    /**
     * @var string
     */
    protected $baseUrl;

    /**
     * @var string
     */
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.numu.base_url');
        $this->apiKey = config('services.numu.api_key');
    }

    /**
     * Build the base HTTP client for NUMU API requests.
     *
     * @return PendingRequest
     */
    protected function client(): PendingRequest
    {
        return Http::withHeaders([
            'x-api-key' => $this->apiKey,
        ])->baseUrl($this->baseUrl);
    }

    /**
     * Fetch all available surveys.
     * Results are cached to prevent hitting rate limits during multiple aggregations.
     *
     * @return array
     */
    public function getSurveys(): array
    {
        $response = $this->client()->get('/surveys');

        if ($response->successful()) {
            return $response->json('data.surveys') ?? [];
        }

        return [];
    }

    public function getResponsesPage(?string $surveyId = null, int $page = 1, int $limit = 100): array
    {
        $queryParams = [
            'page' => $page,
            'limit' => $limit,
        ];

        if ($surveyId) {
            $queryParams['survey_id'] = $surveyId;
        }

        $response = $this->client()->get('/responses', $queryParams);

        if ($response->successful()) {
            return $response->json('data') ?? [];
        }

        return [];
    }

    public function getAllResponses(?string $surveyId = null): array
    {
        $allResponses = [];
        $page = 1;

        do {
            $data = $this->getResponsesPage($surveyId, $page, 100);

            if (empty($data['responses'])) {
                break;
            }

            $allResponses = array_merge($allResponses, $data['responses']);
            $pagination = $data['pagination'] ?? [];
            $hasNextPage = $pagination['hasNextPage'] ?? false;
            $page++;
        } while ($hasNextPage);

        return $allResponses;
    }
}
