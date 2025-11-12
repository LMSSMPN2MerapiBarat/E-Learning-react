<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'kelas_id',
        'nis',
        'no_telp',
        'tempat_lahir',
        'tanggal_lahir',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($siswa) {
            // Cegah error saat user belum terbuat atau belum terhubung
            if ($siswa->relationLoaded('user') || $siswa->user()->exists()) {
                $siswa->user->delete();
            }
        });
    }
}
