<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';
    protected $fillable = ['nama_kelas', 'deskripsi'];

    // Relasi: satu kelas punya banyak guru
    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_kelas', 'kelas_id', 'user_id')
                    ->where('role', 'guru');
    }

    // Relasi: satu kelas punya banyak siswa
    public function siswa()
    {
        return $this->belongsToMany(User::class, 'kelas_siswa', 'kelas_id', 'user_id')
                    ->where('role', 'siswa');
    }
}
