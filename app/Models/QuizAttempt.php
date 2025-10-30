<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'siswa_id',
        'score',
        'correct_answers',
        'total_questions',
        'duration_seconds',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function answers()
    {
        return $this->hasMany(QuizAttemptAnswer::class);
    }
}
