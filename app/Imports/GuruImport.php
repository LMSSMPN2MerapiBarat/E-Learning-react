<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GuruImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $name        = $row['nama'] ?? $row['Nama'] ?? 'Tanpa Nama';
        $email       = $row['email'] ?? $row['Email'] ?? uniqid('guru_') . '@example.com';
        $nip         = $row['nip'] ?? $row['NIP'] ?? null;
        $mapelString = $row['mapel'] ?? $row['Mapel'] ?? $row['mapel_yang_diajar'] ?? $row['Mapel yang Diajar'] ?? null;
        $kelasString = $row['kelas'] ?? $row['Kelas'] ?? $row['kelas_yang_diajar'] ?? $row['Kelas yang Diajar'] ?? null;
        $noTelp      = $row['no_telp'] ?? $row['No. Telepon'] ?? $row['no_telepon'] ?? null;

        if (User::where('email', $email)->exists()) {
            return null;
        }

        $genderInput = strtolower(trim($row['jenis_kelamin'] ?? $row['gender'] ?? ''));
        $gender = in_array($genderInput, ['laki-laki', 'perempuan']) ? $genderInput : null;

        $user = User::create([
            'name'          => $name,
            'email'         => $email,
            'password'      => Hash::make('password'),
            'role'          => 'guru',
            'jenis_kelamin' => $gender,
        ]);

        $guru = Guru::create([
            'user_id' => $user->id,
            'nip'     => $nip,
            'no_telp' => $noTelp,
        ]);

        if (!empty($mapelString)) {
            $mapelNames = array_filter(array_map('trim', preg_split('/[,;]/', (string) $mapelString)));

            $mapelIds = collect($mapelNames)->map(function (string $nama) {
                if ($nama === '') {
                    return null;
                }

                $mapel = MataPelajaran::firstOrCreate(['nama_mapel' => $nama]);

                return $mapel->id;
            })->filter()->values();

            if ($mapelIds->isNotEmpty()) {
                $guru->mataPelajaran()->sync($mapelIds);
            }
        }

        if (!empty($kelasString)) {
            $kelasNames = array_filter(array_map('trim', preg_split('/[,;]/', (string) $kelasString)));

            $kelasIds = collect($kelasNames)->map(function (string $namaKelas) {
                if ($namaKelas === '') {
                    return null;
                }

                $tingkat = $this->determineTingkat($namaKelas);

                $kelas = Kelas::firstOrCreate(
                    ['kelas' => $namaKelas],
                    [
                        'tingkat'      => $tingkat,
                        'tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
                        'deskripsi'    => 'Auto-generated from guru import',
                    ]
                );

                return $kelas->id;
            })->filter()->values();

            if ($kelasIds->isNotEmpty()) {
                $guru->kelas()->sync($kelasIds);
            }
        }

        return $guru;
    }

    private function determineTingkat(string $kelasNama): string
    {
        $nama = strtolower($kelasNama);

        if (str_contains($nama, 'xii') || str_contains($nama, '12')) {
            return 'Kelas 12';
        }

        if (str_contains($nama, 'xi') || str_contains($nama, '11')) {
            return 'Kelas 11';
        }

        if (str_contains($nama, 'x') || str_contains($nama, '10')) {
            return 'Kelas 10';
        }

        if (str_contains($nama, 'ix') || str_contains($nama, '9')) {
            return 'Kelas 9';
        }

        if (str_contains($nama, 'viii') || str_contains($nama, '8')) {
            return 'Kelas 8';
        }

        return 'Kelas 7';
    }
}

