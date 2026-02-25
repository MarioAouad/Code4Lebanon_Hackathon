<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'slug',
        'title',
        'description',
        'is_active',
        'allow_multiple_submissions',
        'requires_auth',
        'published_at',
        'expires_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'allow_multiple_submissions' => 'boolean',
        'requires_auth' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function responses()
    {
        return $this->hasMany(SurveyResponse::class);
    }
}
