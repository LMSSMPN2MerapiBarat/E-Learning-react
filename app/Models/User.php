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
        'jenis_kelamin',

        // kolom berikut memang ada di migration lama; namun logika kini
        // dipindahkan ke tabel profil (Gurus/Siswas). Kolom ini tidak lagi dipakai
        // pada controller baru, tapi dibiarkan untuk kompatibilitas DB.
        'nip',
        'nis',
        'no_telp',
        'mapel',
        'kelas',
    ];

    protected $hidden = ['password'];

    public function isAdmin() { return $this->role === 'admin'; }
    public function isGuru()  { return $this->role === 'guru'; }
    public function isSiswa() { return $this->role === 'siswa'; }

    // Relasi "baru"
    public function guru()
    {
        return $this->hasOne(Guru::class);
    }

    public function siswa()
    {
        return $this->hasOne(Siswa::class);
    }

    // Relasi lama (opsional) – tetap dibiarkan agar kode lama tidak error
    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'kelas_siswa', 'user_id', 'kelas_id')->withTimestamps();
    }

    public function mataPelajaran()
    {
        return $this->belongsToMany(MataPelajaran::class, 'guru_mata_pelajaran', 'user_id', 'mata_pelajaran_id')->withTimestamps();
    }
}
