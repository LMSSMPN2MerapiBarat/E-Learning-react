<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'nip', 'mapel', 'no_telp'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsToMany(
            MataPelajaran::class,
            'guru_mata_pelajaran',
            'guru_id',
            'mata_pelajaran_id'
        )->withTimestamps();
    }

    public function kelas()
    {
        return $this->belongsToMany(
            Kelas::class,
            'guru_kelas',
            'user_id',
            'kelas_id',
            'user_id',
            'id'
        )->withTimestamps();
    }

    public function materis()
    {
        return $this->hasMany(Materi::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
