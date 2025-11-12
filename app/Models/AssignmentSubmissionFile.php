<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignmentSubmissionFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_submission_id',
        'file_name',
        'file_path',
        'file_mime',
        'file_size',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(AssignmentSubmission::class, 'assignment_submission_id');
    }
}
