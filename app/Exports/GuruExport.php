<?php

namespace App\Exports;

use App\Models\Guru;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class GuruExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Guru::with('user')->get()->map(function ($guru) {
            return [
                'Nama'        => $guru->user->name ?? '-',
                'Email'       => $guru->user->email ?? '-',
                'NIP'         => $guru->nip ?? '-',
                'Mapel'       => $guru->mapel ?? '-',
                'No. Telepon' => $guru->no_telp ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return ['Nama', 'Email', 'NIP', 'Mapel', 'No. Telepon'];
    }
}
