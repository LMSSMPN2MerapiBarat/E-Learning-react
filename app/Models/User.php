<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nip',
        'nis',
        'kelas',
        'no_telp',
    ];

    protected $hidden = ['password'];

    // 🔹 Helper untuk memeriksa role
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isGuru()
    {
        return $this->role === 'guru';
    }

    public function isSiswa()
    {
        return $this->role === 'siswa';
    }

    // 🔹 Relasi: Guru memiliki banyak Mata Pelajaran
    public function mataPelajaran()
    {
        return $this->belongsToMany(
            MataPelajaran::class,
            'guru_mata_pelajaran',
            'user_id',
            'mata_pelajaran_id'
        );
    }
}
