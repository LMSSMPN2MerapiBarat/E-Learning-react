<?php

namespace App\Exports;

use App\Models\Kelas;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class KelasExport implements FromCollection, WithHeadings, WithMapping
{
    private int $index = 0;

    public function collection(): Collection
    {
        return Kelas::withCount(['siswa', 'guru'])
            ->orderBy('tingkat')
            ->orderBy('kelas')
            ->orderBy('tahun_ajaran')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Tingkat',
            'Nama Kelas',
            'Tahun Ajaran',
            'Jumlah Siswa',
            'Jumlah Pengajar',
            'Deskripsi',
        ];
    }

    /**
     * @param \App\Models\Kelas $kelas
     */
    public function map($kelas): array
    {
        $this->index++;

        return [
            $this->index,
            $kelas->tingkat ?? '-',
            $kelas->kelas ?? '-',
            $kelas->tahun_ajaran ?? '-',
            $kelas->siswa_count ?? 0,
            $kelas->guru_count ?? 0,
            $kelas->deskripsi ?? '-',
        ];
    }
}
