<?php

namespace App\Imports;

use App\Models\User;
use App\Models\MataPelajaran;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GuruImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Buat user guru baru
        $guru = User::create([
            'name' => $row['name'] ?? null,
            'email' => $row['email'] ?? null,
            'password' => Hash::make($row['password'] ?? '123456'),
            'role' => 'guru',
            'nip' => $row['nip'] ?? null,
            'no_telp' => $row['no_telp'] ?? null,
        ]);

        // Cek apakah ada kolom mata_pelajaran
        if (!empty($row['mata_pelajaran'])) {
            // Bisa lebih dari satu mapel, pisahkan dengan koma
            $mapelList = array_map('trim', explode(',', $row['mata_pelajaran']));

            foreach ($mapelList as $namaMapel) {
                // Cek apakah mapel sudah ada
                $mapel = MataPelajaran::firstOrCreate(['nama_mapel' => $namaMapel]);
                // Hubungkan ke guru
                $guru->mataPelajaran()->attach($mapel->id);
            }
        }

        return $guru;
    }
}
