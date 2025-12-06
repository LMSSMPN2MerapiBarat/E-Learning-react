<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'nip', 'mapel', 'no_telp'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsToMany(
            MataPelajaran::class,
            'guru_mata_pelajaran',
            'guru_id',
            'mata_pelajaran_id'
        )->withTimestamps();
    }

    public function kelas()
    {
        return $this->belongsToMany(
            Kelas::class,
            'guru_kelas',
            'user_id',
            'kelas_id',
            'user_id',
            'id'
        )->withTimestamps();
    }

    public function materis()
    {
        return $this->hasMany(Materi::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * Get all kelas-mapel assignments for this guru
     */
    public function kelasMapel()
    {
        return $this->hasMany(GuruKelasMapel::class, 'guru_id');
    }

    /**
     * Get all unique kelas from kelas-mapel assignments
     */
    public function kelasFromKelasMapel()
    {
        return $this->belongsToMany(
            Kelas::class,
            'guru_kelas_mapel',
            'guru_id',
            'kelas_id'
        )->withTimestamps()->distinct();
    }

    /**
     * Get mapel IDs for a specific kelas
     */
    public function mapelDiKelas($kelasId)
    {
        return $this->kelasMapel()
            ->where('kelas_id', $kelasId)
            ->pluck('mata_pelajaran_id')
            ->toArray();
    }

    /**
     * Get kelas IDs for a specific mapel
     */
    public function kelasDenganMapel($mapelId)
    {
        return $this->kelasMapel()
            ->where('mata_pelajaran_id', $mapelId)
            ->pluck('kelas_id')
            ->toArray();
    }

    /**
     * Sync kelas-mapel assignments
     * @param array $kelasMapelData Array of ['kelas_id' => [mapel_ids]]
     */
    public function syncKelasMapel(array $kelasMapelData)
    {
        // Delete existing assignments
        $this->kelasMapel()->delete();

        // Insert new assignments
        foreach ($kelasMapelData as $kelasId => $mapelIds) {
            foreach ($mapelIds as $mapelId) {
                GuruKelasMapel::create([
                    'guru_id' => $this->id,
                    'kelas_id' => $kelasId,
                    'mata_pelajaran_id' => $mapelId,
                ]);
            }
        }
    }
}
