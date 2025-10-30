<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'guru_id',
        'mata_pelajaran_id',
        'judul',
        'deskripsi',
        'durasi',
        'status',
    ];

    protected $casts = [
        'durasi' => 'integer',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function kelas()
    {
        return $this->belongsToMany(
            Kelas::class,
            'quiz_kelas',
            'quiz_id',
            'kelas_id'
        )->withTimestamps();
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
}
