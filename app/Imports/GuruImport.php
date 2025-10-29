<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Guru;
use App\Models\MataPelajaran;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GuruImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // ✅ 1. Buat akun user untuk guru
        $user = User::create([
            'name'     => $row['nama'] ?? 'Tanpa Nama',
            'email'    => $row['email'] ?? uniqid('guru_') . '@example.com',
            'password' => Hash::make('password'),
            'role'     => 'guru',
        ]);

        // ✅ 2. Buat data guru
        $guru = Guru::create([
            'user_id' => $user->id,
            'nip'     => $row['nip'] ?? null,
            'no_telp' => $row['no_telepon'] ?? null,
        ]);

        // ✅ 3. Hubungkan ke tabel mata pelajaran (bisa lebih dari satu, dipisahkan koma)
        if (!empty($row['mapel'])) {
            $mapelNames = array_map('trim', explode(',', $row['mapel']));

            $mapelIds = collect($mapelNames)->map(function ($nama) {
                $mapel = MataPelajaran::firstOrCreate(['nama_mapel' => $nama]);
                return $mapel->id;
            });

            $guru->mataPelajaran()->sync($mapelIds);
        }

        return $guru;
    }
}
