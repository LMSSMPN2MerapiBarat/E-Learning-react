<?php

namespace App\Exports;

use App\Models\Siswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SiswaExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Siswa::with(['user', 'kelas'])->get()->map(function ($siswa) {
            return [
                'Nama'         => $siswa->user->name ?? '-',
                'Email'        => $siswa->user->email ?? '-',
                'NIS'          => $siswa->nis ?? '-',
                'Kelas'        => $siswa->kelas->kelas ?? '-',
                'Tahun Ajaran' => $siswa->kelas->tahun_ajaran ?? '-',
                'No. Telepon'  => $siswa->no_telp ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return ['Nama', 'Email', 'NIS', 'Kelas', 'Tahun Ajaran', 'No. Telepon'];
    }
}
