<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $fillable = ['tingkat', 'kelas', 'tahun_ajaran', 'deskripsi'];

    // Relasi siswa normal: Siswa(user) memiliki kelas_id
    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }

    // Masih biarkan relasi many-to-many ke User (jika ada kebutuhan lama)
    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_kelas', 'kelas_id', 'user_id')->withTimestamps();
    }

    public function getJumlahSiswaAttribute()
    {
        return $this->siswa()->count();
    }
}
