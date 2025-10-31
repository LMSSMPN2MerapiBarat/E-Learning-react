<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class SiswaImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public function model(array $row)
    {
        $nama      = $row['nama'] ?? $row['Nama'] ?? 'Tanpa Nama';
        $email     = $row['email'] ?? $row['Email'] ?? uniqid('siswa_') . '@example.com';
        $nis       = $row['nis'] ?? $row['NIS'] ?? null;
        $kelasNama = $row['kelas'] ?? $row['Kelas'] ?? null;
        $noTelp    = $row['no_telepon'] ?? $row['No. Telepon'] ?? null;

        // ✅ Mapping otomatis tingkat dari nama kelas
        $tingkat = 'Kelas 7'; // default
        if (preg_match('/VIII/i', $kelasNama)) {
            $tingkat = 'Kelas 8';
        } elseif (preg_match('/IX/i', $kelasNama)) {
            $tingkat = 'Kelas 9';
        } elseif (preg_match('/VII/i', $kelasNama)) {
            $tingkat = 'Kelas 7';
        }

        // ✅ Buat kelas otomatis dengan field lengkap
        $kelas = null;
        if (!empty($kelasNama)) {
            $kelas = Kelas::firstOrCreate(
                ['kelas' => trim($kelasNama)],
                [
                    'tingkat' => $tingkat,
                    'tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
                    'deskripsi' => 'Auto-generated from import',
                ]
            );
        }

        // ✅ Skip jika user sudah ada
        if (User::where('email', $email)->exists()) {
            return null;
        }

        $genderInput = strtolower(trim($row['jenis_kelamin'] ?? $row['gender'] ?? ''));
        $gender = in_array($genderInput, ['laki-laki', 'perempuan']) ? $genderInput : null;

        $user = User::create([
            'name'     => $nama,
            'email'    => $email,
            'password' => Hash::make('password'),
            'role'     => 'siswa',
            'jenis_kelamin' => $gender,
        ]);

        return new Siswa([
            'user_id'  => $user->id,
            'nis'      => $nis,
            'kelas_id' => $kelas?->id,
            'no_telp'  => $noTelp,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.nama'  => 'required|string',
            '*.email' => 'nullable|email|unique:users,email',
        ];
    }
}
