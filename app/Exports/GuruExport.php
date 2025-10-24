<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class GuruExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return User::where('role', 'guru')
            ->select('name', 'email', 'nip', 'no_telp')
            ->get();
    }

    public function headings(): array
    {
        return ['Nama', 'Email', 'NIP', 'No. Telp'];
    }
}
