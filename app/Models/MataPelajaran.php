<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'mata_pelajarans';
    protected $fillable = ['nama_mapel'];

    // ✅ Relasi many-to-many dengan tabel pivot 'guru_mata_pelajaran'
    public function gurus()
    {
        return $this->belongsToMany(
            Guru::class,
            'guru_mata_pelajaran',
            'mata_pelajaran_id',
            'guru_id'
        )->withTimestamps();
    }
}
