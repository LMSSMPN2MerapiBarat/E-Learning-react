<?php

namespace App\Exports;

use App\Models\Siswa;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SiswaExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Siswa::with(['user', 'kelas'])
            ->get()
            ->map(function ($siswa) {
                $kelas = $siswa->kelas;

                $kelasName = $kelas
                    ? trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''))
                    : null;

                if ($kelasName === '' && $kelas) {
                    $kelasName = $kelas->kelas ?? null;
                }

                $formattedBirthDate = '-';
                if (!empty($siswa->tanggal_lahir)) {
                    try {
                        $formattedBirthDate = Carbon::parse($siswa->tanggal_lahir)->format('Y-m-d');
                    } catch (\Throwable $e) {
                        $formattedBirthDate = (string) $siswa->tanggal_lahir;
                    }
                }

                return [
                    'Nama'           => $siswa->user->name ?? '-',
                    'Jenis Kelamin'  => $siswa->user->jenis_kelamin
                        ? ucfirst($siswa->user->jenis_kelamin)
                        : '-',
                    'Email'          => $siswa->user->email ?? '-',
                    'NISN'           => $siswa->nis ?? '-',
                    'Tempat Lahir'   => $siswa->tempat_lahir ?? '-',
                    'Tanggal Lahir'  => $formattedBirthDate,
                    'Kelas'          => $kelasName ?? '-',
                    'Tahun Ajaran'   => optional($kelas)->tahun_ajaran ?? '-',
                    'No. Telepon'    => $siswa->no_telp ?? '-',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Nama',
            'Jenis Kelamin',
            'Email',
            'NISN',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Kelas',
            'Tahun Ajaran',
            'No. Telepon',
        ];
    }
}
