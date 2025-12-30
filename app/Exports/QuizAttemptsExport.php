<?php

namespace App\Exports;

use App\Models\Quiz;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class QuizAttemptsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $quizId;
    protected $kelasIds;

    public function __construct(int $quizId, array $kelasIds = [])
    {
        $this->quizId = $quizId;
        $this->kelasIds = $kelasIds;
    }

    public function query()
    {
        $query = Quiz::find($this->quizId)
            ->attempts()
            ->with(['siswa.user', 'siswa.kelas']);

        // Filter by class IDs if provided
        if (!empty($this->kelasIds)) {
            $query->whereHas('siswa', function ($q) {
                $q->whereIn('kelas_id', $this->kelasIds);
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'Nama Siswa',
            'Kelas',
            'NIS',
            'Nilai',
            'Durasi (menit)',
            'Waktu Selesai'
        ];
    }

    public function map($attempt): array
    {
        $siswa = $attempt->siswa;
        $user = $siswa ? $siswa->user : null;
        $kelas = $siswa ? $siswa->kelas : null;

        $kelasLabel = $kelas ? trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? '')) : '-';
        $durationMinutes = $attempt->duration_seconds ? round($attempt->duration_seconds / 60) : 0;

        return [
            $user ? $user->name : '-',
            $kelasLabel,
            $siswa ? $siswa->nis : '-',
            $attempt->score ?? 0,
            $durationMinutes,
            $attempt->submitted_at ? $attempt->submitted_at->format('d/m/Y H:i') : '-'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
