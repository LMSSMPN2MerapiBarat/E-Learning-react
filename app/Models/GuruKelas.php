<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuruKelas extends Model
{
    use HasFactory;

    protected $table = 'guru_kelas';
    protected $fillable = ['user_id', 'kelas_id'];

    // Relasi ke User (Guru)
    public function guru()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi ke Kelas
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    // Relasi ke Kuis
    public function kuis()
    {
        return $this->hasMany(Kuis::class, 'guru_kelas_id');
    }
}
