<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'mata_pelajarans';
    protected $fillable = ['nama_mapel'];

    public function gurus()
    {
        return $this->belongsToMany(
            User::class,
            'guru_mata_pelajaran',
            'mata_pelajaran_id',
            'user_id'
        );
    }
}
