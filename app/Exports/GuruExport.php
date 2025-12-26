<?php

namespace App\Exports;

use App\Models\Guru;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class GuruExport implements FromCollection, WithHeadings, WithEvents, WithStyles, WithTitle
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

    public function title(): string
    {
        return 'Data Guru';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 14],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
            2 => [
                'font' => ['bold' => true, 'size' => 12],
            ],
            6 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E7E6E6'],
                ],
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestColumn = $sheet->getHighestColumn();
                
                $sheet->insertNewRowBefore(1, 5);
                
                $sheet->setCellValue('A1', 'Daftar Tenaga Pendidik');
                $sheet->mergeCells('A1:' . $highestColumn . '1');
                
                $sheet->setCellValue('A2', 'SMPN 2 MERAPI BARAT');
                $sheet->mergeCells('A2:' . $highestColumn . '2');
                
                $sheet->setCellValue('A3', 'Kec. Merapi Barat, Kab. Lahat, Prov. Sumatera Selatan');
                $sheet->mergeCells('A3:' . $highestColumn . '3');
                
                $timestamp = Carbon::now('Asia/Jakarta')->format('Y-m-d H:i:s');
                $sheet->setCellValue('A4', 'Tanggal Unduh: ' . $timestamp . ' WIB');
                $sheet->mergeCells('A4:' . $highestColumn . '4');
                
                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
                
                $lastRow = $sheet->getHighestRow();
                if ($lastRow > 6) {
                    $sheet->getStyle('A7:' . $highestColumn . $lastRow)->applyFromArray([
                        'borders' => [
                            'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                        ],
                    ]);
                    $sheet->getStyle('A7:' . $highestColumn . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                }
            },
        ];
    }
}
