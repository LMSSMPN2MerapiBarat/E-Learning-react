<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'guru_id',
        'mata_pelajaran_id',
        'judul',
        'deskripsi',
        'dibuka_pada',
        'ditutup_pada',
        'max_score',
        'passing_grade',
        'allow_text_answer',
        'allow_file_upload',
        'allowed_file_types',
        'allow_cancel_submit',
        'status',
    ];

    protected $casts = [
        'dibuka_pada' => 'datetime',
        'ditutup_pada' => 'datetime',
        'allowed_file_types' => 'array',
        'allow_text_answer' => 'boolean',
        'allow_file_upload' => 'boolean',
        'allow_cancel_submit' => 'boolean',
    ];

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function kelas(): BelongsToMany
    {
        return $this->belongsToMany(
            Kelas::class,
            'assignment_kelas',
            'assignment_id',
            'kelas_id'
        )->withTimestamps();
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(AssignmentAttachment::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(AssignmentSubmission::class);
    }
}
