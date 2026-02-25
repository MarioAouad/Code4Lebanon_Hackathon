<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyResponse extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'survey_id',
        'respondent_email',
        'respondent_phone',
        'respondent_name',
        'responses',
        'submission_status',
        'ip_address',
        'user_agent',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'geo_country',
        'geo_region',
        'geo_city'
    ];

    protected $casts = [
        'responses' => 'array',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
