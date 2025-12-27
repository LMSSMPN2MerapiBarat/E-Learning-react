<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankMateri extends Model
{
    use HasFactory;

    protected $fillable = [
        'guru_id',
        'nama',
        'deskripsi',
        'file_path',
        'file_name',
        'file_mime',
        'file_size',
        'status',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }
}
