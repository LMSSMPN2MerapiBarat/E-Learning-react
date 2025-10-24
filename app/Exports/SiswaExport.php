<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SiswaExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return User::where('role', 'siswa')
            ->select('name', 'email', 'nis', 'kelas', 'no_telp')
            ->get();
    }

    public function headings(): array
    {
        return ['Nama', 'Email', 'NIS', 'Kelas', 'No. Telp'];
    }
}
