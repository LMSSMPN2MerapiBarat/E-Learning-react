<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'mata_pelajarans'; // Nama tabel di database
    protected $fillable = ['nama_mapel']; // Kolom yang bisa diisi mass-assignment

    /**
     * Relasi ke guru: banyak guru bisa mengajar banyak mapel.
     * (Pivot: guru_mata_pelajaran)
     */
    public function gurus()
    {
        return $this->belongsToMany(
            User::class,              // Model relasi
            'guru_mata_pelajaran',    // Nama tabel pivot
            'mata_pelajaran_id',      // Foreign key di pivot untuk model ini
            'user_id'                 // Foreign key di pivot untuk model User
        );
    }
}
