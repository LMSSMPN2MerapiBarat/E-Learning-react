<?php

namespace App\Exports;

use App\Models\Assignment;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AssignmentSubmissionsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $assignmentId;

    public function __construct(int $assignmentId)
    {
        $this->assignmentId = $assignmentId;
    }

    public function query()
    {
        return Assignment::find($this->assignmentId)
            ->submissions()
            ->with(['siswa.user', 'siswa.kelas']);
    }

    public function headings(): array
    {
        return [
            'Nama Siswa',
            'Kelas',
            'NIS',
            'Tanggal Pengumpulan',
            'Status',
            'Nilai',
            'Feedback Guru'
        ];
    }

    public function map($submission): array
    {
        $siswa = $submission->siswa;
        $user = $siswa ? $siswa->user : null;
        $kelas = $siswa ? $siswa->kelas : null;

        $kelasLabel = $kelas ? trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? '')) : '-';

        return [
            $user ? $user->name : '-',
            $kelasLabel,
            $siswa ? $siswa->nis : '-',
            $submission->submitted_at ? $submission->submitted_at->format('d/m/Y H:i') : '-',
            $this->translateStatus($submission->status),
            $submission->score ?? 0,
            $submission->feedback ?? '-'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    protected function translateStatus($status)
    {
        return match ($status) {
            'submitted' => 'Menunggu Penilaian',
            'graded' => 'Sudah Dinilai',
            'draft' => 'Draft',
            default => $status,
        };
    }
}
