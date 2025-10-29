<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $fillable = ['tingkat', 'nama_kelas', 'tahun_ajaran', 'deskripsi'];

    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_kelas', 'kelas_id', 'user_id')
                    ->withTimestamps();
    }

    public function siswa()
    {
        return $this->belongsToMany(User::class, 'kelas_siswa', 'kelas_id', 'user_id')
                    ->withTimestamps();
    }

    public function getJumlahSiswaAttribute()
    {
        return $this->siswa()->count();
    }
}
