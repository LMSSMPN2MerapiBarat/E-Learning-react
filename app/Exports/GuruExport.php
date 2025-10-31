<?php

namespace App\Exports;

use App\Models\Guru;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class GuruExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Guru::with(['user', 'mataPelajaran', 'kelas'])
            ->get()
            ->map(function ($guru) {
                $mapelList = $guru->mataPelajaran
                    ->pluck('nama_mapel')
                    ->filter()
                    ->unique()
                    ->implode(', ');

                $kelasList = $guru->kelas
                    ->map(function ($kelas) {
                        $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
                        return $nama !== '' ? $nama : ($kelas->kelas ?? null);
                    })
                    ->filter()
                    ->unique()
                    ->implode(', ');

                return [
                    'Nama'              => $guru->user->name ?? '-',
                    'Jenis Kelamin'     => $guru->user->jenis_kelamin
                        ? ucfirst($guru->user->jenis_kelamin)
                        : '-',
                    'Email'             => $guru->user->email ?? '-',
                    'NIP'               => $guru->nip ?? '-',
                    'Mapel yang Diajar' => $mapelList !== '' ? $mapelList : '-',
                    'Kelas yang Diajar' => $kelasList !== '' ? $kelasList : '-',
                    'No. Telepon'       => $guru->no_telp ?? '-',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Nama',
            'Jenis Kelamin',
            'Email',
            'NIP',
            'Mapel yang Diajar',
            'Kelas yang Diajar',
            'No. Telepon',
        ];
    }
}
