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
        'no_telp',
        'kelas', // ✅ ditambahkan
    ];

    protected $hidden = ['password'];

    public function isAdmin() { return $this->role === 'admin'; }
    public function isGuru() { return $this->role === 'guru'; }
    public function isSiswa() { return $this->role === 'siswa'; }

    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'kelas_siswa', 'user_id', 'kelas_id')->withTimestamps();
    }

    public function mataPelajaran()
    {
        return $this->belongsToMany(MataPelajaran::class, 'guru_mata_pelajaran', 'user_id', 'mata_pelajaran_id')->withTimestamps();
    }
}
