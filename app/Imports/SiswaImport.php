<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SiswaImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new User([
            'name' => $row['name'] ?? null,
            'email' => $row['email'] ?? null,
            'password' => Hash::make($row['password'] ?? '123456'),
            'role' => 'siswa',
            'nis' => $row['nis'] ?? null,
            'kelas' => $row['kelas'] ?? null,
            'no_telp' => $row['no_telp'] ?? null,
        ]);
    }
}
